/**
 * mailer/emailService.js
 * -------------------------------------------------
 * Nodemailer SMTP transport + send helper + logging.
 * -------------------------------------------------
 */
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Lazy-create the SMTP transporter.
 */
function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Send an email and return the result.
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} textBody
 * @param {string} [htmlBody]
 * @returns {{ success: boolean, messageId?: string, error?: string }}
 */
async function sendEmail(to, subject, textBody, htmlBody) {
  const mail = getTransporter();

  const mailOptions = {
    from: `"InternSieve" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: textBody,
    html: htmlBody || undefined,
  };

  try {
    const info = await mail.sendMail(mailOptions);
    logger.info('Mailer', `Email sent to ${to}`, { messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error('Mailer', `Failed to send email to ${to}`, {
      error: err.message,
    });
    return { success: false, error: err.message };
  }
}

module.exports = { sendEmail, getTransporter };
