import React, { useState, useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Trash2,
  X,
  Link,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

export const KhoiThongTinCaNhan: React.FC = () => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarDragOver, setIsAvatarDragOver] = useState(false);

  const {
    cv,
    capNhatThongTinCaNhan,
    suaLienHeTuyChinh,
    xoaLienHeTuyChinh,
  } = useKhoLuuTruCV();
  const { dinhDang, thongTinCaNhan } = cv;

  const iconLienHe = thongTinCaNhan.iconLienHe || {
    email: 'Mail',
    soDienThoai: 'Phone',
    diaChi: 'MapPin',
    website: 'Globe',
  };

  const handleDoiIconLienHe = (
    key: 'email' | 'soDienThoai' | 'diaChi' | 'website',
    newIcon: string
  ) => {
    capNhatThongTinCaNhan({
      iconLienHe: {
        ...iconLienHe,
        [key]: newIcon,
      },
    });
  };

  // Chọn ảnh từ máy tính
  const handleChonAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result as string;
      if (res) capNhatThongTinCaNhan({ avatarUrl: res });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Kéo thả ảnh vào Header A4
  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsAvatarDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) capNhatThongTinCaNhan({ avatarUrl: res });
      };
      reader.readAsDataURL(file);
      return;
    }

    const droppedUrl = e.dataTransfer.getData('text/plain');
    if (droppedUrl) {
      capNhatThongTinCaNhan({ avatarUrl: droppedUrl });
    }
  };

  const kieuHoTen = dinhDang.kieuChuTuyChinh?.['input-hoTen'] || {};
  const kieuViTri = dinhDang.kieuChuTuyChinh?.['input-viTri'] || {};

  return (
    <div
      className="border-b-2 pb-5 mb-5 transition-colors"
      style={{ borderColor: dinhDang.mauChuDao }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* KHUNG AVATAR (80x80px / 88x88px) */}
        <div className="relative group shrink-0">
          {thongTinCaNhan.avatarUrl ? (
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden ring-3 ring-slate-200/90 shadow-sm bg-white">
              <img
                src={thongTinCaNhan.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 rounded-full transition cursor-pointer"
                  title="Đổi ảnh đại diện"
                >
                  <Camera size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => capNhatThongTinCaNhan({ avatarUrl: '' })}
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 rounded-full transition cursor-pointer"
                  title="Xóa ảnh đại diện"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsAvatarDragOver(true);
              }}
              onDragLeave={() => setIsAvatarDragOver(false)}
              onDrop={handleAvatarDrop}
              onClick={() => avatarInputRef.current?.click()}
              className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all print:hidden ${
                isAvatarDragOver
                  ? 'border-blue-600 bg-blue-50/80 scale-105 ring-2 ring-blue-500/30 text-blue-600'
                  : 'border-slate-300 hover:border-blue-600 bg-slate-50/60 hover:bg-blue-50/40 text-slate-400 hover:text-blue-600'
              }`}
              title="Nhấn để tải ảnh hoặc kéo ảnh vào đây"
            >
              <Camera size={20} className="mb-0.5" />
              <span className="text-[9px] font-bold leading-tight">
                Kéo ảnh vào / Tải ảnh
              </span>
            </div>
          )}

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleChonAvatarFile}
            className="hidden"
          />
        </div>

        {/* Thông tin Họ tên, Vị trí & Liên hệ bằng Icon */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
          {/* Họ và tên */}
          <AutoResizeInput
            dataStyleKey="input-hoTen"
            value={thongTinCaNhan.hoTen}
            onChange={(e) => capNhatThongTinCaNhan({ hoTen: e.target.value })}
            placeholder="HỌ VÀ TÊN CỦA BẠN"
            className="w-full text-2xl sm:text-3xl font-extrabold tracking-tight bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition text-center sm:text-left"
            style={{
              color: kieuHoTen.mauChu || dinhDang.mauChuDao,
              fontSize: kieuHoTen.coChu || undefined,
              fontWeight: kieuHoTen.inDam === false ? 500 : 800,
              fontStyle: kieuHoTen.inNghieng ? 'italic' : 'normal',
              textDecoration: kieuHoTen.gachChan ? 'underline' : 'none',
              textTransform: kieuHoTen.inHoa === false ? 'none' : 'uppercase',
            }}
          />

          {/* Vị trí ứng tuyển */}
          <AutoResizeInput
            dataStyleKey="input-viTri"
            value={thongTinCaNhan.viTriUngTuyen}
            onChange={(e) =>
              capNhatThongTinCaNhan({ viTriUngTuyen: e.target.value })
            }
            placeholder="Vị trí ứng tuyển (Ví dụ: Senior Software Engineer)"
            className="w-full text-sm font-semibold text-slate-600 bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition mt-1 text-center sm:text-left"
            style={{
              color: kieuViTri.mauChu || undefined,
              fontSize: kieuViTri.coChu || undefined,
              fontWeight: kieuViTri.inDam ? 700 : 600,
              fontStyle: kieuViTri.inNghieng ? 'italic' : 'normal',
              textDecoration: kieuViTri.gachChan ? 'underline' : 'none',
              textTransform: kieuViTri.inHoa ? 'uppercase' : 'none',
            }}
          />

          {/* Các thông tin liên hệ dùng Custom Icon thay cho chữ trường thường */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-600">
            {/* Email */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[185px]">
              <NutChonIconTuyChinh
                iconName={iconLienHe.email}
                fallback={Mail}
                onChonIcon={(ic) => handleDoiIconLienHe('email', ic)}
                size={13}
                mauChuDao={dinhDang.mauChuDao}
                styleKey="input-email"
                title="Nhấn để đổi icon & màu icon trường Email"
              />
              <AutoResizeInput
                dataStyleKey="input-email"
                value={thongTinCaNhan.email}
                onChange={(e) => capNhatThongTinCaNhan({ email: e.target.value })}
                placeholder="email@example.com"
                className="w-full text-xs bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition break-all"
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[135px]">
              <NutChonIconTuyChinh
                iconName={iconLienHe.soDienThoai}
                fallback={Phone}
                onChonIcon={(ic) => handleDoiIconLienHe('soDienThoai', ic)}
                size={13}
                mauChuDao={dinhDang.mauChuDao}
                styleKey="input-phone"
                title="Nhấn để đổi icon & màu icon trường Số điện thoại"
              />
              <AutoResizeInput
                dataStyleKey="input-phone"
                value={thongTinCaNhan.soDienThoai}
                onChange={(e) =>
                  capNhatThongTinCaNhan({ soDienThoai: e.target.value })
                }
                placeholder="0901 234 567"
                className="w-full text-xs bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition"
              />
            </div>

            {/* Địa chỉ */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[145px]">
              <NutChonIconTuyChinh
                iconName={iconLienHe.diaChi}
                fallback={MapPin}
                onChonIcon={(ic) => handleDoiIconLienHe('diaChi', ic)}
                size={13}
                mauChuDao={dinhDang.mauChuDao}
                styleKey="input-diaChi"
                title="Nhấn để đổi icon & màu icon trường Địa chỉ"
              />
              <AutoResizeInput
                dataStyleKey="input-diaChi"
                value={thongTinCaNhan.diaChi}
                onChange={(e) => capNhatThongTinCaNhan({ diaChi: e.target.value })}
                placeholder="TP. Hồ Chí Minh"
                className="w-full text-xs bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition"
              />
            </div>

            {/* Website / LinkedIn */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[165px]">
              <NutChonIconTuyChinh
                iconName={iconLienHe.website}
                fallback={Globe}
                onChonIcon={(ic) => handleDoiIconLienHe('website', ic)}
                size={13}
                mauChuDao={dinhDang.mauChuDao}
                styleKey="input-website"
                title="Nhấn để đổi icon & màu icon trường Website/LinkedIn"
              />
              <AutoResizeInput
                dataStyleKey="input-website"
                value={thongTinCaNhan.website}
                onChange={(e) => capNhatThongTinCaNhan({ website: e.target.value })}
                placeholder="linkedin.com/in/my-profile"
                className="w-full text-xs bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition break-all"
              />
            </div>

            {/* Các trường liên hệ tùy chỉnh dùng Icon do người dùng tự thêm */}
            {(thongTinCaNhan.lienHeTuyChinh || []).map((item) => (
              <div
                key={item.id}
                className="group/lh flex items-center gap-1.5 flex-1 min-w-[165px] relative"
              >
                <NutChonIconTuyChinh
                  iconName={item.iconName}
                  fallback={Link}
                  onChonIcon={(ic) => suaLienHeTuyChinh(item.id, { iconName: ic })}
                  size={13}
                  mauChuDao={dinhDang.mauChuDao}
                  styleKey={`input-${item.id}`}
                  title="Nhấn để chọn icon & màu icon cho trường này"
                />
                <AutoResizeInput
                  dataStyleKey={`input-${item.id}`}
                  value={item.giaTri}
                  onChange={(e) =>
                    suaLienHeTuyChinh(item.id, { giaTri: e.target.value })
                  }
                  placeholder={item.placeholder || 'Nhập thông tin...'}
                  className="w-full text-xs bg-transparent hover:bg-slate-50 focus:bg-white border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded transition"
                />
                <button
                  type="button"
                  onClick={() => xoaLienHeTuyChinh(item.id)}
                  className="opacity-0 group-hover/lh:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition cursor-pointer print:hidden"
                  title="Xóa trường này"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
