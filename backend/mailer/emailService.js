/**
 * mailer/emailService.js
 * -------------------------------------------------
 * Nodemailer SMTP transport + HTML template support.
 * -------------------------------------------------
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
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
 * Load an HTML template file and interpolate placeholders.
 * Placeholders: {{name}}, {{roleTitle}}, {{#strengths}}...{{/strengths}}, etc.
 *
 * @param {string} templateName - 'accept' or 'reject'
 * @param {Object} data         - Template variables
 * @returns {string}            - Rendered HTML
 */
function renderTemplate(templateName, data) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');

  // Simple {{key}} interpolation
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  }

  // Handle {{#array}}...{{/array}} blocks (for strengths/weaknesses lists)
  const blockPattern = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;
  html = html.replace(blockPattern, (match, key, template) => {
    const arr = data[key];
    if (!Array.isArray(arr)) return '';
    return arr.map((item) => template.replace(/{{\.}}/g, item)).join('');
  });

  return html;
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

module.exports = { sendEmail, getTransporter, renderTemplate };
