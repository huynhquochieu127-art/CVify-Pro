import React from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiChungChi: React.FC = () => {
  const { cv, themChungChi, suaChungChi, xoaChungChi } = useStoreCV();

  return (
    <SortableKhoi id="chung-chi" tieuDe="Chứng Chỉ & Giải Thưởng" icon={ShieldCheck}>
      <div className="space-y-3">
        {cv.chungChi.map((cc) => (
          <div
            key={cc.id}
            className="group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-amber-500 transition-colors"
          >
            <button
              onClick={() => xoaChungChi(cc.id)}
              className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
              title="Xóa chứng chỉ"
            >
              <Trash2 size={13} />
            </button>

            <div className="flex items-baseline justify-between gap-2">
              <input
                type="text"
                value={cc.ten}
                onChange={(e) => suaChungChi(cc.id, { ten: e.target.value })}
                placeholder="Tên chứng chỉ / Giải thưởng"
                className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
              />
              <input
                type="text"
                value={cc.nam}
                onChange={(e) => suaChungChi(cc.id, { nam: e.target.value })}
                placeholder="2023"
                className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-20 shrink-0 placeholder:italic"
              />
            </div>

            <input
              type="text"
              value={cc.toChuc}
              onChange={(e) => suaChungChi(cc.id, { toChuc: e.target.value })}
              placeholder="Tổ chức cấp (ví dụ: Google, AWS, TOEIC...)"
              className="text-xs text-amber-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
            />
          </div>
        ))}

        <button
          onClick={() => themChungChi()}
          className="flex items-center gap-1.5 text-[11px] text-amber-600 hover:text-amber-700 font-medium hover:bg-amber-50/60 px-2.5 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          <span>Thêm Chứng Chỉ</span>
        </button>
      </div>
    </SortableKhoi>
  );
};
