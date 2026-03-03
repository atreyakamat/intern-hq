const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

exports.generateAcceptanceEmail = (candidateName, roleTitle, strengths) => {
  const subject = `Congratulations! You've been shortlisted for the ${roleTitle} internship`;
  const text = `Hi ${candidateName},

We are excited to inform you that you have been shortlisted for the ${roleTitle} internship. We were particularly impressed by your strengths in: ${strengths.join(', ')}.

We will contact you soon for the next steps.

Best regards,
InternSieve Team`;
  return { subject, text };
};

exports.generateRejectionEmail = (candidateName, roleTitle, feedback) => {
  const subject = `Update on your application for ${roleTitle}`;
  const text = `Hi ${candidateName},

Thank you for your interest in the ${roleTitle} internship. After careful review, we have decided not to move forward with your application at this time.

Feedback from our AI evaluation:
${feedback}

We wish you the best in your future endeavors.

Best regards,
InternSieve Team`;
  return { subject, text };
};
