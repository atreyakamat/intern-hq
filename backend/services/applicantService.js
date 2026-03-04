/**
 * services/applicantService.js
 * -------------------------------------------------
 * Business logic for applicant lifecycle:
 *   intake → parse → score → rank → email
 * -------------------------------------------------
 */
const Applicant = require('../models/Applicant');
const Role = require('../models/Role');
const { extractTextFromPDF, extractSkillKeywords } = require('../utils/resumeParser');
const { runFullScoringPipeline } = require('../ai/scoringEngine');
const { extractResumeInfo } = require('../ai/summaryGenerator');
const { generateComparison, generateAcceptanceEmail, generateRejectionEmail } = require('../ai/summaryGenerator');
const { sendEmail } = require('../mailer/emailService');
const logger = require('../utils/logger');

/* ================================================================
   INTAKE
   ================================================================ */

/**
 * Process a single uploaded resume file and optional form data.
 *
 * @param {string} filePath   - Path to the uploaded PDF
 * @param {string} roleId     - ObjectId of the target role
 * @param {Object} formData   - Optional additional form fields
 * @returns {Object}          - Created Applicant document
 */
async function processResume(filePath, roleId, formData = {}) {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  // 1. Extract text
  const resumeText = await extractTextFromPDF(filePath);
  logger.info('ApplicantService', `Extracted ${resumeText.length} chars from resume`);

  // 2. Quick keyword extraction (non-AI)
  const quickSkills = extractSkillKeywords(resumeText);

  // 3. AI-based info extraction
  let extracted = {};
  try {
    extracted = (await extractResumeInfo(resumeText)) || {};
  } catch (err) {
    logger.warn('ApplicantService', 'AI extraction failed', { error: err.message });
  }

  // 4. Merge: form data overrides > AI extraction > defaults
  const applicantData = {
    name: formData.name || extracted.name || 'Unknown',
    email: formData.email || extracted.email || `applicant_${Date.now()}@placeholder.com`,
    phone: formData.phone || extracted.phone || '',
    resumeText,
    resumeFileName: formData.resumeFileName || '',
    skills: formData.skills || extracted.skills || quickSkills,
    experience: formData.experience ?? extracted.experience ?? 0,
    education: formData.education || extracted.education || '',
    githubUrl: formData.githubUrl || extracted.githubUrl || '',
    linkedinUrl: formData.linkedinUrl || extracted.linkedinUrl || '',
    portfolioUrl: formData.portfolioUrl || extracted.portfolioUrl || '',
    motivationAnswer: formData.motivationAnswer || '',
    projectDescriptions: formData.projectDescriptions || extracted.projectDescriptions || [],
    role: roleId,
  };

  const applicant = new Applicant(applicantData);
  await applicant.save();
  logger.info('ApplicantService', `Applicant created: ${applicant.name} (${applicant._id})`);

  // 5. Run full scoring pipeline
  try {
    const scores = await runFullScoringPipeline(applicant, role);
    Object.assign(applicant, scores);
    await applicant.save();
    logger.info('ApplicantService', `Scored: ${applicant.name} → ${applicant.finalScore}`);
  } catch (err) {
    logger.error('ApplicantService', `Scoring failed for ${applicant.name}`, { error: err.message });
  }

  return applicant;
}

/* ================================================================
   BATCH PROCESSING
   ================================================================ */

/**
 * Process multiple resume files for a role.
 */
async function processMultipleResumes(files, roleId, formDataArray = []) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const formData = formDataArray[i] || {};
      formData.resumeFileName = files[i].originalname;
      const applicant = await processResume(files[i].path, roleId, formData);
      results.push({ success: true, applicant });
    } catch (err) {
      logger.error('ApplicantService', `Failed to process file ${files[i].originalname}`, { error: err.message });
      results.push({ success: false, fileName: files[i].originalname, error: err.message });
    }

    // Clean up uploaded file
    const fs = require('fs');
    try {
      fs.unlinkSync(files[i].path);
    } catch { /* ignore */ }
  }
  return results;
}

/* ================================================================
   RANKING
   ================================================================ */

/**
 * Recalculate ranks for all applicants in a role, ordered by finalScore desc.
 */
async function recalculateRanks(roleId) {
  const applicants = await Applicant.find({ role: roleId }).sort({ finalScore: -1 });
  for (let i = 0; i < applicants.length; i++) {
    applicants[i].rank = i + 1;
    await applicants[i].save();
  }
  return applicants;
}

/* ================================================================
   COMPARATIVE INTELLIGENCE
   ================================================================ */

/**
 * Generate a comparative report for top N applicants in a role.
 */
async function compareTopApplicants(roleId, topN = 10) {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  const applicants = await Applicant.find({ role: roleId })
    .sort({ finalScore: -1 })
    .limit(topN);

  if (applicants.length < 2) {
    throw new Error('Need at least 2 applicants to compare');
  }

  return generateComparison(role, applicants);
}

/* ================================================================
   STATUS + EMAIL
   ================================================================ */

/**
 * Update applicant HR status and optionally send email.
 */
async function updateStatus(applicantId, newStatus, sendNotification = true) {
  const applicant = await Applicant.findById(applicantId).populate('role');
  if (!applicant) throw new Error('Applicant not found');

  applicant.hrStatus = newStatus;

  if (sendNotification && (newStatus === 'accepted' || newStatus === 'rejected')) {
    try {
      let emailContent;
      if (newStatus === 'accepted') {
        emailContent = await generateAcceptanceEmail(applicant, applicant.role);
      } else {
        emailContent = await generateRejectionEmail(applicant, applicant.role);
      }

      const result = await sendEmail(
        applicant.email,
        emailContent.subject,
        emailContent.body
      );

      applicant.emailLog.push({
        type: newStatus === 'accepted' ? 'acceptance' : 'rejection',
        subject: emailContent.subject,
        body: emailContent.body,
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId || '',
        error: result.error || '',
      });

      logger.info('ApplicantService', `${newStatus} email → ${applicant.email}`, {
        success: result.success,
      });
    } catch (err) {
      logger.error('ApplicantService', `Email failed for ${applicant.name}`, { error: err.message });
      applicant.emailLog.push({
        type: newStatus === 'accepted' ? 'acceptance' : 'rejection',
        subject: 'Failed to generate',
        body: '',
        status: 'failed',
        error: err.message,
      });
    }
  }

  await applicant.save();
  return applicant;
}

/**
 * Bulk status update.
 */
async function bulkUpdateStatus(applicantIds, newStatus, sendNotification = false) {
  const results = [];
  for (const id of applicantIds) {
    try {
      const applicant = await updateStatus(id, newStatus, sendNotification);
      results.push({ success: true, id, name: applicant.name });
    } catch (err) {
      results.push({ success: false, id, error: err.message });
    }
  }
  return results;
}

/* ================================================================
   QUERIES
   ================================================================ */

async function listApplicants(filters = {}) {
  const query = {};

  if (filters.roleId) query.role = filters.roleId;
  if (filters.hrStatus && filters.hrStatus !== 'all') query.hrStatus = filters.hrStatus;
  if (filters.minScore) query.finalScore = { $gte: Number(filters.minScore) };
  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }

  let sort = { finalScore: -1 };
  if (filters.sortBy === 'date') sort = { createdAt: -1 };
  if (filters.sortBy === 'name') sort = { name: 1 };

  return Applicant.find(query).populate('role', 'title').sort(sort);
}

async function getApplicantById(id) {
  return Applicant.findById(id).populate('role');
}

async function getAnalytics(roleId) {
  const filter = roleId ? { role: roleId } : {};
  const applicants = await Applicant.find(filter);

  const total = applicants.length;
  const avgScore =
    total > 0
      ? Math.round(applicants.reduce((s, a) => s + a.finalScore, 0) / total)
      : 0;

  const statusCounts = { pending: 0, reviewing: 0, accepted: 0, rejected: 0 };
  const fitCounts = { Excellent: 0, Strong: 0, Moderate: 0, Weak: 0 };

  applicants.forEach((a) => {
    if (statusCounts[a.hrStatus] !== undefined) statusCounts[a.hrStatus]++;
    if (fitCounts[a.fitRating] !== undefined) fitCounts[a.fitRating]++;
  });

  // Top skills
  const skillMap = {};
  applicants.forEach((a) =>
    (a.skills || []).forEach((s) => {
      skillMap[s] = (skillMap[s] || 0) + 1;
    })
  );
  const topSkills = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    totalApplicants: total,
    averageScore: avgScore,
    statusCounts,
    fitCounts,
    topSkills,
  };
}

module.exports = {
  processResume,
  processMultipleResumes,
  recalculateRanks,
  compareTopApplicants,
  updateStatus,
  bulkUpdateStatus,
  listApplicants,
  getApplicantById,
  getAnalytics,
};
