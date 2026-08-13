import { Resend } from "resend";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Core sendEmail helper using Resend API or Dev console fallback
 */
export const sendEmail = async (
  to: string,
  subject: string,
  htmlBody: string,
  from?: string
): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = from || process.env.EMAIL_FROM || "AI Resume Analyzer <onboarding@resend.dev>";

  if (apiKey && apiKey !== "re_123456789_your_resend_api_key") {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: htmlBody,
      });

      if (error) {
        console.error("[EmailService] Resend API error:", error);
        return false;
      }
      console.log(`[EmailService] Email sent successfully to ${to} (ID: ${data?.id})`);
      return true;
    } catch (error) {
      console.error("[EmailService] Exception sending email:", error);
      return false;
    }
  }

  // Development Fallback Log
  console.log(`\n======================================================`);
  console.log(`[EmailService] Dev Mode (API Key not set) - Simulated Email Output:`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From: ${fromEmail}`);
  console.log(`======================================================\n`);
  return true;
};

/**
 * Send Account Activation Email with styled HTML template
 */
export const sendActivationEmail = async (to: string, activationUrl: string, name?: string): Promise<boolean> => {
  const userName = name || "User";
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #1E3A8A; color: #ffffff; padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.5px; }
      .content { padding: 30px 25px; color: #333333; line-height: 1.6; }
      .btn-container { text-align: center; margin: 30px 0; }
      .btn { background-color: #2563EB; color: #ffffff !important; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>AI Resume Analyzer & Reviewer</h1>
      </div>
      <div class="content">
        <h2>Xin chào ${userName},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>AI Resume Analyzer</strong>. Vui lòng nhấn vào nút bên dưới để xác thực và kích hoạt tài khoản của bạn:</p>
        <div class="btn-container">
          <a href="${activationUrl}" class="btn" target="_blank">Kích hoạt tài khoản</a>
        </div>
        <p>Hoặc copy đường dẫn bên dưới và dán vào trình duyệt của bạn:</p>
        <p style="word-break: break-all; color: #2563EB;">${activationUrl}</p>
        <p>Link kích hoạt có hiệu lực trong 24 giờ. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
      </div>
      <div class="footer">
        &copy; 2026 AI Resume Analyzer. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
  return sendEmail(to, "Xác thực & Kích hoạt tài khoản - AI Resume Analyzer", html);
};

/**
 * Send Password Reset OTP / Token Email with styled HTML template
 */
export const sendOtpResetPasswordEmail = async (to: string, resetTokenOrOtp: string, name?: string): Promise<boolean> => {
  const userName = name || "User";
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetTokenOrOtp}`;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
      .header { background: #1E3A8A; color: #ffffff; padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px 25px; color: #333333; line-height: 1.6; }
      .otp-box { background-color: #EFF6FF; border: 2px dashed #3B82F6; border-radius: 8px; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1E3A8A; margin: 25px 0; word-break: break-all; }
      .btn-container { text-align: center; margin: 25px 0; }
      .btn { background-color: #2563EB; color: #ffffff !important; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Yêu cầu khôi phục mật khẩu</h1>
      </div>
      <div class="content">
        <h2>Xin chào ${userName},</h2>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email <strong>${to}</strong>.</p>
        <p>Mã / Token khôi phục mật khẩu của bạn là:</p>
        <div class="otp-box">${resetTokenOrOtp}</div>
        <div class="btn-container">
          <a href="${resetUrl}" class="btn" target="_blank">Đặt lại mật khẩu</a>
        </div>
        <p>Mã này có hiệu lực trong 1 giờ. Nếu bạn không gửi yêu cầu này, hãy bảo mật tài khoản ngay lập tức.</p>
      </div>
      <div class="footer">
        &copy; 2026 AI Resume Analyzer. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
  return sendEmail(to, "Mã khôi phục mật khẩu - AI Resume Analyzer", html);
};
