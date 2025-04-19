const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // Add to .env
      pass: process.env.EMAIL_PASS,     // Add to .env
    },
  });

  await transporter.sendMail({
    from: `"Rehnuma Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;