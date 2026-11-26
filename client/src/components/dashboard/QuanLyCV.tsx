import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  X,
  Briefcase,
  Clock,
  FolderOpen,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';

export interface CVData {
  id: number;
  tieu_de_cv: string;
  ngay_tao: string;
  ngay_sua: string;
  dinh_dang_cv?: {
    mauChuDao?: string;
    ngonNgu?: string;
  };
  noi_dung_cv?: {
    thongTinCaNhan?: {
      hoTen?: string;
      viTriUngTuyen?: string;
    };
    boCuc?: {
      cheDo?: string;
    };
  };
}

export interface QuanLyCVProps {
  onChuyenTrinhThietKe: (cvId: number) => void;
  onTaoCVMoi: () => void;
}

export const QuanLyCV: React.FC<QuanLyCVProps> = ({
  onChuyenTrinhThietKe,
  onTaoCVMoi,
}) => {
  const [danhSachCV, setDanhSachCV] = useState<CVData[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [thongBaoLoi, setThongBaoLoi] = useState<string | null>(null);
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string | null>(null);
  const [cvCanXoa, setCvCanXoa] = useState<CVData | null>(null);
  const [dangXoa, setDangXoa] = useState(false);
  const [tuKhoa, setTuKhoa] = useState('');

  const { napDuLieuCVTuServer } = useKhoLuuTruCV();

  const hienToast = (msg: string) => {
    setThongBaoThanhCong(msg);
    setTimeout(() => setThongBaoThanhCong(null), 3000);
  };

  // Gọi API lấy danh sách CV từ MySQL
  const taiDanhSachCV = async () => {
    setDangTai(true);
    setThongBaoLoi(null);

    const token = sessionStorage.getItem('token');
    if (!token) {
      setDangTai(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/cv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.thanh_cong) {
        setDanhSachCV(res.data.danh_sach || []);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(err.response?.data?.thong_bao || 'Không thể tải danh sách CV từ máy chủ.');
      } else {
        setThongBaoLoi('Đã có lỗi xảy ra khi tải danh sách CV.');
      }
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSachCV();
  }, []);

  const danhSachLoc = useMemo(() => {
    const kw = tuKhoa.trim().toLowerCase();
    if (!kw) return danhSachCV;
    return danhSachCV.filter((item) => {
      const tieuDe = (item.tieu_de_cv || '').toLowerCase();
      const viTri = (item.noi_dung_cv?.thongTinCaNhan?.viTriUngTuyen || '').toLowerCase();
      const hoTen = (item.noi_dung_cv?.thongTinCaNhan?.hoTen || '').toLowerCase();
      return tieuDe.includes(kw) || viTri.includes(kw) || hoTen.includes(kw);
    });
  }, [danhSachCV, tuKhoa]);

  // Xử lý khi nhấn nút "Sửa" CV
  const handleSuaCV = async (cvId: number) => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/cv/${cvId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.thanh_cong && res.data.cv) {
        napDuLieuCVTuServer(res.data.cv);
        onChuyenTrinhThietKe(cvId);
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết CV:', err);
      onChuyenTrinhThietKe(cvId);
    }
  };

  // Xử lý Xóa CV khỏi database
  const xacNhanXoaCV = async () => {
    if (!cvCanXoa) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;

    setDangXoa(true);
    try {
      const res = await axios.delete(`http://localhost:5000/api/cv/${cvCanXoa.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.thanh_cong) {
        setDanhSachCV((prev) => prev.filter((item) => item.id !== cvCanXoa.id));
        hienToast('Đã xóa bản CV thành công!');
        setCvCanXoa(null);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.thong_bao || 'Không thể xóa bản CV này.');
      } else {
        alert('Đã có lỗi xảy ra khi xóa CV.');
      }
    } finally {
      setDangXoa(false);
    }
  };

  const dinhDangNgay = (ngayChuoi: string) => {
    try {
      const d = new Date(ngayChuoi);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return ngayChuoi;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      {/* Toast thông báo thành công */}
      {thongBaoThanhCong && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{thongBaoThanhCong}</span>
        </div>
      )}

      {/* Header trang Quản Lý CV */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1a91f0] border border-blue-100 flex items-center justify-center shrink-0">
            <FolderOpen size={20} strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Quản Lý CV Của Bạn
              </h1>
              {!dangTai && (
                <span className="text-[11px] font-bold text-[#1a91f0] bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                  {danhSachCV.length} hồ sơ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lưu trữ, chỉnh sửa và quản lý tập trung toàn bộ các phiên bản CV ứng tuyển của bạn.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {danhSachCV.length > 0 && (
            <div className="relative flex-1 sm:w-56">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                placeholder="Tìm theo tên CV, vị trí..."
                className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1a91f0] rounded-xl pl-8 pr-7 py-2.5 text-slate-800 focus:outline-none transition"
              />
              {tuKhoa && (
                <button
                  type="button"
                  onClick={() => setTuKhoa('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onTaoCVMoi}
            className="inline-flex items-center justify-center gap-1.5 bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xs transition cursor-pointer shrink-0"
          >
            <Plus size={16} strokeWidth={2.2} />
            <span>Tạo CV Mới</span>
          </button>
        </div>
      </div>

      {/* Trạng thái Đang tải */}
      {dangTai && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Loader2 size={32} className="animate-spin text-[#1a91f0] mb-3" />
          <p className="text-xs font-semibold text-slate-500">
            Đang đồng bộ danh sách CV từ máy chủ...
          </p>
        </div>
      )}

      {/* Báo lỗi kết nối */}
      {!dangTai && thongBaoLoi && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-3 mb-6">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{thongBaoLoi}</span>
        </div>
      )}

      {/* Khi chưa có CV nào */}
      {!dangTai && !thongBaoLoi && danhSachCV.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1a91f0] flex items-center justify-center mb-4 border border-blue-100">
            <FileText size={32} strokeWidth={1.6} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Bạn chưa có bản CV nào
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md leading-relaxed">
            Bắt đầu tạo bản CV đầu tiên bằng cách tự thiết kế từ đầu hoặc chọn nhanh từ kho mẫu có sẵn.
          </p>
          <button
            type="button"
            onClick={onTaoCVMoi}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Tạo Bản CV Đầu Tiên</span>
          </button>
        </div>
      )}

      {/* Khi tìm kiếm không có kết quả */}
      {!dangTai && !thongBaoLoi && danhSachCV.length > 0 && danhSachLoc.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-2">
          <p className="text-sm font-bold text-slate-700">
            Không tìm thấy CV nào khớp với "{tuKhoa}"
          </p>
          <button
            type="button"
            onClick={() => setTuKhoa('')}
            className="text-xs font-bold text-[#1a91f0] hover:underline cursor-pointer"
          >
            Xóa từ khóa tìm kiếm
          </button>
        </div>
      )}

      {/* Lưới Card CV hiện đại */}
      {!dangTai && !thongBaoLoi && danhSachLoc.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {danhSachLoc.map((cv) => {
            const mauChuDao = cv.dinh_dang_cv?.mauChuDao || '#1a91f0';
            const ngonNgu = (cv.dinh_dang_cv?.ngonNgu || 'vi').toUpperCase();
            const hoTen = cv.noi_dung_cv?.thongTinCaNhan?.hoTen || cv.tieu_de_cv;
            const viTri =
              cv.noi_dung_cv?.thongTinCaNhan?.viTriUngTuyen || 'Chưa cập nhật vị trí';
            const motCot = cv.noi_dung_cv?.boCuc?.cheDo === '1-cot';

            return (
              <div
                key={cv.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1a91f0]/50 transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Preview tờ A4 thu nhỏ trực quan */}
                <div
                  onClick={() => handleSuaCV(cv.id)}
                  className="h-48 bg-slate-50/90 border-b border-slate-100 p-4 flex items-center justify-center relative cursor-pointer overflow-hidden"
                  title="Nhấn để mở chỉnh sửa bản CV này"
                >
                  {/* Nhãn ngôn ngữ góc trái */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 border border-slate-200/80 text-[10px] font-bold text-slate-600 shadow-2xs">
                    {ngonNgu}
                  </span>

                  {/* Tờ giấy A4 mô phỏng sát dữ liệu thực */}
                  <div className="w-32 h-40 bg-white rounded shadow-sm border border-slate-200/90 p-2.5 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.04]">
                    <div>
                      <div
                        className="h-1.5 w-full rounded-full mb-2"
                        style={{ backgroundColor: mauChuDao }}
                      />
                      <p
                        className="text-[8px] font-extrabold uppercase truncate leading-tight"
                        style={{ color: mauChuDao }}
                      >
                        {hoTen}
                      </p>
                      <p className="text-[6.5px] text-slate-500 truncate mb-2">
                        {viTri}
                      </p>

                      {motCot ? (
                        <div className="space-y-1.5">
                          <div className="h-1 bg-slate-200 rounded w-full" />
                          <div className="h-1 bg-slate-100 rounded w-5/6" />
                          <div className="h-1 bg-slate-200 rounded w-4/6 mt-1.5" />
                          <div className="h-1 bg-slate-100 rounded w-full" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-12 gap-1.5">
                          <div className="col-span-4 space-y-1">
                            <div className="h-1 bg-slate-300 rounded w-full" />
                            <div className="h-1 bg-slate-100 rounded w-4/5" />
                            <div className="h-1 bg-slate-100 rounded w-full" />
                          </div>
                          <div className="col-span-8 space-y-1">
                            <div className="h-1 bg-slate-300 rounded w-3/4" />
                            <div className="h-1 bg-slate-100 rounded w-full" />
                            <div className="h-1 bg-slate-100 rounded w-5/6" />
                            <div className="h-1 bg-slate-100 rounded w-2/3" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: mauChuDao }}
                      />
                      <span className="text-[6px] text-slate-400 font-medium">CVify Pro</span>
                    </div>
                  </div>

                  {/* Overlay nhẹ khi hover */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-[11px] font-bold shadow-sm inline-flex items-center gap-1.5">
                      <Edit3 size={12} className="text-[#1a91f0]" />
                      Mở chỉnh sửa
                    </span>
                  </div>
                </div>

                {/* Thông tin chi tiết bản CV */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => handleSuaCV(cv.id)}
                      className="text-sm font-bold text-slate-900 hover:text-[#1a91f0] transition cursor-pointer truncate"
                      title={cv.tieu_de_cv}
                    >
                      {cv.tieu_de_cv}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-1 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{viTri}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        Tạo: {dinhDangNgay(cv.ngay_tao)}
                      </span>
                      {cv.ngay_sua && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          Sửa: {dinhDangNgay(cv.ngay_sua)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nhóm nút hành động */}
                  <div className="pt-3.5 mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSuaCV(cv.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-[#1a91f0] text-[#1a91f0] hover:text-white border border-blue-100 hover:border-[#1a91f0] rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Chỉnh sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCvCanXoa(cv)}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                      title="Xóa bản CV này"
                    >
                      <Trash2 size={13} />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA CV */}
      {cvCanXoa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bản CV?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Bạn có chắc chắn muốn xóa bản CV "<strong>{cvCanXoa.tieu_de_cv}</strong>"? Hành động này không thể hoàn tác.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setCvCanXoa(null)}
                disabled={dangXoa}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={xacNhanXoaCV}
                disabled={dangXoa}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                {dangXoa ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>{dangXoa ? 'Đang xóa...' : 'Xóa vĩnh viễn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyCV;
