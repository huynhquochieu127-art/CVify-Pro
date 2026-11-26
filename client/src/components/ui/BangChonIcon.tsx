import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Calendar,
  Star,
  Sparkles,
  Rocket,
  Code2,
  Terminal,
  Cpu,
  Database,
  Layers,
  Target,
  Compass,
  Heart,
  Flame,
  Zap,
  Trophy,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Link,
  Smartphone,
  AtSign,
  Send,
  Flag,
  Home,
  Wrench,
  Palette,
  Camera,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  BadgeCheck,
  FileText,
  Search,
  X,
} from 'lucide-react';

export interface IconItemConfig {
  id: string;
  ten: string;
  nhom: 'lien-he' | 'hoc-van-cong-viec' | 'ky-thuat' | 'bieu-tuong';
  comp?: React.ComponentType<{ size?: number; className?: string }>;
  emoji?: string;
}

export const DANH_SACH_ICON_TUY_CHINH: IconItemConfig[] = [
  // 1. Liên hệ & Cá nhân
  { id: 'Mail', ten: 'Email', nhom: 'lien-he', comp: Mail },
  { id: 'Phone', ten: 'Điện thoại', nhom: 'lien-he', comp: Phone },
  { id: 'Smartphone', ten: 'Di động', nhom: 'lien-he', comp: Smartphone },
  { id: 'MapPin', ten: 'Địa chỉ', nhom: 'lien-he', comp: MapPin },
  { id: 'Globe', ten: 'Website / Web', nhom: 'lien-he', comp: Globe },
  { id: 'Link', ten: 'Liên kết', nhom: 'lien-he', comp: Link },
  { id: 'AtSign', ten: 'Tài khoản MXH', nhom: 'lien-he', comp: AtSign },
  { id: 'Send', ten: 'Telegram / Gửi', nhom: 'lien-he', comp: Send },
  { id: 'User', ten: 'Cá nhân', nhom: 'lien-he', comp: User },
  { id: 'Calendar', ten: 'Ngày tháng', nhom: 'lien-he', comp: Calendar },
  { id: 'Home', ten: 'Quê quán', nhom: 'lien-he', comp: Home },
  { id: 'Flag', ten: 'Quốc tịch / Mục tiêu', nhom: 'lien-he', comp: Flag },
  { id: 'Heart', ten: 'Sở thích', nhom: 'lien-he', comp: Heart },
  { id: 'Camera', ten: 'Nhiếp ảnh', nhom: 'lien-he', comp: Camera },

  // 2. Học vấn & Công việc
  { id: 'GraduationCap', ten: 'Học vấn / Trường', nhom: 'hoc-van-cong-viec', comp: GraduationCap },
  { id: 'Briefcase', ten: 'Kinh nghiệm / Việc làm', nhom: 'hoc-van-cong-viec', comp: Briefcase },
  { id: 'Building2', ten: 'Công ty / Tổ chức', nhom: 'hoc-van-cong-viec', comp: Building2 },
  { id: 'BookOpen', ten: 'Chuyên ngành / Sách', nhom: 'hoc-van-cong-viec', comp: BookOpen },
  { id: 'Award', ten: 'Kỹ năng / Giải thưởng', nhom: 'hoc-van-cong-viec', comp: Award },
  { id: 'Trophy', ten: 'Thành tích / Cúp', nhom: 'hoc-van-cong-viec', comp: Trophy },
  { id: 'ShieldCheck', ten: 'Chứng chỉ', nhom: 'hoc-van-cong-viec', comp: ShieldCheck },
  { id: 'BadgeCheck', ten: 'Xác thực / GPA', nhom: 'hoc-van-cong-viec', comp: BadgeCheck },
  { id: 'Target', ten: 'Mục tiêu sự nghiệp', nhom: 'hoc-van-cong-viec', comp: Target },
  { id: 'Compass', ten: 'Định hướng', nhom: 'hoc-van-cong-viec', comp: Compass },
  { id: 'TrendingUp', ten: 'Tăng trưởng / KPI', nhom: 'hoc-van-cong-viec', comp: TrendingUp },
  { id: 'FileText', ten: 'Hồ sơ / Bài báo', nhom: 'hoc-van-cong-viec', comp: FileText },
  { id: 'Bookmark', ten: 'Dấu trang', nhom: 'hoc-van-cong-viec', comp: Bookmark },
  { id: 'MessageSquare', ten: 'Ngôn ngữ / Giao tiếp', nhom: 'hoc-van-cong-viec', comp: MessageSquare },

  // 3. Kỹ thuật & Sáng tạo
  { id: 'FolderGit2', ten: 'Dự án / Git', nhom: 'ky-thuat', comp: FolderGit2 },
  { id: 'Code2', ten: 'Lập trình / Code', nhom: 'ky-thuat', comp: Code2 },
  { id: 'Terminal', ten: 'Terminal / Dev', nhom: 'ky-thuat', comp: Terminal },
  { id: 'Cpu', ten: 'Phần cứng / AI', nhom: 'ky-thuat', comp: Cpu },
  { id: 'Database', ten: 'Cơ sở dữ liệu', nhom: 'ky-thuat', comp: Database },
  { id: 'Layers', ten: 'Kiến trúc / Đa tầng', nhom: 'ky-thuat', comp: Layers },
  { id: 'Wrench', ten: 'Công cụ / Kỹ thuật', nhom: 'ky-thuat', comp: Wrench },
  { id: 'Palette', ten: 'Thiết kế / UI-UX', nhom: 'ky-thuat', comp: Palette },
  { id: 'Sparkles', ten: 'Nổi bật / AI', nhom: 'ky-thuat', comp: Sparkles },
  { id: 'Rocket', ten: 'Khởi nghiệp / Tốc độ', nhom: 'ky-thuat', comp: Rocket },
  { id: 'Zap', ten: 'Năng lượng / Nhanh', nhom: 'ky-thuat', comp: Zap },
  { id: 'Flame', ten: 'Nhiệt huyết / Hot', nhom: 'ky-thuat', comp: Flame },
  { id: 'Lightbulb', ten: 'Sáng kiến / Ý tưởng', nhom: 'ky-thuat', comp: Lightbulb },
  { id: 'Star', ten: 'Ngôi sao / Đánh giá', nhom: 'ky-thuat', comp: Star },
  { id: 'CheckCircle2', ten: 'Hoàn thành', nhom: 'ky-thuat', comp: CheckCircle2 },

  // 4. Biểu tượng Emoji trực quan
  { id: 'emoji:🎓', ten: 'Mũ tốt nghiệp', nhom: 'bieu-tuong', emoji: '🎓' },
  { id: 'emoji:🏫', ten: 'Trường học', nhom: 'bieu-tuong', emoji: '🏫' },
  { id: 'emoji:💼', ten: 'Cặp công sở', nhom: 'bieu-tuong', emoji: '💼' },
  { id: 'emoji:🏢', ten: 'Tòa nhà công ty', nhom: 'bieu-tuong', emoji: '🏢' },
  { id: 'emoji:💻', ten: 'Laptop / IT', nhom: 'bieu-tuong', emoji: '💻' },
  { id: 'emoji:🚀', ten: 'Tên lửa dự án', nhom: 'bieu-tuong', emoji: '🚀' },
  { id: 'emoji:🏆', ten: 'Cúp vàng', nhom: 'bieu-tuong', emoji: '🏆' },
  { id: 'emoji:⭐', ten: 'Ngôi sao', nhom: 'bieu-tuong', emoji: '⭐' },
  { id: 'emoji:🔥', ten: 'Ngọn lửa', nhom: 'bieu-tuong', emoji: '🔥' },
  { id: 'emoji:🎯', ten: 'Hồng tâm mục tiêu', nhom: 'bieu-tuong', emoji: '🎯' },
  { id: 'emoji:📍', ten: 'Ghim vị trí', nhom: 'bieu-tuong', emoji: '📍' },
  { id: 'emoji:📅', ten: 'Lịch thời gian', nhom: 'bieu-tuong', emoji: '📅' },
  { id: 'emoji:📧', ten: 'Thư điện tử', nhom: 'bieu-tuong', emoji: '📧' },
  { id: 'emoji:📞', ten: 'Điện thoại bàn', nhom: 'bieu-tuong', emoji: '📞' },
  { id: 'emoji:🌐', ten: 'Quả địa cầu', nhom: 'bieu-tuong', emoji: '🌐' },
  { id: 'emoji:✅', ten: 'Tích xanh', nhom: 'bieu-tuong', emoji: '✅' },
  { id: 'emoji:💡', ten: 'Bóng đèn ý tưởng', nhom: 'bieu-tuong', emoji: '💡' },
  { id: 'emoji:📊', ten: 'Biểu đồ dữ liệu', nhom: 'bieu-tuong', emoji: '📊' },
  { id: 'emoji:🏅', ten: 'Huy chương', nhom: 'bieu-tuong', emoji: '🏅' },
  { id: 'emoji:📚', ten: 'Sách học tập', nhom: 'bieu-tuong', emoji: '📚' },
];

export interface HienThiIconTuyChinhProps {
  iconName?: string;
  fallback?: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const HienThiIconTuyChinh: React.FC<HienThiIconTuyChinhProps> = ({
  iconName,
  fallback,
  size = 14,
  className = '',
  style,
}) => {
  if (iconName) {
    if (iconName.startsWith('emoji:')) {
      const char = iconName.replace('emoji:', '');
      return (
        <span
          className={`inline-flex items-center justify-center leading-none select-none ${className}`}
          style={{ fontSize: `${size}px`, ...style }}
        >
          {char}
        </span>
      );
    }

    const found = DANH_SACH_ICON_TUY_CHINH.find((item) => item.id === iconName);
    if (found?.comp) {
      const IconComp = found.comp;
      return (
        <span className={`inline-flex items-center justify-center ${className}`} style={style}>
          <IconComp size={size} />
        </span>
      );
    }
    if (found?.emoji) {
      return (
        <span
          className={`inline-flex items-center justify-center leading-none select-none ${className}`}
          style={{ fontSize: `${size}px`, ...style }}
        >
          {found.emoji}
        </span>
      );
    }
  }

  if (React.isValidElement(fallback)) {
    return <span className={className} style={style}>{fallback}</span>;
  }

  if (typeof fallback === 'function' || (typeof fallback === 'object' && fallback !== null)) {
    const FallbackComp = fallback as React.ComponentType<{ size?: number; className?: string }>;
    return (
      <span className={`inline-flex items-center justify-center ${className}`} style={style}>
        <FallbackComp size={size} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={style}>
      <Sparkles size={size} />
    </span>
  );
};

import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';

const MAU_ICON_NHANH = [
  '#0f141e',
  '#1a91f0',
  '#2563eb',
  '#059669',
  '#7c3aed',
  '#e11d48',
  '#d97706',
  '#475569',
];

export interface NutChonIconTuyChinhProps {
  iconName?: string;
  fallback?: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  onChonIcon: (newIconName: string) => void;
  size?: number;
  mauChuDao?: string;
  styleKey?: string;
  title?: string;
  className?: string;
}

export const NutChonIconTuyChinh: React.FC<NutChonIconTuyChinhProps> = ({
  iconName,
  fallback,
  onChonIcon,
  size = 14,
  mauChuDao = '#1a91f0',
  styleKey,
  title = 'Nhấn để đổi biểu tượng & màu icon',
  className = '',
}) => {
  const { cv, capNhatKieuChu } = useKhoLuuTruCV();
  const [moPopover, setMoPopover] = useState(false);
  const [tuKhoa, setTuKhoa] = useState('');
  const [nhomChon, setNhomChon] = useState<string>('tat-ca');
  const [autoSiblingKey, setAutoSiblingKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tự động nhận diện ô input nằm cạnh icon này để đồng bộ màu chữ ⇄ màu icon
  useEffect(() => {
    if (styleKey) return;
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    const siblingInput = parent.querySelector<HTMLElement>('input[data-style-key], textarea[data-style-key]');
    if (siblingInput) {
      const k = siblingInput.getAttribute('data-style-key');
      if (k && k !== autoSiblingKey) {
        setAutoSiblingKey(k);
      }
    }
  }, [styleKey, cv, autoSiblingKey]);

  useEffect(() => {
    if (!moPopover) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMoPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moPopover]);

  const effectiveKey = styleKey || autoSiblingKey || `icon-only-${title}`;
  const iconStyleKey = `icon-color-${effectiveKey}`;

  // Ưu tiên: 1. Màu riêng của icon -> 2. Màu chữ của ô input đi kèm -> 3. Màu chủ đạo truyền vào
  const mauRiengIcon = cv.dinhDang?.kieuChuTuyChinh?.[iconStyleKey]?.mauChu;
  const mauChuInputDiKem = effectiveKey
    ? cv.dinhDang?.kieuChuTuyChinh?.[effectiveKey]?.mauChu
    : undefined;
  const mauHienThi = mauRiengIcon || mauChuInputDiKem || mauChuDao;

  const handleChonMauIcon = (mauMoi: string | undefined) => {
    capNhatKieuChu(iconStyleKey, { mauChu: mauMoi });
  };

  const danhSachLoc = DANH_SACH_ICON_TUY_CHINH.filter((item) => {
    const khopNhom = nhomChon === 'tat-ca' || item.nhom === nhomChon;
    const khopTuKhoa =
      !tuKhoa.trim() ||
      item.ten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
      item.id.toLowerCase().includes(tuKhoa.toLowerCase());
    return khopNhom && khopTuKhoa;
  });

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        data-icon-btn="true"
        onClick={(e) => {
          e.stopPropagation();
          setMoPopover((prev) => !prev);
        }}
        title={title}
        style={{ color: mauHienThi }}
        className="group/iconbtn relative inline-flex items-center justify-center p-1 -m-1 rounded-md hover:bg-blue-50/80 hover:ring-1 hover:ring-blue-300 transition cursor-pointer"
      >
        <HienThiIconTuyChinh iconName={iconName} fallback={fallback} size={size} />
      </button>

      {moPopover && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 animate-in fade-in zoom-in-95 duration-150 print:hidden select-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#1a91f0]" />
              Chọn Icon & Màu Icon
            </span>
            <button
              type="button"
              onClick={() => setMoPopover(false)}
              className="p-0.5 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>

          {/* BẢNG CHỌN MÀU RIÊNG CHO ICON NÀY */}
          <div className="mb-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-600">
                Màu của Icon này:
              </span>
              {mauRiengIcon && (
                <button
                  type="button"
                  onClick={() => handleChonMauIcon(undefined)}
                  className="text-[10px] font-semibold text-[#1a91f0] hover:underline cursor-pointer"
                >
                  Đồng bộ theo màu chữ
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-1">
              {MAU_ICON_NHANH.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleChonMauIcon(m)}
                  className={`w-4.5 h-4.5 rounded-full border transition cursor-pointer ${
                    mauHienThi === m
                      ? 'scale-120 border-slate-900 ring-2 ring-blue-400'
                      : 'border-white shadow-2xs hover:scale-110'
                  }`}
                  style={{ backgroundColor: m }}
                  title={`Đổi màu icon thành ${m}`}
                />
              ))}
              <label
                className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white hover:bg-slate-100 cursor-pointer border border-slate-300 shadow-2xs"
                title="Chọn màu icon tùy ý"
              >
                <Palette size={11} style={{ color: mauHienThi }} />
                <input
                  type="color"
                  value={mauHienThi}
                  onChange={(e) => handleChonMauIcon(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Ô tìm kiếm icon */}
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm icon (VD: trường, công ty, code...)"
              className="w-full text-[11px] pl-7 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0] focus:bg-white text-slate-700"
            />
          </div>

          {/* Bộ lọc nhóm */}
          <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-1 text-[10px]">
            {[
              { id: 'tat-ca', nhan: 'Tất cả' },
              { id: 'hoc-van-cong-viec', nhan: 'Học vấn/CV' },
              { id: 'lien-he', nhan: 'Liên hệ' },
              { id: 'ky-thuat', nhan: 'Kỹ thuật' },
              { id: 'bieu-tuong', nhan: 'Emoji' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNhomChon(tab.id)}
                className={`px-2 py-0.5 rounded-full font-semibold whitespace-nowrap transition cursor-pointer ${
                  nhomChon === tab.id
                    ? 'bg-[#1a91f0] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.nhan}
              </button>
            ))}
          </div>

          {/* Lưới các icon */}
          <div className="grid grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-0.5">
            {danhSachLoc.map((it) => {
              const dangChon = iconName === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    onChonIcon(it.id);
                    setMoPopover(false);
                  }}
                  title={it.ten}
                  style={{ color: dangChon ? mauHienThi : undefined }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition cursor-pointer ${
                    dangChon
                      ? 'bg-blue-50 border-[#1a91f0] ring-1 ring-[#1a91f0]'
                      : 'border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700'
                  }`}
                >
                  <HienThiIconTuyChinh iconName={it.id} size={16} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutChonIconTuyChinh;
