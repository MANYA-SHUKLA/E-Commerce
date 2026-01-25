const nodemailer = require('nodemailer');

const buildTransporter = () => {
  // Simple Gmail/App Password setup
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD in .env');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

/**
 * sendEmail
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} [options.text]
 * @param {string} [options.html]
 * @param {string} [options.from]
 */
const sendEmail = async (options = {}) => {
  const { to, subject, text, html, from } = options;

  if (!to) throw new Error('sendEmail: "to" is required');
  if (!subject) throw new Error('sendEmail: "subject" is required');
  if (!text && !html) throw new Error('sendEmail: either "text" or "html" is required');

  const transporter = buildTransporter();

  const senderName = (process.env.EMAIL_SENDER_NAME || 'E-Commerce').replace(/"/g, '');
  const senderEmail = process.env.EMAIL_USER || process.env.EMAIL_USERNAME || 'noreply@ecommerce.com';

  const mailOptions = {
    from: from || `"${senderName}" <${senderEmail}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
  buildTransporter,
};