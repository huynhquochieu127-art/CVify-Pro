import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';

export interface SortableKhoiProps {
  id: string;
  tieuDe: string;
  icon: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  mauChuDao?: string;
  nutThem?: React.ReactNode;
  onXoaKhoi?: () => void;
  children: React.ReactNode;
}

export const SortableKhoi: React.FC<SortableKhoiProps> = ({
  id,
  tieuDe,
  icon,
  mauChuDao,
  nutThem,
  onXoaKhoi,
  children,
}) => {
  const { cv, batTatKhoi } = useKhoLuuTruCV();
  const mau = mauChuDao || cv.dinhDang?.mauChuDao || '#0a66c2';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
      const IconComp = icon as React.ComponentType<{ size?: number; className?: string }>;
      return <IconComp size={15} />;
    }
    return null;
  };

  const handleXoa = () => {
    if (onXoaKhoi) {
      onXoaKhoi();
    } else {
      batTatKhoi(id, false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl transition-all duration-200 p-2 -mx-2 mb-4 hover:bg-slate-50/70 border border-transparent hover:border-slate-200/80 ${
        isDragging ? 'opacity-40 ring-2 ring-blue-500 bg-blue-50/50 shadow-md z-30' : ''
      }`}
    >
      {/* TAY CẦM KÉO THẢ (Icon 6 chấm GripVertical xuất hiện khi rê chuột) */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-3 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded-md shadow-2xs transition-all cursor-grab active:cursor-grabbing z-20 print:hidden"
        title="Bấm giữ và kéo thả để đổi vị trí khối này"
      >
        <GripVertical size={16} />
      </div>

      {/* Tiêu đề của khối & Nút thêm mục / Xóa khối */}
      <div
        className="flex items-center justify-between border-b pb-1.5 mb-2.5"
        style={{ borderColor: mau }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: mau }}>{renderIcon()}</span>
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: mau }}
          >
            {tieuDe}
          </h2>
        </div>

        {/* Nút thêm mục & Nút Xóa/Ẩn khối */}
        <div className="flex items-center gap-2 print:hidden">
          {nutThem}
          <button
            type="button"
            onClick={handleXoa}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
            title="Ẩn / Xóa khối này khỏi CV"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Nội dung khối */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default SortableKhoi;
