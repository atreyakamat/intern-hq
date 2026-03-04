/**
 * services/applicantService.js
 * -------------------------------------------------
 * Business logic for applicant lifecycle:
 *   apply → parse (Step 2)
 *   evaluate → score + AI + RAG (Steps 3-6)
 *   rank (Step 7 ranking)
 *   compare (Step 7 comparative)
 *   notify (Step 9 emails)
 * -------------------------------------------------
 */
const Applicant = require('../models/Applicant');
const Role = require('../models/Role');
const { extractTextFromPDF, extractSkillKeywords } = require('../utils/resumeParser');
const { runFullScoringPipeline } = require('../ai/scoringEngine');
const { extractResumeInfo, generateAcceptanceEmail, generateRejectionEmail } = require('../ai/candidateEvaluator');
const { generateComparison } = require('../ai/comparisonEngine');
const { sendEmail, renderTemplate } = require('../mailer/emailService');
const logger = require('../utils/logger');

/* ================================================================
   STEP 2 — APPLICATION SUBMISSION (POST /apply)
   ================================================================ */

/**
 * Process a single uploaded resume file and optional form data.
 * Parses the PDF, extracts info, stores in DB.
 * Does NOT run evaluation — that is a separate step.
 */
async function processResume(filePath, roleId, formData = {}) {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  // 1. Extract text (pdf-parse)
  const resumeText = await extractTextFromPDF(filePath);
  logger.info('ApplicantService', `Extracted ${resumeText.length} chars from resume`);

  // 2. Quick keyword extraction (non-AI)
  const quickSkills = extractSkillKeywords(resumeText);

  // 3. AI-based structured info extraction
  let extracted = {};
  try {
    extracted = (await extractResumeInfo(resumeText)) || {};
  } catch (err) {
    logger.warn('ApplicantService', 'AI extraction failed', { error: err.message });
  }

  // 4. Merge: form data › AI extraction › defaults
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

  return applicant;
}

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
    try { fs.unlinkSync(files[i].path); } catch { /* ignore */ }
  }
  return results;
}

/* ================================================================
   STEPS 3-6 — EVALUATE (POST /evaluate)
   Embeds, scores deterministically, runs AI evaluation, RAG
   ================================================================ */

/**
 * Run the full scoring pipeline for all un-evaluated applicants in a role,
 * or for specific applicant IDs.
 */
async function evaluateApplicants(roleId, applicantIds = null) {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  const query = { role: roleId };
  if (applicantIds && applicantIds.length > 0) {
    query._id = { $in: applicantIds };
  } else {
    // Only evaluate applicants that haven't been scored yet
    query.finalScore = 0;
  }

  const applicants = await Applicant.find(query);
  const results = [];

  for (const applicant of applicants) {
    try {
      const scores = await runFullScoringPipeline(applicant, role);
      Object.assign(applicant, scores);
      await applicant.save();
      logger.info('ApplicantService', `Evaluated: ${applicant.name} → ${applicant.finalScore}`);
      results.push({ success: true, id: applicant._id, name: applicant.name, finalScore: applicant.finalScore });
    } catch (err) {
      logger.error('ApplicantService', `Evaluation failed for ${applicant.name}`, { error: err.message });
      results.push({ success: false, id: applicant._id, name: applicant.name, error: err.message });
    }
  }

  return results;
}

/* ================================================================
   STEP 7 — RANKING (POST /rank)
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
   STEP 7 — COMPARATIVE INTELLIGENCE
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
   STEP 9 — EMAIL NOTIFICATION (POST /notify)
   ================================================================ */

/**
 * Send accept/reject notifications to specified applicants.
 */
async function notifyApplicants(applicantIds, action) {
  const results = [];

  for (const id of applicantIds) {
    try {
      const applicant = await Applicant.findById(id).populate('role');
      if (!applicant) {
        results.push({ success: false, id, error: 'Applicant not found' });
        continue;
      }

      const role = applicant.role;
      let emailContent;
      let htmlBody;

      if (action === 'accepted') {
        applicant.hrStatus = 'accepted';
        emailContent = await generateAcceptanceEmail(applicant, role);
        try {
          htmlBody = renderTemplate('accept', {
            name: applicant.name,
            roleTitle: role.title,
            strengths: applicant.strengths || [],
          });
        } catch { /* HTML template optional, fallback to text */ }
      } else {
        applicant.hrStatus = 'rejected';
        emailContent = await generateRejectionEmail(applicant, role);
        try {
          htmlBody = renderTemplate('reject', {
            name: applicant.name,
            roleTitle: role.title,
            weaknesses: applicant.weaknesses || [],
          });
        } catch { /* HTML template optional */ }
      }

      const result = await sendEmail(
        applicant.email,
        emailContent.subject,
        emailContent.body,
        htmlBody
      );

      applicant.emailSent = result.success;
      applicant.emailLog.push({
        type: action === 'accepted' ? 'acceptance' : 'rejection',
        subject: emailContent.subject,
        body: emailContent.body,
        status: result.success ? 'sent' : 'failed',
        messageId: result.messageId || '',
        error: result.error || '',
      });

      await applicant.save();
      logger.info('ApplicantService', `${action} email → ${applicant.email}`, { success: result.success });
      results.push({ success: result.success, id, name: applicant.name, messageId: result.messageId });
    } catch (err) {
      logger.error('ApplicantService', `Notify failed for ${id}`, { error: err.message });
      results.push({ success: false, id, error: err.message });
    }
  }

  return results;
}

/**
 * Update applicant HR status and optionally send email.
 */
async function updateStatus(applicantId, newStatus, sendNotification = true) {
  const applicant = await Applicant.findById(applicantId).populate('role');
  if (!applicant) throw new Error('Applicant not found');

  applicant.hrStatus = newStatus;

  if (sendNotification && (newStatus === 'accepted' || newStatus === 'rejected')) {
    const results = await notifyApplicants([applicantId], newStatus);
    return applicant;
  }

  await applicant.save();
  return applicant;
}

/**
 * Bulk status update.
 */
async function bulkUpdateStatus(applicantIds, newStatus, sendNotification = false) {
  if (sendNotification && (newStatus === 'accepted' || newStatus === 'rejected')) {
    // Update status and send emails in one go
    for (const id of applicantIds) {
      const a = await Applicant.findById(id);
      if (a) { a.hrStatus = newStatus; await a.save(); }
    }
    return notifyApplicants(applicantIds, newStatus);
  }

  const results = [];
  for (const id of applicantIds) {
    try {
      const a = await Applicant.findByIdAndUpdate(id, { hrStatus: newStatus }, { new: true });
      results.push({ success: true, id, name: a?.name });
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
  evaluateApplicants,
  recalculateRanks,
  compareTopApplicants,
  notifyApplicants,
  updateStatus,
  bulkUpdateStatus,
  listApplicants,
  getApplicantById,
  getAnalytics,
};
