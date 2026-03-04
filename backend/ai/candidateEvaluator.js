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
  const llm = getLLM(0.0);
  const chain = EXTRACT_INFO_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({ resumeText: resumeText.slice(0, 5000) });

  try {
    return JSON.parse(raw);
  } catch {
    console.error('[CandidateEvaluator] Failed to parse extracted info:', raw);
    return null;
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
  const llm = getLLM(0.2);
  const chain = AI_EVALUATION_PROMPT.pipe(llm).pipe(new StringOutputParser());

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
    return {
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      fitRating: 'Weak',
      summary: 'AI evaluation failed to parse.',
    };
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
  const llm = getLLM(0.3);
  const chain = ACCEPTANCE_EMAIL_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({
    candidateName: applicant.name,
    roleTitle: role.title,
    strengths: (applicant.strengths || []).join(', ') || 'General technical aptitude',
    fitRating: applicant.fitRating || 'Strong',
  });

  try {
    return JSON.parse(raw);
  } catch {
    return {
      subject: `Congratulations! You've been selected for the ${role.title} internship`,
      body: `Hello ${applicant.name},\n\nWe are excited to inform you that you have been selected for the ${role.title} internship.\n\nYour strengths that stood out were:\n${(applicant.strengths || []).map(s => `- ${s}`).join('\n')}\n\nNext steps will follow soon.\n\nBest regards,\nHR Team`,
    };
  }
}

/**
 * Generate personalised rejection email content.
 */
async function generateRejectionEmail(applicant, role) {
  const llm = getLLM(0.3);
  const chain = REJECTION_EMAIL_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({
    candidateName: applicant.name,
    roleTitle: role.title,
    weaknesses: (applicant.weaknesses || []).join(', ') || 'Areas for improvement identified',
    aiSummary: applicant.aiSummary || 'General evaluation completed.',
  });

  try {
    return JSON.parse(raw);
  } catch {
    return {
      subject: `Update on your ${role.title} internship application`,
      body: `Hello ${applicant.name},\n\nThank you for applying.\n\nWhile we were impressed with your profile, we selected candidates whose experience more closely matched the role.\n\nAreas to improve:\n${(applicant.weaknesses || []).map(w => `- ${w}`).join('\n')}\n\nWe encourage you to apply again in the future.\n\nBest regards,\nHR Team`,
    };
  }
}

module.exports = {
  extractResumeInfo,
  evaluateCandidate,
  generateAcceptanceEmail,
  generateRejectionEmail,
};
