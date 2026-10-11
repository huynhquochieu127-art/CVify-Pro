// server/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { guiMailOTP } from '../config/mail.js';

// Bộ nhớ tạm lưu trữ mã OTP: Key là email (lowercase), Value là { otp, expiresAt }
const otpStore = new Map();

// Hàm dọn dẹp các mã OTP đã hết hạn định kỳ
setInterval(() => {
  const now = Date.now();
  for (const [email, item] of otpStore.entries()) {
    if (now > item.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 60 * 1000);

// ======================================================================
// 1. GỬI MÃ OTP ĐĂNG KÝ VỀ GMAIL (Nodemailer)
// ======================================================================
export const guiOtpDangKy = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng cung cấp địa chỉ Gmail hợp lệ!',
      });
    }

    const emailChuanHoa = email.trim().toLowerCase();

    // 1. Kiểm tra định dạng bắt buộc @gmail.com
    if (!emailChuanHoa.endsWith('@gmail.com')) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Hệ thống chỉ hỗ trợ đăng ký bằng tài khoản Gmail (@gmail.com)!',
      });
    }

    // 2. Kiểm tra xem email đã tồn tại trong MySQL chưa
    const nguoiDungTonTai = await prisma.nguoiDung.findUnique({
      where: { email: emailChuanHoa },
    });

    if (nguoiDungTonTai) {
      return res.status(409).json({
        thanh_cong: false,
        thong_bao: 'Email này đã được sử dụng!',
      });
    }

    // 3. Sinh mã OTP ngẫu nhiên 6 chữ số (100000 -> 999999)
    const maOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Lưu mã OTP vào bộ nhớ có thời hạn 5 phút (300.000 ms)
    otpStore.set(emailChuanHoa, {
      otp: maOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log(`[CVify Pro] 👉 Mã OTP cho Gmail (${emailChuanHoa}): ${maOtp} (Hết hạn trong 5 phút)`);

    // 5. Gửi email thật qua Nodemailer
    try {
      await guiMailOTP(emailChuanHoa, maOtp);
    } catch (mailError) {
      console.error('[Nodemailer Error] Không thể gửi email:', mailError.message);
      // Nếu gửi mail thất bại (do chưa điền App Password Gmail hợp lệ trong .env)
      // Vẫn thông báo hướng dẫn người dùng
      return res.status(500).json({
        thanh_cong: false,
        thong_bao:
          'Không thể gửi email xác thực. Vui lòng kiểm tra lại cấu hình EMAIL_USER và EMAIL_PASS (Mật khẩu ứng dụng Gmail) trong server/.env!',
      });
    }

    return res.json({
      thanh_cong: true,
      thong_bao: 'Mã OTP đã được gửi về Gmail của bạn!',
    });
  } catch (error) {
    console.error('Lỗi khi gửi OTP đăng ký:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi gửi mã xác thực. Vui lòng thử lại sau!',
    });
  }
};

// ======================================================================
// 2. XÁC THỰC MÃ OTP & ĐĂNG KÝ TÀI KHOẢN MỚI
// ======================================================================
export const xacThucVaDangKy = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau, ma_otp } = req.body;

    if (!ho_ten || !email || !mat_khau || !ma_otp) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng điền đầy đủ Họ tên, Gmail, Mật khẩu và Mã OTP!',
      });
    }

    const emailChuanHoa = email.trim().toLowerCase();
    const otpNhap = ma_otp.toString().trim();

    // 1. Kiểm tra mã OTP trong bộ nhớ tạm
    const duLieuOtp = otpStore.get(emailChuanHoa);

    if (!duLieuOtp || duLieuOtp.otp !== otpNhap || Date.now() > duLieuOtp.expiresAt) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Mã OTP không chính xác hoặc đã hết hạn!',
      });
    }

    // Xóa mã OTP sau khi xác thực thành công để chống dùng lại
    otpStore.delete(emailChuanHoa);

    // 2. Kiểm tra lại trùng email trong CSDL
    const nguoiDungTonTai = await prisma.nguoiDung.findUnique({
      where: { email: emailChuanHoa },
    });

    if (nguoiDungTonTai) {
      return res.status(409).json({
        thanh_cong: false,
        thong_bao: 'Email này đã được sử dụng!',
      });
    }

    // 3. Mã hóa mật khẩu bằng bcryptjs
    const matKhauMaHoa = await bcrypt.hash(mat_khau, 10);

    // 4. Lưu tài khoản mới vào MySQL
    const nguoiDungMoi = await prisma.nguoiDung.create({
      data: {
        ho_ten: ho_ten.trim(),
        email: emailChuanHoa,
        mat_khau: matKhauMaHoa,
        vai_tro: 'nguoi_dung',
      },
    });

    // 5. Tự động tạo 1 bản ghi ho_so_goc cho người dùng này
    await prisma.hoSoGoc.create({
      data: {
        ma_nguoi_dung: nguoiDungMoi.id,
        thong_tin_ca_nhan: {
          ho_ten: nguoiDungMoi.ho_ten,
          email: nguoiDungMoi.email,
        },
        kinh_nghiem: [],
        hoc_van: [],
        ky_nang: [],
      },
    });

    // 6. Tạo JWT Token
    const token = jwt.sign(
      { id: nguoiDungMoi.id, email: nguoiDungMoi.email },
      process.env.JWT_SECRET || 'cv_builder_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      thanh_cong: true,
      thong_bao: 'Đăng ký tài khoản thành công!',
      token,
      nguoi_dung: {
        id: nguoiDungMoi.id,
        ho_ten: nguoiDungMoi.ho_ten,
        email: nguoiDungMoi.email,
        vai_tro: nguoiDungMoi.vai_tro,
        avatar: '',
      },
    });
  } catch (error) {
    console.error('Lỗi khi xác thực và đăng ký:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi hoàn tất đăng ký. Vui lòng thử lại!',
    });
  }
};

// ======================================================================
// 3. ĐĂNG NHẬP BẰNG GOOGLE (Google Sign-In)
// ======================================================================
export const dangNhapGoogle = async (req, res) => {
  try {
    const { email, ho_ten, anh_dai_dien } = req.body;

    if (!email) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Thông tin tài khoản Google không hợp lệ (thiếu email)!',
      });
    }

    const emailChuanHoa = email.trim().toLowerCase();
    const tenHienThi = ho_ten?.trim() || emailChuanHoa.split('@')[0];

    // Kiểm tra xem người dùng đã tồn tại trong MySQL chưa
    let nguoiDung = await prisma.nguoiDung.findUnique({
      where: { email: emailChuanHoa },
      include: { ho_so_goc: true },
    });

    if (!nguoiDung) {
      // Nếu chưa có trong MySQL -> Tự động tạo mới tài khoản
      const matKhauNgauNhien = await bcrypt.hash(`google_oauth_${Date.now()}_${Math.random()}`, 10);

      nguoiDung = await prisma.nguoiDung.create({
        data: {
          email: emailChuanHoa,
          ho_ten: tenHienThi,
          mat_khau: matKhauNgauNhien,
          vai_tro: 'nguoi_dung',
        },
      });

      // Tự động tạo bản ghi ho_so_goc và lưu avatar
      const hoSoGoc = await prisma.hoSoGoc.create({
        data: {
          ma_nguoi_dung: nguoiDung.id,
          anh_dai_dien: anh_dai_dien || null,
          thong_tin_ca_nhan: {
            ho_ten: tenHienThi,
            email: emailChuanHoa,
            anh_dai_dien: anh_dai_dien || null,
          },
          kinh_nghiem: [],
          hoc_van: [],
          ky_nang: [],
        },
      });

      nguoiDung.ho_so_goc = hoSoGoc;
    } else {
      // Nếu tài khoản đã tồn tại và có avatar mới nhưng ho_so_goc chưa có
      if (anh_dai_dien && (!nguoiDung.ho_so_goc || !nguoiDung.ho_so_goc.anh_dai_dien)) {
        if (!nguoiDung.ho_so_goc) {
          const hoSoMoi = await prisma.hoSoGoc.create({
            data: {
              ma_nguoi_dung: nguoiDung.id,
              anh_dai_dien: anh_dai_dien,
              thong_tin_ca_nhan: {
                ho_ten: nguoiDung.ho_ten,
                email: nguoiDung.email,
                anh_dai_dien: anh_dai_dien,
              },
              kinh_nghiem: [],
              hoc_van: [],
              ky_nang: [],
            },
          });
          nguoiDung.ho_so_goc = hoSoMoi;
        } else {
          const hoSoCapNhat = await prisma.hoSoGoc.update({
            where: { ma_nguoi_dung: nguoiDung.id },
            data: { anh_dai_dien: anh_dai_dien },
          });
          nguoiDung.ho_so_goc = hoSoCapNhat;
        }
      }
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: nguoiDung.id, email: nguoiDung.email },
      process.env.JWT_SECRET || 'cv_builder_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    const avatarUrl = anh_dai_dien || nguoiDung.ho_so_goc?.anh_dai_dien || '';

    return res.json({
      thanh_cong: true,
      thong_bao: 'Đăng nhập Google thành công!',
      token,
      nguoi_dung: {
        id: nguoiDung.id,
        ho_ten: nguoiDung.ho_ten,
        email: nguoiDung.email,
        vai_tro: nguoiDung.vai_tro,
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập bằng Google:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi đăng nhập bằng Google!',
    });
  }
};

// ======================================================================
// 4. ĐĂNG KÝ TRUYỀN THỐNG (Dự phòng)
// ======================================================================
export const dangKy = async (req, res) => {
  try {
    const { ho_ten, email, mat_khau } = req.body;

    if (!ho_ten || !email || !mat_khau) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu!',
      });
    }

    const emailChuanHoa = email.trim().toLowerCase();

    const nguoiDungTonTai = await prisma.nguoiDung.findUnique({
      where: { email: emailChuanHoa },
    });

    if (nguoiDungTonTai) {
      return res.status(409).json({
        thanh_cong: false,
        thong_bao: 'Email này đã được sử dụng. Vui lòng chọn email khác!',
      });
    }

    const matKhauMaHoa = await bcrypt.hash(mat_khau, 10);

    const nguoiDungMoi = await prisma.nguoiDung.create({
      data: {
        ho_ten: ho_ten.trim(),
        email: emailChuanHoa,
        mat_khau: matKhauMaHoa,
        vai_tro: 'nguoi_dung',
      },
    });

    await prisma.hoSoGoc.create({
      data: {
        ma_nguoi_dung: nguoiDungMoi.id,
        thong_tin_ca_nhan: { ho_ten: nguoiDungMoi.ho_ten, email: nguoiDungMoi.email },
        kinh_nghiem: [],
        hoc_van: [],
        ky_nang: [],
      },
    });

    const token = jwt.sign(
      { id: nguoiDungMoi.id, email: nguoiDungMoi.email },
      process.env.JWT_SECRET || 'cv_builder_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      thanh_cong: true,
      thong_bao: 'Đăng ký tài khoản thành công!',
      token,
      nguoi_dung: {
        id: nguoiDungMoi.id,
        ho_ten: nguoiDungMoi.ho_ten,
        email: nguoiDungMoi.email,
        vai_tro: nguoiDungMoi.vai_tro,
        avatar: '',
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi đăng ký tài khoản. Vui lòng thử lại sau!',
    });
  }
};

// ======================================================================
// 5. ĐĂNG NHẬP TRUYỀN THỐNG (Email & Password)
// ======================================================================
export const dangNhap = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    if (!email || !mat_khau) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng nhập Email và Mật khẩu!',
      });
    }

    const emailChuanHoa = email.trim().toLowerCase();

    const nguoiDung = await prisma.nguoiDung.findUnique({
      where: { email: emailChuanHoa },
      include: { ho_so_goc: true },
    });

    if (!nguoiDung) {
      return res.status(401).json({
        thanh_cong: false,
        thong_bao: 'Email hoặc mật khẩu không chính xác!',
      });
    }

    const matKhauChinhXac = await bcrypt.compare(mat_khau, nguoiDung.mat_khau);
    if (!matKhauChinhXac) {
      return res.status(401).json({
        thanh_cong: false,
        thong_bao: 'Email hoặc mật khẩu không chính xác!',
      });
    }

    const token = jwt.sign(
      { id: nguoiDung.id, email: nguoiDung.email },
      process.env.JWT_SECRET || 'cv_builder_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    const avatarUrl = nguoiDung.ho_so_goc?.anh_dai_dien || '';

    return res.json({
      thanh_cong: true,
      thong_bao: 'Đăng nhập thành công!',
      token,
      nguoi_dung: {
        id: nguoiDung.id,
        ho_ten: nguoiDung.ho_ten,
        email: nguoiDung.email,
        vai_tro: nguoiDung.vai_tro,
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi đăng nhập!',
    });
  }
};
