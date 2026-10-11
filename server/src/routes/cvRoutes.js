// server/src/routes/cvRoutes.js
import express from 'express';
import {
  layDanhSachCV,
  taoCVMoi,
  layChiTietCV,
  capNhatCV,
  xoaCV,
} from '../controllers/cvController.js';
import { xacThucToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Tất cả các route quản lý CV yêu cầu đăng nhập
router.use(xacThucToken);

// 1. Lấy danh sách CV của người dùng
router.get('/', layDanhSachCV);

// 2. Tạo bản CV mới
router.post('/', taoCVMoi);

// 3. Lấy chi tiết bản CV theo ID
router.get('/:id', layChiTietCV);

// 4. Cập nhật nội dung bản CV theo ID
router.put('/:id', capNhatCV);

// 5. Xóa bản CV theo ID
router.delete('/:id', xoaCV);

export default router;
