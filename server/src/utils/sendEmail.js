import nodemailer from "nodemailer";
import env from "../config/env.js";

/**
 * Email Service
 * Sends emails using Nodemailer with Gmail or other SMTP providers
 */

/**
 * Create email transporter
 * Supports Gmail, SendGrid, or custom SMTP
 */
const createTransporter = () => {
  // Check if using SendGrid
  if (env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: env.SENDGRID_API_KEY,
      },
    });
  }

  // Check if using Gmail
  if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Check if using custom SMTP
  if (env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: env.SMTP_SECURE === "true",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  // Development: Return null - we'll create Ethereal account dynamically
  return null;
};

/**
 * Create Ethereal test account dynamically
 * This is called when no email service is configured in development
 */
let etherealTransporter = null;
const getEtherealTransporter = async () => {
  if (etherealTransporter) return etherealTransporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("📧 Created Ethereal test account:", testAccount.user);

    etherealTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return etherealTransporter;
  } catch (error) {
    console.error("Failed to create Ethereal account:", error.message);
    return null;
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export const sendEmail = async (options) => {
  let transporter = createTransporter();

  // In development, use Ethereal if no transporter configured
  if (!transporter && env.NODE_ENV === "development") {
    console.log(
      "📧 No email service configured, using Ethereal for testing...",
    );
    transporter = await getEtherealTransporter();
  }

  if (!transporter) {
    console.warn("⚠️ Email service not configured. Email not sent.");
    console.log("📧 Email would have been sent to:", options.to);
    console.log("📧 Subject:", options.subject);
    throw new Error("Email service not configured");
  }

  const mailOptions = {
    from: env.EMAIL_FROM || `"Employee Management" <noreply@emp-mgmt.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);

    // If using Ethereal, log the preview URL prominently
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("\n" + "=".repeat(60));
      console.log("📧 ETHEREAL EMAIL PREVIEW (click to view email):");
      console.log("🔗 " + previewUrl);
      console.log("=".repeat(60) + "\n");
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} resetUrl - Password reset URL
 * @param {string} userName - User's name
 */
export const sendPasswordResetEmail = async (email, resetUrl, userName) => {
  const subject = "Password Reset Request - Employee Management System";

  const text = `
Hello ${userName},

You requested a password reset for your Employee Management System account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email. Your password will remain unchanged.

Best regards,
Employee Management System Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; background: linear-gradient(135deg, #1f1f3a 0%, #2d2d4a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px; color: white; font-weight: bold;">🔐</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Password Reset</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="margin: 0 0 20px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                Hello <strong style="color: #ffffff;">${userName}</strong>,
              </p>
              <p style="margin: 0 0 30px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                You requested a password reset for your Employee Management System account. Click the button below to set a new password.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                ⏰ This link will expire in <strong style="color: #f59e0b;">10 minutes</strong>.
              </p>
              
              <p style="margin: 20px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; color: #52525b; font-size: 12px;">
                Can't click the button? Copy and paste this link:
              </p>
              <p style="margin: 0; color: #10b981; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom text -->
        <p style="margin: 30px 0 0; color: #52525b; font-size: 12px;">
          © ${new Date().getFullYear()} Employee Management System. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to: email, subject, text, html });
};

export default sendEmail;
