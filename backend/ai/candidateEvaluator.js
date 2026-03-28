/**
 * ai/candidateEvaluator.js
 * -------------------------------------------------
 * LLM-powered candidate evaluation.
 *
 * Responsibilities:
 *  1. Structured resume information extraction
 *  2. AI evaluation of a candidate against a role
 *     (strengths, weaknesses, fitRating, summary)
 *  3. Email content generation (accept / reject)
 *
 * Uses LangChain + OpenAI GPT-4o (temperature 0.2).
 * -------------------------------------------------
 */
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { getLLM } = require('./ragPipeline');
const { extractSkillKeywords } = require('../utils/resumeParser');

function hasLlmAccess() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function uniqueItems(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function estimateFitRating(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Moderate';
  return 'Weak';
}

function fallbackResumeInfo(resumeText) {
  const lines = (resumeText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = resumeText.match(/(\+?\d[\d\s().-]{7,}\d)/);
  const githubMatch = resumeText.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i);
  const linkedinMatch = resumeText.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
  const portfolioMatch = resumeText.match(/https?:\/\/(?!(?:www\.)?linkedin\.com|(?:www\.)?github\.com)[^\s)]+/i);
  const educationLine = lines.find((line) =>
    /(university|college|institute|school|b\.?tech|b\.?e\b|bsc|bs\b|ms\b|msc|mba)/i.test(line)
  );

  const projectDescriptions = lines
    .filter((line) => /(project|built|developed|implemented|designed|deployed)/i.test(line))
    .slice(0, 5);

  const experienceMatches = [...resumeText.matchAll(/(\d+)\+?\s*(?:years|yrs)/gi)];
  const experience = experienceMatches.length
    ? Math.max(...experienceMatches.map((match) => Number(match[1]) || 0))
    : 0;

  const nameCandidate = lines.find((line) => /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(line)) || 'Unknown';

  return {
    name: nameCandidate,
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    education: educationLine || null,
    experience,
    skills: uniqueItems(extractSkillKeywords(resumeText)),
    githubUrl: githubMatch?.[0] || null,
    linkedinUrl: linkedinMatch?.[0] || null,
    portfolioUrl: portfolioMatch?.[0] || null,
    projectDescriptions,
  };
}

function fallbackCandidateEvaluation(applicant, role) {
  const applicantSkills = new Set((applicant.skills || []).map((skill) => skill.toLowerCase()));
  const requiredMatches = (role.requiredSkills || []).filter((skill) =>
    applicantSkills.has(skill.toLowerCase())
  );
  const preferredMatches = (role.preferredSkills || []).filter((skill) =>
    applicantSkills.has(skill.toLowerCase())
  );

  const strengths = [];
  const weaknesses = [];

  if (requiredMatches.length > 0) {
    strengths.push(`Matches key required skills: ${requiredMatches.join(', ')}`);
  }
  if (preferredMatches.length > 0) {
    strengths.push(`Brings bonus skills: ${preferredMatches.join(', ')}`);
  }
  if (applicant.projectDescriptions?.length) {
    strengths.push(`Shows project experience across ${applicant.projectDescriptions.length} project entry(s)`);
  }
  if (applicant.githubUrl || applicant.portfolioUrl || applicant.linkedinUrl) {
    strengths.push('Provides supporting profile links for additional review');
  }

  const missingRequired = (role.requiredSkills || []).filter(
    (skill) => !applicantSkills.has(skill.toLowerCase())
  );
  if (missingRequired.length > 0) {
    weaknesses.push(`Missing some required skills: ${missingRequired.slice(0, 4).join(', ')}`);
  }
  if (!applicant.motivationAnswer) {
    weaknesses.push('Did not provide a motivation statement for communication scoring');
  }
  if (!applicant.projectDescriptions?.length) {
    weaknesses.push('Project depth is difficult to confirm from the submitted materials');
  }

  const overallScore = Math.min(
    100,
    Math.round(
      requiredMatches.length * 18 +
        preferredMatches.length * 8 +
        Math.min(20, (applicant.experience || 0) * 8) +
        (applicant.projectDescriptions?.length ? 15 : 0) +
        (applicant.githubUrl || applicant.portfolioUrl ? 10 : 0)
    )
  );

  const fitRating = estimateFitRating(overallScore);
  const summary = `${applicant.name} shows ${fitRating.toLowerCase()} alignment for ${
    role.title
  }. The fallback evaluator highlighted ${requiredMatches.length} required-skill match(es) and ${
    preferredMatches.length
  } preferred-skill match(es), with project depth and profile links used as supporting signals.`;

  return {
    overallScore,
    strengths: uniqueItems(strengths).slice(0, 4),
    weaknesses: uniqueItems(weaknesses).slice(0, 4),
    fitRating,
    summary,
  };
}

function fallbackAcceptanceEmail(applicant, role) {
  return {
    subject: `Congratulations! You've been selected for the ${role.title} internship`,
    body: `Hello ${applicant.name},\n\nWe are excited to inform you that you have been selected for the ${role.title} internship.\n\nYour strengths that stood out were:\n${(applicant.strengths || []).map((strength) => `- ${strength}`).join('\n') || '- Strong overall alignment with the role'}\n\nNext steps will follow soon.\n\nBest regards,\nHR Team`,
  };
}

function fallbackRejectionEmail(applicant, role) {
  return {
    subject: `Update on your ${role.title} internship application`,
    body: `Hello ${applicant.name},\n\nThank you for applying.\n\nWhile we were impressed with your profile, we selected candidates whose experience more closely matched the role.\n\nAreas to improve:\n${(applicant.weaknesses || []).map((weakness) => `- ${weakness}`).join('\n') || '- Continue building role-relevant experience and projects'}\n\nWe encourage you to apply again in the future.\n\nBest regards,\nHR Team`,
  };
}

/* ================================================================
   1. RESUME INFO EXTRACTION
   ================================================================ */

const EXTRACT_INFO_PROMPT = PromptTemplate.fromTemplate(`
You are a professional resume parser.
Extract the following fields from the resume text below.

Resume Text:
{resumeText}

Return STRICTLY as JSON:
{{
  "name": "<string or null>",
  "email": "<string or null>",
  "phone": "<string or null>",
  "education": "<string or null>",
  "experience": <number or 0>,
  "skills": ["<string>", ...],
  "githubUrl": "<string or null>",
  "linkedinUrl": "<string or null>",
  "portfolioUrl": "<string or null>",
  "projectDescriptions": ["<brief project description>", ...]
}}

Rules:
- Only extract what is explicitly present.
- For experience, estimate years from dates if possible.
- Skills should be technical skills / tools only.
- Return ONLY the JSON. No markdown fences.
`);

/**
 * Extract structured information from resume text using AI.
 *
 * @param {string} resumeText - Cleaned resume text
 * @returns {Object|null}     - Parsed info or null on failure
 */
async function extractResumeInfo(resumeText) {
  if (!hasLlmAccess()) {
    return fallbackResumeInfo(resumeText);
  }

  const llm = getLLM(0.0);
  const chain = EXTRACT_INFO_PROMPT.pipe(llm).pipe(new StringOutputParser());

  try {
    const raw = await chain.invoke({ resumeText: resumeText.slice(0, 5000) });

    try {
      return JSON.parse(raw);
    } catch {
      console.error('[CandidateEvaluator] Failed to parse extracted info:', raw);
      return fallbackResumeInfo(resumeText);
    }
  } catch (error) {
    console.error('[CandidateEvaluator] Resume extraction fallback triggered:', error.message);
    return fallbackResumeInfo(resumeText);
  }
}

/* ================================================================
   2. AI EVALUATION — STEP 6
   ================================================================ */

const AI_EVALUATION_PROMPT = PromptTemplate.fromTemplate(`
You are an expert HR evaluator.

Analyze the candidate relative to the internship role.

## Role
Title: {roleTitle}
Required Skills: {requiredSkills}
Preferred Skills: {preferredSkills}
Experience Level: {experienceLevel}
Company Culture: {cultureDescription}
Scoring Weights: skills={wSkills}, experience={wExperience}, projects={wProjects}, communication={wCommunication}, bonus={wBonus}

## Applicant
Name: {name}
Skills: {skills}
Experience: {experience} years
Education: {education}
GitHub: {githubUrl}
Motivation Answer: {motivationAnswer}
Projects: {projectDescriptions}

## Resume Text
{resumeText}

---

Provide your evaluation STRICTLY as a JSON object:

{{
  "overallScore": <number 0-100>,
  "strengths": ["<string>", "<string>", ...],
  "weaknesses": ["<string>", "<string>", ...],
  "fitRating": "<Excellent | Strong | Moderate | Weak>",
  "summary": "<concise 3-4 sentence evaluation paragraph>"
}}

Rules:
- Temperature must remain low for consistency.
- Be objective and evidence-based.
- Only reference information present in the resume and form data.
- Do NOT hallucinate skills or experience the candidate doesn't have.
- Return ONLY the JSON. No markdown fences.
`);

/**
 * Run AI evaluation of a single candidate against a role.
 * This is the "Step 6" evaluator from the system workflow.
 *
 * @param {Object} applicant - Mongoose applicant document
 * @param {Object} role      - Mongoose role document
 * @returns {Object}         - { overallScore, strengths, weaknesses, fitRating, summary }
 */
async function evaluateCandidate(applicant, role) {
  if (!hasLlmAccess()) {
    return fallbackCandidateEvaluation(applicant, role);
  }

  const llm = getLLM(0.2);
  const chain = AI_EVALUATION_PROMPT.pipe(llm).pipe(new StringOutputParser());

  try {
    const raw = await chain.invoke({
      roleTitle: role.title,
      requiredSkills: role.requiredSkills.join(', '),
      preferredSkills: role.preferredSkills.join(', '),
      experienceLevel: role.experienceLevel,
      cultureDescription: role.cultureDescription || 'Not specified',
      wSkills: role.weightConfig.skills,
      wExperience: role.weightConfig.experience,
      wProjects: role.weightConfig.projects,
      wCommunication: role.weightConfig.communication,
      wBonus: role.weightConfig.bonus,
      name: applicant.name,
      skills: (applicant.skills || []).join(', '),
      experience: applicant.experience || 0,
      education: applicant.education || 'N/A',
      githubUrl: applicant.githubUrl || 'N/A',
      motivationAnswer: applicant.motivationAnswer || 'N/A',
      projectDescriptions: (applicant.projectDescriptions || []).join('; ') || 'N/A',
      resumeText: (applicant.resumeText || '').slice(0, 4000),
    });

    try {
      return JSON.parse(raw);
    } catch {
      console.error('[CandidateEvaluator] Failed to parse AI eval:', raw);
      return fallbackCandidateEvaluation(applicant, role);
    }
  } catch (error) {
    console.error('[CandidateEvaluator] Candidate evaluation fallback triggered:', error.message);
    return fallbackCandidateEvaluation(applicant, role);
  }
}

/* ================================================================
   3. EMAIL CONTENT GENERATION
   ================================================================ */

const ACCEPTANCE_EMAIL_PROMPT = PromptTemplate.fromTemplate(`
You are an HR communications specialist. Write a personalized internship acceptance email.

Candidate: {candidateName}
Role: {roleTitle}
Strengths identified: {strengths}
Fit Rating: {fitRating}

Write a professional, warm acceptance email following this structure:

Hello {candidateName},

We are excited to inform you that you have been selected for the internship.

Your strengths that stood out were:
[reference their specific strengths]

Next steps will follow soon.

Best regards,
HR Team

Return STRICTLY as JSON:
{{
  "subject": "<email subject line>",
  "body": "<full email body in plain text with line breaks as \\n>"
}}

Return ONLY the JSON. No markdown fences.
`);

const REJECTION_EMAIL_PROMPT = PromptTemplate.fromTemplate(`
You are an HR communications specialist. Write a personalized, constructive internship rejection email.

Candidate: {candidateName}
Role: {roleTitle}
Weaknesses identified: {weaknesses}
AI Summary: {aiSummary}

Write a professional, empathetic rejection email following this structure:

Hello {candidateName},

Thank you for applying.

While we were impressed with your profile, we selected candidates whose experience more closely matched the role.

Areas to improve:
[reference their specific weaknesses constructively]

We encourage you to apply again in the future.

Return STRICTLY as JSON:
{{
  "subject": "<email subject line>",
  "body": "<full email body in plain text with line breaks as \\n>"
}}

Return ONLY the JSON. No markdown fences.
`);

/**
 * Generate personalised acceptance email content.
 */
async function generateAcceptanceEmail(applicant, role) {
  if (!hasLlmAccess()) {
    return fallbackAcceptanceEmail(applicant, role);
  }

  const llm = getLLM(0.3);
  const chain = ACCEPTANCE_EMAIL_PROMPT.pipe(llm).pipe(new StringOutputParser());

  try {
    const raw = await chain.invoke({
      candidateName: applicant.name,
      roleTitle: role.title,
      strengths: (applicant.strengths || []).join(', ') || 'General technical aptitude',
      fitRating: applicant.fitRating || 'Strong',
    });

    try {
      return JSON.parse(raw);
    } catch {
      return fallbackAcceptanceEmail(applicant, role);
    }
  } catch (_error) {
    return fallbackAcceptanceEmail(applicant, role);
  }
}

/**
 * Generate personalised rejection email content.
 */
async function generateRejectionEmail(applicant, role) {
  if (!hasLlmAccess()) {
    return fallbackRejectionEmail(applicant, role);
  }

  const llm = getLLM(0.3);
  const chain = REJECTION_EMAIL_PROMPT.pipe(llm).pipe(new StringOutputParser());

  try {
    const raw = await chain.invoke({
      candidateName: applicant.name,
      roleTitle: role.title,
      weaknesses: (applicant.weaknesses || []).join(', ') || 'Areas for improvement identified',
      aiSummary: applicant.aiSummary || 'General evaluation completed.',
    });

    try {
      return JSON.parse(raw);
    } catch {
      return fallbackRejectionEmail(applicant, role);
    }
  } catch (_error) {
    return fallbackRejectionEmail(applicant, role);
  }
}

module.exports = {
  extractResumeInfo,
  evaluateCandidate,
  generateAcceptanceEmail,
  generateRejectionEmail,
};
