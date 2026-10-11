// server/src/config/mail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo Transporter với dịch vụ Gmail
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Hàm gửi email chứa mã OTP đăng ký với giao diện HTML chuyên nghiệp
 * @param {string} toEmail - Địa chỉ Gmail người nhận
 * @param {string} otp - Mã OTP 6 chữ số
 */
export const guiMailOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: `"CVify Pro Support" <${process.env.EMAIL_USER || 'no-reply@cvifypro.com'}>`,
    to: toEmail,
    subject: '[CVify Pro] Mã xác thực đăng ký tài khoản của bạn',
    html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mã Xác Thực OTP - CVify Pro</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0a66c2 0%, #004182 100%); padding: 32px 24px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { color: #bfdbfe; margin: 6px 0 0; font-size: 13px; }
          .body { padding: 32px 28px; }
          .greeting { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 12px; }
          .desc { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
          .otp-card { background: #f0f7ff; border: 2px dashed #0a66c2; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .otp-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0a66c2; margin-bottom: 8px; }
          .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0a66c2; font-family: 'Courier New', monospace; margin: 0; }
          .warning { font-size: 13px; color: #e11d48; background: #fff1f2; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #f43f5e; }
          .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CVify Pro</h1>
            <p>Hệ thống Thiết kế & Quản lý CV Chuyên nghiệp</p>
          </div>
          <div class="body">
            <div class="greeting">Xin chào bạn,</div>
            <p class="desc">
              Cảm ơn bạn đã đăng ký tài khoản tại <strong>CVify Pro</strong>. Để hoàn tất việc kích hoạt tài khoản của bạn, vui lòng nhập mã xác thực OTP dưới đây:
            </p>
            <div class="otp-card">
              <div class="otp-label">MÃ XÁC THỰC OTP CỦA BẠN</div>
              <div class="otp-code">${otp}</div>
            </div>
            <div class="warning">
              ⏱ <strong>Lưu ý:</strong> Mã xác thực có hiệu lực trong vòng <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này cho bất kỳ ai!
            </div>
            <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
              Nếu bạn không yêu cầu mã này, bạn có thể an tâm bỏ qua email này.
            </p>
          </div>
          <div class="footer">
            © 2026 CVify Pro. Mọi quyền được bảo lưu.<br>
            Email này được gửi tự động, vui lòng không phản hồi.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default transporter;
