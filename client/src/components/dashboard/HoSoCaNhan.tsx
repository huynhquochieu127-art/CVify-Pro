import React, { useState } from 'react';
import {
  UserCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export interface HoSoCaNhanProps {
  nguoiDung?: {
    ten: string;
    email: string;
    avatar?: string;
  } | null;
  onChuyenTrinhThietKe?: () => void;
}

export const HoSoCaNhan: React.FC<HoSoCaNhanProps> = ({ nguoiDung, onChuyenTrinhThietKe }) => {
  // Lấy thông tin tài khoản đang đăng nhập để điền sẵn
  const tenMacDinh = nguoiDung?.ten || '';
  const emailMacDinh = nguoiDung?.email || '';

  const [hoTen, setHoTen] = useState(tenMacDinh);
  const [chucVu, setChucVu] = useState('');
  const [email, setEmail] = useState(emailMacDinh);
  const [soDienThoai, setSoDienThoai] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');

  const [kyNang, setKyNang] = useState<string[]>([]);
  const [kyNangMoi, setKyNangMoi] = useState('');

  const [kinhNghiem, setKinhNghiem] = useState<
    Array<{
      id: string;
      congTy: string;
      viTri: string;
      thoiGian: string;
      moTa: string;
    }>
  >([]);

  const [thongBaoLuu, setThongBaoLuu] = useState(false);

  // Tính độ hoàn thiện hồ sơ (bắt đầu từ 0% hoặc điểm theo Họ tên/Email hiện có)
  const tinhDoHoanThien = () => {
    let diem = 0;
    if (hoTen.trim()) diem += 15;
    if (email.trim()) diem += 15;
    if (chucVu.trim()) diem += 15;
    if (soDienThoai.trim()) diem += 15;
    if (diaChi.trim()) diem += 10;
    if (website.trim()) diem += 5;
    if (bio.trim()) diem += 10;
    if (kyNang.length > 0) diem += 10;
    if (kinhNghiem.length > 0) diem += 5;
    return Math.min(100, diem);
  };

  const doHoanThien = tinhDoHoanThien();

  const handleThemKyNang = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = kyNangMoi.trim();
    if (!val) return;
    if (!kyNang.includes(val)) {
      setKyNang([...kyNang, val]);
    }
    setKyNangMoi('');
  };

  const handleXoaKyNang = (ten: string) => {
    setKyNang(kyNang.filter((k) => k !== ten));
  };

  const handleThemKinhNghiem = () => {
    setKinhNghiem([
      ...kinhNghiem,
      {
        id: `kn-${Date.now()}`,
        congTy: '',
        viTri: '',
        thoiGian: '',
        moTa: '',
      },
    ]);
  };

  const handleXoaKinhNghiem = (id: string) => {
    setKinhNghiem(kinhNghiem.filter((k) => k.id !== id));
  };

  const handleLuuHoSo = () => {
    setThongBaoLuu(true);
    setTimeout(() => setThongBaoLuu(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Toast thông báo lưu thành công */}
      {thongBaoLuu && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} />
          <span>Đã lưu thông tin Hồ Sơ Cá Nhân thành công!</span>
        </div>
      )}

      {/* Header Hồ Sơ Cá Nhân */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-[#1a91f0]">
              <UserCheck size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Hồ Sơ Cá Nhân (Master Profile)
            </h1>
          </div>
          <p className="text-xs text-slate-500 pl-11">
            Lưu trữ thông tin gốc của bạn để tự động điền nhanh vào mọi bản thiết kế CV chỉ với 1 click.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLuuHoSo}
            className="flex items-center gap-2 bg-[#1a91f0] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Save size={16} />
            <span>Lưu Hồ Sơ</span>
          </button>

          {onChuyenTrinhThietKe && (
            <button
              type="button"
              onClick={onChuyenTrinhThietKe}
              className="flex items-center gap-1.5 text-xs font-bold text-[#1a91f0] bg-blue-50 hover:bg-blue-100 px-3.5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Tạo CV Từ Hồ Sơ</span>
            </button>
          )}
        </div>
      </div>

      {/* Hộp Tiến trình Hoàn thiện Hồ sơ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Độ hoàn thiện hồ sơ gốc
            </span>
            <span className="text-xs font-extrabold text-emerald-600">{doHoanThien}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${doHoanThien}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          {doHoanThien >= 85
            ? 'Tuyệt vời! Hồ sơ gốc của bạn đã sẵn sàng để tạo CV chuẩn ATS.'
            : doHoanThien > 0
            ? 'Hãy điền thêm các mục để CV tự động cập nhật chính xác.'
            : 'Hồ sơ đang trống. Hãy điền các mục để bắt đầu hoàn thiện hồ sơ của bạn.'}
        </p>
      </div>

      {/* FORM CHI TIẾT HỒ SƠ GỐC (RỘNG RÃI TOÀN BỘ TRANG) */}
      <div className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <User size={16} className="text-[#1a91f0]" />
            <span>Thông Tin Liên Hệ Cơ Bản</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chức danh / Vị trí chuyên môn
              </label>
              <input
                type="text"
                value={chucVu}
                onChange={(e) => setChucVu(e.target.value)}
                placeholder="VD: Nhân viên Kinh doanh, Lập trình viên..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ cư trú
              </label>
              <input
                type="text"
                value={diaChi}
                onChange={(e) => setDiaChi(e.target.value)}
                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website / LinkedIn
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="VD: linkedin.com/in/ten-ban hoặc github.com/..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tóm tắt bản thân & Mục tiêu nghề nghiệp
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn về bản thân, mục tiêu nghề nghiệp..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Khối 2: Kinh nghiệm làm việc */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={16} className="text-[#1a91f0]" />
              <span>Kinh Nghiệm Làm Việc</span>
            </h2>

            <button
              type="button"
              onClick={handleThemKinhNghiem}
              className="flex items-center gap-1 text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Kinh Nghiệm</span>
            </button>
          </div>

          <div className="space-y-4">
            {kinhNghiem.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-500 mb-2">Chưa có kinh nghiệm làm việc nào được thêm.</p>
                <button
                  type="button"
                  onClick={handleThemKinhNghiem}
                  className="text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Thêm kinh nghiệm đầu tiên
                </button>
              </div>
            ) : (
              kinhNghiem.map((kn) => (
                <div
                  key={kn.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleXoaKinhNghiem(kn.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition cursor-pointer"
                    title="Xóa kinh nghiệm này"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Chức danh / Vị trí
                      </label>
                      <input
                        type="text"
                        value={kn.viTri}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKinhNghiem(
                            kinhNghiem.map((k) => (k.id === kn.id ? { ...k, viTri: val } : k))
                          );
                        }}
                        placeholder="VD: Nhân viên Kinh doanh, Lập trình viên..."
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Công ty & Thời gian
                      </label>
                      <input
                        type="text"
                        value={kn.congTy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKinhNghiem(
                            kinhNghiem.map((k) => (k.id === kn.id ? { ...k, congTy: val } : k))
                          );
                        }}
                        placeholder="VD: Công ty TNHH ABC (2022 - Hiện tại)"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mô tả công việc & Thành tích
                    </label>
                    <textarea
                      value={kn.moTa}
                      onChange={(e) => {
                        const val = e.target.value;
                        setKinhNghiem(
                          kinhNghiem.map((k) => (k.id === kn.id ? { ...k, moTa: val } : k))
                        );
                      }}
                      placeholder="Mô tả tóm tắt nhiệm vụ và thành tựu nổi bật..."
                      rows={2}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-[#1a91f0]"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khối 3: Kỹ năng chuyên môn */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Award size={16} className="text-[#1a91f0]" />
            <span>Kỹ Năng Nổi Bật</span>
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {kyNang.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có kỹ năng nào. Nhập tên kỹ năng và nhấn &quot;Thêm&quot; bên dưới.</p>
            ) : (
              kyNang.map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-[#1a91f0] rounded-full text-xs font-semibold border border-blue-200"
                >
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => handleXoaKyNang(k)}
                    className="hover:text-rose-600 cursor-pointer font-bold text-sm"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          <form onSubmit={handleThemKyNang} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={kyNangMoi}
              onChange={(e) => setKyNangMoi(e.target.value)}
              placeholder="VD: Giao tiếp, Tiếng Anh, React, Photoshop..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#1a91f0]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#1a91f0] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Thêm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HoSoCaNhan;
