const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[EMAIL SKIPPED] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"ResolveHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL SENT] To: ${to}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] ${error.message}`);
  }
};

const complaintStatusEmail = (name, ticketId, status) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #6366f1;">Complaint Status Update</h2>
    <p>Hello ${name},</p>
    <p>Your complaint <strong>${ticketId}</strong> has been updated to:</p>
    <p style="background: #f0f0ff; padding: 12px; border-radius: 8px; font-weight: bold; color: #6366f1;">${status}</p>
    <p>Log in to ResolveHub to view details and chat with your agent.</p>
  </div>
`;

module.exports = { sendEmail, complaintStatusEmail };
