import React from 'react';
import { User } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';

export const KhoiGioiThieu: React.FC = () => {
  const { cv, setGioiThieu } = useStoreCV();

  return (
    <SortableKhoi id="gioi-thieu" tieuDe="Giới Thiệu Bản Thân" icon={User}>
      <textarea
        value={cv.gioiThieu}
        onChange={(e) => setGioiThieu(e.target.value)}
        placeholder="Viết một đoạn ngắn giới thiệu bản thân, mục tiêu sự nghiệp và điểm mạnh nổi bật..."
        className="w-full text-xs text-slate-700 bg-transparent border-0 resize-none focus:outline-none focus:bg-slate-50/80 rounded p-1.5 transition-colors leading-relaxed placeholder:italic placeholder:text-slate-400"
        rows={3}
      />
    </SortableKhoi>
  );
};
