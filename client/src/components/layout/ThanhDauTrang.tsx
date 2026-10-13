import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  ChevronDown,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';

export interface NguoiDung {
  id?: number | string;
  ten: string;
  email: string;
  avatar?: string;
  vai_tro?: string;
}

interface ThanhDauTrangProps {
  nguoiDung: NguoiDung | null;
  onMoDangNhap: () => void;
  onMoDangKy: () => void;
  onDangXuat: () => void;
  onVeTrangChu: () => void;
  coTaskbar?: boolean;
}

export const ThanhDauTrang: React.FC<ThanhDauTrangProps> = ({
  nguoiDung,
  onMoDangNhap,
  onMoDangKy,
  onDangXuat,
  onVeTrangChu,
  coTaskbar = false,
}) => {
  // Trạng thái mở menu dropdown tài khoản
  const [moDropdown, setMoDropdown] = useState(false);
  // Trạng thái mở modal xem chi tiết thông tin tài khoản
  const [moModalThongTin, setMoModalThongTin] = useState(false);
  // Trạng thái ảnh avatar lỗi
  const [loiAnhAvatar, setLoiAnhAvatar] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset trạng thái lỗi khi avatar thay đổi
  useEffect(() => {
    setLoiAnhAvatar(false);
  }, [nguoiDung?.avatar]);

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lấy chữ cái đầu tiên của tên người dùng
  const chuCaiDau = nguoiDung?.ten
    ? nguoiDung.ten.trim().charAt(0).toUpperCase()
    : 'U';

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-white border-b border-[#d9deeb] transition-all ${
          coTaskbar ? 'pl-18' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo CVify Pro bên trái */}
          <div
            onClick={onVeTrangChu}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a91f0] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition">
              CV
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#0f141e] group-hover:text-[#1a91f0] transition">
              CVify <span className="text-[#1a91f0]">Pro</span>
            </span>
          </div>

          {/* Phía bên phải: Phụ thuộc vào trạng thái đăng nhập */}
          <div className="flex items-center gap-3">
            {/* TRẠNG THÁI 1: CHƯA ĐĂNG NHẬP (Khách vãng lai) */}
            {!nguoiDung ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onMoDangNhap}
                  className="text-xs font-medium text-[#1e2532] hover:text-[#1a91f0] px-3.5 py-1.5 rounded-full hover:bg-[#f7f9fc] transition cursor-pointer"
                >
                  Đăng Nhập
                </button>

                <button
                  type="button"
                  onClick={onMoDangKy}
                  className="text-xs font-medium text-white bg-[#1a91f0] hover:bg-[#016fd0] px-4 py-1.5 rounded-full transition active:scale-95 cursor-pointer shadow-xs"
                >
                  Đăng Ký
                </button>
              </div>
            ) : (
              /* TRẠNG THÁI 2: ĐÃ ĐĂNG NHẬP THÀNH CÔNG */
              <div className="relative" ref={dropdownRef}>
                {/* Ô Tròn Profile Avatar ở góc trên bên phải */}
                <button
                  type="button"
                  onClick={() => setMoDropdown(!moDropdown)}
                  className="flex items-center gap-2.5 p-1 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition cursor-pointer active:scale-98"
                  title="Tài khoản của bạn"
                >
                  {/* Ô tròn chứa chữ cái đầu hoặc avatar */}
                  {nguoiDung.avatar && !loiAnhAvatar ? (
                    <img
                      src={nguoiDung.avatar}
                      alt={nguoiDung.ten}
                      referrerPolicy="no-referrer"
                      onError={() => setLoiAnhAvatar(true)}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#1a91f0]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1a91f0] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-xs">
                      {chuCaiDau}
                    </div>
                  )}

                  {/* Tên người dùng */}
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[130px] truncate">
                    {nguoiDung.ten}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      moDropdown ? 'rotate-180 text-[#1a91f0]' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Xổ Ra Khi Click Vào Profile */}
                {moDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-fade-in">
                    {/* Header thông tin nhanh trong menu */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      {nguoiDung.avatar && !loiAnhAvatar ? (
                        <img
                          src={nguoiDung.avatar}
                          alt={nguoiDung.ten}
                          referrerPolicy="no-referrer"
                          onError={() => setLoiAnhAvatar(true)}
                          className="w-10 h-10 rounded-full object-cover border border-blue-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1a91f0] flex items-center justify-center font-bold text-sm border border-blue-200 shrink-0">
                          {chuCaiDau}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {nguoiDung.ten}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {nguoiDung.email}
                        </p>
                      </div>
                    </div>

                    {/* Danh sách hành động */}
                    <div className="p-1 space-y-0.5 text-xs">
                      {/* 👤 Thông tin tài khoản */}
                      <button
                        type="button"
                        onClick={() => {
                          setMoDropdown(false);
                          setMoModalThongTin(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:text-[#1a91f0] hover:bg-slate-50 rounded-xl transition cursor-pointer font-medium"
                      >
                        <User size={15} className="text-slate-500" />
                        <span>Thông tin tài khoản</span>
                      </button>

                      {/* 🚪 Đăng Xuất */}
                      <button
                        type="button"
                        onClick={() => {
                          setMoDropdown(false);
                          onDangXuat();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer font-semibold"
                      >
                        <LogOut size={15} />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Xem Chi Tiết Thông Tin Tài Khoản */}
      {moModalThongTin && nguoiDung && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 relative">
            <button
              type="button"
              onClick={() => setMoModalThongTin(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[#1a91f0] text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                {chuCaiDau}
              </div>
              <h3 className="text-base font-bold text-slate-900">{nguoiDung.ten}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{nguoiDung.email}</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User size={14} className="text-slate-400" />
                  Họ và tên:
                </span>
                <span className="font-bold text-slate-800">{nguoiDung.ten}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  Email:
                </span>
                <span className="font-medium text-slate-700 truncate max-w-[170px]">{nguoiDung.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Trạng thái:
                </span>
                <span className="font-bold text-emerald-600">Đã kích hoạt</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMoModalThongTin(false)}
              className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThanhDauTrang;
