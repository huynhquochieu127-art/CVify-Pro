// client/src/components/auth/HopThoaiXacThuc.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  RotateCw,
  Send,
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { NguoiDungAuth } from './types';
export type { NguoiDungAuth };

export interface HopThoaiXacThucProps {
  dangMo: boolean;
  onDong: () => void;
  cheDoMacDinh?: 'dang-nhap' | 'dang-ky';
  onXacThucThanhCong: (nguoiDung: NguoiDungAuth) => void;
}

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '1088737234857-mockclientidcvbuilder.apps.googleusercontent.com';

export const HopThoaiXacThuc: React.FC<HopThoaiXacThucProps> = ({
  dangMo,
  onDong,
  cheDoMacDinh = 'dang-nhap',
  onXacThucThanhCong,
}) => {
  const [cheDo, setCheDo] = useState<'dang-nhap' | 'dang-ky'>(cheDoMacDinh);

  // Bước đăng ký: 1 = Nhập thông tin & Gửi OTP, 2 = Nhập mã OTP xác thực
  const [buocDangKy, setBuocDangKy] = useState<1 | 2>(1);

  // Form Fields
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [maOtp, setMaOtp] = useState('');
  const [hienMatKhau, setHienMatKhau] = useState(false);

  // Trạng thái đếm ngược OTP (60s)
  const [demNguoc, setDemNguoc] = useState(60);
  const [coTheGuiLai, setCoTheGuiLai] = useState(false);

  // Trạng thái xử lý & Thông báo
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangGuiOtp, setDangGuiOtp] = useState(false);
  const [thongBaoLoi, setThongBaoLoi] = useState<string | null>(null);
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string | null>(null);

  // Modal giả lập test Google nếu chưa có Client ID thật
  const [moModalTestGoogle, setMoModalTestGoogle] = useState(false);
  const [emailTestGoogle, setEmailTestGoogle] = useState('');
  const [tenTestGoogle, setTenTestGoogle] = useState('');

  // Sử dụng ReturnType<typeof setInterval> thay vì NodeJS.Timeout để tương thích trình duyệt
  const demNguocRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset form khi mở modal hoặc thay đổi chế độ
  useEffect(() => {
    setCheDo(cheDoMacDinh);
    setBuocDangKy(1);
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
    setMaOtp('');
  }, [cheDoMacDinh, dangMo]);

  // Bộ đếm ngược 60 giây khi chuyển sang Bước 2
  useEffect(() => {
    if (cheDo === 'dang-ky' && buocDangKy === 2) {
      setDemNguoc(60);
      setCoTheGuiLai(false);

      if (demNguocRef.current) clearInterval(demNguocRef.current);

      demNguocRef.current = setInterval(() => {
        setDemNguoc((prev) => {
          if (prev <= 1) {
            if (demNguocRef.current) clearInterval(demNguocRef.current);
            setCoTheGuiLai(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (demNguocRef.current) clearInterval(demNguocRef.current);
    };
  }, [cheDo, buocDangKy]);

  if (!dangMo) return null;

  const resetForm = () => {
    setHoTen('');
    setEmail('');
    setMatKhau('');
    setMaOtp('');
    setBuocDangKy(1);
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
    setDangXuLy(false);
    setDangGuiOtp(false);
  };

  const chuyenCheDo = (cheDoMoi: 'dang-nhap' | 'dang-ky') => {
    setCheDo(cheDoMoi);
    setBuocDangKy(1);
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
  };

  // ====================================================================
  // 1. BƯỚC 1 ĐĂNG KÝ: GỬI MÃ OTP ĐẾN GMAIL
  // ====================================================================
  const handleGuiOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);

    const emailTrim = email.trim().toLowerCase();

    // Kiểm tra đuôi @gmail.com
    if (!emailTrim.endsWith('@gmail.com')) {
      setThongBaoLoi('Địa chỉ email bắt buộc phải có đuôi @gmail.com!');
      return;
    }

    if (!hoTen.trim()) {
      setThongBaoLoi('Vui lòng nhập họ và tên của bạn!');
      return;
    }

    if (!matKhau || matKhau.length < 6) {
      setThongBaoLoi('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setDangGuiOtp(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/gui-otp-dang-ky', {
        email: emailTrim,
      });

      if (res.data.thanh_cong) {
        setThongBaoThanhCong(res.data.thong_bao || 'Mã OTP đã được gửi về Gmail của bạn!');
        setBuocDangKy(2); // Tự động chuyển sang Bước 2
      } else {
        setThongBaoLoi(res.data.thong_bao || 'Không thể gửi mã OTP.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(
          err.response?.data?.thong_bao ||
            err.response?.data?.message ||
            'Không thể kết nối đến máy chủ hoặc chưa cấu hình gửi mail Nodemailer!'
        );
      } else {
        setThongBaoLoi('Đã có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại!');
      }
    } finally {
      setDangGuiOtp(false);
    }
  };

  // ====================================================================
  // GỬI LẠI MÃ OTP (Tại Bước 2)
  // ====================================================================
  const handleGuiLaiOtp = async () => {
    if (!coTheGuiLai || dangGuiOtp) return;

    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
    setDangGuiOtp(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/gui-otp-dang-ky', {
        email: email.trim().toLowerCase(),
      });

      if (res.data.thanh_cong) {
        setThongBaoThanhCong('Đã gửi lại mã OTP mới đến Gmail của bạn!');
        setDemNguoc(60);
        setCoTheGuiLai(false);
        if (demNguocRef.current) clearInterval(demNguocRef.current);
        demNguocRef.current = setInterval(() => {
          setDemNguoc((prev) => {
            if (prev <= 1) {
              if (demNguocRef.current) clearInterval(demNguocRef.current);
              setCoTheGuiLai(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setThongBaoLoi(res.data.thong_bao || 'Không thể gửi lại mã OTP.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(err.response?.data?.thong_bao || 'Không thể gửi lại mã OTP.');
      } else {
        setThongBaoLoi('Lỗi khi gửi lại OTP!');
      }
    } finally {
      setDangGuiOtp(false);
    }
  };

  // ====================================================================
  // 2. BƯỚC 2 ĐĂNG KÝ: XÁC THỰC OTP VÀ TẠO TÀI KHOẢN
  // ====================================================================
  const handleXacThucVaDangKy = async (e: React.FormEvent) => {
    e.preventDefault();
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);

    if (!maOtp.trim() || maOtp.trim().length !== 6) {
      setThongBaoLoi('Vui lòng nhập đúng 6 chữ số mã OTP!');
      return;
    }

    setDangXuLy(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/xac-thuc-va-dang-ky', {
        ho_ten: hoTen.trim(),
        email: email.trim().toLowerCase(),
        mat_khau: matKhau,
        ma_otp: maOtp.trim(),
      });

      if (res.data.thanh_cong) {
        // Lưu token & thông tin người dùng vào sessionStorage
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('nguoiDung', JSON.stringify(res.data.nguoi_dung));

        setThongBaoThanhCong('Đăng ký tài khoản và xác thực thành công!');
        setTimeout(() => {
          onXacThucThanhCong(res.data.nguoi_dung);
          resetForm();
          onDong();
        }, 800);
      } else {
        setThongBaoLoi(res.data.thong_bao || 'Xác thực không thành công.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(
          err.response?.data?.thong_bao ||
            err.response?.data?.message ||
            'Mã OTP không chính xác hoặc đã hết hạn!'
        );
      } else {
        setThongBaoLoi('Đã có lỗi xảy ra khi xác thực OTP!');
      }
    } finally {
      setDangXuLy(false);
    }
  };

  // ====================================================================
  // 3. ĐĂNG NHẬP TRUYỀN THỐNG (Email & Password)
  // ====================================================================
  const handleDangNhap = async (e: React.FormEvent) => {
    e.preventDefault();
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
    setDangXuLy(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/dang-nhap', {
        email: email.trim().toLowerCase(),
        mat_khau: matKhau,
      });

      if (res.data.thanh_cong) {
        // Lưu token & thông tin vào sessionStorage
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('nguoiDung', JSON.stringify(res.data.nguoi_dung));

        setThongBaoThanhCong('Đăng nhập thành công!');
        setTimeout(() => {
          onXacThucThanhCong(res.data.nguoi_dung);
          resetForm();
          onDong();
        }, 600);
      } else {
        setThongBaoLoi(res.data.thong_bao || 'Đăng nhập không thành công.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(err.response?.data?.thong_bao || 'Email hoặc mật khẩu không chính xác!');
      } else {
        setThongBaoLoi('Đã có lỗi xảy ra khi đăng nhập!');
      }
    } finally {
      setDangXuLy(false);
    }
  };

  // ====================================================================
  // 4. XỬ LÝ ĐĂNG NHẬP BẰNG GOOGLE
  // ====================================================================
  const guiDangNhapGoogle = async (duLieuGoogle: {
    email: string;
    ho_ten: string;
    anh_dai_dien?: string;
  }) => {
    setThongBaoLoi(null);
    setThongBaoThanhCong(null);
    setDangXuLy(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', duLieuGoogle);

      if (res.data.thanh_cong) {
        // Lưu vào sessionStorage
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('nguoiDung', JSON.stringify(res.data.nguoi_dung));

        setThongBaoThanhCong('Đăng nhập Google thành công!');
        setTimeout(() => {
          onXacThucThanhCong(res.data.nguoi_dung);
          resetForm();
          setMoModalTestGoogle(false);
          onDong();
        }, 700);
      } else {
        setThongBaoLoi(res.data.thong_bao || 'Đăng nhập Google thất bại!');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setThongBaoLoi(err.response?.data?.thong_bao || 'Không thể đăng nhập bằng tài khoản Google!');
      } else {
        setThongBaoLoi('Lỗi kết nối khi đăng nhập Google!');
      }
    } finally {
      setDangXuLy(false);
    }
  };

  const coGoogleClientIdThat =
    Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID) &&
    import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com');

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 overflow-hidden">
          {/* Nút đóng modal */}
          <button
            type="button"
            onClick={() => {
              resetForm();
              onDong();
            }}
            disabled={dangXuLy || dangGuiOtp}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Chuyển đổi Tab Đăng Nhập / Đăng Ký */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => chuyenCheDo('dang-nhap')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                cheDo === 'dang-nhap'
                  ? 'bg-white text-[#1a91f0] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => chuyenCheDo('dang-ky')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                cheDo === 'dang-ky'
                  ? 'bg-white text-[#1a91f0] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Đăng Ký
            </button>
          </div>

          {/* Thông báo lỗi */}
          {thongBaoLoi && (
            <div className="mb-3.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-snug">{thongBaoLoi}</span>
            </div>
          )}

          {/* Thông báo thành công */}
          {thongBaoThanhCong && (
            <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span className="font-semibold">{thongBaoThanhCong}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* GIAO DIỆN FORM: ĐĂNG NHẬP                                    */}
          {/* ============================================================ */}
          {cheDo === 'dang-nhap' && (
            <div>
              <div className="text-center mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Chào mừng bạn trở lại</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nhập email và mật khẩu để quản lý và tạo CV
                </p>
              </div>

              <form onSubmit={handleDangNhap} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      disabled={dangXuLy}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/30 focus:border-[#1a91f0] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={hienMatKhau ? 'text' : 'password'}
                      required
                      disabled={dangXuLy}
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/30 focus:border-[#1a91f0] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setHienMatKhau(!hienMatKhau)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {hienMatKhau ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dangXuLy}
                  className="w-full mt-2 py-2.5 bg-[#1a91f0] hover:bg-[#004182] disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {dangXuLy ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </>
                  ) : (
                    'Đăng Nhập'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* GIAO DIỆN FORM: ĐĂNG KÝ BƯỚC 1 (Nhập thông tin & Gửi OTP)    */}
          {/* ============================================================ */}
          {cheDo === 'dang-ky' && buocDangKy === 1 && (
            <div>
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a91f0] text-[11px] font-bold mb-1.5 border border-blue-100">
                  <span>Bước 1/2</span>
                  <span>•</span>
                  <span>Xác thực Gmail</span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Tạo tài khoản mới</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Nhập thông tin và nhận mã OTP qua Gmail
                </p>
              </div>

              <form onSubmit={handleGuiOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      disabled={dangGuiOtp}
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/30 focus:border-[#1a91f0] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ Gmail <span className="text-red-500 font-normal">(@gmail.com)</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      disabled={dangGuiOtp}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/30 focus:border-[#1a91f0] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu khởi tạo
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={hienMatKhau ? 'text' : 'password'}
                      required
                      disabled={dangGuiOtp}
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/30 focus:border-[#1a91f0] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setHienMatKhau(!hienMatKhau)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {hienMatKhau ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={dangGuiOtp}
                  className="w-full mt-2 py-2.5 bg-[#1a91f0] hover:bg-[#004182] disabled:bg-blue-300 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {dangGuiOtp ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang gửi mã...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Gửi Mã Xác Thực Đến Gmail</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* GIAO DIỆN FORM: ĐĂNG KÝ BƯỚC 2 (Nhập mã OTP 6 số)            */}
          {/* ============================================================ */}
          {cheDo === 'dang-ky' && buocDangKy === 2 && (
            <div className="animate-fade-in">
              <button
                type="button"
                onClick={() => setBuocDangKy(1)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#1a91f0] mb-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Quay lại đổi thông tin</span>
              </button>

              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-50 text-[#1a91f0] rounded-full mx-auto flex items-center justify-center mb-2.5 shadow-2xs border border-blue-100">
                  <KeyRound size={22} />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">Xác thực mã OTP</h2>
                <p className="text-xs text-slate-600 mt-1 px-1 leading-relaxed">
                  Mã 6 chữ số đã được gửi đến{' '}
                  <span className="font-bold text-[#1a91f0] underline decoration-blue-300">
                    {email}
                  </span>
                  . Vui lòng mở Gmail kiểm tra hộp thư đến (hoặc thư Rác/Spam).
                </p>
              </div>

              <form onSubmit={handleXacThucVaDangKy} className="space-y-4">
                <div>
                  <label className="block text-center text-xs font-semibold text-slate-700 mb-2">
                    Nhập 6 chữ số mã OTP:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    disabled={dangXuLy}
                    value={maOtp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setMaOtp(val);
                    }}
                    placeholder="••••••"
                    className="w-full text-center text-2xl font-mono font-black tracking-[0.4em] py-2.5 px-3 bg-slate-50 border-2 border-blue-200 focus:border-[#1a91f0] focus:bg-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition text-slate-800"
                  />
                </div>

                {/* Đồng hồ đếm ngược và nút gửi lại mã */}
                <div className="flex items-center justify-between text-xs px-1 text-slate-500">
                  <span>
                    Hạn mã: <strong className="text-slate-700">5 phút</strong>
                  </span>

                  {coTheGuiLai ? (
                    <button
                      type="button"
                      onClick={handleGuiLaiOtp}
                      disabled={dangGuiOtp}
                      className="text-[#1a91f0] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw size={12} className={dangGuiOtp ? 'animate-spin' : ''} />
                      <span>Gửi lại mã</span>
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      Gửi lại sau:{' '}
                      <strong className="text-[#1a91f0] font-mono">
                        {demNguoc < 10 ? `0${demNguoc}` : demNguoc}s
                      </strong>
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={dangXuLy || maOtp.length !== 6}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {dangXuLy ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang xác thực & tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Xác Nhận & Hoàn Tất Đăng Ký</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHẦN ĐĂNG NHẬP GOOGLE (Chỉ hiện ở Đăng nhập hoặc Đăng ký B1) */}
          {/* ============================================================ */}
          {(cheDo === 'dang-nhap' || (cheDo === 'dang-ky' && buocDangKy === 1)) && (
            <div className="mt-4">
              {/* Đường kẻ phân cách */}
              <div className="relative my-3 flex items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hoặc tiếp tục với
                </span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Nút Đăng nhập bằng Google */}
              {coGoogleClientIdThat ? (
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        try {
                          const decoded: any = jwtDecode(credentialResponse.credential);
                          guiDangNhapGoogle({
                            email: decoded.email,
                            ho_ten: decoded.name || decoded.given_name || 'Người Dùng Google',
                            anh_dai_dien: decoded.picture || '',
                          });
                        } catch (e) {
                          setThongBaoLoi('Không thể giải mã dữ liệu Google Sign-In!');
                        }
                      }
                    }}
                    onError={() => {
                      setThongBaoLoi('Đăng nhập Google thất bại hoặc bạn đã hủy!');
                    }}
                    shape="pill"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setMoModalTestGoogle(true)}
                  disabled={dangXuLy}
                  className="w-full py-2 px-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-2.5"
                >
                  {/* Logo Google 4 màu đặc trưng */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Đăng nhập bằng Google</span>
                </button>
              )}
            </div>
          )}

          {/* Đáy modal chuyển nhanh chế độ */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            {cheDo === 'dang-nhap' ? (
              <p className="text-xs text-slate-500">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => chuyenCheDo('dang-ky')}
                  className="font-bold text-[#1a91f0] hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => chuyenCheDo('dang-nhap')}
                  className="font-bold text-[#1a91f0] hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL PHỤ: THỬ NGHIỆM ĐĂNG NHẬP GOOGLE HOẶC CẤU HÌNH         */}
      {/* ============================================================ */}
      {moModalTestGoogle && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-slate-200">
            <button
              type="button"
              onClick={() => setMoModalTestGoogle(false)}
              className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <h3 className="font-extrabold text-sm text-slate-900">
                Đăng Nhập Google API Backend
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Bạn có thể kiểm tra trực tiếp API{' '}
              <code className="text-[#1a91f0] bg-blue-50 px-1 py-0.5 rounded font-mono">
                POST /api/auth/google-login
              </code>{' '}
              (tự động lưu tài khoản vào MySQL & tạo hồ sơ gốc):
            </p>

            <div className="space-y-2.5 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Họ tên Google
                </label>
                <input
                  type="text"
                  value={tenTestGoogle}
                  onChange={(e) => setTenTestGoogle(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Google"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Gmail đăng nhập
                </label>
                <input
                  type="email"
                  value={emailTestGoogle}
                  onChange={(e) => setEmailTestGoogle(e.target.value)}
                  placeholder="nguyenvangoogle@gmail.com"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  guiDangNhapGoogle({
                    email: emailTestGoogle.trim() || 'nguyenvangoogle@gmail.com',
                    ho_ten: tenTestGoogle.trim() || 'Nguyễn Văn Google',
                    anh_dai_dien: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                  });
                }}
                disabled={dangXuLy}
                className="flex-1 py-2 bg-[#1a91f0] hover:bg-[#004182] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {dangXuLy ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <span>Gửi API Đăng Nhập Google</span>
                )}
              </button>
            </div>

            <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 leading-snug">
              💡 Để bật Google Sign-In popup thật, bạn chỉ cần điền Client ID vào{' '}
              <code className="font-mono text-amber-900 font-semibold">client/.env</code>:{' '}
              <br />
              <code className="text-[10px] font-mono">
                VITE_GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
              </code>
            </div>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
};

export default HopThoaiXacThuc;
