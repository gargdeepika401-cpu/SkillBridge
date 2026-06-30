/**
 * Email service using Nodemailer + Gmail SMTP.
 *
 * How it works:
 *   1. Creates a "transporter" — a connection to Gmail's SMTP server
 *   2. sendOtpEmail(to, otp) — sends a formatted email with the OTP code
 *
 * Requires these env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */

const nodemailer = require('nodemailer');

// Create reusable transporter — connects to Gmail's SMTP server
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587 (uses STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send an OTP email to the user.
 * @param {string} to    — recipient email address
 * @param {string} otp   — 6-digit OTP code
 */
const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"SkillBridge" <${process.env.SMTP_USER}>`,
    to,
    subject: 'SkillBridge — Your Password Reset Code',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f1629; border-radius: 16px; color: #fff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #a78bfa;">SkillBridge</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.6); font-size: 14px;">Password Reset Request</p>
        </div>
        <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; text-align: center;">
          <p style="margin: 0 0 16px; color: rgba(255,255,255,0.8); font-size: 15px;">
            Use the code below to reset your password. It expires in <strong>5 minutes</strong>.
          </p>
          <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #818cf8; background: rgba(99,102,241,0.12); padding: 16px; border-radius: 12px; border: 1px solid rgba(99,102,241,0.2);">
            ${otp}
          </div>
          <p style="margin: 16px 0 0; color: rgba(255,255,255,0.4); font-size: 13px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <p style="text-align: center; margin: 24px 0 0; color: rgba(255,255,255,0.3); font-size: 12px;">
          &copy; ${new Date().getFullYear()} SkillBridge. All rights reserved.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
