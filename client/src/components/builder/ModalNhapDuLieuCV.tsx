import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  X,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Columns2,
  Columns3,
  LayoutGrid,
  Square,
  Upload,
  Database,
  AlertCircle,
  FileUp,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  ShieldCheck,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';
import type { CheDoBoCuc } from '../../types/cv';
import { LOCAL_SAVED_CVS_KEY } from './ThanhCongCu';
import {
  parseExternalCVText,
  type DuLieuCVTrinhXuat,
} from '../../utils/boPhanTichCVTho';

interface ModalNhapDuLieuCVProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabNguon = 'file' | 'cv-noi-bo';

export const ModalNhapDuLieuCV: React.FC<ModalNhapDuLieuCVProps> = ({
  isOpen,
  onClose,
}) => {
  const { cv, nhapNoiDungTuCVCụ } = useKhoLuuTruCV();

  const [tabHienTai, setTabHienTai] = useState<TabNguon>('file');
  const [fileDaChon, setFileDaChon] = useState<File | null>(null);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [tienTrinhPhanTich, setTienTrinhPhanTich] = useState(0);
  const [buocPhanTich, setBuocPhanTich] = useState('');
  const [loiThongBao, setLoiThongBao] = useState<string | null>(null);

  // Dữ liệu CV bóc tách được từ văn bản/file bên ngoài
  const [duLieuBocTach, setDuLieuBocTach] = useState<DuLieuCVTrinhXuat | any | null>(null);

  // Danh sách CV nội bộ đã lưu
  const [danhSachCVNoiBo, setDanhSachCVNoiBo] = useState<any[]>([]);
  const [dangTaiCVNoiBo, setDangTaiCVNoiBo] = useState(false);
  const [cvNoiBoDuocChon, setCvNoiBoDuocChon] = useState<string | number | null>(null);

  // Lựa chọn Layout đích (mặc định là giữ nguyên layout vừa thiết kế)
  const [layoutMoiChon, setLayoutMoiChon] = useState<CheDoBoCuc | 'giu-nguyen'>('giu-nguyen');
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState(false);

  // Mở modal: Mặc định mở ngay tab Tải File CV
  useEffect(() => {
    if (isOpen) {
      setTabHienTai('file');
      setFileDaChon(null);
      setDuLieuBocTach(null);
      setLoiThongBao(null);
      setTienTrinhPhanTich(0);
      setBuocPhanTich('');
      setThongBaoThanhCong(false);
      setLayoutMoiChon('giu-nguyen');
      taiDanhSachCVNoiBo();
    }
  }, [isOpen]);

  const taiDanhSachCVNoiBo = async () => {
    setDangTaiCVNoiBo(true);
    let serverList: any[] = [];
    let localList: any[] = [];

    try {
      const rawLocal = localStorage.getItem(LOCAL_SAVED_CVS_KEY);
      if (rawLocal) {
        localList = JSON.parse(rawLocal).map((item: any) => ({
          ...item,
          loai: 'Đã lưu trên máy',
        }));
      }
    } catch (e) {
      console.error('Lỗi đọc local CV:', e);
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/api/cv', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.thanh_cong) {
          serverList = (res.data.danh_sach || []).map((item: any) => ({
            ...item,
            loai: 'Đã lưu Cloud',
          }));
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách CV từ server:', err);
      }
    }

    const merged = [...serverList, ...localList];
    setDanhSachCVNoiBo(merged);
    setDangTaiCVNoiBo(false);
  };

  // Chạy hiệu ứng thanh tiến trình ngang 0% -> 100% khi bóc tách file CV
  const chayTienTrinhBocTach = async (tacVuDocFile: () => Promise<any>) => {
    setDangXuLy(true);
    setDuLieuBocTach(null);
    setLoiThongBao(null);
    setTienTrinhPhanTich(10);
    setBuocPhanTich('Đang tải tệp CV lên bộ xử lý...');

    let current = 10;
    const interval = setInterval(() => {
      current = Math.min(88, current + Math.floor(Math.random() * 14) + 8);
      setTienTrinhPhanTich(current);
      if (current < 35) {
        setBuocPhanTich('Đang đọc cấu trúc tài liệu CV...');
      } else if (current < 65) {
        setBuocPhanTich('Đang nhận diện thông tin cá nhân & học vấn...');
      } else {
        setBuocPhanTich('Đang bóc tách kinh nghiệm, kỹ năng & dự án...');
      }
    }, 220);

    try {
      const [ketQua] = await Promise.all([
        tacVuDocFile(),
        new Promise((r) => setTimeout(r, 1100)),
      ]);
      clearInterval(interval);
      setTienTrinhPhanTich(100);
      setBuocPhanTich('Hoàn tất bóc tách dữ liệu CV!');
      await new Promise((r) => setTimeout(r, 280));
      if (ketQua) {
        setDuLieuBocTach(ketQua);
      }
    } catch (err: any) {
      clearInterval(interval);
      setLoiThongBao(err?.message || 'Không thể trích xuất nội dung từ file này!');
    } finally {
      setDangXuLy(false);
    }
  };

  // 1. Tải File CV từ máy tính
  const handleChonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileDaChon(file);
    const fileName = file.name.toLowerCase();

    await chayTienTrinhBocTach(async () => {
      // File JSON
      if (fileName.endsWith('.json')) {
        const text = await file.text();
        try {
          const parsed = JSON.parse(text || '{}');
          return parsed.noi_dung_cv || parsed;
        } catch {
          throw new Error('File JSON không hợp lệ!');
        }
      }

      // File TXT / MD
      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        const raw = await file.text();
        const parsed = parseExternalCVText(raw);
        if (!parsed) {
          throw new Error('Không trích xuất được thông tin từ file văn bản này.');
        }
        return parsed;
      }

      // File PDF hoặc Word (.docx)
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await axios.post('http://localhost:5000/api/cv/parse-external-cv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.thanh_cong && res.data?.du_lieu_cv) {
          return res.data.du_lieu_cv;
        }
        throw new Error(res.data?.thong_bao || 'Không thể trích xuất nội dung từ file này!');
      } catch (err: any) {
        throw new Error(
          err.response?.data?.thong_bao ||
            err.message ||
            'Không thể đọc trực tiếp file này. Vui lòng thử lại với file PDF hoặc DOCX chuẩn.'
        );
      }
    });
  };

  // 3. Chọn CV nội bộ
  const handleChonCVNoiBo = (item: any) => {
    setCvNoiBoDuocChon(item.id);
    if (item.noi_dung_cv) {
      setDuLieuBocTach(item.noi_dung_cv);
    }
  };

  // 4. Xác nhận đổ dữ liệu vào Layout vừa thiết kế
  const handleXacNhanDoDuLieu = () => {
    if (!duLieuBocTach) return;

    const cheDoDich = layoutMoiChon !== 'giu-nguyen' ? layoutMoiChon : undefined;
    nhapNoiDungTuCVCụ(duLieuBocTach, cheDoDich);

    setThongBaoThanhCong(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  const soCotHienTai = cv.boCuc?.danhSachCot?.length || (cv.boCuc?.cheDo === '1-cot' ? 1 : 2);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] my-auto overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* TIÊU ĐỀ MODAL */}
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 bg-blue-50 text-[#1a91f0] rounded-xl shrink-0">
            <Sparkles size={20} />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Lấy Nội Dung CV Đưa Vào Layout
          </h2>
        </div>

        {thongBaoThanhCong ? (
          <div className="py-12 text-center space-y-2">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-800">
              Đã Chuyển Đổi Thành Công Vào Layout!
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {/* TABS (Chỉ giữ lại Tải File CV & CV Đã Lưu) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setTabHienTai('file')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition cursor-pointer ${
                  tabHienTai === 'file'
                    ? 'bg-white text-[#1a91f0] shadow-xs font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <FileUp size={14} />
                <span>Tải File CV</span>
              </button>

              <button
                type="button"
                onClick={() => setTabHienTai('cv-noi-bo')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition cursor-pointer ${
                  tabHienTai === 'cv-noi-bo'
                    ? 'bg-white text-[#1a91f0] shadow-xs font-bold'
                    : 'hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Database size={14} />
                <span>CV Đã Lưu</span>
              </button>
            </div>

            {loiThongBao && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1">{loiThongBao}</div>
              </div>
            )}

            {/* TAB 1: TẢI FILE CV VỚI THANH TIẾN TRÌNH LOAD NGANG % */}
            {tabHienTai === 'file' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-[#1a91f0] rounded-2xl bg-slate-50/60 hover:bg-blue-50/30 transition cursor-pointer text-center group">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.json,.md"
                    onChange={handleChonFile}
                    disabled={dangXuLy}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1a91f0] flex items-center justify-center mb-2.5 group-hover:scale-105 transition border border-blue-100">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {fileDaChon ? fileDaChon.name : 'Nhấn để chọn file CV (PDF, Word, TXT, JSON)'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hệ thống sẽ tự động đọc và bóc tách nội dung CV vào bố cục của bạn
                  </p>
                </label>

                {/* Thanh tiến trình bóc tách ngang 0% -> 100% giống So Khớp JD */}
                {dangXuLy && (
                  <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-[#1a91f0]" />
                        <span>{buocPhanTich || 'Đang bóc tách nội dung CV...'}</span>
                      </span>
                      <span className="font-extrabold text-[#1a91f0] tabular-nums">
                        {tienTrinhPhanTich}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200/90 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1a91f0] via-sky-400 to-indigo-500 transition-all duration-300 relative overflow-hidden"
                        style={{ width: `${tienTrinhPhanTich}%` }}
                      >
                        <div className="absolute inset-0 bg-white/25 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CV NỘI BỘ */}
            {tabHienTai === 'cv-noi-bo' && (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 animate-in fade-in duration-150">
                {dangTaiCVNoiBo ? (
                  <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#1a91f0]" />
                    <span>Đang tải danh sách...</span>
                  </div>
                ) : danhSachCVNoiBo.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Chưa có bản CV nào được lưu trong tài khoản.
                  </div>
                ) : (
                  danhSachCVNoiBo.map((item) => {
                    const dangChon = String(cvNoiBoDuocChon) === String(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleChonCVNoiBo(item)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          dangChon
                            ? 'border-[#1a91f0] bg-blue-50/50 ring-2 ring-[#1a91f0]/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`p-2 rounded-xl shrink-0 ${
                              dangChon ? 'bg-[#1a91f0] text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <FileText size={16} />
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {item.tieu_de_cv || 'CV Chưa Đặt Tên'}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {item.loai} • Cập nhật:{' '}
                              {item.ngay_sua ? new Date(item.ngay_sua).toLocaleDateString('vi-VN') : 'Gần đây'}
                            </p>
                          </div>
                        </div>
                        {dangChon && <CheckCircle2 size={18} className="text-[#1a91f0] shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* KẾT QUẢ BÓC TÁCH (CHỈ HIỂN THỊ KHI ĐÃ NHẬN DIỆN ĐƯỢC DỮ LIỆU) */}
            {duLieuBocTach && (
              <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Nội dung đã nhận diện:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <User size={13} className="text-[#1a91f0] shrink-0" />
                    <div className="min-w-0 truncate">
                      <p className="font-bold text-slate-800 truncate">
                        {duLieuBocTach.thongTinCaNhan?.hoTen || 'Ứng viên'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {duLieuBocTach.thongTinCaNhan?.viTriUngTuyen || 'Chức danh'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <Briefcase size={13} className="text-amber-600 shrink-0" />
                    <span className="font-bold text-slate-700">
                      {duLieuBocTach.kinhNghiem?.length || 0} Kinh nghiệm
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <GraduationCap size={13} className="text-indigo-600 shrink-0" />
                    <span className="font-bold text-slate-700">
                      {duLieuBocTach.hocVan?.length || 0} Học vấn
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <Award size={13} className="text-rose-600 shrink-0" />
                    <span className="font-bold text-slate-700">
                      {duLieuBocTach.kyNang?.length || 0} Kỹ năng
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <FolderGit2 size={13} className="text-purple-600 shrink-0" />
                    <span className="font-bold text-slate-700">
                      {duLieuBocTach.duAn?.length || 0} Dự án
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center gap-2">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-700">
                      {duLieuBocTach.chungChi?.length || 0} Chứng chỉ
                    </span>
                  </div>
                </div>

                {/* CHỌN LAYOUT ĐÍCH */}
                <div className="pt-2 border-t border-blue-200/60">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Đổ dữ liệu vào Layout:
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: 'giu-nguyen' as const,
                        ten: `Giữ Layout hiện tại (${soCotHienTai} cột)`,
                        icon: Sparkles,
                      },
                      { id: '1-cot' as const, ten: 'Layout 1 Cột ATS', icon: Square },
                      { id: '2-cot' as const, ten: 'Layout 2 Cột (35-65)', icon: Columns2 },
                      { id: '2-cot-deu' as const, ten: 'Layout 2 Cột (50-50)', icon: LayoutGrid },
                      { id: '3-cot' as const, ten: 'Layout 3 Cột Hiện Đại', icon: Columns3 },
                      { id: '4-cot' as const, ten: 'Layout 4 Cột Đa Năng', icon: LayoutGrid },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const active = layoutMoiChon === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setLayoutMoiChon(opt.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                            active
                              ? 'border-[#1a91f0] bg-blue-600 text-white font-bold shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                          }`}
                        >
                          <Icon size={14} className="shrink-0" />
                          <span className="truncate">{opt.ten}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* NÚT XÁC NHẬN */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleXacNhanDoDuLieu}
                disabled={!duLieuBocTach}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a91f0] hover:bg-[#004182] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md active:scale-95"
              >
                <Sparkles size={14} />
                <span>Chuyển Nội Dung Vào Layout Vừa Thiết Kế</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModalNhapDuLieuCV;
