// client/src/components/layout/ThanhTaskbar.tsx
import React, { useState, useEffect } from 'react';
import {
  Home,
  PlusCircle,
  FolderKanban,
  LayoutTemplate,
  UserCheck,
  LogOut,
} from 'lucide-react';
import type { NguoiDung } from './index';

export type ManHinhType =
  | 'trang-chu'
  | 'quan-ly-cv'
  | 'kho-mau'
  | 'trinh-thiet-ke'
  | 'ho-so-goc';

export interface ThanhTaskbarProps {
  manHinhHienTai: ManHinhType;
  onChuyenManHinh: (manHinh: ManHinhType) => void;
  onTaoCVMoi?: () => void;
  nguoiDung?: NguoiDung | null;
  onDangXuat?: () => void;
}

export const ThanhTaskbar: React.FC<ThanhTaskbarProps> = ({
  manHinhHienTai,
  onChuyenManHinh,
  onTaoCVMoi,
  nguoiDung,
  onDangXuat,
}) => {
  // Trạng thái mở rộng khi rê chuột vào thanh
  const [dangMoRong, setDangMoRong] = useState(false);
  const [loiAnhAvatar, setLoiAnhAvatar] = useState(false);

  useEffect(() => {
    setLoiAnhAvatar(false);
  }, [nguoiDung?.avatar]);

  const chuCaiDau = nguoiDung?.ten
    ? nguoiDung.ten.trim().charAt(0).toUpperCase()
    : 'U';

  // Danh sách 5 nút điều hướng
  const danhSachNut = [
    {
      id: 'trang-chu' as ManHinhType,
      ten: 'Trang Chủ',
      icon: Home,
      action: () => onChuyenManHinh('trang-chu'),
      active: manHinhHienTai === 'trang-chu',
    },
    {
      id: 'trinh-thiet-ke' as ManHinhType,
      ten: 'Tạo CV Mới',
      icon: PlusCircle,
      action: onTaoCVMoi || (() => onChuyenManHinh('trinh-thiet-ke')),
      active: manHinhHienTai === 'trinh-thiet-ke',
    },
    {
      id: 'quan-ly-cv' as ManHinhType,
      ten: 'Quản Lý CV',
      icon: FolderKanban,
      action: () => onChuyenManHinh('quan-ly-cv'),
      active: manHinhHienTai === 'quan-ly-cv',
    },
    {
      id: 'kho-mau' as ManHinhType,
      ten: 'Kho Mẫu CV',
      icon: LayoutTemplate,
      action: () => onChuyenManHinh('kho-mau'),
      active: manHinhHienTai === 'kho-mau',
    },
    {
      id: 'ho-so-goc' as ManHinhType,
      ten: 'Hồ Sơ Cá Nhân',
      icon: UserCheck,
      action: () => onChuyenManHinh('ho-so-goc'),
      active: manHinhHienTai === 'ho-so-goc',
    },
  ];

  return (
    <aside
      onMouseEnter={() => setDangMoRong(true)}
      onMouseLeave={() => setDangMoRong(false)}
      style={{
        width: dangMoRong ? '240px' : '70px',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-[#d9deeb] z-50 overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between py-4 select-none"
    >
      {/* ============================================================== */}
      {/* 1. PHẦN TRÊN: LOGO & CÁC NÚT ĐIỀU HƯỚNG                        */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-5">
        {/* Logo CVify Pro: Thu gọn chỉ hiện icon, mở rộng hiện cả tên */}
        <div
          onClick={() => onChuyenManHinh('trang-chu')}
          className="flex items-center gap-3 px-3 cursor-pointer"
          title="Về Trang Chủ"
        >
          <div className="w-11 h-11 rounded-xl bg-[#1a91f0] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            CV
          </div>
          {dangMoRong && (
            <div className="whitespace-nowrap overflow-hidden transition-all duration-200">
              <span className="font-extrabold text-base tracking-tight text-[#0f141e]">
                CVify <span className="text-[#1a91f0]">Pro</span>
              </span>
              <p className="text-[10px] text-[#828ba2] font-medium leading-none mt-0.5">
                Hệ thống tạo CV
              </p>
            </div>
          )}
        </div>

        {/* Danh sách 5 nút bấm đồng bộ thiết kế 100% */}
        <nav className="flex flex-col gap-1 px-2">
          {danhSachNut.map((nut) => {
            const Icon = nut.icon;
            const dangChon = nut.active;

            return (
              <button
                key={nut.id}
                type="button"
                onClick={nut.action}
                title={!dangMoRong ? nut.ten : undefined}
                className={`w-full rounded-xl py-3 px-3 transition-colors flex items-center gap-3.5 cursor-pointer ${
                  dangChon
                    ? 'bg-[#f1f2ff] text-[#1a91f0] font-semibold'
                    : 'text-[#656e83] hover:text-[#1e2532] hover:bg-[#f7f9fc] font-medium'
                }`}
              >
                {/* Icon căn giữa */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      dangChon ? 'text-[#1a91f0]' : 'text-[#828ba2]'
                    }`}
                  />
                </div>

                {/* Tiêu đề nút: Hiện rõ khi mở rộng */}
                {dangMoRong && (
                  <span className="whitespace-nowrap text-xs font-semibold text-slate-800 transition-all duration-200">
                    {nut.ten}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 2. PHẦN ĐÁY: AVATAR & THÔNG TIN NGƯỜI DÙNG                     */}
      {/* ============================================================== */}
      <div className="px-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition">
          {/* Ô tròn Avatar kèm chấm xanh Online */}
          <div className="relative shrink-0">
            {nguoiDung?.avatar && !loiAnhAvatar ? (
              <img
                src={nguoiDung.avatar}
                alt={nguoiDung.ten}
                referrerPolicy="no-referrer"
                onError={() => setLoiAnhAvatar(true)}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#f1f2ff] text-[#1a91f0] flex items-center justify-center font-bold text-xs border border-[#d9deeb]">
                {chuCaiDau}
              </div>
            )}
            {/* Chấm xanh trạng thái trực tuyến */}
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/20"
              title="Đang hoạt động"
            />
          </div>

          {/* Khi mở rộng: Hiện tên người dùng và nút Đăng Xuất */}
          {dangMoRong && (
            <div className="min-w-0 flex-1 flex items-center justify-between gap-1 overflow-hidden transition-all duration-200">
              <div className="min-w-0 pr-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {nguoiDung?.ten || 'Người Dùng'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {nguoiDung?.email || 'Trực tuyến'}
                </p>
              </div>

              {onDangXuat && (
                <button
                  type="button"
                  onClick={onDangXuat}
                  title="Đăng Xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ThanhTaskbar;
