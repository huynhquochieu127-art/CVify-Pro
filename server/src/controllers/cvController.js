// server/src/controllers/cvController.js
import prisma from '../config/db.js';

// Dữ liệu mẫu khởi tạo cho một bản CV mới
const DEFAULT_DINH_DANG = {
  mauChuDao: '#0a66c2',
  coChu: '14px',
  fontChu: 'Inter',
  matDo: 'normal',
};

const DEFAULT_THU_TU_KHOI = [
  'gioi-thieu',
  'kinh-nghiem',
  'hoc-van',
  'ky-nang',
];

const DEFAULT_NOI_DUNG = {
  thongTinCaNhan: {
    hoTen: '',
    viTriUngTuyen: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
    website: '',
    avatarUrl: '',
    coverColor: '#0a66c2',
  },
  gioiThieu: '',
  kinhNghiem: [],
  hocVan: [],
  kyNang: [],
  duAn: [],
  chungChi: [],
  anHienKhoi: {
    'gioi-thieu': true,
    'kinh-nghiem': true,
    'hoc-van': true,
    'ky-nang': true,
  },
};

// 1. Lấy tất cả CV của người dùng đang đăng nhập
export const layDanhSachCV = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;

    const danhSach = await prisma.danhSachCv.findMany({
      where: { ma_nguoi_dung },
      orderBy: { ngay_sua: 'desc' },
      include: {
        mau_cv: {
          select: { id: true, ten_mau: true, anh_xem_truoc: true },
        },
      },
    });

    return res.json({
      thanh_cong: true,
      danh_sach: danhSach,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi lấy danh sách CV!',
    });
  }
};

// 2. Tạo bản CV mới
export const taoCVMoi = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const { tieu_de_cv, ma_mau, noi_dung_cv, thu_tu_khoi, dinh_dang_cv } = req.body;

    // Lấy thông tin người dùng để điền sẵn họ tên & email nếu có
    const user = await prisma.nguoiDung.findUnique({
      where: { id: ma_nguoi_dung },
      select: { ho_ten: true, email: true },
    });

    const noiDungKhoiTao = {
      ...DEFAULT_NOI_DUNG,
      ...(noi_dung_cv || {}),
      thongTinCaNhan: {
        ...DEFAULT_NOI_DUNG.thongTinCaNhan,
        hoTen: user?.ho_ten || '',
        email: user?.email || '',
        ...(noi_dung_cv?.thongTinCaNhan || {}),
      },
    };

    const cvMoi = await prisma.danhSachCv.create({
      data: {
        ma_nguoi_dung,
        ma_mau: ma_mau ? parseInt(ma_mau) : null,
        tieu_de_cv: tieu_de_cv ? tieu_de_cv.trim() : 'CV Mới Chưa Đặt Tên',
        thu_tu_khoi: thu_tu_khoi || DEFAULT_THU_TU_KHOI,
        noi_dung_cv: noiDungKhoiTao,
        dinh_dang_cv: dinh_dang_cv || DEFAULT_DINH_DANG,
      },
    });

    return res.status(201).json({
      thanh_cong: true,
      thong_bao: 'Tạo CV mới thành công!',
      cv: cvMoi,
    });
  } catch (error) {
    console.error('Lỗi khi tạo CV mới:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tạo CV mới!',
    });
  }
};

// 3. Lấy chi tiết 1 bản CV theo ID
export const layChiTietCV = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Mã CV không hợp lệ!',
      });
    }

    const cv = await prisma.danhSachCv.findFirst({
      where: {
        id,
        ma_nguoi_dung,
      },
      include: {
        mau_cv: true,
      },
    });

    if (!cv) {
      return res.status(404).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy bản CV này hoặc bạn không có quyền xem!',
      });
    }

    return res.json({
      thanh_cong: true,
      cv,
    });
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tải chi tiết CV!',
    });
  }
};

// 4. Cập nhật bản CV theo ID
export const capNhatCV = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Mã CV không hợp lệ!',
      });
    }

    const { tieu_de_cv, noi_dung_cv, thu_tu_khoi, dinh_dang_cv, cong_khai } = req.body;

    // Kiểm tra xem CV có tồn tại và thuộc về người dùng không
    const tonTai = await prisma.danhSachCv.findFirst({
      where: { id, ma_nguoi_dung },
    });

    if (!tonTai) {
      return res.status(404).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy bản CV cần cập nhật!',
      });
    }

    const cvCapNhat = await prisma.danhSachCv.update({
      where: { id },
      data: {
        ...(tieu_de_cv !== undefined && { tieu_de_cv }),
        ...(noi_dung_cv !== undefined && { noi_dung_cv }),
        ...(thu_tu_khoi !== undefined && { thu_tu_khoi }),
        ...(dinh_dang_cv !== undefined && { dinh_dang_cv }),
        ...(cong_khai !== undefined && { cong_khai }),
      },
    });

    return res.json({
      thanh_cong: true,
      thong_bao: 'Cập nhật và lưu CV thành công!',
      cv: cvCapNhat,
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi lưu CV!',
    });
  }
};

// 5. Xóa bản CV theo ID
export const xoaCV = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Mã CV không hợp lệ!',
      });
    }

    const cv = await prisma.danhSachCv.findFirst({
      where: { id, ma_nguoi_dung },
    });

    if (!cv) {
      return res.status(404).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy bản CV cần xóa!',
      });
    }

    await prisma.danhSachCv.delete({
      where: { id },
    });

    return res.json({
      thanh_cong: true,
      thong_bao: 'Đã xóa bản CV thành công!',
      idXoa: id,
    });
  } catch (error) {
    console.error('Lỗi khi xóa CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi xóa CV!',
    });
  }
};
