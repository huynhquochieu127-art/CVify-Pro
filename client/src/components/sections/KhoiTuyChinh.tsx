import React from 'react';
import { Layers, Columns2, Plus, Trash2 } from 'lucide-react';
import { useKhoLuuTruCV, type KhoiTuyChinhItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';
import { SoanThaoRichText } from '../ui/SoanThaoRichText';

export interface KhoiTuyChinhItemProps {
  id: string;
  tieuDe: string;
  noiDung: string;
}

interface KhoiTuyChinhProps {
  item: KhoiTuyChinhItem;
}

export const KhoiTuyChinh: React.FC<KhoiTuyChinhProps> = ({ item }) => {
  const { suaKhoiTuyChinh, xoaKhoiTuyChinh } = useKhoLuuTruCV();

  const dsCotCon = item.danhSachCotCon || [];

  const handleThemCotCon = () => {
    const baseCols =
      dsCotCon.length > 0
        ? [...dsCotCon]
        : [
            {
              id: `subcol-1-${Date.now()}`,
              tieuDeCot: 'Cột 1',
              noiDung: item.noiDung || '',
            },
          ];

    baseCols.push({
      id: `subcol-${baseCols.length + 1}-${Date.now()}`,
      tieuDeCot: `Cột ${baseCols.length + 1}`,
      noiDung: '',
    });

    suaKhoiTuyChinh(item.id, { danhSachCotCon: baseCols });
  };

  const handleSuaCotCon = (
    subId: string,
    duLieu: { tieuDeCot?: string; noiDung?: string }
  ) => {
    const capNhat = dsCotCon.map((c) => (c.id === subId ? { ...c, ...duLieu } : c));
    suaKhoiTuyChinh(item.id, { danhSachCotCon: capNhat });
  };

  const handleXoaCotCon = (subId: string) => {
    const conLai = dsCotCon.filter((c) => c.id !== subId);
    if (conLai.length <= 1) {
      suaKhoiTuyChinh(item.id, {
        noiDung: conLai[0]?.noiDung || item.noiDung,
        danhSachCotCon: [],
      });
    } else {
      suaKhoiTuyChinh(item.id, { danhSachCotCon: conLai });
    }
  };

  return (
    <SortableKhoi
      id={item.id}
      tieuDe={item.tieuDe || 'Mục Tùy Chỉnh'}
      icon={Layers}
      onXoaKhoi={() => xoaKhoiTuyChinh(item.id)}
      onDoiTieuDe={(tieuDeMoi) => suaKhoiTuyChinh(item.id, { tieuDe: tieuDeMoi })}
      nutThem={
        <button
          type="button"
          onClick={handleThemCotCon}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1a91f0] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition cursor-pointer"
          title="Thêm cột con tùy ý bên trong mục này"
        >
          <Columns2 size={11} />
          <Plus size={10} />
          <span>Thêm cột</span>
        </button>
      }
    >
      {dsCotCon.length > 1 ? (
        <div
          className="grid gap-3 mt-1"
          style={{
            gridTemplateColumns: `repeat(${dsCotCon.length}, minmax(0, 1fr))`,
          }}
        >
          {dsCotCon.map((col, idx) => (
            <div
              key={col.id}
              className="group/subcol relative border border-dashed border-slate-200 hover:border-blue-300 rounded-lg p-2 bg-slate-50/30"
            >
              <div className="flex items-center justify-between mb-1">
                <input
                  type="text"
                  data-style-key={`subcol-title-${col.id}`}
                  value={col.tieuDeCot ?? `Cột ${idx + 1}`}
                  onChange={(e) =>
                    handleSuaCotCon(col.id, { tieuDeCot: e.target.value })
                  }
                  placeholder={`Tiêu đề cột ${idx + 1}...`}
                  className="text-[11px] font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1a91f0] focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => handleXoaCotCon(col.id)}
                  className="opacity-0 group-hover/subcol:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition cursor-pointer print:hidden shrink-0"
                  title="Xóa cột con này"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <SoanThaoRichText
                value={col.noiDung}
                onChange={(html) => handleSuaCotCon(col.id, { noiDung: html })}
                placeholder="Nhập nội dung cột..."
                className="w-full text-xs text-slate-700 bg-transparent rounded p-1 focus:bg-white"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 mt-1">
          <SoanThaoRichText
            value={item.noiDung}
            onChange={(html) => suaKhoiTuyChinh(item.id, { noiDung: html })}
            placeholder="Nhập nội dung chi tiết cho mục này (hỗ trợ IN HOA, Đậm, Nghiêng, Màu sắc, Cỡ chữ, Chèn Icon...)..."
            className="w-full text-xs text-slate-700 bg-transparent rounded p-1 -ml-1 focus:bg-slate-50/80"
          />
        </div>
      )}
    </SortableKhoi>
  );
};
