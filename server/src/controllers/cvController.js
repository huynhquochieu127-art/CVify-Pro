// server/src/controllers/cvController.js
import prisma from '../config/db.js';
import { layGioVietNam } from './authController.js';
import { parseExternalCVText } from '../utils/cvParser.js';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

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
        cong_khai: Boolean(req.body.cong_khai),
        cho_phep_danh_gia: Boolean(req.body.cho_phep_danh_gia),
        thu_tu_khoi: thu_tu_khoi || DEFAULT_THU_TU_KHOI,
        noi_dung_cv: noiDungKhoiTao,
        dinh_dang_cv: dinh_dang_cv || DEFAULT_DINH_DANG,
        ngay_tao: layGioVietNam(),
        ngay_sua: layGioVietNam(),
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
        ...(req.body.cho_phep_danh_gia !== undefined && { cho_phep_danh_gia: req.body.cho_phep_danh_gia }),
        ngay_sua: layGioVietNam(),
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

// ==========================================
// TÍNH NĂNG MỚI: ĐÁNH GIÁ & GÓP Ý CV CỘNG ĐỒNG
// ==========================================

// 6. Chủ động Push hoặc Gỡ CV trên Bản Tin Cộng Đồng Nghề Nghiệp
export const capNhatPushCongDong = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const id = parseInt(req.params.id);
    const { cong_khai, loi_nhan_cong_dong } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ thanh_cong: false, thong_bao: 'Mã CV không hợp lệ!' });
    }

    const tonTai = await prisma.danhSachCv.findFirst({
      where: { id, ma_nguoi_dung },
    });

    if (!tonTai) {
      return res.status(404).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy bản CV của bạn!',
      });
    }

    const noiDungHienTai =
      tonTai.noi_dung_cv && typeof tonTai.noi_dung_cv === 'object'
        ? tonTai.noi_dung_cv
        : {};

    const cvCapNhat = await prisma.danhSachCv.update({
      where: { id },
      data: {
        cong_khai: Boolean(cong_khai),
        cho_phep_danh_gia: Boolean(cong_khai),
        noi_dung_cv: {
          ...noiDungHienTai,
          ...(loi_nhan_cong_dong !== undefined && { loi_nhan_cong_dong }),
        },
        ngay_sua: layGioVietNam(),
      },
    });

    return res.json({
      thanh_cong: true,
      thong_bao: cong_khai
        ? 'Đã Push CV lên Cộng Đồng Nghề Nghiệp để nhận đánh giá!'
        : 'Đã gỡ CV khỏi Cộng Đồng (Chuyển về riêng tư)!',
      cv: cvCapNhat,
    });
  } catch (error) {
    console.error('Lỗi khi push CV lên cộng đồng:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi cập nhật trạng thái cộng đồng!',
    });
  }
};

// 6a. Lấy danh sách CV đã được chủ nhân CHỦ ĐỘNG PUSH lên Cộng Đồng (cong_khai: true)
export const layDanhSachCVCongDong = async (req, res) => {
  try {
    const danhSach = await prisma.danhSachCv.findMany({
      where: {
        cong_khai: true,
      },
      orderBy: { ngay_sua: 'desc' },
      take: 30,
      include: {
        nguoi_dung: {
          select: { id: true, ho_ten: true, email: true },
        },
        danh_gia: {
          orderBy: { ngay_tao: 'desc' },
          take: 5,
        },
        _count: {
          select: { danh_gia: true },
        },
      },
    });

    return res.json({
      thanh_cong: true,
      danh_sach: danhSach,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách CV cộng đồng:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tải danh sách CV cộng đồng!',
    });
  }
};

// 6b. Lấy chi tiết CV theo mã chia sẻ công khai kèm các đánh giá thật
export const layCVPublic = async (req, res) => {
  try {
    const { shareId } = req.params;
    const cvIdNum = parseInt(shareId);

    const cv = await prisma.danhSachCv.findFirst({
      where: {
        OR: [
          { ma_chia_se: shareId },
          ...(!isNaN(cvIdNum) ? [{ id: cvIdNum }] : []),
        ],
      },
      include: {
        nguoi_dung: {
          select: { id: true, ho_ten: true, email: true },
        },
        danh_gia: {
          orderBy: { ngay_tao: 'desc' },
          include: {
            nguoi_danh_gia: {
              select: { id: true, ho_ten: true, email: true },
            },
          },
        },
      },
    });

    if (!cv) {
      return res.status(404).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy bản CV này trong cơ sở dữ liệu!',
      });
    }

    return res.json({
      thanh_cong: true,
      cv,
    });
  } catch (error) {
    console.error('Lỗi khi lấy CV public:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tải CV công khai!',
    });
  }
};

// 7. Gửi đánh giá sao và nhận xét góp ý thật cho một bản CV (Mỗi người chỉ lưu 1 đánh giá mới nhất, không lặp lại)
export const guiDanhGiaCV = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { diem_so, diem_bo_cuc, diem_noi_dung, diem_ky_nang, nhan_xet, ten_nguoi_danh_gia } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ thanh_cong: false, thong_bao: 'Mã CV không hợp lệ!' });
    }

    const cv = await prisma.danhSachCv.findUnique({
      where: { id },
    });

    if (!cv) {
      return res.status(404).json({ thanh_cong: false, thong_bao: 'Không tìm thấy bản CV!' });
    }

    const ma_nguoi_danh_gia = req.nguoiDung ? req.nguoiDung.id : null;
    const tenNguoiDanhGia =
      ten_nguoi_danh_gia?.trim() ||
      (req.nguoiDung ? req.nguoiDung.ho_ten : 'Người dùng ẩn danh');

    const diemSoChuan = Math.min(5, Math.max(1, parseInt(diem_so) || 5));
    const duLieuDG = {
      ma_cv: id,
      ma_nguoi_danh_gia,
      ten_nguoi_danh_gia: tenNguoiDanhGia,
      diem_so: diemSoChuan,
      diem_bo_cuc: diem_bo_cuc ? parseInt(diem_bo_cuc) : 5,
      diem_noi_dung: diem_noi_dung ? parseInt(diem_noi_dung) : 5,
      diem_ky_nang: diem_ky_nang ? parseInt(diem_ky_nang) : 5,
      nhan_xet: nhan_xet ? String(nhan_xet).trim() : 'CV thiết kế rất chuyên nghiệp!',
      ngay_tao: layGioVietNam(),
    };

    // Tìm xem người đánh giá này đã từng chấm điểm CV này chưa để cập nhật thay vì tạo trùng lặp
    const tenGoc = tenNguoiDanhGia.split('(')[0].trim();
    const danhGiaCu = await prisma.danhGiaCv.findMany({
      where: {
        ma_cv: id,
        OR: [
          ...(ma_nguoi_danh_gia ? [{ ma_nguoi_danh_gia }] : []),
          ...(tenGoc ? [{ ten_nguoi_danh_gia: { startsWith: tenGoc } }] : []),
        ],
      },
      orderBy: { id: 'desc' },
    });

    let danhGiaMoi;
    if (danhGiaCu.length > 0) {
      danhGiaMoi = await prisma.danhGiaCv.update({
        where: { id: danhGiaCu[0].id },
        data: duLieuDG,
      });
      // Xóa các bản ghi bị trùng cũ (nếu có) của cùng người này trên cùng CV
      if (danhGiaCu.length > 1) {
        const idsTrung = danhGiaCu.slice(1).map((d) => d.id);
        await prisma.danhGiaCv.deleteMany({
          where: { id: { in: idsTrung } },
        });
      }
    } else {
      danhGiaMoi = await prisma.danhGiaCv.create({
        data: duLieuDG,
      });
    }

    // Tự động tính toán lại điểm trung bình và số lượt đánh giá
    const tatCaDanhGia = await prisma.danhGiaCv.findMany({
      where: { ma_cv: id },
      select: { diem_so: true },
    });

    const tongDiem = tatCaDanhGia.reduce((sum, item) => sum + item.diem_so, 0);
    const diemTrungBinh =
      tatCaDanhGia.length > 0
        ? parseFloat((tongDiem / tatCaDanhGia.length).toFixed(1))
        : 5;

    await prisma.danhSachCv.update({
      where: { id },
      data: {
        diem_trung_binh: diemTrungBinh,
        so_luot_danh_gia: tatCaDanhGia.length,
      },
    });

    return res.status(201).json({
      thanh_cong: true,
      thong_bao: 'Gửi đánh giá CV thành công! Cảm ơn bạn đã đóng góp.',
      danh_gia: danhGiaMoi,
      diem_trung_binh: diemTrungBinh,
      so_luot_danh_gia: tatCaDanhGia.length,
    });
  } catch (error) {
    console.error('Lỗi khi gửi đánh giá CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi gửi đánh giá!',
    });
  }
};

// 8. Lấy danh sách đánh giá của một bản CV (Khử trùng lặp theo từng người đánh giá)
export const layDanhSachDanhGia = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ thanh_cong: false, thong_bao: 'Mã CV không hợp lệ!' });
    }

    const danhSachRaw = await prisma.danhGiaCv.findMany({
      where: { ma_cv: id },
      orderBy: { ngay_tao: 'desc' },
      include: {
        nguoi_danh_gia: {
          select: { id: true, ho_ten: true, email: true },
        },
      },
    });

    const daGap = new Set();
    const danhSach = [];
    for (const item of danhSachRaw) {
      const key = item.ma_nguoi_danh_gia
        ? `uid-${item.ma_nguoi_danh_gia}`
        : `name-${(item.ten_nguoi_danh_gia || '').split('(')[0].trim().toLowerCase()}`;
      if (!daGap.has(key)) {
        daGap.add(key);
        danhSach.push(item);
      }
    }

    return res.json({
      thanh_cong: true,
      danh_sach: danhSach,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đánh giá:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tải đánh giá!',
    });
  }
};

// 9. Lấy Hồ Sơ Gốc (Master Profile) từ bảng ho_so_goc trong MySQL
export const layHoSoGoc = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const hoSo = await prisma.hoSoGoc.findUnique({
      where: { ma_nguoi_dung },
    });

    return res.json({
      thanh_cong: true,
      ho_so: hoSo || null,
    });
  } catch (error) {
    console.error('Lỗi khi tải hồ sơ gốc:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi tải hồ sơ cá nhân!',
    });
  }
};

// 10. Lưu / Cập nhật Hồ Sơ Gốc (Master Profile) vào bảng ho_so_goc trong MySQL
export const luuHoSoGoc = async (req, res) => {
  try {
    const ma_nguoi_dung = req.nguoiDung.id;
    const {
      anh_dai_dien,
      thong_tin_ca_nhan,
      kinh_nghiem,
      hoc_van,
      ky_nang,
      du_an,
      chung_chi,
    } = req.body;

    const hoSo = await prisma.hoSoGoc.upsert({
      where: { ma_nguoi_dung },
      update: {
        ...(anh_dai_dien !== undefined && { anh_dai_dien }),
        ...(thong_tin_ca_nhan !== undefined && { thong_tin_ca_nhan }),
        ...(kinh_nghiem !== undefined && { kinh_nghiem }),
        ...(hoc_van !== undefined && { hoc_van }),
        ...(ky_nang !== undefined && { ky_nang }),
        ...(du_an !== undefined && { du_an }),
        ...(chung_chi !== undefined && { chung_chi }),
      },
      create: {
        ma_nguoi_dung,
        anh_dai_dien: anh_dai_dien || null,
        thong_tin_ca_nhan: thong_tin_ca_nhan || {},
        kinh_nghiem: kinh_nghiem || [],
        hoc_van: hoc_van || [],
        ky_nang: ky_nang || [],
        du_an: du_an || [],
        chung_chi: chung_chi || [],
      },
    });

    return res.json({
      thanh_cong: true,
      thong_bao: 'Đã lưu Hồ Sơ Cá Nhân thành công!',
      ho_so: hoSo,
    });
  } catch (error) {
    console.error('Lỗi khi lưu hồ sơ gốc:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi lưu hồ sơ cá nhân!',
    });
  }
};

// 12. Phân tích nội dung CV tải từ bên ngoài (PDF, Word DOCX, TXT hoặc Raw Text)
export const phanTichCVNgoai = async (req, res) => {
  try {
    let rawText = req.body?.rawText || '';

    if (req.file) {
      const { originalname, buffer, mimetype } = req.file;
      const lowerName = (originalname || '').toLowerCase();

      if (lowerName.endsWith('.pdf') || mimetype === 'application/pdf') {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        rawText = result?.text || '';
      } else if (
        lowerName.endsWith('.docx') ||
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result?.value || '';
      } else if (lowerName.endsWith('.json') || mimetype === 'application/json') {
        const jsonStr = buffer.toString('utf-8');
        try {
          const parsedJson = JSON.parse(jsonStr);
          const noiDung = parsedJson.noi_dung_cv || parsedJson;
          return res.json({
            thanh_cong: true,
            du_lieu_cv: noiDung,
            loai: 'json',
          });
        } catch {
          rawText = jsonStr;
        }
      } else {
        rawText = buffer.toString('utf-8');
      }
    }

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Không tìm thấy nội dung văn bản trong file hoặc văn bản rỗng!',
      });
    }

    const duLieuCV = parseExternalCVText(rawText);
    return res.json({
      thanh_cong: true,
      thong_bao: 'Phân tích CV từ bên ngoài thành công!',
      rawText,
      du_lieu_cv: duLieuCV,
    });
  } catch (error) {
    console.error('Lỗi khi phân tích CV ngoài:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi khi đọc file CV ngoài: ' + error.message,
    });
  }
};

// 13. So khớp CV với Tin tuyển dụng (Job Description Matcher API)
export const soKhopCVVoiJD = async (req, res) => {
  try {
    const { cv, noi_dung_jd } = req.body;
    if (!noi_dung_jd || typeof noi_dung_jd !== 'string') {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Vui lòng cung cấp nội dung tin tuyển dụng (noi_dung_jd)!',
      });
    }

    const jdText = noi_dung_jd.toLowerCase();
    const thongTinCV = cv || {};
    const viTriCV = (thongTinCV.thongTinCaNhan?.viTriUngTuyen || '').toLowerCase();
    const dsKyNang = (thongTinCV.kyNang || []).map((k) => (k.ten || '').toLowerCase());

    return res.json({
      thanh_cong: true,
      thong_bao: 'Phân tích so khớp CV với JD thành công!',
      du_lieu: {
        vi_tri_cv: viTriCV,
        tong_so_ky_nang: dsKyNang.length,
      },
    });
  } catch (error) {
    console.error('Lỗi so khớp CV với JD:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Lỗi máy chủ khi so khớp CV: ' + error.message,
    });
  }
};

const MA_NGON_NGU_GOOGLE = {
  vi: 'vi',
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  ko: 'ko',
  fr: 'fr',
  de: 'de',
  es: 'es',
};

async function dichMotDoanGoogle(text, targetCode) {
  if (!text || !text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    targetCode
  )}&dt=t&q=${encodeURIComponent(text)}`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  const data = await resp.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) return text;
  return data[0].map((part) => (Array.isArray(part) ? part[0] : '')).join('');
}

// 14. Dịch toàn bộ nội dung CV sang ngôn ngữ đích (Việt / Anh / Nhật / Trung)
export const dichNoiDungCV = async (req, res) => {
  try {
    const { texts, targetLang } = req.body || {};
    if (!Array.isArray(texts) || !targetLang) {
      return res.status(400).json({
        thanh_cong: false,
        thong_bao: 'Thiếu danh sách văn bản (texts) hoặc ngôn ngữ đích (targetLang)!',
      });
    }

    const targetCode = MA_NGON_NGU_GOOGLE[targetLang] || 'en';
    const ketQua = new Array(texts.length);

    // Xử lý song song theo lô 6 đoạn để nhanh và ổn định
    const BATCH_SIZE = 6;
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const translatedBatch = await Promise.all(
        batch.map(async (item) => {
          if (typeof item !== 'string' || !item.trim()) return item || '';
          try {
            return await dichMotDoanGoogle(item, targetCode);
          } catch {
            return item;
          }
        })
      );
      for (let j = 0; j < translatedBatch.length; j++) {
        ketQua[i + j] = translatedBatch[j];
      }
    }

    return res.json({
      thanh_cong: true,
      targetLang,
      translations: ketQua,
    });
  } catch (error) {
    console.error('Lỗi dịch nội dung CV:', error);
    return res.status(500).json({
      thanh_cong: false,
      thong_bao: 'Không thể dịch nội dung CV lúc này: ' + error.message,
    });
  }
};


