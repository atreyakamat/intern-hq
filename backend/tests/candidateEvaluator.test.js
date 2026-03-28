const test = require('node:test');
const assert = require('node:assert/strict');
const {
  extractResumeInfo,
  evaluateCandidate,
  generateAcceptanceEmail,
  generateRejectionEmail,
} = require('../ai/candidateEvaluator');

const originalOpenAiKey = process.env.OPENAI_API_KEY;

test.before(() => {
  delete process.env.OPENAI_API_KEY;
});

test.after(() => {
  if (originalOpenAiKey) {
    process.env.OPENAI_API_KEY = originalOpenAiKey;
  } else {
    delete process.env.OPENAI_API_KEY;
  }
});

test('extractResumeInfo falls back to regex and keyword extraction without OpenAI', async () => {
  const resumeText = `Alex Rivera
alex@example.com
+1 555 123 4567
https://github.com/alexrivera
https://linkedin.com/in/alexrivera
University of Example
Built a React dashboard project using JavaScript and CSS
2 years of internship experience`;

  const result = await extractResumeInfo(resumeText);

  assert.equal(result.email, 'alex@example.com');
  assert.match(result.phone, /555/);
  assert.ok(result.skills.includes('javascript'));
  assert.ok(result.skills.includes('react'));
  assert.equal(result.experience, 2);
});

test('evaluateCandidate produces a deterministic fallback summary without OpenAI', async () => {
  const applicant = {
    name: 'Alex Rivera',
    skills: ['React', 'JavaScript', 'CSS'],
    experience: 2,
    projectDescriptions: ['Built a React analytics dashboard'],
    githubUrl: 'https://github.com/alexrivera',
    portfolioUrl: 'https://alex.dev',
    motivationAnswer: 'I want to learn and contribute to a strong product team.',
  };

  const role = {
    title: 'Frontend Intern',
    requiredSkills: ['React', 'JavaScript'],
    preferredSkills: ['TypeScript'],
    weightConfig: {
      skills: 0.4,
      experience: 0.25,
      projects: 0.2,
      communication: 0.1,
      bonus: 0.05,
    },
  };

  const result = await evaluateCandidate(applicant, role);

  assert.ok(result.overallScore > 0);
  assert.ok(['Excellent', 'Strong', 'Moderate', 'Weak'].includes(result.fitRating));
  assert.ok(result.summary.includes('Frontend Intern'));
});

test('email generators fall back to template text without OpenAI', async () => {
  const applicant = {
    name: 'Alex Rivera',
    strengths: ['Strong React fundamentals'],
    weaknesses: ['Needs more TypeScript depth'],
    fitRating: 'Strong',
    aiSummary: 'Solid frontend foundation.',
  };
  const role = { title: 'Frontend Intern' };

  const acceptance = await generateAcceptanceEmail(applicant, role);
  const rejection = await generateRejectionEmail(applicant, role);

  assert.match(acceptance.subject, /Frontend Intern/);
  assert.match(acceptance.body, /selected/i);
  assert.match(rejection.subject, /Frontend Intern/);
  assert.match(rejection.body, /Thank you for applying/i);
});
