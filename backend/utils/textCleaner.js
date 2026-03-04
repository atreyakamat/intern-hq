/**
 * utils/textCleaner.js
 * -------------------------------------------------
 * Text normalisation and cleaning utilities for
 * resume content and applicant answers.
 * -------------------------------------------------
 */

/**
 * Clean and normalise raw extracted text.
 * Removes excessive whitespace, non-printable characters,
 * and normalises line endings.
 *
 * @param {string} raw - Raw extracted text
 * @returns {string}   - Cleaned text
 */
function cleanText(raw) {
  if (!raw) return '';
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')        // collapse 3+ newlines
    .replace(/[ \t]{2,}/g, ' ')        // collapse multiple spaces/tabs
    .replace(/[^\x20-\x7E\n]/g, '')    // strip non-printable ASCII
    .trim();
}

/**
 * Normalise a single string for comparison (lowercase, strip special chars).
 *
 * @param {string} s
 * @returns {string}
 */
function normalise(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9+#. ]/g, '').trim();
}

/**
 * Remove stop-words and very short tokens from text.
 *
 * @param {string} text
 * @returns {string}
 */
function removeStopWords(text) {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
    'should', 'may', 'might', 'must', 'can', 'could', 'of', 'in', 'on',
    'at', 'to', 'for', 'with', 'by', 'from', 'as', 'into', 'through',
    'during', 'before', 'after', 'and', 'but', 'or', 'nor', 'not',
    'so', 'yet', 'both', 'either', 'neither', 'each', 'every',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our',
    'you', 'your', 'he', 'she', 'it', 'they', 'them', 'their',
  ]);

  return text
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w.toLowerCase()))
    .join(' ');
}

/**
 * Truncate text to a maximum character length, appending '...' if truncated.
 *
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(text, maxLen = 4000) {
  if (!text || text.length <= maxLen) return text || '';
  return text.slice(0, maxLen) + '...';
}

module.exports = {
  cleanText,
  normalise,
  removeStopWords,
  truncate,
};
