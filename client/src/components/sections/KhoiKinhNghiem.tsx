import React from 'react';
import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';
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
import { useKhoLuuTruCV, type KinhNghiemItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

interface ItemProps {
  kn: KinhNghiemItem;
  onSua: (id: string, duLieu: Partial<KinhNghiemItem>) => void;
  onXoa: (id: string) => void;
}

const SortableKinhNghiemItemRow: React.FC<ItemProps> = ({ kn, onSua, onXoa }) => {
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
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-[#1a91f0] transition-colors ${
        isDragging ? 'opacity-40 bg-blue-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục kinh nghiệm */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-[#1a91f0] cursor-grab active:cursor-grabbing transition print:hidden"
        title="Kéo thả để đổi thứ tự công việc này"
      >
        <GripVertical size={13} />
      </div>

      <button
        type="button"
        onClick={() => onXoa(kn.id)}
        className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition cursor-pointer print:hidden"
        title="Xóa mục này"
      >
        <Trash2 size={13} />
      </button>

      <div className="flex items-baseline justify-between gap-2">
        <input
          type="text"
          value={kn.viTri}
          onChange={(e) => onSua(kn.id, { viTri: e.target.value })}
          placeholder="Vị trí / Chức danh"
          className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        <input
          type="text"
          value={kn.thoiGian}
          onChange={(e) => onSua(kn.id, { thoiGian: e.target.value })}
          placeholder="2022 - Hiện tại"
          className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-28 shrink-0 placeholder:italic"
        />
      </div>

      <input
        type="text"
        value={kn.congTy}
        onChange={(e) => onSua(kn.id, { congTy: e.target.value })}
        placeholder="Tên công ty / Doanh nghiệp"
        className="text-xs text-[#1a91f0] font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
      />

      <textarea
        value={kn.moTa}
        onChange={(e) => onSua(kn.id, { moTa: e.target.value })}
        placeholder="Mô tả công việc, trách nhiệm chính và các thành tựu đạt được..."
        className="w-full text-xs text-slate-600 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1 -ml-1 mt-1 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
        rows={2}
      />
    </div>
  );
};

export const KhoiKinhNghiem: React.FC = () => {
  const { cv, themKinhNghiem, suaKinhNghiem, xoaKinhNghiem, sapXepKinhNghiem } =
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
      const oldIndex = cv.kinhNghiem.findIndex((k) => k.id === active.id);
      const newIndex = cv.kinhNghiem.findIndex((k) => k.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const danhSachMoi = arrayMove(cv.kinhNghiem, oldIndex, newIndex);
        sapXepKinhNghiem(danhSachMoi);
      }
    }
  };

  const itemIds = cv.kinhNghiem.map((k) => k.id);

  return (
    <SortableKhoi id="kinh-nghiem" tieuDe="Kinh Nghiệm Làm Việc" icon={Briefcase}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {cv.kinhNghiem.map((kn) => (
              <SortableKinhNghiemItemRow
                key={kn.id}
                kn={kn}
                onSua={suaKinhNghiem}
                onXoa={xoaKinhNghiem}
              />
            ))}

            <button
              type="button"
              onClick={() => themKinhNghiem()}
              className="flex items-center gap-1.5 text-[11px] text-[#1a91f0] hover:text-blue-700 font-medium hover:bg-blue-50/60 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
            >
              <Plus size={12} />
              <span>Thêm Kinh Nghiệm</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </SortableKhoi>
  );
};

export default KhoiKinhNghiem;
