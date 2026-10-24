import React from 'react';
import { Plus, Columns2, Square } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';
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
  const { cv, chuyenCheDoBoCuc } = useKhoLuuTruCV();
  const { thuTuKhoi, anHienKhoi, khoiTuyChinh, boCuc } = cv;

  const laCheDo2Cot = boCuc?.cheDo === '2-cot';

  // =========================================================================
  // DROPPABLE REFS CHO TỪNG VÙNG TRÊN TỜ A4
  // =========================================================================
  // Canvas tổng
  const { setNodeRef: setA4DroppableRef, isOver: isA4Over } = useDroppable({
    id: 'a4-canvas',
  });

  // Vùng Cột Trái (35%)
  const { setNodeRef: setCotTraiRef, isOver: isCotTraiOver } = useDroppable({
    id: 'cot-trai',
  });

  // Vùng Cột Phải (65%)
  const { setNodeRef: setCotPhaiRef, isOver: isCotPhaiOver } = useDroppable({
    id: 'cot-phai',
  });

  // =========================================================================
  // PHÂN LOẠI DANH SÁCH KHỐI HIỂN THỊ
  // =========================================================================
  // 1 Cột: Toàn bộ khối hiển thị
  const danhSachKhoiHienThi = (thuTuKhoi || []).filter(
    (khoiId) => anHienKhoi[khoiId] !== false
  );

  // 2 Cột: Cột Trái & Cột Phải
  const cotTraiHienThi = (boCuc?.cotTrai || []).filter(
    (khoiId) => anHienKhoi[khoiId] !== false
  );

  const cotPhaiHienThi = (boCuc?.cotPhai || []).filter(
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
      className={`w-full flex flex-col items-center pb-16 print:p-0 select-text transition-all ${
        isA4Over ? 'ring-2 ring-blue-500/40 rounded-sm' : ''
      }`}
    >
      {/* THANH ĐIỀU KHIỂN BỐ CỤC NHANH (Layout Switcher Toolbar) */}
      <div className="w-full max-w-[800px] mb-3 flex items-center justify-between px-2 print:hidden">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium">Bố cục trang:</span>
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => chuyenCheDoBoCuc('2-cot')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              laCheDo2Cot
                ? 'bg-[#1a91f0] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Bố cục 2 Cột hiện đại (Sidebar 35% + Nội dung chính 65%)"
          >
            <Columns2 size={13} />
            <span>2 Cột (Hiện đại)</span>
          </button>

          <button
            type="button"
            onClick={() => chuyenCheDoBoCuc('1-cot')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !laCheDo2Cot
                ? 'bg-[#1a91f0] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Bố cục 1 Cột toàn chiều rộng chuẩn ATS"
          >
            <Square size={13} />
            <span>1 Cột (Cổ điển)</span>
          </button>
        </div>
      </div>

      {/* TỜ GIẤY A4 CHUẨN IN ẤN (210 x 297mm) */}
      <div className="page-a4 w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 bg-white border border-[#d9deeb] shadow-sm rounded-sm text-[#1e2532] flex flex-col justify-between print:border-none print:shadow-none print:m-0 print:p-8">
        <div>
          {/* HEADER THÔNG TIN CÁ NHÂN & AVATAR */}
          <KhoiThongTinCaNhan />

          {/* =================================================================== */}
          {/* TRƯỜNG HỢP 1: BỐ CỤC 2 CỘT HIỆN ĐẠI (TRÁI 35% - PHẢI 65%)          */}
          {/* =================================================================== */}
          {laCheDo2Cot ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 print:grid-cols-12 mt-4">
              {/* CỘT TRÁI (35% - 4 cols): Kỹ năng, học vấn, chứng chỉ, liên hệ */}
              <div
                ref={setCotTraiRef}
                className={`md:col-span-4 print:col-span-4 min-h-[220px] rounded-xl transition-all p-1.5 -m-1.5 ${
                  isCotTraiOver
                    ? 'ring-2 ring-[#1a91f0] bg-blue-50/30'
                    : 'border border-dashed border-transparent hover:border-slate-200'
                }`}
              >
                <SortableContext
                  items={cotTraiHienThi}
                  strategy={verticalListSortingStrategy}
                >
                  {cotTraiHienThi.length === 0 ? (
                    <div className="py-10 px-3 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Cột Trái (35%)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Kéo thả kỹ năng, học vấn hoặc chứng chỉ vào đây
                      </p>
                    </div>
                  ) : (
                    cotTraiHienThi.map((khoiId) => renderKhoi(khoiId))
                  )}
                </SortableContext>
              </div>

              {/* CỘT PHẢI (65% - 8 cols): Giới thiệu, kinh nghiệm, dự án */}
              <div
                ref={setCotPhaiRef}
                className={`md:col-span-8 print:col-span-8 min-h-[220px] rounded-xl transition-all p-1.5 -m-1.5 ${
                  isCotPhaiOver
                    ? 'ring-2 ring-[#1a91f0] bg-blue-50/30'
                    : 'border border-dashed border-transparent hover:border-slate-200'
                }`}
              >
                <SortableContext
                  items={cotPhaiHienThi}
                  strategy={verticalListSortingStrategy}
                >
                  {cotPhaiHienThi.length === 0 ? (
                    <div className="py-10 px-3 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Cột Phải (65%)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Kéo thả kinh nghiệm, giới thiệu hoặc dự án vào đây
                      </p>
                    </div>
                  ) : (
                    cotPhaiHienThi.map((khoiId) => renderKhoi(khoiId))
                  )}
                </SortableContext>
              </div>
            </div>
          ) : (
            /* =================================================================== */
            /* TRƯỜNG HỢP 2: BỐ CỤC 1 CỘT TOÀN KHỔ (FULL-WIDTH 100%)               */
            /* =================================================================== */
            <div className="mt-4">
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
                      Kéo một khối từ Sidebar bên trái thả vào đây để bắt đầu thiết kế bản CV của bạn.
                    </p>
                  </div>
                ) : (
                  danhSachKhoiHienThi.map((khoiId) => renderKhoi(khoiId))
                )}
              </SortableContext>
            </div>
          )}
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
