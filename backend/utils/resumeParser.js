/**
 * utils/resumeParser.js
 * -------------------------------------------------
 * Handles PDF text extraction using pdf-parse.
 * Text cleaning is delegated to textCleaner.js.
 * -------------------------------------------------
 */
const fs = require('fs');
const pdf = require('pdf-parse');
const { cleanText } = require('./textCleaner');

/**
 * Extract text from a PDF file buffer or path.
 *
 * @param {string|Buffer} filePathOrBuffer - Path to PDF or raw buffer
 * @returns {string} Cleaned text content
 */
async function extractTextFromPDF(filePathOrBuffer) {
  let buffer;
  if (Buffer.isBuffer(filePathOrBuffer)) {
    buffer = filePathOrBuffer;
  } else {
    buffer = fs.readFileSync(filePathOrBuffer);
  }
  const data = await pdf(buffer);
  return cleanText(data.text);
}

/**
 * Quick keyword extraction from resume text (non-AI).
 * Uses a known skills dictionary for fast matching.
 */
function extractSkillKeywords(text) {
  const SKILLS_DICT = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab',
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt',
    'node.js', 'express', 'fastify', 'django', 'flask', 'spring boot',
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform',
    'git', 'ci/cd', 'jenkins', 'github actions',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'pandas', 'numpy', 'scikit-learn', 'nlp',
    'html', 'css', 'tailwindcss', 'sass', 'bootstrap',
    'graphql', 'rest api', 'websocket', 'grpc',
    'figma', 'ux', 'ui', 'photoshop',
    'agile', 'scrum', 'jira', 'confluence',
    'sql', 'nosql', 'data analysis', 'data visualization',
    'tableau', 'power bi', 'excel',
    'linux', 'bash', 'powershell',
  ];

  const lower = text.toLowerCase();
  return SKILLS_DICT.filter((skill) => lower.includes(skill));
}

module.exports = {
  extractTextFromPDF,
  cleanText,
  extractSkillKeywords,
};
