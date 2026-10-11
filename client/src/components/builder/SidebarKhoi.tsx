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
} from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useStoreCV } from '../../store/khoLuuTruCV';

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
      className={`group relative flex items-center justify-between p-3 rounded-xl bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-500/60 shadow-xs hover:shadow transition-all ${
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
  const [moThemTuyChinh, setMoThemTuyChinh] = useState(false);
  const [tenKhoiTuyChinh, setTenKhoiTuyChinh] = useState('');

  const {
    cv,
    capNhatThongTinCaNhan,
    batTatKhoi,
    sapXepKhoi,
    themKhoiTuyChinh,
    xoaKhoiTuyChinh,
  } = useStoreCV();

  const { thongTinCaNhan, anHienKhoi, thuTuKhoi, dinhDang, khoiTuyChinh } = cv;
  const avatarUrl = thongTinCaNhan.avatarUrl || '';

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
    if (!thuTuKhoi.includes(khoiId)) {
      sapXepKhoi([...thuTuKhoi, khoiId]);
    }
  };

  // Ẩn / Xóa một khối khỏi CV
  const handleXoaKhoi = (khoiId: string) => {
    batTatKhoi(khoiId, false);
    sapXepKhoi(thuTuKhoi.filter((id) => id !== khoiId));
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
    <aside className="w-full lg:w-[360px] xl:w-[380px] shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-auto lg:h-[calc(100vh-53px)] overflow-y-auto select-none print:hidden">
      <div className="p-4 sm:p-5 space-y-6">
        {/* Header Sidebar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span>Thành Phần CV</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Kéo thả hoặc nhấn Thêm để đưa vào tờ A4
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KHỐI 1: UPLOAD & KÉO THẢ ẢNH ĐẠI DIỆN (AVATAR)                           */}
        {/* ========================================================================= */}
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
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-xl transition cursor-pointer"
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

        {/* ========================================================================= */}
        {/* KHỐI 2: DANH SÁCH CÁC KHỐI NỘI DUNG CƠ BẢN                                 */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Khối Nội Dung Chuẩn
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">
              {DANH_SACH_KHOI.filter((k) => anHienKhoi[k.id] !== false && thuTuKhoi.includes(k.id)).length} / {DANH_SACH_KHOI.length} Đang bật
            </span>
          </div>

          <div className="space-y-2.5">
            {DANH_SACH_KHOI.map((khoi) => {
              const dangHienThi = anHienKhoi[khoi.id] !== false && thuTuKhoi.includes(khoi.id);
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

        {/* ========================================================================= */}
        {/* KHỐI 3: MỤC TÙY CHỈNH & NÚT THÊM MỤC TÙY CHỈNH                            */}
        {/* ========================================================================= */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-blue-600" />
              <span>Mục Tùy Chỉnh</span>
            </h3>
            {khoiTuyChinh && khoiTuyChinh.length > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">
                {khoiTuyChinh.length} mục
              </span>
            )}
          </div>

          {/* Danh sách các khối tùy chỉnh đã tạo */}
          {khoiTuyChinh && khoiTuyChinh.length > 0 && (
            <div className="space-y-2 mb-3">
              {khoiTuyChinh.map((item) => {
                const dangHienThi = anHienKhoi[item.id] !== false && thuTuKhoi.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-700"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-1 rounded-lg bg-blue-50 text-blue-600 shrink-0">
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
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                        title={dangHienThi ? 'Ẩn khỏi CV' : 'Hiện trên CV'}
                      >
                        {dangHienThi ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => xoaKhoiTuyChinh(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
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

          {/* Form thêm mục tùy chỉnh */}
          {moThemTuyChinh ? (
            <form onSubmit={handleXacNhanThemTuyChinh} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <label className="block text-[11px] font-semibold text-slate-700">
                Tên mục tùy chỉnh mới:
              </label>
              <input
                type="text"
                autoFocus
                value={tenKhoiTuyChinh}
                onChange={(e) => setTenKhoiTuyChinh(e.target.value)}
                placeholder="VD: Hoạt động xã hội, Sở thích..."
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMoThemTuyChinh(false);
                    setTenKhoiTuyChinh('');
                  }}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 rounded transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!tenKhoiTuyChinh.trim()}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition disabled:opacity-50"
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
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-blue-400/80 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm mục tùy chỉnh</span>
            </button>
          )}
        </div>

        {/* Hướng dẫn nhanh */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-2 text-amber-900">
          <HelpCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-amber-800">
            <strong>Mẹo thiết kế:</strong> Kéo khối từ thanh này thả sang trang A4 để chèn vào CV. Trên trang A4, rê chuột vào icon 6 chấm để di chuyển đổi thứ tự các khối.
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarKhoi;
