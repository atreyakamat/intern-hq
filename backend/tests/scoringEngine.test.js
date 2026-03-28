const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calcSkillMatch,
  calcExperienceScore,
  calcProjectDepth,
  calcCommunicationScore,
  calcBonusSignals,
} = require('../ai/scoringEngine');

test('calcSkillMatch rewards required skills more than preferred skills', () => {
  const score = calcSkillMatch(
    ['React', 'JavaScript', 'Figma'],
    ['React', 'JavaScript'],
    ['TypeScript', 'Figma']
  );

  assert.equal(score, 85);
});

test('calcExperienceScore uses experience level targets', () => {
  assert.equal(calcExperienceScore(0, 'Entry Level'), 100);
  assert.equal(calcExperienceScore(1, 'Junior'), 100);
  assert.equal(calcExperienceScore(2, 'Intermediate'), 67);
});

test('calcProjectDepth and communication helpers stay within expected ranges', () => {
  const projectDepth = calcProjectDepth(
    ['Built an analytics dashboard with React and Node.js', 'Designed a deployment pipeline'],
    'Built and deployed a project with architecture decisions and implementation details.'
  );
  const communication = calcCommunicationScore(
    'I want to learn, contribute to the team, and grow through meaningful product challenges.'
  );

  assert.ok(projectDepth >= 20 && projectDepth <= 100);
  assert.ok(communication >= 20 && communication <= 100);
});

test('calcBonusSignals counts relevant profile links and education', () => {
  const score = calcBonusSignals({
    githubUrl: 'https://github.com/example',
    linkedinUrl: 'https://linkedin.com/in/example',
    portfolioUrl: 'https://example.dev',
    education: 'State University',
  });

  assert.equal(score, 100);
});
