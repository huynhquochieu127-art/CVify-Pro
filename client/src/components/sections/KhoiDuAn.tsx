import React from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react';
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
import { useKhoLuuTruCV, type DuAnItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

interface ItemProps {
  da: DuAnItem;
  onSua: (id: string, duLieu: Partial<DuAnItem>) => void;
  onXoa: (id: string) => void;
}

const SortableDuAnItemRow: React.FC<ItemProps> = ({ da, onSua, onXoa }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: da.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-violet-500 transition-colors ${
        isDragging ? 'opacity-40 bg-violet-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục dự án */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-violet-600 cursor-grab active:cursor-grabbing transition print:hidden"
        title="Kéo thả để đổi thứ tự dự án này"
      >
        <GripVertical size={13} />
      </div>

      <button
        type="button"
        onClick={() => onXoa(da.id)}
        className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition cursor-pointer print:hidden"
        title="Xóa dự án"
      >
        <Trash2 size={13} />
      </button>

      <div className="flex items-baseline justify-between gap-2">
        <input
          type="text"
          value={da.ten}
          onChange={(e) => onSua(da.id, { ten: e.target.value })}
          placeholder="Tên dự án"
          className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        <input
          type="text"
          value={da.thoiGian}
          onChange={(e) => onSua(da.id, { thoiGian: e.target.value })}
          placeholder="01/2023 - 06/2023"
          className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-28 shrink-0 placeholder:italic"
        />
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        <input
          type="text"
          value={da.vaiTro}
          onChange={(e) => onSua(da.id, { vaiTro: e.target.value })}
          placeholder="Vai trò trong dự án (ví dụ: Frontend Lead, Thiết kế UI)"
          className="text-xs text-violet-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        {da.lienKet && (
          <a
            href={da.lienKet.startsWith('http') ? da.lienKet : `https://${da.lienKet}`}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-blue-500"
            title="Mở liên kết"
          >
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      <input
        type="text"
        value={da.lienKet || ''}
        onChange={(e) => onSua(da.id, { lienKet: e.target.value })}
        placeholder="Đường dẫn / Demo dự án (tùy chọn)"
        className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:italic placeholder:text-slate-400"
      />

      <textarea
        value={da.moTa}
        onChange={(e) => onSua(da.id, { moTa: e.target.value })}
        placeholder="Mô tả công nghệ sử dụng, giải pháp và kết quả đạt được..."
        className="w-full text-xs text-slate-600 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1 -ml-1 mt-1 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
        rows={2}
      />
    </div>
  );
};

export const KhoiDuAn: React.FC = () => {
  const { cv, themDuAn, suaDuAn, xoaDuAn, sapXepDuAn } = useKhoLuuTruCV();

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
      const oldIndex = cv.duAn.findIndex((d) => d.id === active.id);
      const newIndex = cv.duAn.findIndex((d) => d.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const danhSachMoi = arrayMove(cv.duAn, oldIndex, newIndex);
        sapXepDuAn(danhSachMoi);
      }
    }
  };

  const itemIds = cv.duAn.map((d) => d.id);

  return (
    <SortableKhoi id="du-an" tieuDe="Dự Án Tiêu Biểu" icon={FolderGit2}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {cv.duAn.map((da) => (
              <SortableDuAnItemRow
                key={da.id}
                da={da}
                onSua={suaDuAn}
                onXoa={xoaDuAn}
              />
            ))}

            <button
              type="button"
              onClick={() => themDuAn()}
              className="flex items-center gap-1.5 text-[11px] text-violet-600 hover:text-violet-700 font-medium hover:bg-violet-50/60 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
            >
              <Plus size={12} />
              <span>Thêm Dự Án</span>
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </SortableKhoi>
  );
};

export default KhoiDuAn;
