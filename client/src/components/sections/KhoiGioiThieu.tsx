import React from 'react';
import { User } from 'lucide-react';
import { useStoreCV } from '../../store/khoLuuTruCV';
import { SortableKhoi } from './SortableKhoi';
import { SoanThaoRichText } from '../ui/SoanThaoRichText';

export const KhoiGioiThieu: React.FC = () => {
  const { cv, setGioiThieu } = useStoreCV();

  return (
    <SortableKhoi id="gioi-thieu" tieuDe="Giới Thiệu Bản Thân" icon={User}>
      <SoanThaoRichText
        value={cv.gioiThieu}
        onChange={setGioiThieu}
        placeholder="Viết một đoạn ngắn giới thiệu bản thân, mục tiêu sự nghiệp và điểm mạnh nổi bật (bôi đen chữ để in đậm, in nghiêng, gạch chân)..."
        className="w-full text-xs text-slate-700 bg-transparent rounded p-1.5 focus:bg-slate-50/80"
      />
    </SortableKhoi>
  );
};
