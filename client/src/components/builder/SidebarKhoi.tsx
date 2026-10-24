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
  HelpCircle,
  EyeOff,
  Sparkles,
  Layers,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Focus,
  Boxes,
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';

export interface KhoiConfig {
  id: string;
  ten: string;
  moTa: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
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
  mauChuDao: string;
}

const DraggableKhoiItem: React.FC<DraggableKhoiItemProps> = ({
  khoi,
  dangHienThi,
  onThem,
  onXoa,
  mauChuDao,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-khoi-${khoi.id}`,
    disabled: dangHienThi,
  });

  const Icon = khoi.icon;

  if (dangHienThi) {
    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-500 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Check size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-700 truncate">{khoi.ten}</p>
            <p className="text-[10px] text-emerald-600 font-medium">Đang hiển thị trên CV</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onXoa(khoi.id)}
          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition cursor-pointer shrink-0"
          title="Ẩn / Xóa khối này khỏi CV"
        >
          <EyeOff size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`group relative flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-500/60 shadow-2xs hover:shadow transition-all ${
        isDragging ? 'opacity-30 scale-95 ring-2 ring-blue-500' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-2.5 flex-1 cursor-grab active:cursor-grabbing min-w-0"
        title="Bấm giữ và kéo thả sang tờ A4"
      >
        <span className="text-slate-400 group-hover:text-blue-600 transition shrink-0">
          <GripVertical size={16} />
        </span>
        <span
          className="p-1.5 rounded-lg text-white shrink-0"
          style={{ backgroundColor: mauChuDao }}
        >
          <Icon size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
            {khoi.ten}
          </p>
          <p className="text-[10px] text-slate-400 truncate">{khoi.moTa}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onThem(khoi.id)}
        className="ml-2 flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-2.5 py-1.5 rounded-lg transition active:scale-95 cursor-pointer shrink-0"
        title="Thêm khối này vào CV"
      >
        <Plus size={13} />
        <span>Thêm</span>
      </button>
    </div>
  );
};

export const SidebarKhoi: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tabHienTai, setTabHienTai] = useState<'thanh-phan' | 'cau-truc'>('thanh-phan');
  const [moThemTuyChinh, setMoThemTuyChinh] = useState(false);
  const [tenKhoiTuyChinh, setTenKhoiTuyChinh] = useState('');

  const {
    cv,
    capNhatThongTinCaNhan,
    batTatKhoi,
    sapXepKhoi,
    doiCotKhoi,
    diChuyenKhoiLenXuong,
    chuyenKhoiSangCot,
    themKhoiTuyChinh,
    xoaKhoiTuyChinh,
  } = useKhoLuuTruCV();

  const { thongTinCaNhan, anHienKhoi, thuTuKhoi, dinhDang, khoiTuyChinh, boCuc } = cv;
  const avatarUrl = thongTinCaNhan.avatarUrl || '';
  const laCheDo2Cot = boCuc?.cheDo === '2-cot';

  const cotTraiHienThi = (boCuc?.cotTrai || []).filter(
    (id) => anHienKhoi[id] !== false
  );
  const cotPhaiHienThi = (boCuc?.cotPhai || []).filter(
    (id) => anHienKhoi[id] !== false
  );
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

  const layIconKhoi = (id: string) => {
    const standard = DANH_SACH_KHOI.find((k) => k.id === id);
    if (standard) {
      const Icon = standard.icon;
      return <Icon size={14} />;
    }
    return <Layers size={14} />;
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
    if (laCheDo2Cot) {
      chuyenKhoiSangCot(khoiId, 'cot-phai');
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

  // Component render item cấu trúc layer
  const renderLayerItem = (khoiId: string) => {
    return (
      <div
        key={khoiId}
        className="group flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200/90 hover:border-blue-400 transition-all text-xs"
      >
        <div
          onClick={() => cuonToiKhoi(khoiId)}
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
          title="Bấm để cuộn nhanh đến khối này trên trang A4"
        >
          <span className="p-1 rounded-lg bg-slate-100 text-slate-600 group-hover:text-blue-600 group-hover:bg-blue-50 transition shrink-0">
            {layIconKhoi(khoiId)}
          </span>
          <span className="font-semibold text-slate-700 group-hover:text-blue-600 truncate">
            {layTenKhoi(khoiId)}
          </span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {/* Nút xem vị trí */}
          <button
            type="button"
            onClick={() => cuonToiKhoi(khoiId)}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
            title="Định vị trên A4"
          >
            <Focus size={13} />
          </button>

          {/* Nút lên */}
          <button
            type="button"
            onClick={() => diChuyenKhoiLenXuong(khoiId, 'len')}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
            title="Lên trên 1 nấc"
          >
            <ChevronUp size={13} />
          </button>

          {/* Nút xuống */}
          <button
            type="button"
            onClick={() => diChuyenKhoiLenXuong(khoiId, 'xuong')}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-md transition"
            title="Xuống dưới 1 nấc"
          >
            <ChevronDown size={13} />
          </button>

          {/* Nút đổi cột */}
          {laCheDo2Cot && (
            <button
              type="button"
              onClick={() => doiCotKhoi(khoiId)}
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition"
              title="Chuyển sang cột bên cạnh"
            >
              <ArrowLeftRight size={13} />
            </button>
          )}

          {/* Nút ẩn */}
          <button
            type="button"
            onClick={() => batTatKhoi(khoiId, false)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
            title="Ẩn khỏi CV"
          >
            <EyeOff size={13} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full lg:w-[360px] xl:w-[380px] shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-auto lg:h-[calc(100vh-53px)] overflow-y-auto select-none print:hidden">
      {/* ========================================================================= */}
      {/* TABS CHUYỂN ĐỔI: KHO THÀNH PHẦN ⇄ CẤU TRÚC CV (LAYERS)                     */}
      {/* ========================================================================= */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-xs">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/60 rounded-xl">
          <button
            type="button"
            onClick={() => setTabHienTai('thanh-phan')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              tabHienTai === 'thanh-phan'
                ? 'bg-white text-[#0f141e] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes size={14} />
            <span>Thành Phần</span>
          </button>

          <button
            type="button"
            onClick={() => setTabHienTai('cau-truc')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
              tabHienTai === 'cau-truc'
                ? 'bg-white text-[#1a91f0] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>Cấu Trúc (Layers)</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-6">
        {/* ======================================================================= */}
        {/* TAB 1: KHO THÀNH PHẦN & UPLOAD AVATAR                                   */}
        {/* ======================================================================= */}
        {tabHienTai === 'thanh-phan' ? (
          <>
            {/* Header Thành Phần */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles size={16} className="text-[#1a91f0]" />
                  <span>Kho Thành Phần CV</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Kéo thả sang A4 hoặc nhấn Thêm để bổ sung vào CV
                </p>
              </div>
            </div>

            {/* KHỐI 1: UPLOAD ẢNH ĐẠI DIỆN */}
            <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera size={15} style={{ color: dinhDang.mauChuDao }} />
                  Ảnh Đại Diện (Avatar)
                </span>
                {avatarUrl && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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
                    className="relative group w-20 h-20 rounded-full overflow-hidden ring-3 ring-white shadow-sm border border-slate-200 shrink-0 cursor-grab active:cursor-grabbing"
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
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1a91f0] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>Thay ảnh khác</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => capNhatThongTinCaNhan({ avatarUrl: '' })}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 py-1.5 px-3 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Xóa ảnh</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropAnh}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Khối Nội Dung Chuẩn
                </h3>
                <span className="text-[10px] font-semibold text-slate-400">
                  {DANH_SACH_KHOI.filter((k) => anHienKhoi[k.id] !== false).length} / {DANH_SACH_KHOI.length} Đang bật
                </span>
              </div>

              <div className="space-y-2.5">
                {DANH_SACH_KHOI.map((khoi) => {
                  const dangHienThi = anHienKhoi[khoi.id] !== false;
                  return (
                    <DraggableKhoiItem
                      key={khoi.id}
                      khoi={khoi}
                      dangHienThi={dangHienThi}
                      onThem={handleThemKhoi}
                      onXoa={handleXoaKhoi}
                      mauChuDao={dinhDang.mauChuDao}
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
        ) : (
          /* ======================================================================= */
          /* TAB 2: CẤU TRÚC CV (LAYERS & OUTLINE MANAGER)                           */
          /* ======================================================================= */
          <>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers size={16} className="text-[#1a91f0]" />
                <span>Cấu Trúc Các Khối (Layers)</span>
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Xem toàn cảnh vị trí các khối, di chuyển nấc hoặc cuộn nhanh tới khối
              </p>
            </div>

            {laCheDo2Cot ? (
              <div className="space-y-5">
                {/* NHÓM CỘT TRÁI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#1a91f0]" />
                      <span>Cột Trái (35%)</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {cotTraiHienThi.length} khối
                    </span>
                  </div>

                  {cotTraiHienThi.length === 0 ? (
                    <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      Chưa có khối nào ở Cột Trái
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cotTraiHienThi.map((khoiId) => renderLayerItem(khoiId))}
                    </div>
                  )}
                </div>

                {/* NHÓM CỘT PHẢI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Cột Phải (65%)</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {cotPhaiHienThi.length} khối
                    </span>
                  </div>

                  {cotPhaiHienThi.length === 0 ? (
                    <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                      Chưa có khối nào ở Cột Phải
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cotPhaiHienThi.map((khoiId) => renderLayerItem(khoiId))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Thứ tự trên trang (1 Cột)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {danhSachKhoiHienThi.length} khối
                  </span>
                </div>

                {danhSachKhoiHienThi.length === 0 ? (
                  <div className="p-3 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Chưa có khối nào hiển thị
                  </div>
                ) : (
                  <div className="space-y-2">
                    {danhSachKhoiHienThi.map((khoiId) => renderLayerItem(khoiId))}
                  </div>
                )}
              </div>
            )}

            <div className="p-3 bg-blue-50/80 border border-blue-200/70 rounded-xl flex items-start gap-2 text-blue-900">
              <Focus size={15} className="text-[#1a91f0] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-blue-800">
                <strong>Mẹo:</strong> Nhấp vào bất kỳ khối nào trong danh sách trên để trang A4 tự động cuộn đến và viền khối sáng lên!
              </div>
            </div>
          </>
        )}

        {/* Hướng dẫn nhanh chung */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-2 text-amber-900">
          <HelpCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-amber-800">
            <strong>Mẹo thiết kế:</strong> Bạn có thể đổi qua lại giữa Bố cục 1 Cột và 2 Cột trên đầu trang A4. Khi hover vào khối trên A4, thanh công cụ nổi sẽ cho phép di chuyển và đổi cột nhanh.
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarKhoi;
