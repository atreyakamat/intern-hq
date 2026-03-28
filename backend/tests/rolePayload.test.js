const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeRolePayload,
  validateWeightConfig,
} = require('../utils/rolePayload');

test('normalizeRolePayload trims and deduplicates role data', () => {
  const payload = normalizeRolePayload({
    title: '  Frontend Intern  ',
    requiredSkills: 'React, React, JavaScript ',
    preferredSkills: [' TypeScript ', 'Figma', 'TypeScript'],
    description: '  Build UI systems ',
    cultureDescription: ' Collaborative ',
    weightConfig: {
      skills: 0.4,
      experience: 0.25,
      projects: 0.2,
      communication: 0.1,
      bonus: 0.05,
    },
  });

  assert.equal(payload.title, 'Frontend Intern');
  assert.deepEqual(payload.requiredSkills, ['React', 'JavaScript']);
  assert.deepEqual(payload.preferredSkills, ['TypeScript', 'Figma']);
  assert.equal(payload.description, 'Build UI systems');
  assert.equal(payload.cultureDescription, 'Collaborative');
});

test('validateWeightConfig rejects totals that do not sum to one', () => {
  assert.throws(
    () =>
      validateWeightConfig({
        skills: 0.4,
        experience: 0.25,
        projects: 0.2,
        communication: 0.1,
        bonus: 0.2,
      }),
    /sum to 1.0/i
  );
});
