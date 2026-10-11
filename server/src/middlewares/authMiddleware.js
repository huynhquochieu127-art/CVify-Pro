// server/src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const xacThucToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng đăng nhập để thực hiện thao tác này!',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_cv');
    req.nguoiDung = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      thanh_cong: false,
      thong_bao: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!',
    });
  }
};
