import React from 'react';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';
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
import { useKhoLuuTruCV, type HocVanItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

interface ItemProps {
  hv: HocVanItem;
  onSua: (id: string, duLieu: Partial<HocVanItem>) => void;
  onXoa: (id: string) => void;
}

const SortableHocVanItemRow: React.FC<ItemProps> = ({ hv, onSua, onXoa }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: hv.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-emerald-500 transition-colors ${
        isDragging ? 'opacity-40 bg-emerald-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục học vấn */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-emerald-600 cursor-grab active:cursor-grabbing transition print:hidden"
        title="Kéo thả để đổi thứ tự học vấn này"
      >
        <GripVertical size={13} />
      </div>

      <button
        type="button"
        onClick={() => onXoa(hv.id)}
        className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition cursor-pointer print:hidden"
        title="Xóa mục này"
      >
        <Trash2 size={13} />
      </button>

      <div className="flex items-baseline justify-between gap-2">
        <input
          type="text"
          value={hv.chuyenNganh}
          onChange={(e) => onSua(hv.id, { chuyenNganh: e.target.value })}
          placeholder="Chuyên ngành / Văn bằng"
          className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        <input
          type="text"
          value={hv.thoiGian}
          onChange={(e) => onSua(hv.id, { thoiGian: e.target.value })}
          placeholder="2018 - 2022"
          className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-24 shrink-0 placeholder:italic"
        />
      </div>

      <input
        type="text"
        value={hv.truong}
        onChange={(e) => onSua(hv.id, { truong: e.target.value })}
        placeholder="Tên trường đại học / Cơ sở đào tạo"
        className="text-xs text-emerald-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
      />

      <input
        type="text"
        value={hv.diemSo || hv.gpa || ''}
        onChange={(e) => onSua(hv.id, { diemSo: e.target.value })}
        placeholder="Điểm số / GPA / Xếp loại tốt nghiệp (không bắt buộc)"
        className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:italic placeholder:text-slate-400 mt-0.5"
      />
    </div>
  );
};

export const KhoiHocVan: React.FC = () => {
  const { cv, themHocVan, suaHocVan, xoaHocVan, sapXepHocVan } = useKhoLuuTruCV();

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
      const oldIndex = cv.hocVan.findIndex((h) => h.id === active.id);
      const newIndex = cv.hocVan.findIndex((h) => h.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const danhSachMoi = arrayMove(cv.hocVan, oldIndex, newIndex);
        sapXepHocVan(danhSachMoi);
      }
    }
  };

  const itemIds = cv.hocVan.map((h) => h.id);

  return (
    <SortableKhoi id="hoc-van" tieuDe="Học Vấn & Bằng Cấp" icon={GraduationCap}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3.5">
            {cv.hocVan.map((hv) => (
              <SortableHocVanItemRow
                key={hv.id}
                hv={hv}
                onSua={suaHocVan}
                onXoa={xoaHocVan}
              />
            ))}

            <button
              type="button"
              onClick={() => themHocVan()}
              className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50/60 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
            >
              <Plus size={12} />
              <span>Thêm Học Vấn</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </SortableKhoi>
  );
};

export default KhoiHocVan;
