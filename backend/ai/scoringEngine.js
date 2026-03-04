/**
 * ai/scoringEngine.js
 * -------------------------------------------------
 * Hybrid two-layer scoring: deterministic + AI.
 * -------------------------------------------------
 *
 *  Layer 1 – Deterministic scoring
 *    FinalDeterministic =
 *      (SkillMatch        * w.skills)         +
 *      (ExperienceScore   * w.experience)     +
 *      (ProjectDepth      * w.projects)       +
 *      (CommunicationScore* w.communication)  +
 *      (BonusSignals      * w.bonus)
 *
 *  Layer 2 – AI reasoning via candidateEvaluator
 *    strengths, weaknesses, fitRating, summary
 *
 *  Layer 3 – RAG contextual fit
 *
 *  Combined: 0.45 * deterministic + 0.40 * AI + 0.15 * RAG
 * -------------------------------------------------
 */
const { evaluateWithRAG } = require('./ragPipeline');
const { evaluateCandidate } = require('./candidateEvaluator');
const { embedResume } = require('./embedding');

/* ================================================================
   LAYER 1 — Deterministic Scoring Helpers
   ================================================================ */

/**
 * Normalise a string for comparison.
 */
function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9+#]/g, '');
}

/**
 * Skill-match score (0-100).
 * How many required/preferred skills does the candidate have?
 */
function calcSkillMatch(candidateSkills, requiredSkills, preferredSkills) {
  const cs = (candidateSkills || []).map(norm);
  const reqMatches = requiredSkills.filter((s) => cs.includes(norm(s))).length;
  const prefMatches = preferredSkills.filter((s) => cs.includes(norm(s))).length;

  const reqTotal = requiredSkills.length || 1;
  const prefTotal = preferredSkills.length || 1;

  // Required skills worth 70 %, preferred 30 %
  return Math.min(
    100,
    Math.round((reqMatches / reqTotal) * 70 + (prefMatches / prefTotal) * 30)
  );
}

/**
 * Experience score (0-100).
 */
function calcExperienceScore(candidateYears, experienceLevel) {
  const targets = {
    'Entry Level': 0,
    Junior: 1,
    Intermediate: 3,
    Senior: 5,
  };
  const target = targets[experienceLevel] ?? 1;

  if (candidateYears >= target) return 100;
  if (target === 0) return 100;
  return Math.round((candidateYears / target) * 100);
}

/**
 * Project depth score (0-100).
 * Heuristic: longer + more projects = deeper.
 */
function calcProjectDepth(projectDescriptions, resumeText) {
  let score = 0;
  const projects = projectDescriptions || [];

  // Number of projects (up to 40 pts)
  score += Math.min(40, projects.length * 10);

  // Average description length (up to 30 pts)
  if (projects.length > 0) {
    const avgLen =
      projects.reduce((sum, p) => sum + (p || '').length, 0) / projects.length;
    score += Math.min(30, Math.round(avgLen / 10));
  }

  // Resume mentions of technical projects (up to 30 pts)
  const projectKeywords = [
    'project',
    'built',
    'developed',
    'implemented',
    'designed',
    'architecture',
    'deployed',
    'shipped',
  ];
  const text = (resumeText || '').toLowerCase();
  const hits = projectKeywords.filter((kw) => text.includes(kw)).length;
  score += Math.min(30, hits * 5);

  return Math.min(100, score);
}

/**
 * Communication score (0-100).
 * Based on motivation answer quality and resume clarity.
 */
function calcCommunicationScore(motivationAnswer) {
  if (!motivationAnswer) return 0;
  let score = 0;

  // Length penalty / reward
  const len = motivationAnswer.length;
  if (len > 50) score += 20;
  if (len > 150) score += 20;
  if (len > 300) score += 10;

  // Sentence structure (simple heuristic)
  const sentences = motivationAnswer.split(/[.!?]+/).filter(Boolean);
  score += Math.min(20, sentences.length * 4);

  // Keyword quality
  const qualityWords = [
    'passion',
    'goal',
    'learn',
    'contribute',
    'team',
    'impact',
    'grow',
    'challenge',
    'innovation',
    'responsibility',
  ];
  const lower = motivationAnswer.toLowerCase();
  const kwHits = qualityWords.filter((w) => lower.includes(w)).length;
  score += Math.min(30, kwHits * 6);

  return Math.min(100, score);
}

/**
 * Bonus signals score (0-100).
 * GitHub, LinkedIn, portfolio presence.
 */
function calcBonusSignals(applicant) {
  let score = 0;
  if (applicant.githubUrl) score += 35;
  if (applicant.linkedinUrl) score += 25;
  if (applicant.portfolioUrl) score += 25;
  if (applicant.education) score += 15;
  return Math.min(100, score);
}

/**
 * Run Layer 1 deterministic scoring.
 */
function deterministicScore(applicant, role) {
  const skillMatch = calcSkillMatch(
    applicant.skills,
    role.requiredSkills,
    role.preferredSkills
  );
  const experienceScore = calcExperienceScore(
    applicant.experience,
    role.experienceLevel
  );
  const projectDepth = calcProjectDepth(
    applicant.projectDescriptions,
    applicant.resumeText
  );
  const communication = calcCommunicationScore(applicant.motivationAnswer);
  const bonusSignals = calcBonusSignals(applicant);

  const w = role.weightConfig;
  const weighted = Math.round(
    skillMatch * w.skills +
      experienceScore * w.experience +
      projectDepth * w.projects +
      communication * w.communication +
      bonusSignals * w.bonus
  );

  return { skillMatch, experienceScore, projectDepth, communication, bonusSignals, weighted };
}

/* ================================================================
   LAYER 2 — AI-Powered Reasoning
   ================================================================ */

/* AI evaluation is delegated to candidateEvaluator.js */

/* ================================================================
   COMBINED SCORING PIPELINE
   ================================================================ */

/**
 * Run the full hybrid scoring pipeline for an applicant.
 *
 * Steps:
 *  1. Embed resume into vector store
 *  2. Deterministic scoring (Layer 1)
 *  3. AI reasoning (Layer 2)
 *  4. RAG evaluation (contextual retrieval)
 *  5. Combine into final score
 *
 * @param {Object} applicant - Mongoose Applicant document
 * @param {Object} role      - Mongoose Role document
 * @returns {Object} scoring results to save on applicant
 */
async function runFullScoringPipeline(applicant, role) {
  // 1. Embed resume
  try {
    await embedResume(applicant._id, applicant.resumeText, role._id);
  } catch (err) {
    console.warn('[ScoringEngine] Embedding failed, continuing:', err.message);
  }

  // 2. Layer 1: Deterministic
  const det = deterministicScore(applicant, role);

  // 3. Layer 2: AI evaluation (candidateEvaluator)
  const ai = await evaluateCandidate(applicant, role);

  // 4. RAG evaluation
  let rag = { contextualFitScore: 0, differentiators: [], concerns: [] };
  try {
    rag = await evaluateWithRAG(applicant, role);
  } catch (err) {
    console.warn('[ScoringEngine] RAG eval failed, continuing:', err.message);
  }

  // 5. Combine
  //    45 % deterministic + 40 % AI + 15 % RAG contextual
  const finalScore = Math.round(
    det.weighted * 0.45 +
      (ai.overallScore || 0) * 0.40 +
      (rag.contextualFitScore || 0) * 0.15
  );

  // Build summary
  const aiSummary = ai.summary || '';

  return {
    deterministicScore: det,
    aiScore: ai.overallScore || 0,
    aiSummary,
    strengths: ai.strengths || [],
    weaknesses: ai.weaknesses || [],
    fitRating: ai.fitRating || 'Weak',
    finalScore,
    embeddingGenerated: true,
  };
}

module.exports = {
  deterministicScore,
  runFullScoringPipeline,
  // Export helpers for testing
  calcSkillMatch,
  calcExperienceScore,
  calcProjectDepth,
  calcCommunicationScore,
  calcBonusSignals,
};
