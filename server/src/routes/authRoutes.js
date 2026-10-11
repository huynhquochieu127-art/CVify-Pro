// server/src/routes/authRoutes.js
import express from 'express';
import {
  guiOtpDangKy,
  xacThucVaDangKy,
  dangNhapGoogle,
  dangKy,
  dangNhap,
} from '../controllers/authController.js';

const router = express.Router();

// 1. Gửi mã OTP xác thực đăng ký đến Gmail
// POST /api/auth/gui-otp-dang-ky
router.post('/gui-otp-dang-ky', guiOtpDangKy);

// 2. Xác thực mã OTP và hoàn tất đăng ký tài khoản
// POST /api/auth/xac-thuc-va-dang-ky
router.post('/xac-thuc-va-dang-ky', xacThucVaDangKy);

// 3. Đăng nhập hoặc tạo mới người dùng bằng tài khoản Google
// POST /api/auth/google-login
router.post('/google-login', dangNhapGoogle);

// 4. Các API đăng ký & đăng nhập truyền thống
// POST /api/auth/dang-ky
router.post('/dang-ky', dangKy);

// POST /api/auth/dang-nhap
router.post('/dang-nhap', dangNhap);

export default router;
