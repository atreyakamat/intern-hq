/**
 * ai/summaryGenerator.js
 * -------------------------------------------------
 * RE-EXPORT MODULE
 *
 * This file preserves backwards compatibility by
 * re-exporting functions that were moved to:
 *   - ai/candidateEvaluator.js
 *   - ai/comparisonEngine.js
 * -------------------------------------------------
 */
const { evaluateCandidate, extractResumeInfo, generateAcceptanceEmail, generateRejectionEmail } = require('./candidateEvaluator');
const { generateComparison } = require('./comparisonEngine');

module.exports = {
  evaluateCandidate,
  extractResumeInfo,
  generateAcceptanceEmail,
  generateRejectionEmail,
  generateComparison,
};
