import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';

export interface CVData {
  id: number;
  tieu_de_cv: string;
  ngay_tao: string;
  ngay_sua: string;
  dinh_dang_cv?: {
    mauChuDao?: string;
  };
  noi_dung_cv?: {
    thongTinCaNhan?: {
      viTriUngTuyen?: string;
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
        // Nạp dữ liệu vào Zustand store
        napDuLieuCVTuServer(res.data.cv);
        // Chuyển sang màn hình Trình Thiết Kế
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Toast thông báo thành công */}
      {thongBaoThanhCong && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{thongBaoThanhCong}</span>
        </div>
      )}

      {/* Header trang Quản Lý CV - Rộng rãi toàn màn hình */}
      <div className="flex items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0a66c2]">
              <FileText size={22} />
            </span>
            <span>Danh Sách CV Của Bạn</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 pl-11">
            Quản lý và chỉnh sửa các bản CV chuyên nghiệp chuẩn ATS đã lưu trong hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={onTaoCVMoi}
          className="flex items-center justify-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs hover:shadow transition active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={18} />
          <span>Tạo CV Mới</span>
        </button>
      </div>

      {/* Trạng thái Đang tải */}
      {dangTai && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <Loader2 size={36} className="animate-spin text-[#0a66c2] mb-3" />
          <p className="text-xs font-semibold text-slate-500">Đang đồng bộ danh sách CV từ máy chủ...</p>
        </div>
      )}

      {/* Báo lỗi kết nối nếu có */}
      {!dangTai && thongBaoLoi && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-3 mb-6">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{thongBaoLoi}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRƯỜNG HỢP 1: KHI CHƯA CÓ CV NÀO - ĐÚNG 1 KHUNG TRỐNG DUY NHẤT Ở GIỮA     */}
      {/* ========================================================================= */}
      {!dangTai && !thongBaoLoi && danhSachCV.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-slate-200/90 text-center shadow-xs">
          {/* Icon tờ giấy lớn FileText */}
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-[#0a66c2] flex items-center justify-center mb-5 shadow-xs border border-blue-100">
            <FileText size={42} />
          </div>

          {/* Tiêu đề & mô tả */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Bạn chưa có bản CV nào
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
            Hãy tạo bản CV đầu tiên của bạn để sẵn sàng ứng tuyển!
          </p>

          {/* Đúng 1 nút bấm to nổi bật duy nhất */}
          <button
            type="button"
            onClick={onTaoCVMoi}
            className="mt-6 flex items-center gap-2.5 px-6 py-3.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer"
          >
            <Plus size={20} />
            <span>Tạo Bản CV Đầu Tiên</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TRƯỜNG HỢP 2: KHI ĐÃ CÓ CV - HIỂN THỊ LƯỚI CARD CÁC BẢN CV                 */}
      {/* ========================================================================= */}
      {!dangTai && !thongBaoLoi && danhSachCV.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {danhSachCV.map((cv) => {
            const mauChuDao = cv.dinh_dang_cv?.mauChuDao || '#0a66c2';
            const viTri = cv.noi_dung_cv?.thongTinCaNhan?.viTriUngTuyen || 'Chuyên viên ứng tuyển';

            return (
              <div
                key={cv.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Phần xem trước tờ A4 thu nhỏ */}
                <div
                  onClick={() => handleSuaCV(cv.id)}
                  className="h-44 bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-center cursor-pointer group-hover:bg-slate-100/70 transition"
                  title="Nhấn để mở và chỉnh sửa"
                >
                  <div className="w-28 h-36 bg-white rounded-sm shadow-sm border border-slate-200 p-2.5 flex flex-col space-y-1.5 overflow-hidden transition-transform group-hover:scale-105">
                    <div
                      className="h-3 w-full rounded-xs flex items-center px-1"
                      style={{ backgroundColor: mauChuDao }}
                    />
                    <div className="h-1 bg-slate-300 rounded-xs w-3/4" />
                    <div className="h-1 bg-slate-200 rounded-xs w-1/2" />
                    <div className="pt-1.5 space-y-1 flex-1">
                      <div className="h-0.5 bg-slate-100 rounded-xs w-full" />
                      <div className="h-0.5 bg-slate-100 rounded-xs w-5/6" />
                      <div className="h-0.5 bg-slate-100 rounded-xs w-4/6" />
                    </div>
                  </div>
                </div>

                {/* Thông tin CV */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => handleSuaCV(cv.id)}
                      className="text-sm font-bold text-slate-900 hover:text-[#0a66c2] transition cursor-pointer truncate"
                      title={cv.tieu_de_cv}
                    >
                      {cv.tieu_de_cv}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{viTri}</p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5">
                      <Calendar size={13} />
                      <span>Ngày tạo: {dinhDangNgay(cv.ngay_tao)}</span>
                    </div>
                  </div>

                  {/* Nhóm nút hành động: Sửa và Xóa */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleSuaCV(cv.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-[#0a66c2] text-[#0a66c2] hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCvCanXoa(cv)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                      title="Xóa bản CV này"
                    >
                      <Trash2 size={14} />
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
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Xác nhận xóa bản CV?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Bạn có chắc chắn muốn xóa bản CV "<strong>{cvCanXoa.tieu_de_cv}</strong>"? Hành động này không thể hoàn tác.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
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
