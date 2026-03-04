/**
 * mailer/templates.js
 * -------------------------------------------------
 * Static fallback email templates used when AI
 * generation is unavailable.
 * -------------------------------------------------
 */

function acceptanceTemplate(candidateName, roleTitle, strengths = []) {
  const strengthText =
    strengths.length > 0
      ? `We were particularly impressed by your strengths in: ${strengths.join(', ')}.`
      : 'Your application stood out among many strong candidates.';

  return {
    subject: `Congratulations! You've been selected for the ${roleTitle} internship`,
    body: `Dear ${candidateName},

We are delighted to inform you that after a thorough evaluation, you have been selected for the ${roleTitle} internship at our company.

${strengthText}

Here are the next steps:
1. You will receive a follow-up email with interview scheduling details within 2 business days.
2. Please prepare any questions you might have about the role and team.
3. If you have a portfolio or recent project work, feel free to share it during the interview.

We are excited about the possibility of having you join our team!

Best regards,
The InternSieve Team`,
  };
}

function rejectionTemplate(candidateName, roleTitle, feedback = '') {
  const feedbackText = feedback
    ? `\nFeedback from our evaluation:\n${feedback}\n`
    : '';

  return {
    subject: `Update on your ${roleTitle} internship application`,
    body: `Dear ${candidateName},

Thank you for taking the time to apply for the ${roleTitle} internship. We truly appreciate your interest in our organization.

After careful review and evaluation of all applicants, we have decided to move forward with other candidates whose profiles more closely match our current requirements.
${feedbackText}
This decision does not diminish the value of your skills and experience. We encourage you to:
- Continue building your portfolio and technical expertise
- Apply again for future openings that match your profile
- Stay connected with us for upcoming opportunities

We wish you every success in your career journey.

Warm regards,
The InternSieve Team`,
  };
}

module.exports = { acceptanceTemplate, rejectionTemplate };
