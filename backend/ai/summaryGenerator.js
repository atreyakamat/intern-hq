/**
 * ai/summaryGenerator.js
 * -------------------------------------------------
 * Generates:
 *  1. Comparative intelligence reports (top candidates)
 *  2. Personalized email content (accept / reject)
 *  3. Candidate-level detailed explanations
 * -------------------------------------------------
 */
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { getLLM } = require('./ragPipeline');

/* ================================================================
   1. COMPARATIVE RANKING EXPLANATION
   ================================================================ */

const COMPARATIVE_PROMPT = PromptTemplate.fromTemplate(`
You are a senior recruiting analyst generating a comparative report.

## Role
Title: {roleTitle}
Required Skills: {requiredSkills}
Experience Level: {experienceLevel}

## Top Candidates (ranked by final score)
{candidatesSummary}

---

Generate a comparative analysis STRICTLY as a JSON object:

{{
  "topThreeStandout": [
    {{
      "name": "<string>",
      "rank": <number>,
      "whyStandout": "<1-2 sentences>"
    }}
  ],
  "commonWeaknessesLowerRanked": ["<string>", ...],
  "overallTrend": "<1-2 sentence observation about the applicant pool>",
  "recommendedActions": ["<string>", ...]
}}

Rules:
- Be specific — reference actual skills and scores.
- Do NOT invent information not present in the data.
- Return ONLY the JSON. No markdown fences.
`);

/**
 * Generate comparative intelligence for a set of ranked applicants.
 */
async function generateComparison(role, applicants) {
  const sorted = [...applicants].sort((a, b) => b.finalScore - a.finalScore);

  const candidatesSummary = sorted
    .map(
      (a, i) =>
        `#${i + 1} ${a.name} | Score: ${a.finalScore} | Skills: ${(a.skills || []).join(', ')} | ` +
        `Strengths: ${(a.strengths || []).join(', ')} | Weaknesses: ${(a.weaknesses || []).join(', ')} | ` +
        `Fit: ${a.fitRating}`
    )
    .join('\n');

  const llm = getLLM(0.15);
  const chain = COMPARATIVE_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({
    roleTitle: role.title,
    requiredSkills: role.requiredSkills.join(', '),
    experienceLevel: role.experienceLevel,
    candidatesSummary,
  });

  try {
    return JSON.parse(raw);
  } catch {
    console.error('[SummaryGen] Failed to parse comparison:', raw);
    return {
      topThreeStandout: [],
      commonWeaknessesLowerRanked: [],
      overallTrend: 'Analysis unavailable.',
      recommendedActions: [],
    };
  }
}

/* ================================================================
   2. EMAIL CONTENT GENERATION
   ================================================================ */

const ACCEPTANCE_EMAIL_PROMPT = PromptTemplate.fromTemplate(`
You are an HR communications specialist. Write a personalized internship acceptance email.

Candidate: {candidateName}
Role: {roleTitle}
Strengths identified: {strengths}
Fit Rating: {fitRating}

Write a professional, warm acceptance email.
Include:
- Congratulations
- Reference to their specific strengths
- Next steps mention (interview scheduling)
- Company enthusiasm

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

Write a professional, empathetic rejection email.
Include:
- Thank them for applying
- Brief constructive feedback (without being harsh)
- Encouragement to apply again in future
- Wish them well

Return STRICTLY as JSON:
{{
  "subject": "<email subject line>",
  "body": "<full email body in plain text with line breaks as \\n>"
}}

Return ONLY the JSON. No markdown fences.
`);

/**
 * Generate acceptance email content.
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
    // Fallback template
    return {
      subject: `Congratulations! You've been selected for the ${role.title} internship`,
      body: `Hi ${applicant.name},\n\nWe are excited to inform you that you have been selected for the ${role.title} internship.\n\nWe were impressed by your strengths in: ${(applicant.strengths || []).join(', ')}.\n\nWe will reach out shortly with next steps.\n\nBest regards,\nThe InternSieve Team`,
    };
  }
}

/**
 * Generate rejection email content.
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
      body: `Hi ${applicant.name},\n\nThank you for your interest in the ${role.title} internship. After careful evaluation, we have decided to move forward with other candidates.\n\nWe encourage you to continue developing your skills and to apply again in the future.\n\nWishing you all the best,\nThe InternSieve Team`,
    };
  }
}

/* ================================================================
   3. RESUME INFO EXTRACTION
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
 * Extract structured info from resume text using AI.
 */
async function extractResumeInfo(resumeText) {
  const llm = getLLM(0.0);
  const chain = EXTRACT_INFO_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({ resumeText: resumeText.slice(0, 5000) });

  try {
    return JSON.parse(raw);
  } catch {
    console.error('[SummaryGen] Failed to parse extracted info:', raw);
    return null;
  }
}

module.exports = {
  generateComparison,
  generateAcceptanceEmail,
  generateRejectionEmail,
  extractResumeInfo,
};
