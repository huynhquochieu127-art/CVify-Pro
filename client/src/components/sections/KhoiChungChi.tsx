import React from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  GripVertical,
  Trophy,
} from 'lucide-react';
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
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

interface ItemProps {
  cc: ChungChiItem;
  mauChuDao: string;
  onSua: (id: string, duLieu: Partial<ChungChiItem>) => void;
  onXoa: (id: string) => void;
}

const SortableChungChiItemRow: React.FC<ItemProps> = ({
  cc,
  mauChuDao,
  onSua,
  onXoa,
}) => {
  const { cv } = useKhoLuuTruCV();
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

  const mauToChuc =
    cv.dinhDang?.kieuChuTuyChinh?.[`cc-tc-${cc.id}`]?.mauChu || mauChuDao;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 transition-colors break-inside-avoid print:break-inside-avoid ${
        isDragging ? 'opacity-40 bg-blue-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition print:hidden"
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

      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
        <div className="flex items-start gap-1.5 flex-1 min-w-[140px]">
          <div className="mt-0.5 shrink-0">
            <NutChonIconTuyChinh
              iconName={cc.iconTen || 'Trophy'}
              fallback={Trophy}
              onChonIcon={(ic) => onSua(cc.id, { iconTen: ic })}
              size={12}
              mauChuDao={mauChuDao}
              styleKey={`cc-ten-${cc.id}`}
              title="Đổi icon & màu icon Chứng chỉ / Giải thưởng"
            />
          </div>
          <AutoResizeInput
            dataStyleKey={`cc-ten-${cc.id}`}
            value={cc.ten}
            onChange={(e) => onSua(cc.id, { ten: e.target.value })}
            placeholder="Tên chứng chỉ / Giải thưởng"
            className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 flex-1 min-w-0 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
          />
        </div>

        <input
          type="text"
          data-style-key={`cc-nam-${cc.id}`}
          value={cc.nam}
          onChange={(e) => onSua(cc.id, { nam: e.target.value })}
          placeholder="2025"
          className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 min-w-[50px] max-w-[90px] shrink-0 ml-auto pt-0.5 placeholder:italic"
        />
      </div>

      <div className="flex items-start gap-1.5 mt-0.5">
        <div className="mt-0.5 shrink-0">
          <NutChonIconTuyChinh
            iconName={cc.iconToChuc || 'ShieldCheck'}
            fallback={ShieldCheck}
            onChonIcon={(ic) => onSua(cc.id, { iconToChuc: ic })}
            size={12}
            mauChuDao={mauChuDao}
            styleKey={`cc-tc-${cc.id}`}
            title="Đổi icon & màu icon Tổ chức cấp"
          />
        </div>
        <AutoResizeInput
          dataStyleKey={`cc-tc-${cc.id}`}
          value={cc.toChuc}
          onChange={(e) => onSua(cc.id, { toChuc: e.target.value })}
          placeholder="Tổ chức cấp (ví dụ: Google, AWS, TOEIC...)"
          style={{ color: mauToChuc }}
          className="text-xs font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export interface KhoiChungChiProps {
  trang?: number;
}

export const KhoiChungChi: React.FC<KhoiChungChiProps> = ({ trang }) => {
  const { cv, themChungChi, suaChungChi, xoaChungChi, sapXepChungChi } =
    useKhoLuuTruCV();
  const mauKhoi =
    cv.dinhDang?.kieuChuTuyChinh?.['khoi-chung-chi']?.mauChu ||
    cv.dinhDang.mauChuDao ||
    '#1a91f0';

  // Xác định xem mục Chứng chỉ nên hiển thị ở Trang 1 hay Trang 2
  const trangChiDinh =
    cv.dinhDang?.phanBoTrangKhoi?.['chung-chi'] ||
    (cv.dinhDang?.ngatTrangKhoi?.['chung-chi'] ? 2 : 1);

  if (trang && trang !== trangChiDinh) {
    return null;
  }

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
                mauChuDao={mauKhoi}
                onSua={suaChungChi}
                onXoa={xoaChungChi}
              />
            ))}

            <button
              type="button"
              onClick={() => themChungChi()}
              style={{ color: mauKhoi }}
              className="flex items-center gap-1.5 text-[11px] font-medium hover:bg-slate-100 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
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
