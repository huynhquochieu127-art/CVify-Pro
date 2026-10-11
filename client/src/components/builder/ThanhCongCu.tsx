// client/src/components/builder/ThanhCongCu.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Palette,
  Printer,
  Sparkles,
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Edit2,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';

// Danh sách các bảng màu CV chuyên nghiệp chuẩn ATS
const DANH_SACH_MAU = [
  { ten: 'Xanh LinkedIn', maMau: '#0a66c2' },
  { ten: 'Xanh Đậm', maMau: '#1e40af' },
  { ten: 'Xanh Ngọc', maMau: '#0d9488' },
  { ten: 'Tím Hiện Đại', maMau: '#7c3aed' },
  { ten: 'Đỏ Mận', maMau: '#e11d48' },
  { ten: 'Xám Tối Giản', maMau: '#334155' },
];

export interface ThanhCongCuProps {
  onVeTrangChu: () => void;
  onQuayLai?: () => void;
  tieuDeQuayLai?: string;
  onMoDangNhap?: () => void;
  onMoDangKy?: () => void;
}

export const ThanhCongCu: React.FC<ThanhCongCuProps> = ({
  onVeTrangChu,
  onQuayLai,
  tieuDeQuayLai = 'Về Quản Lý CV',
}) => {
  const {
    cv,
    doiMauChuDao,
    idCVHienTai,
    tieuDeCVHienTai,
    datTieuDeCV,
  } = useKhoLuuTruCV();

  const { dinhDang } = cv;

  const [dangLuu, setDangLuu] = useState(false);
  const [thongBaoLuu, setThongBaoLuu] = useState<string | null>(null);

  const handleInPDF = () => {
    window.print();
  };

  const handleQuayLai = onQuayLai || onVeTrangChu;

  // Xử lý gọi API Lưu CV vào MySQL
  const handleLuuCV = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để lưu CV vào cơ sở dữ liệu!');
      return;
    }

    setDangLuu(true);
    setThongBaoLuu(null);

    try {
      const duLieuGui = {
        tieu_de_cv: tieuDeCVHienTai || 'CV Chưa Đặt Tên',
        noi_dung_cv: {
          thongTinCaNhan: cv.thongTinCaNhan,
          gioiThieu: cv.gioiThieu,
          kinhNghiem: cv.kinhNghiem,
          hocVan: cv.hocVan,
          kyNang: cv.kyNang,
          duAn: cv.duAn,
          chungChi: cv.chungChi,
          anHienKhoi: cv.anHienKhoi,
        },
        thu_tu_khoi: cv.thuTuKhoi,
        dinh_dang_cv: cv.dinhDang,
      };

      if (idCVHienTai) {
        // Cập nhật bản CV hiện có (PUT /api/cv/:id)
        await axios.put(`http://localhost:5000/api/cv/${idCVHienTai}`, duLieuGui, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Nếu chưa có ID (tạo mới từ nút bên ngoài), gọi POST /api/cv
        const res = await axios.post('http://localhost:5000/api/cv', duLieuGui, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.cv?.id) {
          useKhoLuuTruCV.setState({
            idCVHienTai: res.data.cv.id,
            tieuDeCVHienTai: res.data.cv.tieu_de_cv,
          });
        }
      }

      setThongBaoLuu('Đã lưu thành công!');
      setTimeout(() => setThongBaoLuu(null), 2500);
    } catch (err) {
      console.error('Lỗi khi lưu CV:', err);
      alert('Không thể lưu CV. Vui lòng kiểm tra kết nối máy chủ!');
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Nút quay về Quản lý CV / Trang chủ & Tiêu đề CV */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleQuayLai}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#0a66c2] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl border border-slate-200 transition active:scale-95 cursor-pointer shrink-0"
            title={tieuDeQuayLai}
          >
            <ArrowLeft size={15} />
            <span>{tieuDeQuayLai}</span>
          </button>

          {/* Ô sửa tên bản CV trực tiếp */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={tieuDeCVHienTai}
                onChange={(e) => datTieuDeCV(e.target.value)}
                placeholder="Nhập tên bản CV..."
                className="text-xs font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-300 focus:border-[#0a66c2] rounded-lg px-2 py-1 focus:outline-none transition max-w-[200px] truncate"
                title="Nhấn để đổi tên CV"
              />
              <Edit2 size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition -ml-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Thanh chọn màu chủ đạo */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Palette size={14} className="text-slate-500" />
          <span className="text-xs font-medium text-slate-600 hidden md:inline">
            Màu chủ đạo:
          </span>
          <div className="flex items-center gap-1.5">
            {DANH_SACH_MAU.map((m) => (
              <button
                key={m.maMau}
                onClick={() => doiMauChuDao(m.maMau)}
                title={m.ten}
                className={`w-4.5 h-4.5 rounded-full transition-transform cursor-pointer ${
                  dinhDang.mauChuDao === m.maMau
                    ? 'scale-125 ring-2 ring-offset-2 ring-slate-400'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: m.maMau }}
              />
            ))}
          </div>
        </div>

        {/* Nhóm nút thao tác bên phải: Lưu CV & In PDF */}
        <div className="flex items-center gap-2">
          {/* Nút 💾 LƯU CV KẾT NỐI MYSQL */}
          <button
            type="button"
            onClick={handleLuuCV}
            disabled={dangLuu}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer ${
              thongBaoLuu
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            {dangLuu ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : thongBaoLuu ? (
              <>
                <Check size={14} />
                <span>{thongBaoLuu}</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>💾 Lưu CV</span>
              </>
            )}
          </button>

          {/* Nút In ấn / Xuất PDF */}
          <button
            type="button"
            onClick={handleInPDF}
            className="flex items-center gap-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer size={14} />
            <span>Tải / In PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ThanhCongCu;
