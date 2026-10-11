import React from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiHocVan: React.FC = () => {
  const { cv, themHocVan, suaHocVan, xoaHocVan } = useStoreCV();

  return (
    <SortableKhoi id="hoc-van" tieuDe="Học Vấn & Bằng Cấp" icon={GraduationCap}>
      <div className="space-y-3.5">
        {cv.hocVan.map((hv) => (
          <div
            key={hv.id}
            className="group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-emerald-500 transition-colors"
          >
            <button
              onClick={() => xoaHocVan(hv.id)}
              className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
              title="Xóa mục này"
            >
              <Trash2 size={13} />
            </button>

            <div className="flex items-baseline justify-between gap-2">
              <input
                type="text"
                value={hv.chuyenNganh}
                onChange={(e) => suaHocVan(hv.id, { chuyenNganh: e.target.value })}
                placeholder="Chuyên ngành / Văn bằng"
                className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
              />
              <input
                type="text"
                value={hv.thoiGian}
                onChange={(e) => suaHocVan(hv.id, { thoiGian: e.target.value })}
                placeholder="2018 - 2022"
                className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-24 shrink-0 placeholder:italic"
              />
            </div>

            <input
              type="text"
              value={hv.truong}
              onChange={(e) => suaHocVan(hv.id, { truong: e.target.value })}
              placeholder="Tên trường đại học / Cơ sở đào tạo"
              className="text-xs text-emerald-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:font-normal placeholder:italic placeholder:text-slate-400"
            />

            <input
              type="text"
              value={hv.diemSo || hv.gpa || ''}
              onChange={(e) => suaHocVan(hv.id, { diemSo: e.target.value })}
              placeholder="Điểm số / GPA / Xếp loại tốt nghiệp (không bắt buộc)"
              className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:italic placeholder:text-slate-400 mt-0.5"
            />
          </div>
        ))}

        <button
          onClick={() => themHocVan()}
          className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50/60 px-2.5 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          <span>Thêm Học Vấn</span>
        </button>
      </div>
    </SortableKhoi>
  );
};
