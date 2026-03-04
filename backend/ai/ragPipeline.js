/**
 * ai/ragPipeline.js
 * -------------------------------------------------
 * Retrieval-Augmented Generation pipeline that
 * compares resume content against job descriptions.
 * -------------------------------------------------
 */
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { similaritySearch } = require('./embedding');

/**
 * Return a ChatOpenAI model configured for deterministic JSON output.
 */
function getLLM(temperature = 0.1) {
  return new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.LLM_MODEL || 'gpt-4o-mini',
    temperature,
  });
}

/* ================================================================
   PROMPT: Retrieve relevant resume sections and compare to role
   ================================================================ */
const RAG_EVALUATION_PROMPT = PromptTemplate.fromTemplate(`
You are an expert technical recruiter performing a deep evaluation.

## Job Description Context (retrieved chunks)
{roleContext}

## Resume Context (retrieved chunks)
{resumeContext}

## Full Role Requirements
Title: {roleTitle}
Required Skills: {requiredSkills}
Preferred Skills: {preferredSkills}
Experience Level: {experienceLevel}
Company Culture: {cultureDescription}

## Candidate Form Data
Skills declared: {candidateSkills}
Experience: {candidateExperience} years
GitHub: {githubUrl}
Motivation: {motivationAnswer}
Projects: {projectDescriptions}

---

Evaluate the candidate against the role using the retrieved context.
Provide your analysis STRICTLY as a JSON object with these fields:

{{
  "contextualFitScore": <number 0-100>,
  "skillAlignment": "<paragraph>",
  "experienceAlignment": "<paragraph>",
  "projectRelevance": "<paragraph>",
  "cultureFit": "<paragraph>",
  "differentiators": ["<string>", ...],
  "concerns": ["<string>", ...],
  "ragConfidence": <number 0-100>
}}

Return ONLY the JSON object. No markdown fences.
`);

/**
 * Run the RAG evaluation pipeline for one applicant against a role.
 *
 * @param {Object} applicant  - Mongoose applicant document
 * @param {Object} role       - Mongoose role document
 * @returns {Object}          - Parsed JSON evaluation
 */
async function evaluateWithRAG(applicant, role) {
  // 1. Build the query from role requirements
  const roleQuery = [
    role.title,
    role.requiredSkills.join(', '),
    role.preferredSkills.join(', '),
    role.cultureDescription,
  ].join(' | ');

  // 2. Retrieve relevant resume chunks
  const resumeChunks = await similaritySearch(roleQuery, 6, {
    applicantId: applicant._id.toString(),
    type: 'resume',
  });

  // 3. Retrieve role description chunks
  const roleChunks = await similaritySearch(
    applicant.resumeText.slice(0, 500),
    4,
    { roleId: role._id.toString(), type: 'role' }
  );

  const resumeContext =
    resumeChunks.map((d) => d.pageContent).join('\n---\n') ||
    applicant.resumeText.slice(0, 2000);
  const roleContext =
    roleChunks.map((d) => d.pageContent).join('\n---\n') ||
    `${role.title}: ${role.description}`;

  // 4. Run LLM
  const llm = getLLM(0.1);
  const chain = RAG_EVALUATION_PROMPT.pipe(llm).pipe(new StringOutputParser());

  const raw = await chain.invoke({
    roleContext,
    resumeContext,
    roleTitle: role.title,
    requiredSkills: role.requiredSkills.join(', '),
    preferredSkills: role.preferredSkills.join(', '),
    experienceLevel: role.experienceLevel,
    cultureDescription: role.cultureDescription || 'Not specified',
    candidateSkills: (applicant.skills || []).join(', '),
    candidateExperience: applicant.experience || 0,
    githubUrl: applicant.githubUrl || 'N/A',
    motivationAnswer: applicant.motivationAnswer || 'N/A',
    projectDescriptions: (applicant.projectDescriptions || []).join('; ') || 'N/A',
  });

  try {
    return JSON.parse(raw);
  } catch {
    console.error('[RAG] Failed to parse LLM response:', raw);
    return {
      contextualFitScore: 0,
      skillAlignment: '',
      experienceAlignment: '',
      projectRelevance: '',
      cultureFit: '',
      differentiators: [],
      concerns: [],
      ragConfidence: 0,
    };
  }
}

module.exports = { evaluateWithRAG, getLLM };
