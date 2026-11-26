import React from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  GripVertical,
  Building2,
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
import { useKhoLuuTruCV, type KinhNghiemItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';
import { SoanThaoRichText } from '../ui/SoanThaoRichText';
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

interface ItemProps {
  kn: KinhNghiemItem;
  mauChuDao: string;
  onSua: (id: string, duLieu: Partial<KinhNghiemItem>) => void;
  onXoa: (id: string) => void;
}

const SortableKinhNghiemItemRow: React.FC<ItemProps> = ({
  kn,
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
  } = useSortable({ id: kn.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mauCongTy =
    cv.dinhDang?.kieuChuTuyChinh?.[`kn-cty-${kn.id}`]?.mauChu || mauChuDao;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative border-l-2 border-slate-200 pl-3.5 transition-colors break-inside-avoid print:break-inside-avoid ${
        isDragging ? 'opacity-40 bg-blue-50/50 rounded-lg' : ''
      }`}
    >
      {/* Tay cầm kéo thả cho từng mục kinh nghiệm */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-3.5 top-0.5 opacity-0 group-hover/item:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing transition print:hidden"
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

      {/* Dòng 1: Vị trí chức danh (Icon) & Thời gian (Icon) */}
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-0.5">
        <div className="flex items-start gap-1.5 flex-1 min-w-[140px]">
          <div className="mt-0.5 shrink-0">
            <NutChonIconTuyChinh
              iconName={kn.iconViTri || 'Briefcase'}
              fallback={Briefcase}
              onChonIcon={(ic) => onSua(kn.id, { iconViTri: ic })}
              size={12}
              mauChuDao={mauChuDao}
              styleKey={`kn-vitri-${kn.id}`}
              title="Đổi icon & màu icon Vị trí / Chức danh"
            />
          </div>
          <AutoResizeInput
            dataStyleKey={`kn-vitri-${kn.id}`}
            value={kn.viTri}
            onChange={(e) => onSua(kn.id, { viTri: e.target.value })}
            placeholder="Vị trí / Chức danh"
            className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 flex-1 min-w-0 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto pt-0.5">
          <NutChonIconTuyChinh
            iconName={kn.iconThoiGian || 'Calendar'}
            fallback={Calendar}
            onChonIcon={(ic) => onSua(kn.id, { iconThoiGian: ic })}
            size={11}
            mauChuDao="#94a3b8"
            styleKey={`kn-tg-${kn.id}`}
            title="Đổi icon & màu icon Thời gian"
          />
          <input
            type="text"
            data-style-key={`kn-tg-${kn.id}`}
            value={kn.thoiGian}
            onChange={(e) => onSua(kn.id, { thoiGian: e.target.value })}
            placeholder="2023 - Hiện tại"
            className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 min-w-[75px] max-w-[130px] shrink-0 placeholder:italic"
          />
        </div>
      </div>

      {/* Dòng 2: Tên công ty */}
      <div className="flex items-start gap-1.5 mt-0.5">
        <div className="mt-0.5 shrink-0">
          <NutChonIconTuyChinh
            iconName={kn.iconCongTy || 'Building2'}
            fallback={Building2}
            onChonIcon={(ic) => onSua(kn.id, { iconCongTy: ic })}
            size={12}
            mauChuDao={mauChuDao}
            styleKey={`kn-cty-${kn.id}`}
            title="Đổi icon & màu icon Công ty / Doanh nghiệp"
          />
        </div>
        <AutoResizeInput
          dataStyleKey={`kn-cty-${kn.id}`}
          value={kn.congTy}
          onChange={(e) => onSua(kn.id, { congTy: e.target.value })}
          placeholder="Tên công ty / Doanh nghiệp"
          style={{ color: mauCongTy }}
          className="text-xs font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
        />
      </div>

      <SoanThaoRichText
        value={kn.moTa}
        onChange={(html) => onSua(kn.id, { moTa: html })}
        placeholder="Mô tả công việc, trách nhiệm chính và các thành tựu (hỗ trợ IN HOA, Đậm, Nghiêng, Màu sắc, Cỡ chữ, Chèn Icon)..."
        className="w-full text-xs text-slate-600 bg-transparent rounded p-1 -ml-1 mt-1 focus:bg-slate-50/80"
      />
    </div>
  );
};

export interface KhoiKinhNghiemProps {
  trang?: number;
}

export const KhoiKinhNghiem: React.FC<KhoiKinhNghiemProps> = ({ trang }) => {
  const { cv, themKinhNghiem, suaKinhNghiem, xoaKinhNghiem, sapXepKinhNghiem } =
    useKhoLuuTruCV();
  const mauKhoi =
    cv.dinhDang?.kieuChuTuyChinh?.['khoi-kinh-nghiem']?.mauChu ||
    cv.dinhDang.mauChuDao ||
    '#1a91f0';

  const soCot = cv.boCuc?.danhSachCot?.length || 2;
  const soTrangCV = cv.dinhDang?.soTrangCV || 1;

  // Lọc danh sách công việc hiển thị theo từng trang
  const itemsHienThi = React.useMemo(() => {
    if (!trang) return cv.kinhNghiem;

    // Nếu người dùng có gán trang cụ thể cho từng item
    const phanBoItem = cv.dinhDang?.phanBoTrangItem;
    if (phanBoItem) {
      return cv.kinhNghiem.filter((kn, idx) => {
        const tr = phanBoItem[kn.id] ?? (idx >= 2 ? 2 : 1);
        return tr === trang;
      });
    }

    // Tự động phân bổ thông minh:
    // Nếu có từ 3 công việc trở lên: 2 công việc đầu ở Trang 1, công việc thứ 3 trở đi ở Trang 2
    if (cv.kinhNghiem.length >= 3) {
      if (trang === 1) return cv.kinhNghiem.slice(0, 2);
      if (trang === 2) return cv.kinhNghiem.slice(2);
    }

    // Nếu có 2 công việc trong layout nhiều cột (3-4 cột) hoặc CV 2 trang:
    if (cv.kinhNghiem.length === 2 && (soTrangCV >= 2 || soCot >= 3)) {
      if (trang === 1) return [cv.kinhNghiem[0]];
      if (trang === 2) return [cv.kinhNghiem[1]];
    }

    // Mặc định: tất cả ở Trang 1, Trang 2 không có
    return trang === 1 ? cv.kinhNghiem : [];
  }, [cv.kinhNghiem, trang, cv.dinhDang?.phanBoTrangItem, soTrangCV, soCot]);

  // Nếu trang này không có công việc nào thì ẩn khối này đi
  if (itemsHienThi.length === 0) {
    return null;
  }

  const laTrang2 = trang === 2;
  const tieuDeHienThi = laTrang2
    ? 'Kinh Nghiệm Làm Việc (tiếp)'
    : 'Kinh Nghiệm Làm Việc';

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

  const itemIds = itemsHienThi.map((k) => k.id);

  return (
    <SortableKhoi
      id={laTrang2 ? 'kinh-nghiem-p2' : 'kinh-nghiem'}
      tieuDe={tieuDeHienThi}
      icon={Briefcase}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {itemsHienThi.map((kn) => (
              <SortableKinhNghiemItemRow
                key={kn.id}
                kn={kn}
                mauChuDao={mauKhoi}
                onSua={suaKinhNghiem}
                onXoa={xoaKinhNghiem}
              />
            ))}

            <button
              type="button"
              onClick={() => themKinhNghiem()}
              style={{ color: mauKhoi }}
              className="flex items-center gap-1.5 text-[11px] font-medium hover:bg-slate-100 px-2.5 py-1 rounded transition-colors cursor-pointer print:hidden"
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
