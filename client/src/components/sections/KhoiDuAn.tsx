import React from 'react';
import { FolderGit2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiDuAn: React.FC = () => {
  const { cv, themDuAn, suaDuAn, xoaDuAn } = useStoreCV();

  return (
    <SortableKhoi id="du-an" tieuDe="Dự Án Tiêu Biểu" icon={FolderGit2}>
      <div className="space-y-4">
        {cv.duAn.map((da) => (
          <div
            key={da.id}
            className="group/item relative border-l-2 border-slate-200 pl-3.5 hover:border-violet-500 transition-colors"
          >
            <button
              onClick={() => xoaDuAn(da.id)}
              className="absolute -right-1 top-0 opacity-0 group-hover/item:opacity-100 p-1 text-slate-300 hover:text-red-500 rounded transition-all"
              title="Xóa dự án"
            >
              <Trash2 size={13} />
            </button>

            <div className="flex items-baseline justify-between gap-2">
              <input
                type="text"
                value={da.ten}
                onChange={(e) => suaDuAn(da.id, { ten: e.target.value })}
                placeholder="Tên dự án"
                className="font-semibold text-xs text-slate-800 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
              />
              <input
                type="text"
                value={da.thoiGian}
                onChange={(e) => suaDuAn(da.id, { thoiGian: e.target.value })}
                placeholder="01/2023 - 06/2023"
                className="text-[11px] text-slate-400 text-right bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 w-28 shrink-0 placeholder:italic"
              />
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <input
                type="text"
                value={da.vaiTro}
                onChange={(e) => suaDuAn(da.id, { vaiTro: e.target.value })}
                placeholder="Vai trò trong dự án (ví dụ: Frontend Lead, Thiết kế UI)"
                className="text-xs text-violet-600 font-medium bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 flex-1 placeholder:font-normal placeholder:italic placeholder:text-slate-400"
              />
              {da.lienKet && (
                <a
                  href={da.lienKet.startsWith('http') ? da.lienKet : `https://${da.lienKet}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-blue-500"
                  title="Mở liên kết"
                >
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            <input
              type="text"
              value={da.lienKet || ''}
              onChange={(e) => suaDuAn(da.id, { lienKet: e.target.value })}
              placeholder="Đường dẫn / Demo dự án (tùy chọn)"
              className="text-[11px] text-slate-500 bg-transparent border-0 focus:outline-none focus:bg-slate-50/80 rounded px-1 -ml-1 w-full placeholder:italic placeholder:text-slate-400"
            />

            <textarea
              value={da.moTa}
              onChange={(e) => suaDuAn(da.id, { moTa: e.target.value })}
              placeholder="Mô tả công nghệ sử dụng, giải pháp và kết quả đạt được..."
              className="w-full text-xs text-slate-600 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1 -ml-1 mt-1 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
              rows={2}
            />
          </div>
        ))}

        <button
          onClick={() => themDuAn()}
          className="flex items-center gap-1.5 text-[11px] text-violet-600 hover:text-violet-700 font-medium hover:bg-violet-50/60 px-2.5 py-1 rounded transition-colors"
        >
          <Plus size={12} />
          <span>Thêm Dự Án</span>
        </button>
      </div>
    </SortableKhoi>
  );
};
