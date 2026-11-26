import React from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  Rocket,
  Code2,
  Calendar,
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
import { useKhoLuuTruCV, type DuAnItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';
import { SoanThaoRichText } from '../ui/SoanThaoRichText';
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

interface ItemProps {
  da: DuAnItem;
  mauChuDao: string;
  onSua: (id: string, duLieu: Partial<DuAnItem>) => void;
  onXoa: (id: string) => void;
}

const SortableDuAnItemRow: React.FC<ItemProps> = ({
  da,
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
  } = useSortable({ id: da.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mauVaiTro =
    cv.dinhDang?.kieuChuTuyChinh?.[`da-vaitro-${da.id}`]?.mauChu || mauChuDao;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 transition-colors break-inside-avoid print:break-inside-avoid ${
        isDragging ? 'opacity-40 bg-blue-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục dự án */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition print:hidden"
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

      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
        <div className="flex items-start gap-1.5 flex-1 min-w-[140px]">
          <div className="mt-0.5 shrink-0">
            <NutChonIconTuyChinh
              iconName={da.iconTen || 'Rocket'}
              fallback={Rocket}
              onChonIcon={(ic) => onSua(da.id, { iconTen: ic })}
              size={12}
              mauChuDao={mauChuDao}
              styleKey={`da-ten-${da.id}`}
              title="Đổi icon & màu icon Tên dự án"
            />
          </div>
          <AutoResizeInput
            dataStyleKey={`da-ten-${da.id}`}
            value={da.ten}
            onChange={(e) => onSua(da.id, { ten: e.target.value })}
            placeholder="Tên dự án"
            className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 flex-1 min-w-0 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto pt-0.5">
          <NutChonIconTuyChinh
            iconName={da.iconThoiGian || 'Calendar'}
            fallback={Calendar}
            onChonIcon={(ic) => onSua(da.id, { iconThoiGian: ic })}
            size={11}
            mauChuDao="#94a3b8"
            styleKey={`da-tg-${da.id}`}
            title="Đổi icon & màu icon Thời gian"
          />
          <input
            type="text"
            data-style-key={`da-tg-${da.id}`}
            value={da.thoiGian}
            onChange={(e) => onSua(da.id, { thoiGian: e.target.value })}
            placeholder="01/2025 - 06/2025"
            className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 min-w-[75px] max-w-[130px] shrink-0 placeholder:italic"
          />
        </div>
      </div>

      <div className="flex items-start gap-1.5 mt-0.5">
        <div className="mt-0.5 shrink-0">
          <NutChonIconTuyChinh
            iconName={da.iconVaiTro || 'Code2'}
            fallback={Code2}
            onChonIcon={(ic) => onSua(da.id, { iconVaiTro: ic })}
            size={12}
            mauChuDao={mauChuDao}
            styleKey={`da-vaitro-${da.id}`}
            title="Đổi icon & màu icon Vai trò dự án"
          />
        </div>
        <AutoResizeInput
          dataStyleKey={`da-vaitro-${da.id}`}
          value={da.vaiTro}
          onChange={(e) => onSua(da.id, { vaiTro: e.target.value })}
          placeholder="Vai trò trong dự án (ví dụ: Fullstack Developer)"
          style={{ color: mauVaiTro }}
          className="text-xs font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
        {da.lienKet && (
          <a
            href={da.lienKet.startsWith('http') ? da.lienKet : `https://${da.lienKet}`}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-blue-500 mt-1 shrink-0"
            title="Mở liên kết"
          >
            <ExternalLink size={11} />
          </a>
        )}
      </div>

      <input
        type="text"
        data-style-key={`da-link-${da.id}`}
        value={da.lienKet || ''}
        onChange={(e) => onSua(da.id, { lienKet: e.target.value })}
        placeholder="Đường dẫn / Demo dự án (tùy chọn)"
        className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-full placeholder:italic placeholder:text-slate-400 mt-0.5"
      />

      <SoanThaoRichText
        value={da.moTa}
        onChange={(html) => onSua(da.id, { moTa: html })}
        placeholder="Mô tả công nghệ sử dụng, giải pháp và kết quả (hỗ trợ IN HOA, Đậm, Nghiêng, Màu sắc, Cỡ chữ, Chèn Icon)..."
        className="w-full text-xs text-slate-600 bg-transparent rounded p-1 -ml-1 mt-1 focus:bg-slate-50/80"
      />
    </div>
  );
};

export interface KhoiDuAnProps {
  trang?: number;
}

export const KhoiDuAn: React.FC<KhoiDuAnProps> = ({ trang }) => {
  const { cv, themDuAn, suaDuAn, xoaDuAn, sapXepDuAn } = useKhoLuuTruCV();
  const mauKhoi =
    cv.dinhDang?.kieuChuTuyChinh?.['khoi-du-an']?.mauChu ||
    cv.dinhDang.mauChuDao ||
    '#1a91f0';

  const trangChiDinh =
    cv.dinhDang?.phanBoTrangKhoi?.['du-an'] ||
    (cv.dinhDang?.ngatTrangKhoi?.['du-an'] ? 2 : 1);

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
                mauChuDao={mauKhoi}
                onSua={suaDuAn}
                onXoa={xoaDuAn}
              />
            ))}

            <button
              type="button"
              onClick={() => themDuAn()}
              style={{ color: mauKhoi }}
              className="flex items-center gap-1.5 text-[11px] font-medium hover:bg-slate-100 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
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
