import React, { useState } from 'react';
import { Award, Plus, X } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiKyNang: React.FC = () => {
  const { cv, themKyNang, suaKyNang, xoaKyNang } = useStoreCV();
  const [kyNangMoi, setKyNangMoi] = useState('');

  const handleThemKyNang = (e: React.FormEvent) => {
    e.preventDefault();
    if (kyNangMoi.trim()) {
      themKyNang(kyNangMoi.trim());
      setKyNangMoi('');
    }
  };

  return (
    <SortableKhoi id="ky-nang" tieuDe="Kỹ Năng Chuyên Môn" icon={Award}>
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {cv.kyNang.map((kn) => (
            <div
              key={kn.id}
              className="group/tag inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-full text-xs text-slate-700 transition-colors"
            >
              <input
                type="text"
                value={kn.ten}
                onChange={(e) => suaKyNang(kn.id, { ten: e.target.value })}
                className="bg-transparent border-0 focus:outline-none text-xs w-auto min-w-[30px] font-medium"
                style={{ width: `${Math.max(kn.ten.length * 7.5, 40)}px` }}
              />
              <button
                onClick={() => xoaKyNang(kn.id)}
                className="text-slate-400 hover:text-red-500 rounded-full transition-colors"
                title="Xóa kỹ năng"
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleThemKyNang} className="flex items-center gap-2">
          <input
            type="text"
            value={kyNangMoi}
            onChange={(e) => setKyNangMoi(e.target.value)}
            placeholder="Nhập kỹ năng mới (ví dụ: React, Tiếng Anh B2, Quản lý dự án)..."
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 focus:bg-white flex-1 placeholder:italic placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!kyNangMoi.trim()}
            className="flex items-center gap-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-3 py-1 rounded transition-colors disabled:opacity-40 disabled:hover:bg-slate-100 disabled:hover:text-slate-700"
          >
            <Plus size={12} />
            <span>Thêm</span>
          </button>
        </form>
      </div>
    </SortableKhoi>
  );
};
