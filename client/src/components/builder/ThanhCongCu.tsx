// client/src/components/builder/ThanhCongCu.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Palette,
  Printer,
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Pencil,
  FileUp,
  Award,
  Type,
  Target,
  Globe,
  Eye,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useKhoLuuTruCV, type ThongTinCV } from '../../store';
import { useKhoThongBao } from '../../store/khoThongBao';
import { ModalNhapDuLieuCV } from './ModalNhapDuLieuCV';
import { ModalDanhGiaCV } from './ModalDanhGiaCV';
import { ModalSoKhopJD } from './ModalSoKhopJD';
import { ModalXemTruocCV } from './ModalXemTruocCV';

// Danh sách các bảng màu CV chuyên nghiệp chuẩn ATS
const DANH_SACH_MAU = [
  { ten: 'Xanh Tín Hiệu (Resume.io)', maMau: '#1a91f0' },
  { ten: 'Xanh Đậm', maMau: '#1e40af' },
  { ten: 'Xanh Ngọc', maMau: '#0d9488' },
  { ten: 'Tím Iris', maMau: '#5660e8' },
  { ten: 'Đỏ Mận', maMau: '#e11d48' },
  { ten: 'Mực Đen', maMau: '#1e2532' },
];

const DANH_SACH_FONT = [
  { ten: 'Inter (Hiện đại)', value: 'Inter, sans-serif' },
  { ten: 'Roboto (Chuẩn ATS)', value: 'Roboto, sans-serif' },
  { ten: 'Montserrat (Sáng tạo)', value: 'Montserrat, sans-serif' },
  { ten: 'Plus Jakarta Sans (Thanh lịch)', value: "'Plus Jakarta Sans', sans-serif" },
  { ten: 'Manrope (Gọn gàng)', value: 'Manrope, sans-serif' },
  { ten: 'Open Sans (Thân thiện)', value: "'Open Sans', sans-serif" },
  { ten: 'Nunito (Mềm mại)', value: 'Nunito, sans-serif' },
  { ten: 'Merriweather (Cổ điển)', value: 'Merriweather, serif' },
  { ten: 'Lora (Biên tập)', value: 'Lora, serif' },
  { ten: 'Georgia (Trang trọng)', value: 'Georgia, serif' },
  { ten: 'Times New Roman (Truyền thống)', value: "'Times New Roman', Times, serif" },
  { ten: 'Arial (Phổ biến)', value: 'Arial, Helvetica, sans-serif' },
];

export const LOCAL_SAVED_CVS_KEY = 'cvify_saved_cvs_local';

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
    dangDichCV,
    doiMauChuDao,
    doiFontChu,
    doiCoChu,
    doiNgonNguCV,
    idCVHienTai,
    maNguoiSoHuuCV,
    tieuDeCVHienTai,
    datTieuDeCV,
  } = useKhoLuuTruCV();

  const { dinhDang } = cv;

  // Kiểm tra xem người dùng hiện tại có phải là Người Đánh Giá (xem CV người khác / mở link shareId) không
  const idUserDangNhap = (() => {
    try {
      const raw = sessionStorage.getItem('nguoiDung');
      return raw ? Number(JSON.parse(raw)?.id) || null : null;
    } catch {
      return null;
    }
  })();
  const dangMoQuaShareLink = Boolean(
    new URLSearchParams(window.location.search).get('shareId')
  );
  const laNguoiDanhGiaNgoai =
    dangMoQuaShareLink ||
    (maNguoiSoHuuCV !== null &&
      (idUserDangNhap === null || Number(idUserDangNhap) !== Number(maNguoiSoHuuCV)));

  const [dangLuu, setDangLuu] = useState(false);
  const [thongBaoLuu, setThongBaoLuu] = useState<string | null>(null);
  const [moModalNhapCV, setMoModalNhapCV] = useState(false);
  const [moModalDanhGia, setMoModalDanhGia] = useState(false);
  const [moModalSoKhopJD, setMoModalSoKhopJD] = useState(false);
  const [moModalXemTruoc, setMoModalXemTruoc] = useState(false);

  // Hệ thống Hoàn tác / Làm lại (Ctrl + Z / Ctrl + Y giống Word)
  const pastStackRef = useRef<ThongTinCV[]>([]);
  const futureStackRef = useRef<ThongTinCV[]>([]);
  const lastSnapshotRef = useRef<ThongTinCV>(useKhoLuuTruCV.getState().cv);
  const dangApDungLichSuRef = useRef(false);
  const [coTheHoanTac, setCoTheHoanTac] = useState(false);
  const [coTheLamLai, setCoTheLamLai] = useState(false);

  const dongBoTrangThaiNutLichSu = useCallback(() => {
    setCoTheHoanTac(pastStackRef.current.length > 0);
    setCoTheLamLai(futureStackRef.current.length > 0);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsub = useKhoLuuTruCV.subscribe((state, prevState) => {
      if (dangApDungLichSuRef.current) return;
      if (state.cv === prevState.cv) return;

      if (timer) clearTimeout(timer);
      const snapshotTruocDo = lastSnapshotRef.current;
      timer = setTimeout(() => {
        pastStackRef.current = [...pastStackRef.current.slice(-39), snapshotTruocDo];
        futureStackRef.current = [];
        lastSnapshotRef.current = useKhoLuuTruCV.getState().cv;
        dongBoTrangThaiNutLichSu();
      }, 280);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, [dongBoTrangThaiNutLichSu]);

  const handleHoanTac = useCallback(() => {
    if (pastStackRef.current.length === 0) return;
    const prevCV = pastStackRef.current[pastStackRef.current.length - 1];
    pastStackRef.current = pastStackRef.current.slice(0, -1);
    const currentCV = useKhoLuuTruCV.getState().cv;
    futureStackRef.current = [currentCV, ...futureStackRef.current.slice(0, 39)];

    dangApDungLichSuRef.current = true;
    useKhoLuuTruCV.setState({ cv: prevCV });
    lastSnapshotRef.current = prevCV;
    dangApDungLichSuRef.current = false;
    dongBoTrangThaiNutLichSu();
  }, [dongBoTrangThaiNutLichSu]);

  const handleLamLai = useCallback(() => {
    if (futureStackRef.current.length === 0) return;
    const nextCV = futureStackRef.current[0];
    futureStackRef.current = futureStackRef.current.slice(1);
    const currentCV = useKhoLuuTruCV.getState().cv;
    pastStackRef.current = [...pastStackRef.current.slice(-39), currentCV];

    dangApDungLichSuRef.current = true;
    useKhoLuuTruCV.setState({ cv: nextCV });
    lastSnapshotRef.current = nextCV;
    dangApDungLichSuRef.current = false;
    dongBoTrangThaiNutLichSu();
  }, [dongBoTrangThaiNutLichSu]);

  // Hỗ trợ phím tắt Ctrl+Z và Ctrl+Y (hoặc Ctrl+Shift+Z) giống Word
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        if (pastStackRef.current.length > 0) {
          e.preventDefault();
          handleHoanTac();
        }
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        if (futureStackRef.current.length > 0) {
          e.preventDefault();
          handleLamLai();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleHoanTac, handleLamLai]);

  useEffect(() => {
    const handleOpenJD = () => setMoModalSoKhopJD(true);
    window.addEventListener('cvify_open_so_khop_jd', handleOpenJD);
    return () => window.removeEventListener('cvify_open_so_khop_jd', handleOpenJD);
  }, []);

  const handleInPDF = () => {
    window.print();
  };

  const handleQuayLai = onQuayLai || onVeTrangChu;

  // Lưu bản sao vào LocalStorage để người dùng luôn có thể lấy lại hoặc nhập từ CV cũ
  const luuBanSaoLocal = (id: number | string, tieuDe: string) => {
    try {
      const raw = localStorage.getItem(LOCAL_SAVED_CVS_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const banGhi = {
        id,
        tieu_de_cv: tieuDe || 'CV Chưa Đặt Tên',
        ngay_sua: new Date().toISOString(),
        noi_dung_cv: {
          thongTinCaNhan: cv.thongTinCaNhan,
          gioiThieu: cv.gioiThieu,
          kinhNghiem: cv.kinhNghiem,
          hocVan: cv.hocVan,
          kyNang: cv.kyNang,
          duAn: cv.duAn,
          chungChi: cv.chungChi,
          khoiTuyChinh: cv.khoiTuyChinh || [],
          anHienKhoi: cv.anHienKhoi,
          boCuc: cv.boCuc,
        },
        thu_tu_khoi: cv.thuTuKhoi,
        dinh_dang_cv: cv.dinhDang,
      };
      const idx = list.findIndex((item) => String(item.id) === String(id));
      if (idx >= 0) {
        list[idx] = banGhi;
      } else {
        list.unshift(banGhi);
      }
      localStorage.setItem(LOCAL_SAVED_CVS_KEY, JSON.stringify(list.slice(0, 20)));
    } catch (e) {
      console.error('Lỗi lưu local CV:', e);
    }
  };

  // Xử lý gọi API Lưu CV vào MySQL (kèm dự phòng LocalStorage)
  const handleLuuCV = async () => {
    const token = sessionStorage.getItem('token');
    setDangLuu(true);
    setThongBaoLuu(null);

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
        khoiTuyChinh: cv.khoiTuyChinh || [],
        anHienKhoi: cv.anHienKhoi,
        boCuc: cv.boCuc,
      },
      thu_tu_khoi: cv.thuTuKhoi,
      dinh_dang_cv: cv.dinhDang,
    };

    if (!token) {
      const localId = idCVHienTai || Date.now();
      luuBanSaoLocal(localId, duLieuGui.tieu_de_cv);
      useKhoThongBao.getState().xoaCVChuaLuu();
      setDangLuu(false);
      setThongBaoLuu('Đã lưu trên máy!');
      setTimeout(() => setThongBaoLuu(null), 2500);
      return;
    }

    try {
      if (idCVHienTai) {
        await axios.put(`http://localhost:5000/api/cv/${idCVHienTai}`, duLieuGui, {
          headers: { Authorization: `Bearer ${token}` },
        });
        luuBanSaoLocal(idCVHienTai, duLieuGui.tieu_de_cv);
      } else {
        const res = await axios.post('http://localhost:5000/api/cv', duLieuGui, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newId = res.data.cv?.id || Date.now();
        if (res.data.cv?.id) {
          useKhoLuuTruCV.setState({
            idCVHienTai: res.data.cv.id,
            tieuDeCVHienTai: res.data.cv.tieu_de_cv,
          });
        }
        luuBanSaoLocal(newId, duLieuGui.tieu_de_cv);
      }

      useKhoThongBao.getState().xoaCVChuaLuu();
      setThongBaoLuu('Đã lưu thành công!');
      setTimeout(() => setThongBaoLuu(null), 2500);
    } catch (err) {
      console.error('Lỗi khi lưu CV:', err);
      const localId = idCVHienTai || Date.now();
      luuBanSaoLocal(localId, duLieuGui.tieu_de_cv);
      useKhoThongBao.getState().xoaCVChuaLuu();
      setThongBaoLuu('Đã lưu bản cục bộ!');
      setTimeout(() => setThongBaoLuu(null), 2500);
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <header className="sticky top-[53px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2 print:hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-2">
        {/* HÀNG 1: ĐIỀU HƯỚNG TÊN FILE & CÁC CÔNG CỤ CHÍNH */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Trái: Nút quay lại kiểu trình duyệt Chrome + Undo/Redo (Ctrl+Z) + Tên CV */}
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={handleQuayLai}
              className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
              title={tieuDeQuayLai.replace(/^←\s*/, '') || 'Quay lại trang trước'}
              aria-label="Quay lại trang trước"
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>

            <span className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />

            {/* Bộ nút Hoàn tác (Ctrl+Z) & Làm lại (Ctrl+Y) giống Word */}
            {!laNguoiDanhGiaNgoai && (
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={handleHoanTac}
                  disabled={!coTheHoanTac}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                  title="Hoàn tác (Ctrl + Z)"
                >
                  <Undo2 size={15} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={handleLamLai}
                  disabled={!coTheLamLai}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                  title="Làm lại (Ctrl + Y)"
                >
                  <Redo2 size={15} strokeWidth={2} />
                </button>
              </div>
            )}

            <span className="hidden sm:block h-4 w-px bg-slate-200 mx-0.5 shrink-0" />

            {/* Ô sửa tên bản CV trực tiếp */}
            <div className="hidden sm:flex items-center group relative">
              <input
                type="text"
                value={tieuDeCVHienTai}
                onChange={(e) => datTieuDeCV(e.target.value)}
                placeholder="Nhập tên bản CV..."
                className="text-xs font-semibold text-slate-900 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-[#1a91f0] rounded-lg pl-2 pr-6 py-1 focus:outline-none transition max-w-[200px] truncate"
                title="Nhấn để đổi tên CV"
              />
              <Pencil
                size={11}
                strokeWidth={1.75}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition -ml-4 pointer-events-none"
              />
            </div>
          </div>

          {/* Phải: Nhóm thao tác chuyên môn (icon duotone sắc nét) + Xem trước, Lưu & Tải PDF */}
          <div className="flex flex-wrap items-center gap-1.5">
            {!laNguoiDanhGiaNgoai && (
              <button
                type="button"
                onClick={() => setMoModalNhapCV(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200/90 text-slate-700 bg-white hover:bg-sky-50/60 hover:border-sky-200 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer shadow-2xs"
                title="Lấy nội dung từ CV cũ đưa vào layout mới"
              >
                <span className="w-5 h-5 rounded-md bg-sky-100/90 text-[#1a91f0] flex items-center justify-center shrink-0">
                  <FileUp size={12} strokeWidth={2.2} />
                </span>
                <span>Nhập CV cũ</span>
              </button>
            )}

            {!laNguoiDanhGiaNgoai && (
              <button
                type="button"
                onClick={() => setMoModalSoKhopJD(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200/90 text-slate-700 bg-white hover:bg-indigo-50/60 hover:border-indigo-200 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer shadow-2xs"
                title="So khớp CV với Tin tuyển dụng thực tế & dự đoán câu hỏi phỏng vấn"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-100/90 text-indigo-600 flex items-center justify-center shrink-0">
                  <Target size={12} strokeWidth={2.2} />
                </span>
                <span>So khớp JD</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMoModalDanhGia(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200/90 text-slate-700 bg-white hover:bg-amber-50/70 hover:border-amber-200 hover:text-slate-900 transition active:scale-[0.98] cursor-pointer shadow-2xs"
              title={
                laNguoiDanhGiaNgoai
                  ? 'Chấm điểm và gửi nhận xét cho bản CV này'
                  : 'Chia sẻ liên kết & Xem đánh giá CV'
              }
            >
              <span className="w-5 h-5 rounded-md bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0">
                <Award size={12} strokeWidth={2.2} />
              </span>
              <span>{laNguoiDanhGiaNgoai ? 'Chấm điểm CV này' : 'Đánh giá CV'}</span>
            </button>

            <span className="hidden sm:block h-4 w-px bg-slate-200 mx-0.5" />

            {/* Nút Xem Trước CV (chuẩn bản in không viền sửa) */}
            <button
              type="button"
              onClick={() => setMoModalXemTruoc(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 transition active:scale-[0.98] cursor-pointer"
              title="Xem trước CV ở chế độ bản in thực tế"
            >
              <Eye size={14} strokeWidth={2} className="text-slate-600" />
              <span>Xem trước</span>
            </button>

            {!laNguoiDanhGiaNgoai && (
              <button
                type="button"
                onClick={handleLuuCV}
                disabled={dangLuu}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold pl-2 pr-3 py-1 rounded-lg border transition active:scale-[0.98] cursor-pointer shadow-2xs ${
                  thongBaoLuu
                    ? 'bg-emerald-600 border-emerald-600 text-white py-1.5 px-3'
                    : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                {dangLuu ? (
                  <>
                    <Loader2 size={13} strokeWidth={2} className="animate-spin text-emerald-600" />
                    <span>Đang lưu...</span>
                  </>
                ) : thongBaoLuu ? (
                  <>
                    <Check size={13} strokeWidth={2.2} />
                    <span>{thongBaoLuu}</span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Save size={12} strokeWidth={2.2} />
                    </span>
                    <span>Lưu CV</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleInPDF}
              className="inline-flex items-center gap-1.5 bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition active:scale-[0.98] cursor-pointer"
            >
              <Printer size={14} strokeWidth={2} />
              <span className="hidden sm:inline">Tải PDF</span>
            </button>
          </div>
        </div>

        {/* HÀNG 2: THANH ĐỊNH DẠNG NHANH (NGÔN NGỮ, FONT, CỠ CHỮ & MÀU SẮC) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
          <div className="inline-flex flex-wrap items-center bg-slate-50/90 border border-slate-200/90 rounded-lg divide-x divide-slate-200">
            {/* Ngôn ngữ CV */}
            <div className="flex items-center gap-1.5 px-2.5 py-1">
              {dangDichCV ? (
                <Loader2 size={13} className="animate-spin text-[#1a91f0]" />
              ) : (
                <Globe size={13} strokeWidth={1.75} className="text-[#1a91f0]" />
              )}
              <select
                value={dinhDang.ngonNgu || 'vi'}
                disabled={dangDichCV}
                onChange={(e) => doiNgonNguCV(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer disabled:opacity-60"
                title="Đổi ngôn ngữ CV (Tự động dịch toàn bộ tiêu đề và nội dung)"
              >
                <option value="vi">VI · Tiếng Việt</option>
                <option value="en">EN · English</option>
                <option value="ja">JA · 日本語</option>
                <option value="zh">ZH · 中文</option>
                <option value="ko">KO · 한국어</option>
                <option value="fr">FR · Français</option>
                <option value="de">DE · Deutsch</option>
                <option value="es">ES · Español</option>
              </select>
              {dangDichCV && (
                <span className="text-[10px] font-semibold text-[#1a91f0] ml-1 whitespace-nowrap">
                  Đang dịch toàn bộ CV...
                </span>
              )}
            </div>

            {/* Font chữ & Cỡ chữ */}
            <div className="flex items-center gap-1.5 px-2.5 py-1">
              <Type size={13} strokeWidth={1.75} className="text-slate-500" />
              <select
                value={dinhDang.fontChu || 'Inter, sans-serif'}
                onChange={(e) => doiFontChu(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                title="Chọn phông chữ toàn CV"
              >
                {DANH_SACH_FONT.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.ten}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center px-2 py-1">
              <select
                value={String(dinhDang.coChu || '14px').replace('px', '')}
                onChange={(e) => doiCoChu(`${e.target.value}px`)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                title="Cỡ chữ chuẩn của CV"
              >
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}px
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bảng màu chủ đạo */}
          <div className="inline-flex items-center gap-2 bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-200/90">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Palette size={13} strokeWidth={1.75} />
              <span className="hidden md:inline">Màu nhấn:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {DANH_SACH_MAU.map((m) => (
                <button
                  key={m.maMau}
                  type="button"
                  onClick={() => doiMauChuDao(m.maMau)}
                  title={m.ten}
                  className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                    dinhDang.mauChuDao === m.maMau
                      ? 'scale-120 ring-2 ring-offset-1 ring-slate-700'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: m.maMau }}
                />
              ))}
              <label
                className="relative w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden hover:scale-110 transition"
                style={{
                  background:
                    'conic-gradient(from 90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
                }}
                title="Tự chọn màu sắc bất kỳ"
              >
                <input
                  type="color"
                  value={dinhDang.mauChuDao}
                  onChange={(e) => doiMauChuDao(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nhập Nội Dung từ CV Cũ */}
      <ModalNhapDuLieuCV
        isOpen={moModalNhapCV}
        onClose={() => setMoModalNhapCV(false)}
      />

      {/* Modal Đánh Giá Góp Ý CV Từ Cộng Đồng */}
      <ModalDanhGiaCV
        isOpen={moModalDanhGia}
        onClose={() => setMoModalDanhGia(false)}
      />

      {/* Modal So Khớp CV với Tin Tuyển Dụng */}
      <ModalSoKhopJD
        isOpen={moModalSoKhopJD}
        onClose={() => setMoModalSoKhopJD(false)}
      />

      {/* Modal Xem Trước CV Chuẩn Bản In */}
      <ModalXemTruocCV
        isOpen={moModalXemTruoc}
        onClose={() => setMoModalXemTruoc(false)}
      />
    </header>
  );
};

export default ThanhCongCu;
