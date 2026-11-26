import React, { useRef, useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  ShieldCheck,
  Camera,
  Upload,
  Check,
  Plus,
  Trash2,
  GripVertical,
  EyeOff,
  LayoutList,
  LayoutTemplate,
  LayoutGrid,
  Loader2,
  PenLine,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  Boxes,
  Palette,
  Globe,
  AlignVerticalSpaceAround,
  Type,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import {
  useKhoLuuTruCV,
  BAN_DICH_NGON_NGU,
  DANH_SACH_HINH_NEN,
} from '../../store/khoLuuTruCV';
import { ModalChecklistLoiCV } from './ModalChecklistLoiCV';
import {
  DANH_SACH_MAU_CV,
  NHAN_PHONG_CACH,
  NHAN_NGON_NGU,
  type LoaiPhongCachCV,
  type NgonNguMauCV,
} from '../kho-mau/KhoCVMau';

export interface KhoiConfig {
  id: string;
  ten: string;
  moTa: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

export const DANH_SACH_KHOI: KhoiConfig[] = [
  {
    id: 'gioi-thieu',
    ten: 'Giới Thiệu Bản Thân',
    moTa: 'Tóm tắt mục tiêu, đam mê và thế mạnh',
    icon: User,
  },
  {
    id: 'kinh-nghiem',
    ten: 'Kinh Nghiệm Làm Việc',
    moTa: 'Quá trình công tác, vị trí và thành tích',
    icon: Briefcase,
  },
  {
    id: 'hoc-van',
    ten: 'Học Vấn & Bằng Cấp',
    moTa: 'Trường học, ngành học, xếp loại và GPA',
    icon: GraduationCap,
  },
  {
    id: 'ky-nang',
    ten: 'Kỹ Năng Chuyên Môn',
    moTa: 'Kỹ năng chuyên ngành, kỹ năng mềm và công cụ',
    icon: Award,
  },
  {
    id: 'du-an',
    ten: 'Dự Án Nổi Bật',
    moTa: 'Các dự án thực tế, vai trò và công nghệ',
    icon: FolderGit2,
  },
  {
    id: 'chung-chi',
    ten: 'Chứng Chỉ & Giải Thưởng',
    moTa: 'Chứng chỉ ngoại ngữ, chuyên môn và thành tích',
    icon: ShieldCheck,
  },
];

// Item khối có thể kéo từ Sidebar sang A4
interface DraggableKhoiItemProps {
  khoi: KhoiConfig;
  dangHienThi: boolean;
  onThem: (id: string) => void;
  onXoa: (id: string) => void;
}

const DraggableKhoiItem: React.FC<DraggableKhoiItemProps> = ({
  khoi,
  dangHienThi,
  onThem,
  onXoa,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-khoi-${khoi.id}`,
    disabled: dangHienThi,
  });

  const Icon = khoi.icon;

  if (dangHienThi) {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <Icon size={14} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{khoi.ten}</p>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Đang hiển thị
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onXoa(khoi.id)}
          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
          title="Ẩn khỏi CV"
        >
          <EyeOff size={14} strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all ${
        isDragging ? 'opacity-30 scale-95 ring-2 ring-[#1a91f0]' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2.5 flex-1 cursor-grab active:cursor-grabbing min-w-0"
        title="Bấm giữ và kéo thả sang tờ A4"
      >
        <span className="text-slate-300 group-hover:text-slate-500 transition shrink-0">
          <GripVertical size={15} strokeWidth={1.75} />
        </span>
        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#1a91f0] border border-slate-200/70 flex items-center justify-center shrink-0 transition-colors">
          <Icon size={14} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition truncate">
            {khoi.ten}
          </p>
          <p className="text-[10px] text-slate-400 truncate">{khoi.moTa}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onThem(khoi.id)}
        className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#1a91f0] bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer shrink-0"
        title="Thêm khối này vào CV"
      >
        <Plus size={12} strokeWidth={2} />
        <span>Thêm</span>
      </button>
    </div>
  );
};

export const SidebarKhoi: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tabHienTai, setTabHienTai] = useState<
    'thanh-phan' | 'thiet-ke-nen' | 'doi-mau' | 'cau-truc' | 'goi-y-viet'
  >('thanh-phan');
  const [moThemTuyChinh, setMoThemTuyChinh] = useState(false);
  const [tenKhoiTuyChinh, setTenKhoiTuyChinh] = useState('');
  const [moModalChecklist, setMoModalChecklist] = useState(false);
  const [mucGoiYChon, setMucGoiYChon] = useState<string>('tat-ca');
  const [khoiDangKeo, setKhoiDangKeo] = useState<string | null>(null);
  const [mucDichKeo, setMucDichKeo] = useState<string | null>(null);
  const [locPhongCachMau, setLocPhongCachMau] = useState<LoaiPhongCachCV | 'tat-ca'>('tat-ca');
  const [locNgonNguMau, setLocNgonNguMau] = useState<NgonNguMauCV | 'tat-ca'>('tat-ca');

  const {
    cv,
    dangDichCV,
    mauCVHienTai,
    capNhatThongTinCaNhan,
    batTatKhoi,
    sapXepKhoi,
    doiCotKhoi,
    diChuyenKhoiLenXuong,
    chuyenKhoiSangCot,
    chuyenCheDoBoCuc,
    apDungMauCV,
    themKhoiTuyChinh,
    xoaKhoiTuyChinh,
    themCotMoi,
    xoaCot,
    doiMauChuDao,
    doiFontChu,
    doiCoChu,
    doiNgonNguCV,
    doiHinhNenCV,
    doiKhoangCachDong,
  } = useKhoLuuTruCV();

  const { thongTinCaNhan, anHienKhoi, thuTuKhoi, dinhDang, khoiTuyChinh, boCuc } = cv;
  const avatarUrl = thongTinCaNhan.avatarUrl || '';
  const danhSachCot = boCuc?.danhSachCot || [];
  const laCheDoNhieuCot = boCuc?.cheDo !== '1-cot' && danhSachCot.length > 1;

  const danhSachKhoiHienThi = (thuTuKhoi || []).filter(
    (id) => anHienKhoi[id] !== false
  );

  // Cuộn mượt đến khối trên trang A4 và nhấp nháy hiệu ứng
  const cuonToiKhoi = (id: string) => {
    const el = document.getElementById(`cv-khoi-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-[#1a91f0]/60');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-[#1a91f0]/60');
      }, 1400);
    }
  };

  const layTenKhoi = (id: string) => {
    const standard = DANH_SACH_KHOI.find((k) => k.id === id);
    if (standard) return standard.ten;
    const custom = (khoiTuyChinh || []).find((k) => k.id === id);
    if (custom) return custom.tieuDe || 'Mục tùy chỉnh';
    return id;
  };

  // Xử lý upload ảnh từ máy tính
  const handleChonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP)!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        capNhatThongTinCaNhan({ avatarUrl: result });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Kéo thả file ảnh trực tiếp vào box Avatar trên Sidebar
  const handleDropAnh = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          capNhatThongTinCaNhan({ avatarUrl: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Thêm một khối vào CV
  const handleThemKhoi = (khoiId: string) => {
    batTatKhoi(khoiId, true);
    if (laCheDoNhieuCot && danhSachCot.length > 0) {
      chuyenKhoiSangCot(khoiId, danhSachCot[danhSachCot.length - 1].id);
    } else {
      if (!thuTuKhoi.includes(khoiId)) {
        sapXepKhoi([...thuTuKhoi, khoiId]);
      }
    }
  };

  // Ẩn / Xóa một khối khỏi CV
  const handleXoaKhoi = (khoiId: string) => {
    batTatKhoi(khoiId, false);
  };

  // Xử lý thêm mục tùy chỉnh mới
  const handleXacNhanThemTuyChinh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenKhoiTuyChinh.trim()) return;
    themKhoiTuyChinh(tenKhoiTuyChinh.trim());
    setTenKhoiTuyChinh('');
    setMoThemTuyChinh(false);
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[372px] shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-auto lg:h-[calc(100vh-53px)] overflow-y-auto select-none print:hidden">
      {/* ========================================================================= */}
      {/* TABS CHUYỂN ĐỔI: THÀNH PHẦN | THIẾT KẾ | ĐỔI MẪU | BỐ CỤC | GỢI Ý         */}
      {/* ========================================================================= */}
      <div className="p-2 border-b border-slate-200/80 bg-white sticky top-0 z-10">
        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'thanh-phan' as const, nhan: 'Mục CV', icon: Boxes, title: 'Kho Thành Phần CV' },
            { id: 'thiet-ke-nen' as const, nhan: 'Thiết kế', icon: Palette, title: 'Ngôn ngữ, Nền & Font chữ' },
            { id: 'doi-mau' as const, nhan: 'Đổi mẫu', icon: LayoutTemplate, title: 'Đổi mẫu CV giữ nguyên nội dung' },
            { id: 'cau-truc' as const, nhan: 'Bố cục', icon: LayoutGrid, title: 'Tùy chỉnh bố cục trực quan' },
            { id: 'goi-y-viet' as const, nhan: 'Gợi ý', icon: PenLine, title: 'Gợi ý viết & Kiểm tra lỗi ATS' },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = tabHienTai === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabHienTai(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[10.5px] font-semibold transition cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={tab.title}
              >
                <Icon
                  size={15}
                  strokeWidth={1.8}
                  className={active ? 'text-[#1a91f0]' : ''}
                />
                <span className="leading-tight whitespace-nowrap">{tab.nhan}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* ======================================================================= */}
        {/* TAB 1: KHO THÀNH PHẦN & UPLOAD AVATAR                                   */}
        {/* ======================================================================= */}
        {tabHienTai === 'thanh-phan' ? (
          <>
            {/* Header Thành Phần */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <LayoutList size={15} strokeWidth={1.75} className="text-slate-500" />
                <span>Kho Thành Phần CV</span>
              </h2>
            </div>

            {/* KHỐI 1: UPLOAD ẢNH ĐẠI DIỆN */}
            <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Camera size={14} strokeWidth={1.75} className="text-slate-500" />
                  Ảnh Đại Diện (Avatar)
                </span>
                {avatarUrl && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                    Đã có ảnh
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleChonFile}
                className="hidden"
              />

              {avatarUrl ? (
                <div className="flex items-center gap-3.5">
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', avatarUrl);
                    }}
                    className="relative group w-20 h-20 rounded-full overflow-hidden ring-2 ring-white shadow-sm border border-slate-200 shrink-0 cursor-grab active:cursor-grabbing"
                    title="Kéo ảnh này thả trực tiếp vào Header trang A4"
                  >
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-medium text-center p-1">
                      Kéo vào A4
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1a91f0] bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg transition cursor-pointer"
                    >
                      <Upload size={13} strokeWidth={1.75} />
                      <span>Thay ảnh khác</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => capNhatThongTinCaNhan({ avatarUrl: '' })}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 py-1.5 px-3 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 size={13} strokeWidth={1.75} />
                      <span>Xóa ảnh</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropAnh}
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-slate-300 hover:border-[#1a91f0] bg-white hover:bg-slate-50/70 rounded-xl p-4 text-center cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 mx-auto rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#1a91f0] flex items-center justify-center mb-2 transition">
                    <Upload size={16} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition">
                    Chọn ảnh từ máy tính
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* KHỐI 2: CÁC KHỐI CHUẨN */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Khối Nội Dung Chuẩn
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">
                  {DANH_SACH_KHOI.filter((k) => anHienKhoi[k.id] !== false).length} / {DANH_SACH_KHOI.length} Đang bật
                </span>
              </div>

              <div className="space-y-2">
                {DANH_SACH_KHOI.map((khoi) => {
                  const dangHienThi = anHienKhoi[khoi.id] !== false;
                  return (
                    <DraggableKhoiItem
                      key={khoi.id}
                      khoi={khoi}
                      dangHienThi={dangHienThi}
                      onThem={handleThemKhoi}
                      onXoa={handleXoaKhoi}
                    />
                  );
                })}
              </div>
            </div>

            {/* KHỐI 3: MỤC TÙY CHỈNH */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-[#1a91f0]" />
                  <span>Mục Tùy Chỉnh</span>
                </h3>
                {khoiTuyChinh && khoiTuyChinh.length > 0 && (
                  <span className="text-[10px] font-semibold text-slate-400">
                    {khoiTuyChinh.length} mục
                  </span>
                )}
              </div>

              {khoiTuyChinh && khoiTuyChinh.length > 0 && (
                <div className="space-y-2 mb-3">
                  {khoiTuyChinh.map((item) => {
                    const dangHienThi = anHienKhoi[item.id] !== false;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="p-1 rounded-lg bg-blue-50 text-[#1a91f0] shrink-0">
                            <Layers size={13} />
                          </span>
                          <p className="text-xs font-semibold truncate">
                            {item.tieuDe || 'Mục tùy chỉnh'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              dangHienThi ? handleXoaKhoi(item.id) : handleThemKhoi(item.id)
                            }
                            className={`p-1 rounded transition text-[11px] ${
                              dangHienThi
                                ? 'text-emerald-600 hover:text-slate-400'
                                : 'text-[#1a91f0] hover:text-blue-700'
                            }`}
                            title={dangHienThi ? 'Ẩn khỏi CV' : 'Hiện trên CV'}
                          >
                            {dangHienThi ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => xoaKhoiTuyChinh(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Xóa hẳn mục này"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {moThemTuyChinh ? (
                <form
                  onSubmit={handleXacNhanThemTuyChinh}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
                >
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Tên mục tùy chỉnh mới:
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={tenKhoiTuyChinh}
                    onChange={(e) => setTenKhoiTuyChinh(e.target.value)}
                    placeholder="VD: Hoạt động xã hội, Sở thích..."
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1a91f0]"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMoThemTuyChinh(false);
                        setTenKhoiTuyChinh('');
                      }}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 rounded transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={!tenKhoiTuyChinh.trim()}
                      className="flex items-center gap-1 px-3 py-1 bg-[#1a91f0] hover:bg-blue-600 text-white rounded text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Thêm</span>
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setMoThemTuyChinh(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-blue-400/80 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-[#1a91f0] text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Thêm mục tùy chỉnh</span>
                </button>
              )}
            </div>
          </>
        ) : tabHienTai === 'thiet-ke-nen' ? (
          /* ======================================================================= */
          /* TAB 2: THIẾT KẾ & HÌNH NỀN CV (NGÔN NGỮ, BACKGROUND, SPACING, FONT)    */
          /* ======================================================================= */
          <div className="space-y-6">
            {/* Header Thiết Kế & Nền */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Palette size={16} className="text-[#1a91f0]" />
                  <span>Thiết Kế & Nền CV</span>
                </h2>
              </div>
            </div>

            {/* 1. NGÔN NGỮ CV */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  {dangDichCV ? (
                    <Loader2 size={13} className="animate-spin text-[#1a91f0]" />
                  ) : (
                    <Globe size={13} strokeWidth={1.75} className="text-[#1a91f0]" />
                  )}
                  <span>Ngôn Ngữ CV</span>
                </h3>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                  {dangDichCV ? 'Đang dịch toàn bộ...' : 'Dịch tiêu đề & nội dung'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BAN_DICH_NGON_NGU).map(([langKey, langVal]) => {
                  const dangChon = (dinhDang.ngonNgu || 'vi') === langKey;
                  const tenNgonNgu =
                    langKey === 'vi'
                      ? 'Tiếng Việt'
                      : langKey === 'en'
                      ? 'Tiếng Anh'
                      : langKey === 'ja'
                      ? 'Tiếng Nhật'
                      : langKey === 'zh'
                      ? 'Tiếng Trung'
                      : langKey === 'ko'
                      ? 'Tiếng Hàn'
                      : langKey === 'fr'
                      ? 'Tiếng Pháp'
                      : langKey === 'de'
                      ? 'Tiếng Đức'
                      : langKey === 'es'
                      ? 'Tiếng TBN'
                      : langVal.tenHienThi;
                  const maCode = langKey.toUpperCase();

                  return (
                    <button
                      key={langKey}
                      type="button"
                      disabled={dangDichCV}
                      onClick={() => doiNgonNguCV(langKey)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer disabled:opacity-60 ${
                        dangChon
                          ? 'bg-blue-50/70 border-[#1a91f0] text-slate-900 ring-2 ring-[#1a91f0]/15 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            dangChon
                              ? 'bg-[#1a91f0] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {maCode}
                        </span>
                        <span>{tenNgonNgu}</span>
                      </div>
                      {dangChon && <Check size={14} strokeWidth={2} className="text-[#1a91f0]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. HÌNH NỀN CV (CANVAS BACKGROUNDS) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={14} className="text-[#1a91f0]" />
                  <span>Hình Nền CV</span>
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">
                  {DANH_SACH_HINH_NEN.length} mẫu nền
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Họa tiết nền mỹ thuật cho trang A4. Tối ưu khi in ấn và chuẩn quét ATS.
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {DANH_SACH_HINH_NEN.map((bg) => {
                  const dangChon = (dinhDang.hinhNen || 'trang-tron') === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => doiHinhNenCV(bg.id)}
                      className={`group relative flex flex-col items-center p-1 rounded-xl border transition-all cursor-pointer ${
                        dangChon
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-xs'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-2xs'
                      }`}
                      title={`${bg.ten}: ${bg.moTa}`}
                    >
                      <div
                        className={`w-full h-14 rounded-lg border border-slate-200/80 flex items-center justify-center transition-all ${
                          bg.previewClass
                        } ${dangChon ? 'scale-[1.02]' : 'group-hover:scale-105'}`}
                      >
                        {dangChon && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] font-semibold text-slate-700 truncate w-full text-center mt-1">
                        {bg.ten}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. KHOẢNG CÁCH DÒNG (LINE HEIGHT) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlignVerticalSpaceAround size={14} className="text-[#1a91f0]" />
                  <span>Khoảng Cách Dòng</span>
                </h3>
                <span className="text-xs font-extrabold text-[#1a91f0] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {dinhDang.khoangCachDong || 1.45}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={dinhDang.khoangCachDong || 1.45}
                  onChange={(e) => doiKhoangCachDong(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1a91f0]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                  <span>1.0 (Khít)</span>
                  <span>1.35 (Chuẩn ATS)</span>
                  <span>1.6 (Thoáng)</span>
                  <span>2.0 (Rộng)</span>
                </div>

                {/* Nút bấm khoảng cách dòng nhanh */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { nhan: 'Chặt chẽ', val: 1.15 },
                    { nhan: 'Chuẩn', val: 1.35 },
                    { nhan: 'Thoáng', val: 1.5 },
                    { nhan: 'Rộng', val: 1.7 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => doiKhoangCachDong(preset.val)}
                      className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border transition cursor-pointer text-center ${
                        dinhDang.khoangCachDong === preset.val
                          ? 'bg-[#1a91f0] text-white border-[#1a91f0]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {preset.nhan}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. FONT CHỮ */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Type size={14} className="text-[#1a91f0]" />
                  <span>Phông Chữ CV</span>
                </h3>
              </div>
              <select
                value={dinhDang.fontChu || 'Inter, sans-serif'}
                onChange={(e) => doiFontChu(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 text-slate-700 focus:outline-none focus:border-[#1a91f0] cursor-pointer shadow-2xs"
              >
                <option value="Inter, sans-serif">Inter (Hiện đại, tối ưu ATS quốc tế)</option>
                <option value="Roboto, sans-serif">Roboto (Google chuẩn văn phòng)</option>
                <option value="Montserrat, sans-serif">Montserrat (Trang nhã, nổi bật)</option>
                <option value="Merriweather, serif">Merriweather (Cổ điển, chuyên gia)</option>
                <option value="Georgia, serif">Georgia (Trang trọng, báo chí)</option>
              </select>
            </div>

            {/* 5. CỠ CHỮ */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cỡ Chữ Chuẩn
                </h3>
                <span className="text-xs font-bold text-[#1a91f0]">
                  {dinhDang.coChu || '14px'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { nhan: 'Nhỏ', sz: '12px' },
                  { nhan: 'Trung bình', sz: '14px' },
                  { nhan: 'Lớn', sz: '15px' },
                  { nhan: 'Siêu lớn', sz: '16px' },
                ].map((item) => (
                  <button
                    key={item.sz}
                    type="button"
                    onClick={() => doiCoChu(item.sz)}
                    className={`py-1.5 text-center text-xs font-bold rounded-xl border transition cursor-pointer ${
                      dinhDang.coChu === item.sz
                        ? 'bg-[#1a91f0] text-white border-[#1a91f0]'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.nhan}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. MÀU CHỦ ĐỀ */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette size={14} className="text-[#1a91f0]" />
                  <span>Màu Chủ Đề</span>
                </h3>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: dinhDang.mauChuDao }}
                />
              </div>
              <div className="flex items-center gap-2">
                {['#1a91f0', '#059669', '#1e2532', '#7c3aed', '#e11d48', '#d97706'].map(
                  (mau) => (
                    <button
                      key={mau}
                      type="button"
                      onClick={() => doiMauChuDao(mau)}
                      className={`w-7 h-7 rounded-full border transition cursor-pointer ${
                        dinhDang.mauChuDao === mau
                          ? 'scale-115 border-white ring-2 ring-blue-500 shadow-xs'
                          : 'border-slate-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: mau }}
                    />
                  )
                )}
                <label
                  className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xs hover:scale-105 transition"
                  style={{
                    background:
                      'conic-gradient(from 90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #ef4444)',
                  }}
                  title="Tự chọn màu tự do"
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
        ) : tabHienTai === 'goi-y-viet' ? (
          /* ======================================================================= */
          /* TAB 3: GỢI Ý VIẾT CV & BẢNG KIỂM TRA LỖI THƯỜNG GẶP (ATS CHECKLIST)       */
          /* ======================================================================= */
          <div className="space-y-5">
            {/* Header & Bộ lọc mục */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <PenLine size={15} strokeWidth={1.75} className="text-slate-600" />
                  <span>Gợi Ý Viết CV Chuẩn ATS</span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Chọn đề mục tương ứng bên dưới để xem hướng dẫn tối ưu:
              </p>

              {/* Selector mục */}
              <select
                value={mucGoiYChon}
                onChange={(e) => setMucGoiYChon(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-[#1a91f0] cursor-pointer shadow-2xs"
              >
                <option value="tat-ca">Hướng dẫn toàn diện</option>
                <option value="gioi-thieu">Mục tiêu & Giới thiệu bản thân</option>
                <option value="kinh-nghiem">Kinh nghiệm làm việc (Mô hình STAR)</option>
                <option value="ky-nang">Kỹ năng chuyên môn & Công cụ</option>
                <option value="hoc-van">Học vấn & Bằng cấp</option>
              </select>
            </div>

            {/* NỘI DUNG CÁCH VIẾT */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5">
              <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Cách viết</span>
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CV cơ bản cần có thông tin cá nhân, kỹ năng, học vấn và kinh nghiệm làm việc.
                Lưu ý ghi rõ tên bạn vào tiêu đề khi bấm Lưu hoặc Tải CV về máy.
              </p>

              {mucGoiYChon === 'tat-ca' && (
                <ul className="text-[11px] text-slate-600 space-y-1.5 pl-3 list-disc">
                  <li><strong>Độ dài lý tưởng:</strong> 1 đến 2 trang A4, không để trang 2 chỉ có vài dòng thừa.</li>
                  <li><strong>Thông tin liên hệ:</strong> Dùng email nghiêm túc, số điện thoại chính chủ và link LinkedIn.</li>
                  <li><strong>Thứ tự chuẩn:</strong> Luôn đặt kinh nghiệm hoặc học vấn gần đây nhất lên trên đầu.</li>
                </ul>
              )}

              {mucGoiYChon === 'gioi-thieu' && (
                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <p><strong>Công thức 3 câu:</strong></p>
                  <p className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 italic">
                    "Chuyên viên [Vị trí] với [Số năm] năm kinh nghiệm trong lĩnh vực [Chuyên môn]. Thế mạnh về [Kỹ năng then chốt]. Mục tiêu mang lại [Giá trị định lượng/Doanh thu/Hiệu suất] cho công ty."
                  </p>
                </div>
              )}

              {mucGoiYChon === 'kinh-nghiem' && (
                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <p><strong>Mô hình STAR (Google XYZ):</strong></p>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 text-slate-700">
                    <p>• <strong>Situation:</strong> Bối cảnh thử thách của dự án.</p>
                    <p>• <strong>Task:</strong> Nhiệm vụ trọng tâm bạn được giao.</p>
                    <p>• <strong>Action:</strong> Hành động cụ thể bạn đã triển khai.</p>
                    <p>• <strong>Result:</strong> Kết quả đo lường bằng con số (%, KPI, $).</p>
                  </div>
                </div>
              )}

              {mucGoiYChon === 'ky-nang' && (
                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <p>Nên có từ <strong>4 - 8 kỹ năng</strong> phân bổ đều giữa:</p>
                  <p>• <strong>Hard Skills:</strong> Công cụ, phần mềm, kỹ thuật nghề (Excel, SQL, Figma, Telesales...).</p>
                  <p>• <strong>Soft Skills:</strong> Làm việc nhóm, Đàm phán, Quản lý thời gian, Giải quyết vấn đề.</p>
                </div>
              )}

              {mucGoiYChon === 'hoc-van' && (
                <div className="text-[11px] text-slate-600 space-y-1.5">
                  <p>• Ghi rõ tên trường đầy đủ, ngành học và xếp loại tốt nghiệp.</p>
                  <p>• Nếu GPA trên 3.0 / 4.0 hoặc 7.5 / 10, hãy ghi rõ để tăng điểm uy tín.</p>
                </div>
              )}
            </div>

            {/* MỘT SỐ LỖI SAI THƯỜNG GẶP (MATCHING IMAGE 3) */}
            <div className="p-3.5 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-rose-700">
                <AlertTriangle size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Một số lỗi sai thường gặp:</h3>
              </div>

              <ul className="text-[11px] text-slate-700 space-y-2">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>Mục tiêu nghề nghiệp chung chung <em>"tìm kiếm cơ hội"</em>, <em>"thăng tiến"</em>, <em>"phát triển bản thân"</em>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>Thiếu thông tin kỹ năng trong CV.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>Kinh nghiệm làm việc hoặc hoạt động chưa có kết quả thể hiện bằng con số.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>Kinh nghiệm làm việc chưa sắp xếp từ gần nhất đến xa nhất.</span>
                </li>
              </ul>
            </div>

            {/* NÚT MỞ BẢNG KIỂM TRA LỖI THƯỜNG GẶP (CHECKLIST POPUP) */}
            <button
              type="button"
              onClick={() => setMoModalChecklist(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-800 text-slate-800 text-xs font-extrabold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <FileCheck2 size={16} className="text-[#1a91f0]" />
              <span>Xem bảng kiểm tra lỗi thường gặp</span>
            </button>
          </div>
        ) : tabHienTai === 'doi-mau' ? (
          /* ======================================================================= */
          /* TAB ĐỔI MẪU CV — ĐỒNG BỘ 100% VỚI KHO MẪU CV BÊN NGOÀI                 */
          /* ======================================================================= */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <LayoutTemplate size={15} strokeWidth={1.75} className="text-[#1a91f0]" />
                <span>Đổi Mẫu CV</span>
              </h2>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                Giữ nguyên nội dung
              </span>
            </div>

            {/* Bộ lọc 3 loại phong cách (đồng bộ Kho Mẫu bên ngoài) */}
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'tat-ca' as const, nhan: 'Tất cả' },
                { id: 'don-gian' as const, nhan: 'Đơn giản' },
                { id: 'an-tuong' as const, nhan: 'Ấn tượng' },
                { id: 'chuyen-nghiep' as const, nhan: 'Ch.nghiệp' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLocPhongCachMau(opt.id)}
                  className={`py-1.5 px-1 text-[10.5px] font-semibold rounded-lg transition cursor-pointer truncate ${
                    locPhongCachMau === opt.id
                      ? 'bg-white text-[#1a91f0] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.nhan}
                </button>
              ))}
            </div>

            {/* Bộ lọc ngôn ngữ CV */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0">
                <Globe size={13} className="text-[#1a91f0]" />
                <span>Ngôn ngữ:</span>
              </div>
              <select
                value={locNgonNguMau}
                onChange={(e) => setLocNgonNguMau(e.target.value as NgonNguMauCV | 'tat-ca')}
                className="flex-1 text-[11px] font-semibold bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-[#1a91f0] cursor-pointer"
              >
                <option value="tat-ca">Tất cả ngôn ngữ (VI, EN, JA, ZH)</option>
                <option value="vi">VI • Tiếng Việt</option>
                <option value="en">EN • Tiếng Anh</option>
                <option value="ja">JA • Tiếng Nhật</option>
                <option value="zh">ZH • Tiếng Trung</option>
              </select>
            </div>

            {(() => {
              const mauDaLoc = DANH_SACH_MAU_CV.filter((m) => {
                const khopLoai =
                  locPhongCachMau === 'tat-ca' || m.loaiPhongCach === locPhongCachMau;
                const khopNN =
                  locNgonNguMau === 'tat-ca' || m.ngonNgu === locNgonNguMau;
                return khopLoai && khopNN;
              });

              if (mauDaLoc.length === 0) {
                return (
                  <div className="p-5 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <p className="text-xs font-semibold text-slate-600">
                      Chưa có mẫu cho bộ lọc này
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setLocPhongCachMau('tat-ca');
                        setLocNgonNguMau('tat-ca');
                      }}
                      className="text-[11px] font-bold text-[#1a91f0] hover:underline cursor-pointer"
                    >
                      Xem tất cả mẫu
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-2.5">
                  {mauDaLoc.map((mau) => {
                    const dangDung =
                      mauCVHienTai === mau.mauHeThongId &&
                      (dinhDang.ngonNgu || 'vi') === mau.ngonNgu;
                    const infoNN = NHAN_NGON_NGU[mau.ngonNgu];
                    const infoLoai = NHAN_PHONG_CACH[mau.loaiPhongCach];

                    return (
                      <button
                        key={mau.id}
                        type="button"
                        disabled={dangDichCV}
                        onClick={() => {
                          apDungMauCV(mau.mauHeThongId, true);
                          if ((dinhDang.ngonNgu || 'vi') !== mau.ngonNgu) {
                            doiNgonNguCV(mau.ngonNgu);
                          }
                        }}
                        className={`group text-left rounded-xl border p-2 transition-all cursor-pointer flex flex-col gap-2 disabled:opacity-60 ${
                          dangDung
                            ? 'border-[#1a91f0] bg-blue-50/40 ring-2 ring-[#1a91f0]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                        }`}
                      >
                        {/* Thumbnail (hỗ trợ ảnh thật khi Admin upload hoặc wireframe mặc định) */}
                        <div className="w-full h-28 rounded-lg bg-slate-50 border border-slate-200/80 p-2 flex flex-col justify-between relative overflow-hidden">
                          {mau.hinhAnhPreview ? (
                            <img
                              src={mau.hinhAnhPreview}
                              alt={mau.ten}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="pt-3">
                              <div className="flex items-center gap-1.5 mb-2">
                                <div
                                  className="w-4 h-4 rounded-full shrink-0"
                                  style={{
                                    backgroundColor: `${mau.mauChuDao}25`,
                                    border: `1.5px solid ${mau.mauChuDao}`,
                                  }}
                                />
                                <div className="flex-1 space-y-1">
                                  <div
                                    className="h-1.5 rounded-full w-3/4"
                                    style={{ backgroundColor: mau.mauChuDao }}
                                  />
                                  <div className="h-1 rounded-full bg-slate-300 w-1/2" />
                                </div>
                              </div>

                              {mau.kieuCot === '1-cot' ? (
                                <div className="space-y-1.5">
                                  <div className="h-1 bg-slate-200 rounded w-full" />
                                  <div className="h-1 bg-slate-200 rounded w-5/6" />
                                  <div className="h-1 bg-slate-200 rounded w-4/5" />
                                </div>
                              ) : mau.kieuCot === '3-cot' ? (
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="space-y-1">
                                    <div className="h-1 rounded bg-slate-300 w-full" />
                                    <div className="h-1 rounded bg-slate-200 w-4/5" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-1 rounded bg-slate-300 w-full" />
                                    <div className="h-1 rounded bg-slate-200 w-full" />
                                  </div>
                                  <div className="space-y-1">
                                    <div className="h-1 rounded bg-slate-300 w-full" />
                                    <div className="h-1 rounded bg-slate-200 w-4/5" />
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`grid gap-1.5 ${
                                    mau.kieuCot === '2-cot-deu' ? 'grid-cols-2' : 'grid-cols-12'
                                  }`}
                                >
                                  <div
                                    className={`space-y-1 ${
                                      mau.kieuCot === '2-cot-deu' ? '' : 'col-span-4'
                                    }`}
                                  >
                                    <div className="h-1 rounded bg-slate-300 w-full" />
                                    <div className="h-1 rounded bg-slate-200 w-3/4" />
                                  </div>
                                  <div
                                    className={`space-y-1 ${
                                      mau.kieuCot === '2-cot-deu' ? '' : 'col-span-8'
                                    }`}
                                  >
                                    <div className="h-1 rounded bg-slate-300 w-4/5" />
                                    <div className="h-1 rounded bg-slate-200 w-full" />
                                    <div className="h-1 rounded bg-slate-200 w-3/4" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Nhãn ngôn ngữ nhỏ góc trên trái */}
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-white/95 border border-slate-200/80 text-[9px] font-bold text-[#1a91f0] leading-none">
                            {infoNN.ma}
                          </span>

                          {dangDung && (
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                              <Check size={9} strokeWidth={3} />
                            </span>
                          )}
                        </div>

                        <div className="px-0.5">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{mau.ten}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {infoLoai.ten} • {mau.soCot}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ) : (
          /* ======================================================================= */
          /* TAB BỐ CỤC TRỰC QUAN KIỂU SƠ ĐỒ WIREFRAME (NHƯ MẪU TOPCV)              */
          /* ======================================================================= */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid size={15} strokeWidth={1.75} className="text-[#1a91f0]" />
                <span>Tùy Chỉnh Bố Cục</span>
              </h2>
              <button
                type="button"
                onClick={themCotMoi}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-semibold transition cursor-pointer shrink-0"
                title="Thêm 1 cột mới vào bố cục CV"
              >
                <Plus size={12} strokeWidth={2} />
                <span>Thêm cột</span>
              </button>
            </div>

            {/* Chọn nhanh số cột */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: '1-cot' as const, nhan: '1 Cột', active: !laCheDoNhieuCot },
                { id: '2-cot' as const, nhan: '2 Cột', active: laCheDoNhieuCot && danhSachCot.length === 2 },
                { id: '3-cot' as const, nhan: '3 Cột', active: laCheDoNhieuCot && danhSachCot.length >= 3 },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => chuyenCheDoBoCuc(opt.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    opt.active
                      ? 'bg-white text-[#1a91f0] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.nhan}
                </button>
              ))}
            </div>

            {/* Hướng dẫn ngắn gọn */}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Kéo thả trực tiếp hoặc bấm nút mũi tên để di chuyển lên/xuống và đổi cột cho từng mục.
            </p>

            {/* 1. SƠ ĐỒ WIREFRAME PHẦN ĐẦU CV (ẢNH ĐẠI DIỆN | DANH THIẾP / THÔNG TIN CÁ NHÂN) */}
            <div className="bg-slate-100/90 rounded-xl p-2.5 border border-slate-200/80">
              <div className="flex items-stretch gap-2">
                <div className="w-[30%] bg-white rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-center p-2 text-center min-h-[76px]">
                  <span className="text-[11px] font-medium text-slate-600 leading-tight">
                    Ảnh đại diện
                  </span>
                </div>

                {/* Vạch chia dọc có tay nắm giữa giống mẫu */}
                <div className="flex flex-col items-center justify-center px-0.5 shrink-0">
                  <div className="w-[2px] flex-1 bg-slate-300/80 rounded-full" />
                  <div className="w-1.5 h-5 rounded-full bg-slate-400/80 my-1" />
                  <div className="w-[2px] flex-1 bg-slate-300/80 rounded-full" />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs py-2.5 px-2 text-center text-xs font-medium text-slate-700">
                    Danh thiếp
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs py-2.5 px-2 text-center text-xs font-medium text-slate-700">
                    Thông tin cá nhân
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SƠ ĐỒ WIREFRAME PHẦN THÂN CV (CÁC KHỐI XẾP THEO CỘT THỰC TẾ) */}
            <div className="bg-slate-100/90 rounded-xl p-2.5 border border-slate-200/80">
              {laCheDoNhieuCot ? (
                <div className="flex items-stretch gap-1.5">
                  {danhSachCot.map((cot, colIdx) => {
                    const khoiHienThiTrongCot = (cot.khoiIds || []).filter(
                      (id) => anHienKhoi[id] !== false
                    );
                    const dangHoverCot = mucDichKeo === `cot-${cot.id}`;
                    return (
                      <React.Fragment key={cot.id}>
                        {colIdx > 0 && (
                          <div className="flex flex-col items-center justify-center px-0.5 shrink-0">
                            <div className="w-[2px] flex-1 bg-slate-300/80 rounded-full" />
                            <div className="w-1.5 h-5 rounded-full bg-slate-400/80 my-1" />
                            <div className="w-[2px] flex-1 bg-slate-300/80 rounded-full" />
                          </div>
                        )}
                        <div
                          style={{ width: `${cot.doRong}%` }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (khoiDangKeo) setMucDichKeo(`cot-${cot.id}`);
                          }}
                          onDragLeave={() => {
                            if (mucDichKeo === `cot-${cot.id}`) setMucDichKeo(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (khoiDangKeo) {
                              chuyenKhoiSangCot(khoiDangKeo, cot.id);
                            }
                            setKhoiDangKeo(null);
                            setMucDichKeo(null);
                          }}
                          className={`min-w-0 flex flex-col gap-2 rounded-lg p-1 -m-1 transition ${
                            dangHoverCot ? 'bg-blue-100/60 ring-2 ring-[#1a91f0]/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                              {cot.ten} ({cot.doRong}%)
                            </span>
                            {danhSachCot.length > 1 && (
                              <button
                                type="button"
                                onClick={() => xoaCot(cot.id)}
                                className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                                title={`Xóa ${cot.ten}`}
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>

                          {khoiHienThiTrongCot.length === 0 ? (
                            <div className="py-5 px-2 text-center border border-dashed border-slate-300 rounded-lg text-[10px] text-slate-400 bg-white/60">
                              Kéo khối vào đây
                            </div>
                          ) : (
                            khoiHienThiTrongCot.map((khoiId, itemIdx) => (
                              <div
                                key={khoiId}
                                draggable
                                onDragStart={(e) => {
                                  setKhoiDangKeo(khoiId);
                                  e.dataTransfer.effectAllowed = 'move';
                                }}
                                onDragEnd={() => {
                                  setKhoiDangKeo(null);
                                  setMucDichKeo(null);
                                }}
                                onClick={() => cuonToiKhoi(khoiId)}
                                className={`group relative bg-white hover:border-[#1a91f0] rounded-lg border border-slate-200/90 shadow-2xs py-2.5 px-2 cursor-grab active:cursor-grabbing transition ${
                                  khoiDangKeo === khoiId ? 'opacity-45 scale-[0.98]' : ''
                                }`}
                                title="Kéo thả sang cột khác hoặc bấm để định vị trên trang A4"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <GripVertical size={12} className="text-slate-300 shrink-0" />
                                  <p className="text-[11px] font-semibold text-slate-700 truncate">
                                    {layTenKhoi(khoiId)}
                                  </p>
                                </div>

                                {/* Thanh nút di chuyển luôn hiển thị rõ ràng */}
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-center gap-1"
                                >
                                  <button
                                    type="button"
                                    disabled={itemIdx === 0}
                                    onClick={() => diChuyenKhoiLenXuong(khoiId, 'len')}
                                    className="p-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1a91f0] border border-slate-200/80 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition"
                                    title="Đẩy lên trên"
                                  >
                                    <ChevronUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={itemIdx === khoiHienThiTrongCot.length - 1}
                                    onClick={() => diChuyenKhoiLenXuong(khoiId, 'xuong')}
                                    className="p-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1a91f0] border border-slate-200/80 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition"
                                    title="Đẩy xuống dưới"
                                  >
                                    <ChevronDown size={12} />
                                  </button>

                                  {danhSachCot.length === 2 ? (
                                    <button
                                      type="button"
                                      onClick={() => doiCotKhoi(khoiId)}
                                      className="p-1 rounded bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 cursor-pointer transition"
                                      title={colIdx === 0 ? 'Chuyển sang cột phải' : 'Chuyển sang cột trái'}
                                    >
                                      <ArrowLeftRight size={12} />
                                    </button>
                                  ) : (
                                    <>
                                      {colIdx > 0 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            chuyenKhoiSangCot(khoiId, danhSachCot[colIdx - 1].id)
                                          }
                                          className="p-1 rounded bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 cursor-pointer transition"
                                          title="Chuyển sang cột trái"
                                        >
                                          <ChevronLeft size={12} />
                                        </button>
                                      )}
                                      {colIdx < danhSachCot.length - 1 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            chuyenKhoiSangCot(khoiId, danhSachCot[colIdx + 1].id)
                                          }
                                          className="p-1 rounded bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200/80 cursor-pointer transition"
                                          title="Chuyển sang cột phải"
                                        >
                                          <ChevronRight size={12} />
                                        </button>
                                      )}
                                    </>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => batTatKhoi(khoiId, false)}
                                    className="p-1 rounded bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 cursor-pointer transition"
                                    title="Ẩn khỏi CV"
                                  >
                                    <EyeOff size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {danhSachKhoiHienThi.length === 0 ? (
                    <div className="py-5 text-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs bg-white/50">
                      Chưa có khối nào hiển thị
                    </div>
                  ) : (
                    danhSachKhoiHienThi.map((khoiId, itemIdx) => {
                      const dangHover = mucDichKeo === khoiId && khoiDangKeo !== khoiId;
                      return (
                        <div
                          key={khoiId}
                          draggable
                          onDragStart={(e) => {
                            setKhoiDangKeo(khoiId);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (khoiDangKeo && khoiDangKeo !== khoiId) {
                              setMucDichKeo(khoiId);
                            }
                          }}
                          onDragLeave={() => {
                            if (mucDichKeo === khoiId) setMucDichKeo(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (khoiDangKeo && khoiDangKeo !== khoiId) {
                              const danhSachMoi = [...(thuTuKhoi || [])];
                              const oldIdx = danhSachMoi.indexOf(khoiDangKeo);
                              const newIdx = danhSachMoi.indexOf(khoiId);
                              if (oldIdx !== -1 && newIdx !== -1) {
                                danhSachMoi.splice(oldIdx, 1);
                                danhSachMoi.splice(newIdx, 0, khoiDangKeo);
                                sapXepKhoi(danhSachMoi);
                              }
                            }
                            setKhoiDangKeo(null);
                            setMucDichKeo(null);
                          }}
                          onDragEnd={() => {
                            setKhoiDangKeo(null);
                            setMucDichKeo(null);
                          }}
                          onClick={() => cuonToiKhoi(khoiId)}
                          className={`group relative bg-white hover:border-[#1a91f0] rounded-lg border shadow-2xs py-2.5 px-2.5 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing transition ${
                            dangHover
                              ? 'border-[#1a91f0] ring-2 ring-[#1a91f0]/30 bg-blue-50/40'
                              : 'border-slate-200/90'
                          } ${khoiDangKeo === khoiId ? 'opacity-45 scale-[0.98]' : ''}`}
                          title="Kéo thả lên/xuống hoặc bấm nút mũi tên để đổi vị trí"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GripVertical size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {layTenKhoi(khoiId)}
                            </span>
                          </div>

                          {/* Luôn hiển thị các nút di chuyển lên/xuống & ẩn */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 shrink-0"
                          >
                            <button
                              type="button"
                              disabled={itemIdx === 0}
                              onClick={() => diChuyenKhoiLenXuong(khoiId, 'len')}
                              className="p-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1a91f0] border border-slate-200/80 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition"
                              title="Đẩy lên trên"
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              type="button"
                              disabled={itemIdx === danhSachKhoiHienThi.length - 1}
                              onClick={() => diChuyenKhoiLenXuong(khoiId, 'xuong')}
                              className="p-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#1a91f0] border border-slate-200/80 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition"
                              title="Đẩy xuống dưới"
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => batTatKhoi(khoiId, false)}
                              className="p-1 rounded bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 cursor-pointer transition"
                              title="Ẩn khỏi CV"
                            >
                              <EyeOff size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Bảng Kiểm Tra Lỗi Thường Gặp (ATS Checklist) */}
      <ModalChecklistLoiCV
        isOpen={moModalChecklist}
        onClose={() => setMoModalChecklist(false)}
      />
    </aside>
  );
};

export default SidebarKhoi;
