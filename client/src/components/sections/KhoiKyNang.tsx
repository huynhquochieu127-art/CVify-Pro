import React, { useState } from 'react';
import { Award, Plus, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKhoLuuTruCV, type KyNangItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

interface ChipProps {
  kn: KyNangItem;
  onSua: (id: string, duLieu: Partial<KyNangItem>) => void;
  onXoa: (id: string) => void;
}

const SortableKyNangChip: React.FC<ChipProps> = ({ kn, onSua, onXoa }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: kn.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/tag inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2 py-1 rounded-full text-xs text-slate-700 transition-colors ${
        isDragging ? 'opacity-40 ring-2 ring-[#1a91f0] bg-blue-100' : ''
      }`}
    >
      <span
        {...attributes}
        {...listeners}
        className="opacity-40 group-hover/tag:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 hover:text-[#1a91f0] print:hidden"
        title="Kéo thả đổi vị trí kỹ năng"
      >
        <GripVertical size={11} />
      </span>

      <input
        type="text"
        value={kn.ten}
        onChange={(e) => onSua(kn.id, { ten: e.target.value })}
        className="bg-transparent border-0 focus:outline-none text-xs w-auto min-w-[30px] font-medium"
        style={{ width: `${Math.max(kn.ten.length * 7.5, 40)}px` }}
      />

      <button
        type="button"
        onClick={() => onXoa(kn.id)}
        className="text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer print:hidden"
        title="Xóa kỹ năng"
      >
        <X size={11} />
      </button>
    </div>
  );
};

export const KhoiKyNang: React.FC = () => {
  const { cv, themKyNang, suaKyNang, xoaKyNang, sapXepKyNang } = useKhoLuuTruCV();
  const [kyNangMoi, setKyNangMoi] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cv.kyNang.findIndex((k) => k.id === active.id);
      const newIndex = cv.kyNang.findIndex((k) => k.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const danhSachMoi = arrayMove(cv.kyNang, oldIndex, newIndex);
        sapXepKyNang(danhSachMoi);
      }
    }
  };

  const handleThemKyNang = (e: React.FormEvent) => {
    e.preventDefault();
    if (kyNangMoi.trim()) {
      themKyNang(kyNangMoi.trim());
      setKyNangMoi('');
    }
  };

  const itemIds = cv.kyNang.map((k) => k.id);

  return (
    <SortableKhoi id="ky-nang" tieuDe="Kỹ Năng Chuyên Môn" icon={Award}>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {cv.kyNang.map((kn) => (
                <SortableKyNangChip
                  key={kn.id}
                  kn={kn}
                  onSua={suaKyNang}
                  onXoa={xoaKyNang}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <form onSubmit={handleThemKyNang} className="flex items-center gap-2 print:hidden">
          <input
            type="text"
            value={kyNangMoi}
            onChange={(e) => setKyNangMoi(e.target.value)}
            placeholder="Nhập kỹ năng mới (ví dụ: React, Tiếng Anh B2)..."
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#1a91f0] focus:bg-white flex-1 placeholder:italic placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!kyNangMoi.trim()}
            className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1a91f0] px-3 py-1 rounded transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Plus size={12} />
            <span>Thêm</span>
          </button>
        </form>
      </div>
    </SortableKhoi>
  );
};

export default KhoiKyNang;
