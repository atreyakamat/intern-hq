/**
 * ai/comparisonEngine.js
 * -------------------------------------------------
 * Generates comparative intelligence reports for
 * ranked applicant pools — Step 7 of the pipeline.
 *
 * After evaluating all candidates individually, this
 * module analyses the group to surface:
 *   - Top differentiators among top candidates
 *   - Common weaknesses among lower-ranked candidates
 *   - Overall pool trends and recommended actions
 * -------------------------------------------------
 */
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { getLLM } = require('./ragPipeline');

function fallbackComparison(applicants) {
  const sorted = [...applicants].sort((a, b) => b.finalScore - a.finalScore);
  const topDifferentiators = sorted.slice(0, 3).map((applicant, index) => ({
    name: applicant.name,
    rank: applicant.rank || index + 1,
    whyStandout:
      applicant.strengths?.[0] ||
      `Strongest available profile based on a final score of ${applicant.finalScore}`,
  }));

  const lowerRanked = sorted.slice(3);
  const commonWeaknesses = [...new Set(
    lowerRanked.flatMap((applicant) => applicant.weaknesses || [])
  )].slice(0, 5);

  const averageScore = sorted.length
    ? Math.round(sorted.reduce((sum, applicant) => sum + (applicant.finalScore || 0), 0) / sorted.length)
    : 0;

  return {
    topDifferentiators,
    commonWeaknesses,
    overallTrend: `The current applicant pool averages ${averageScore}/100 across ${sorted.length} ranked candidate(s).`,
    recommendedActions: [
      'Prioritize interviews for the highest-ranked candidates first.',
      'Review missing required skills before moving lower-ranked candidates forward.',
    ],
  };
}

function withLegacyAliases(report) {
  return {
    ...report,
    topThreeStandout: report.topDifferentiators,
    commonWeaknessesLowerRanked: report.commonWeaknesses,
  };
}

/* ================================================================
   COMPARATIVE ANALYSIS PROMPT
   ================================================================ */

const COMPARATIVE_PROMPT = PromptTemplate.fromTemplate(`
You are a senior recruiting analyst generating a comparative report.

## Role
Title: {roleTitle}
Required Skills: {requiredSkills}
Experience Level: {experienceLevel}

## Candidates (ranked by final score)
{candidatesSummary}

---

Generate a comparative analysis STRICTLY as a JSON object:

{{
  "topDifferentiators": [
    {{
      "name": "<string>",
      "rank": <number>,
      "whyStandout": "<1-2 sentences explaining what makes them unique>"
    }}
  ],
  "commonWeaknesses": ["<string>", ...],
  "overallTrend": "<1-2 sentence observation about the applicant pool quality>",
  "recommendedActions": ["<string>", ...]
}}

Rules:
- Include up to 3 top candidates in topDifferentiators.
- commonWeaknesses should list patterns seen in lower-ranked candidates.
- Be specific — reference actual skills, scores, and data.
- Do NOT invent information not present in the data.
- Return ONLY the JSON. No markdown fences.
`);

/**
 * Generate comparative intelligence for a set of ranked applicants.
 *
 * @param {Object}   role       - Mongoose Role document
 * @param {Object[]} applicants - Array of Applicant documents (pre-sorted by finalScore desc)
 * @returns {Object}            - Comparative report
 */
async function generateComparison(role, applicants) {
  const sorted = [...applicants].sort((a, b) => b.finalScore - a.finalScore);

  const candidatesSummary = sorted
    .map(
      (a, i) =>
        `#${i + 1} ${a.name} | Score: ${a.finalScore} | ` +
        `Skills: ${(a.skills || []).join(', ')} | ` +
        `Strengths: ${(a.strengths || []).join(', ')} | ` +
        `Weaknesses: ${(a.weaknesses || []).join(', ')} | ` +
        `Fit: ${a.fitRating}`
    )
    .join('\n');

  const llm = getLLM(0.2);
  const chain = COMPARATIVE_PROMPT.pipe(llm).pipe(new StringOutputParser());

  try {
    const raw = await chain.invoke({
      roleTitle: role.title,
      requiredSkills: role.requiredSkills.join(', '),
      experienceLevel: role.experienceLevel,
      candidatesSummary,
    });

    try {
      return withLegacyAliases(JSON.parse(raw));
    } catch {
      console.error('[ComparisonEngine] Failed to parse comparison:', raw);
      return withLegacyAliases(fallbackComparison(sorted));
    }
  } catch (error) {
    console.error('[ComparisonEngine] Fallback comparison triggered:', error.message);
    return withLegacyAliases(fallbackComparison(sorted));
  }
}

module.exports = { generateComparison };
