import React from 'react';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiKinhNghiem: React.FC = () => {
  const { cv, themKinhNghiem, suaKinhNghiem, xoaKinhNghiem } = useStoreCV();

  return (
    <SortableKhoi id="kinh-nghiem" tieuDe="Kinh Nghiệm Làm Việc" icon={Briefcase}>
      <div className="space-y-4">
        {cv.kinhNghiem.map((kn) => (
          <div
            key={kn.id}
            className="group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-blue-500 transition-colors"
          >
            <button
              onClick={() => xoaKinhNghiem(kn.id)}
              className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
              title="Xóa mục này"
            >
              <Trash2 size={13} />
            </button>

            <div className="flex items-baseline justify-between gap-2">
              <input
                type="text"
                value={kn.viTri}
                onChange={(e) => suaKinhNghiem(kn.id, { viTri: e.target.value })}
                placeholder="Vị trí / Chức danh"
                className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
              />
              <input
                type="text"
                value={kn.thoiGian}
                onChange={(e) => suaKinhNghiem(kn.id, { thoiGian: e.target.value })}
                placeholder="2022 - Hiện tại"
                className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-28 shrink-0 placeholder:italic"
              />
            </div>

            <input
              type="text"
              value={kn.congTy}
              onChange={(e) => suaKinhNghiem(kn.id, { congTy: e.target.value })}
              placeholder="Tên công ty / Doanh nghiệp"
              className="text-xs text-blue-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
            />

            <textarea
              value={kn.moTa}
              onChange={(e) => suaKinhNghiem(kn.id, { moTa: e.target.value })}
              placeholder="Mô tả công việc, trách nhiệm chính và các thành tựu đạt được..."
              className="w-full text-xs text-slate-600 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1 -ml-1 mt-1 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
              rows={2}
            />
          </div>
        ))}

        <button
          onClick={() => themKinhNghiem()}
          className="flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50/60 px-2.5 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          <span>Thêm Kinh Nghiệm</span>
        </button>
      </div>
    </SortableKhoi>
  );
};
