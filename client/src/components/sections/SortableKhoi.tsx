import React from 'react';
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  EyeOff,
} from 'lucide-react';
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
  const { cv, batTatKhoi, doiCotKhoi, diChuyenKhoiLenXuong } = useKhoLuuTruCV();
  const mau = mauChuDao || cv.dinhDang?.mauChuDao || '#1a91f0';
  const laCheDo2Cot = cv.boCuc?.cheDo === '2-cot';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
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
      id={`cv-khoi-${id}`}
      style={style}
      className={`group relative rounded-xl transition-all duration-200 p-2.5 -mx-2.5 mb-4 border ${
        isDragging
          ? 'opacity-30 ring-2 ring-[#1a91f0] bg-blue-50/50 shadow-lg z-30 border-blue-300'
          : isOver
          ? 'border-t-2 border-t-[#1a91f0] bg-blue-50/20'
          : 'border-transparent hover:border-slate-200/90 hover:bg-slate-50/60'
      }`}
    >
      {/* ========================================================================= */}
      {/* FLOATING ACTION BAR: THANH ĐIỀU KHIỂN NỔI THÔNG MINH KHI HOVER             */}
      {/* ========================================================================= */}
      <div className="absolute -top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-0.5 bg-white border border-slate-200 shadow-md rounded-full px-1.5 py-0.5 z-20 print:hidden scale-95 group-hover:scale-100">
        {/* Nút di chuyển lên */}
        <button
          type="button"
          onClick={() => diChuyenKhoiLenXuong(id, 'len')}
          className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
          title="Di chuyển khối lên 1 vị trí"
        >
          <ChevronUp size={13} />
        </button>

        {/* Nút di chuyển xuống */}
        <button
          type="button"
          onClick={() => diChuyenKhoiLenXuong(id, 'xuong')}
          className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
          title="Di chuyển khối xuống 1 vị trí"
        >
          <ChevronDown size={13} />
        </button>

        {/* Nút đổi cột (nếu đang ở chế độ 2 cột) */}
        {laCheDo2Cot && (
          <button
            type="button"
            onClick={() => doiCotKhoi(id)}
            className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
            title="Chuyển nhanh sang cột bên cạnh"
          >
            <ArrowLeftRight size={13} />
          </button>
        )}

        <span className="w-[1px] h-3 bg-slate-200 mx-0.5" />

        {/* Nút ẩn khối */}
        <button
          type="button"
          onClick={() => batTatKhoi(id, false)}
          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition cursor-pointer"
          title="Ẩn tạm thời khối này khỏi CV"
        >
          <EyeOff size={13} />
        </button>

        {/* Nút xóa khối */}
        <button
          type="button"
          onClick={handleXoa}
          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
          title="Xóa hẳn khối này"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAY CẦM KÉO THẢ TACTILE GRIP (Icon 6 chấm ngoài lề trái)                  */}
      {/* ========================================================================= */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-3 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#1a91f0] hover:bg-white rounded-md shadow-xs transition-all cursor-grab active:cursor-grabbing z-20 print:hidden"
        title="Bấm giữ và kéo thả để di chuyển khối này"
      >
        <GripVertical size={16} />
      </div>

      {/* ========================================================================= */}
      {/* TIÊU ĐỀ KHỐI VÀ NÚT THÊM MỤC                                              */}
      {/* ========================================================================= */}
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

        {/* Nút thêm mục */}
        <div className="flex items-center gap-2 print:hidden">
          {nutThem}
        </div>
      </div>

      {/* Nội dung khối */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default SortableKhoi;
