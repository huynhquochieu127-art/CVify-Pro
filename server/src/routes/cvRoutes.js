// server/src/routes/cvRoutes.js
import express from 'express';
import multer from 'multer';
import {
  layDanhSachCV,
  taoCVMoi,
  layChiTietCV,
  capNhatCV,
  capNhatPushCongDong,
  xoaCV,
  layCVPublic,
  layDanhSachCVCongDong,
  guiDanhGiaCV,
  layDanhSachDanhGia,
  layHoSoGoc,
  luuHoSoGoc,
  phanTichCVNgoai,
  soKhopCVVoiJD,
  dichNoiDungCV,
} from '../controllers/cvController.js';
import { xacThucToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// ==========================================
// CÁC ROUTE CÔNG KHAI (XEM PUBLIC, CỘNG ĐỒNG, ĐÁNH GIÁ & PARSER CV NGOÀI)
// ==========================================
router.get('/cong-dong', layDanhSachCVCongDong);
router.get('/public/:shareId', layCVPublic);
router.post('/parse-external-cv', upload.single('file'), phanTichCVNgoai);
router.post('/so-khop-jd', soKhopCVVoiJD);
router.post('/dich-noi-dung', dichNoiDungCV);
router.get('/:id/danh-gia', layDanhSachDanhGia);
router.post('/:id/danh-gia', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return xacThucToken(req, res, () => guiDanhGiaCV(req, res, next));
  }
  return guiDanhGiaCV(req, res, next);
});

// ==========================================
// CÁC ROUTE QUẢN LÝ CV & HỒ SƠ GỐC (YÊU CẦU ĐĂNG NHẬP)
// ==========================================
router.use(xacThucToken);

// 0. Lấy & Lưu Hồ Sơ Gốc (Master Profile)
router.get('/ho-so-goc', layHoSoGoc);
router.put('/ho-so-goc', luuHoSoGoc);

// 1. Lấy danh sách CV của người dùng
router.get('/', layDanhSachCV);

// 2. Tạo bản CV mới
router.post('/', taoCVMoi);

// 3. Lấy chi tiết bản CV theo ID
router.get('/:id', layChiTietCV);

// 4. Cập nhật nội dung bản CV theo ID
router.put('/:id', capNhatCV);

// 4b. Chủ động Push / Gỡ CV trên Cộng Đồng Nghề Nghiệp
router.put('/:id/push-cong-dong', capNhatPushCongDong);

// 5. Xóa bản CV theo ID
router.delete('/:id', xoaCV);

export default router;
