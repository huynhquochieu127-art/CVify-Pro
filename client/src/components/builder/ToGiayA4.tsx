import React from 'react';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStoreCV } from '../../store/khoLuuTruCV';
import {
  KhoiThongTinCaNhan,
  KhoiGioiThieu,
  KhoiKinhNghiem,
  KhoiHocVan,
  KhoiKyNang,
  KhoiDuAn,
  KhoiChungChi,
  KhoiTuyChinh,
} from '../sections';

export interface ToGiayA4Props {
  onXoaKhoiExternal?: (id: string) => void;
}

export const ToGiayA4: React.FC<ToGiayA4Props> = () => {
  const { cv } = useStoreCV();
  const { thuTuKhoi, anHienKhoi, khoiTuyChinh } = cv;

  // Droppable container cho tờ giấy A4
  const { setNodeRef: setA4DroppableRef, isOver: isA4Over } = useDroppable({
    id: 'a4-canvas',
  });

  // Lọc ra các khối đang được hiển thị trên A4
  const danhSachKhoiHienThi = (thuTuKhoi || []).filter(
    (khoiId) => anHienKhoi[khoiId] !== false
  );

  // Render từng khối nội dung dựa vào ID
  const renderKhoi = (khoiId: string) => {
    switch (khoiId) {
      case 'gioi-thieu':
        return <KhoiGioiThieu key="gioi-thieu" />;
      case 'kinh-nghiem':
        return <KhoiKinhNghiem key="kinh-nghiem" />;
      case 'hoc-van':
        return <KhoiHocVan key="hoc-van" />;
      case 'ky-nang':
        return <KhoiKyNang key="ky-nang" />;
      case 'du-an':
        return <KhoiDuAn key="du-an" />;
      case 'chung-chi':
        return <KhoiChungChi key="chung-chi" />;
      default: {
        // Kiểm tra khối tùy chỉnh
        const itemTuyChinh = (khoiTuyChinh || []).find((k) => k.id === khoiId);
        if (itemTuyChinh) {
          return <KhoiTuyChinh key={itemTuyChinh.id} item={itemTuyChinh} />;
        }
        return null;
      }
    }
  };

  return (
    <div
      ref={setA4DroppableRef}
      className={`w-full flex justify-center pb-16 print:p-0 select-text transition-all ${
        isA4Over ? 'ring-2 ring-blue-500/40 rounded-sm' : ''
      }`}
    >
      {/* TỜ GIẤY A4 CHUẨN IN ẤN (210 x 297mm) */}
      <div className="page-a4 w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 bg-white shadow-2xl rounded-sm text-slate-800 flex flex-col justify-between print:shadow-none print:m-0 print:p-8">
        <div>
          {/* HEADER THÔNG TIN CÁ NHÂN & AVATAR */}
          <KhoiThongTinCaNhan />

          {/* CÁC KHỐI NỘI DUNG KÉO THẢ BẰNG @DND-KIT */}
          <SortableContext
            items={danhSachKhoiHienThi}
            strategy={verticalListSortingStrategy}
          >
            {danhSachKhoiHienThi.length === 0 ? (
              <div className="py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 my-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Plus size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  Chưa có khối nội dung nào trên CV
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Kéo một khối từ Sidebar bên trái thả vào đây, hoặc bật hiển thị khối trên Sidebar để bắt đầu thiết kế bản CV của bạn.
                </p>
              </div>
            ) : (
              danhSachKhoiHienThi.map((khoiId) => renderKhoi(khoiId))
            )}
          </SortableContext>
        </div>

        {/* Chân trang in PDF */}
        <div className="hidden print:block text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200">
          Thiết kế bằng Hệ thống CV Builder chuẩn ATS
        </div>
      </div>
    </div>
  );
};

export default ToGiayA4;
