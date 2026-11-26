import React, { useState } from 'react';
import { Award, Plus, X, GripVertical, Sparkles } from 'lucide-react';
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
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';

interface ChipProps {
  kn: KyNangItem;
  mauChuDao: string;
  onSua: (id: string, duLieu: Partial<KyNangItem>) => void;
  onXoa: (id: string) => void;
}

const SortableKyNangChip: React.FC<ChipProps> = ({
  kn,
  mauChuDao,
  onSua,
  onXoa,
}) => {
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
      className={`group/tag inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2 py-0.5 rounded-full text-xs text-slate-700 transition-colors max-w-full box-border ${
        isDragging ? 'opacity-40 ring-2 ring-[#1a91f0] bg-blue-100' : ''
      }`}
    >
      <span
        {...attributes}
        {...listeners}
        className="opacity-40 group-hover/tag:opacity-100 cursor-grab active:cursor-grabbing text-slate-400 hover:text-[#1a91f0] print:hidden shrink-0"
        title="Kéo thả đổi vị trí kỹ năng"
      >
        <GripVertical size={11} />
      </span>

      {/* Nút chọn Custom Icon cho từng kỹ năng */}
      <div className="shrink-0 flex items-center">
        <NutChonIconTuyChinh
          iconName={kn.iconName || 'Sparkles'}
          fallback={Sparkles}
          onChonIcon={(ic) => onSua(kn.id, { iconName: ic })}
          size={11}
          mauChuDao={mauChuDao}
          styleKey={`kynang-${kn.id}`}
          title="Nhấn để chọn icon & màu icon cho kỹ năng này"
        />
      </div>

      <input
        type="text"
        data-style-key={`kynang-${kn.id}`}
        value={kn.ten}
        onChange={(e) => onSua(kn.id, { ten: e.target.value })}
        className="bg-transparent border-0 focus:outline-none text-xs min-w-[20px] font-medium truncate"
        style={{
          width: `${Math.min(Math.max(kn.ten.length * 7.2, 32), 150)}px`,
          maxWidth: 'calc(100% - 36px)',
        }}
        title={kn.ten}
      />

      <button
        type="button"
        onClick={() => onXoa(kn.id)}
        className="text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer print:hidden shrink-0 ml-0.5"
        title="Xóa kỹ năng"
      >
        <X size={11} />
      </button>
    </div>
  );
};

export interface KhoiKyNangProps {
  trang?: number;
}

export const KhoiKyNang: React.FC<KhoiKyNangProps> = ({ trang }) => {
  const { cv, themKyNang, suaKyNang, xoaKyNang, sapXepKyNang } = useKhoLuuTruCV();
  const [kyNangMoi, setKyNangMoi] = useState('');
  const mauKhoi =
    cv.dinhDang?.kieuChuTuyChinh?.['khoi-ky-nang']?.mauChu ||
    cv.dinhDang.mauChuDao ||
    '#1a91f0';

  const trangChiDinh =
    cv.dinhDang?.phanBoTrangKhoi?.['ky-nang'] ||
    (cv.dinhDang?.ngatTrangKhoi?.['ky-nang'] ? 2 : 1);

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
      <div className="w-full max-w-full overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap gap-1.5 mb-2.5 w-full max-w-full">
              {cv.kyNang.map((kn) => (
                <SortableKyNangChip
                  key={kn.id}
                  kn={kn}
                  mauChuDao={mauKhoi}
                  onSua={suaKyNang}
                  onXoa={xoaKyNang}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <form
          onSubmit={handleThemKyNang}
          className="flex flex-wrap items-center gap-1.5 print:hidden w-full max-w-full mt-1.5"
        >
          <input
            type="text"
            value={kyNangMoi}
            onChange={(e) => setKyNangMoi(e.target.value)}
            placeholder="Thêm kỹ năng..."
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-[#1a91f0] focus:bg-white flex-1 min-w-[80px] w-full max-w-full placeholder:italic placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!kyNangMoi.trim()}
            className="flex items-center justify-center gap-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1a91f0] px-2.5 py-1 rounded transition-colors disabled:opacity-40 cursor-pointer shrink-0 ml-auto sm:ml-0"
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
