import React from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  GripVertical,
  BookOpen,
  Calendar,
  BadgeCheck,
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
import { useKhoLuuTruCV, type HocVanItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

interface ItemProps {
  hv: HocVanItem;
  mauChuDao: string;
  onSua: (id: string, duLieu: Partial<HocVanItem>) => void;
  onXoa: (id: string) => void;
}

const SortableHocVanItemRow: React.FC<ItemProps> = ({
  hv,
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
  } = useSortable({ id: hv.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mauTruong =
    cv.dinhDang?.kieuChuTuyChinh?.[`hv-truong-${hv.id}`]?.mauChu || mauChuDao;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 transition-colors break-inside-avoid print:break-inside-avoid ${
        isDragging ? 'opacity-40 bg-blue-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục học vấn */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition print:hidden"
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

      {/* Dòng 1: Chuyên ngành (Icon) & Thời gian (Icon) */}
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
        <div className="flex items-start gap-1.5 flex-1 min-w-[140px]">
          <div className="mt-0.5 shrink-0">
            <NutChonIconTuyChinh
              iconName={hv.iconChuyenNganh || 'BookOpen'}
              fallback={BookOpen}
              onChonIcon={(ic) => onSua(hv.id, { iconChuyenNganh: ic })}
              size={12}
              mauChuDao={mauChuDao}
              styleKey={`hv-nganh-${hv.id}`}
              title="Đổi icon & màu icon Chuyên ngành"
            />
          </div>
          <AutoResizeInput
            dataStyleKey={`hv-nganh-${hv.id}`}
            value={hv.chuyenNganh}
            onChange={(e) => onSua(hv.id, { chuyenNganh: e.target.value })}
            placeholder="Chuyên ngành / Văn bằng"
            className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 flex-1 min-w-0 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto pt-0.5">
          <NutChonIconTuyChinh
            iconName={hv.iconThoiGian || 'Calendar'}
            fallback={Calendar}
            onChonIcon={(ic) => onSua(hv.id, { iconThoiGian: ic })}
            size={11}
            mauChuDao="#94a3b8"
            styleKey={`hv-tg-${hv.id}`}
            title="Đổi icon & màu icon Thời gian"
          />
          <input
            type="text"
            data-style-key={`hv-tg-${hv.id}`}
            value={hv.thoiGian}
            onChange={(e) => onSua(hv.id, { thoiGian: e.target.value })}
            placeholder="2022 - 2026"
            className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 min-w-[70px] max-w-[120px] shrink-0 placeholder:italic"
          />
        </div>
      </div>

      {/* Dòng 2: Tên trường đại học */}
      <div className="flex items-start gap-1.5 mt-0.5">
        <div className="mt-0.5 shrink-0">
          <NutChonIconTuyChinh
            iconName={hv.iconTruong || 'GraduationCap'}
            fallback={GraduationCap}
            onChonIcon={(ic) => onSua(hv.id, { iconTruong: ic })}
            size={12}
            mauChuDao={mauChuDao}
            styleKey={`hv-truong-${hv.id}`}
            title="Đổi icon & màu icon Trường học"
          />
        </div>
        <AutoResizeInput
          dataStyleKey={`hv-truong-${hv.id}`}
          value={hv.truong}
          onChange={(e) => onSua(hv.id, { truong: e.target.value })}
          placeholder="Tên trường đại học / Cơ sở đào tạo"
          style={{ color: mauTruong }}
          className="text-xs font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
      </div>

      {/* Dòng 3: Điểm GPA / Xếp loại */}
      <div className="flex items-start gap-1.5 mt-0.5">
        <div className="mt-0.5 shrink-0">
          <NutChonIconTuyChinh
            iconName={hv.iconDiemSo || 'BadgeCheck'}
            fallback={BadgeCheck}
            onChonIcon={(ic) => onSua(hv.id, { iconDiemSo: ic })}
            size={12}
            mauChuDao="#64748b"
            styleKey={`hv-gpa-${hv.id}`}
            title="Đổi icon & màu icon Điểm GPA / Thành tích"
          />
        </div>
        <AutoResizeInput
          dataStyleKey={`hv-gpa-${hv.id}`}
          value={hv.diemSo || hv.gpa || ''}
          onChange={(e) => onSua(hv.id, { diemSo: e.target.value })}
          placeholder="GPA: 3.6/4.0 • Học bổng loại Giỏi"
          className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-full placeholder:italic placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export interface KhoiHocVanProps {
  trang?: number;
}

export const KhoiHocVan: React.FC<KhoiHocVanProps> = ({ trang }) => {
  const { cv, themHocVan, suaHocVan, xoaHocVan, sapXepHocVan } = useKhoLuuTruCV();
  const mauKhoi =
    cv.dinhDang?.kieuChuTuyChinh?.['khoi-hoc-van']?.mauChu ||
    cv.dinhDang.mauChuDao ||
    '#1a91f0';

  const trangChiDinh =
    cv.dinhDang?.phanBoTrangKhoi?.['hoc-van'] ||
    (cv.dinhDang?.ngatTrangKhoi?.['hoc-van'] ? 2 : 1);

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
                mauChuDao={mauKhoi}
                onSua={suaHocVan}
                onXoa={xoaHocVan}
              />
            ))}

            <button
              type="button"
              onClick={() => themHocVan()}
              style={{ color: mauKhoi }}
              className="flex items-center gap-1.5 text-[11px] font-medium hover:bg-slate-100 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
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
