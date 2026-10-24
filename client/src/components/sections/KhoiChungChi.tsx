import React from 'react';
import { ShieldCheck, Plus, Trash2, GripVertical } from 'lucide-react';
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
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKhoLuuTruCV, type ChungChiItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

interface ItemProps {
  cc: ChungChiItem;
  onSua: (id: string, duLieu: Partial<ChungChiItem>) => void;
  onXoa: (id: string) => void;
}

const SortableChungChiItemRow: React.FC<ItemProps> = ({ cc, onSua, onXoa }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cc.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-amber-500 transition-colors ${
        isDragging ? 'opacity-40 bg-amber-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-amber-600 cursor-grab active:cursor-grabbing transition print:hidden"
        title="Kéo thả để đổi thứ tự chứng chỉ này"
      >
        <GripVertical size={13} />
      </div>

      <button
        type="button"
        onClick={() => onXoa(cc.id)}
        className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition cursor-pointer print:hidden"
        title="Xóa chứng chỉ"
      >
        <Trash2 size={13} />
      </button>

      <div className="flex items-baseline justify-between gap-2">
        <input
          type="text"
          value={cc.ten}
          onChange={(e) => onSua(cc.id, { ten: e.target.value })}
          placeholder="Tên chứng chỉ / Giải thưởng"
          className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        <input
          type="text"
          value={cc.nam}
          onChange={(e) => onSua(cc.id, { nam: e.target.value })}
          placeholder="2023"
          className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-20 shrink-0 placeholder:italic"
        />
      </div>

      <input
        type="text"
        value={cc.toChuc}
        onChange={(e) => onSua(cc.id, { toChuc: e.target.value })}
        placeholder="Tổ chức cấp (ví dụ: Google, AWS, TOEIC...)"
        className="text-xs text-amber-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
      />
    </div>
  );
};

export const KhoiChungChi: React.FC = () => {
  const { cv, themChungChi, suaChungChi, xoaChungChi, sapXepChungChi } =
    useKhoLuuTruCV();

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
      const oldIndex = cv.chungChi.findIndex((c) => c.id === active.id);
      const newIndex = cv.chungChi.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const danhSachMoi = arrayMove(cv.chungChi, oldIndex, newIndex);
        sapXepChungChi(danhSachMoi);
      }
    }
  };

  const itemIds = cv.chungChi.map((c) => c.id);

  return (
    <SortableKhoi id="chung-chi" tieuDe="Chứng Chỉ & Giải Thưởng" icon={ShieldCheck}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {cv.chungChi.map((cc) => (
              <SortableChungChiItemRow
                key={cc.id}
                cc={cc}
                onSua={suaChungChi}
                onXoa={xoaChungChi}
              />
            ))}

            <button
              type="button"
              onClick={() => themChungChi()}
              className="flex items-center gap-1.5 text-[11px] text-amber-600 hover:text-amber-700 font-medium hover:bg-amber-50/60 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
            >
              <Plus size={12} />
              <span>Thêm Chứng Chỉ</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </SortableKhoi>
  );
};

export default KhoiChungChi;
