import React from 'react';
import { Layers, Trash2 } from 'lucide-react';
import { useKhoLuuTruCV, type KhoiTuyChinhItem } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

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

  return (
    <SortableKhoi id={item.id} tieuDe={item.tieuDe || 'Mục Tùy Chỉnh'} icon={Layers}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={item.tieuDe}
            onChange={(e) => suaKhoiTuyChinh(item.id, { tieuDe: e.target.value })}
            placeholder="Tên mục tùy chỉnh (VD: Hoạt động ngoại khóa, Sở thích...)"
            className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:italic placeholder:font-normal placeholder:text-slate-400"
          />
          <button
            onClick={() => xoaKhoiTuyChinh(item.id)}
            className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors text-[11px] flex items-center gap-1"
            title="Xóa mục tùy chỉnh này"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <textarea
          value={item.noiDung}
          onChange={(e) => suaKhoiTuyChinh(item.id, { noiDung: e.target.value })}
          placeholder="Nhập nội dung chi tiết cho mục này..."
          className="w-full text-xs text-slate-600 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1 -ml-1 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
          rows={3}
        />
      </div>
    </SortableKhoi>
  );
};
