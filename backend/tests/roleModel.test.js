const test = require('node:test');
const assert = require('node:assert/strict');
const Role = require('../models/Role');

test('Role model validation rejects weight configs that do not sum to one', async () => {
  const role = new Role({
    title: 'Invalid Weight Role',
    requiredSkills: ['React'],
    preferredSkills: ['TypeScript'],
    experienceLevel: 'Junior',
    weightConfig: {
      skills: 0.4,
      experience: 0.25,
      projects: 0.2,
      communication: 0.1,
      bonus: 0.1,
    },
  });

  await assert.rejects(role.validate(), /sum to 1.0/i);
});
