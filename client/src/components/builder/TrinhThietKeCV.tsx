import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Layers, GripVertical } from 'lucide-react';
import { SidebarKhoi, DANH_SACH_KHOI } from './SidebarKhoi';
import { ToGiayA4 } from './ToGiayA4';
import { useKhoLuuTruCV, KHOI_COT_TRAI_MAC_DINH } from '../../store/khoLuuTruCV';
import type { CotTuChinh } from '../../types/cv';

export const TrinhThietKeCV: React.FC = () => {
  const {
    cv,
    batTatKhoi,
    sapXepKhoi,
    sapXepKhoiCot,
    chuyenKhoiSangCot,
    chuyenKhoiSangTrang,
  } = useKhoLuuTruCV();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Di chuyển 5px mới bắt đầu kéo thả để không xung đột với click input
      },
    })
  );

  const boCuc = cv.boCuc || {
    cheDo: '2-cot',
    cotTrai: ['hoc-van', 'ky-nang'],
    cotPhai: ['gioi-thieu', 'kinh-nghiem'],
    tiLe: '35-65',
  };

  const danhSachCot: CotTuChinh[] =
    boCuc.danhSachCot && boCuc.danhSachCot.length > 0
      ? boCuc.danhSachCot
      : boCuc.cheDo === '1-cot'
      ? [{ id: 'cot-1', ten: 'Cột chính', doRong: 100, khoiIds: cv.thuTuKhoi || [] }]
      : boCuc.cheDo === '3-cot'
      ? [
          { id: 'cot-trai', ten: 'Cột 1', doRong: 28, khoiIds: boCuc.cotTrai || [] },
          { id: 'cot-giua', ten: 'Cột 2', doRong: 44, khoiIds: boCuc.cotGiua || [] },
          { id: 'cot-phai', ten: 'Cột 3', doRong: 28, khoiIds: boCuc.cotPhai || [] },
        ]
      : [
          {
            id: 'cot-trai',
            ten: 'Cột Trái',
            doRong: boCuc.cheDo === '2-cot-deu' ? 50 : 35,
            khoiIds: boCuc.cotTrai || [],
          },
          {
            id: 'cot-phai',
            ten: 'Cột Phải',
            doRong: boCuc.cheDo === '2-cot-deu' ? 50 : 65,
            khoiIds: boCuc.cotPhai || [],
          },
        ];

  const laCheDoNhieuCot = boCuc.cheDo !== '1-cot' && danhSachCot.length > 1;

  const danhSachKhoiHienThi = (cv.thuTuKhoi || []).filter(
    (khoiId) => cv.anHienKhoi[khoiId] !== false
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    const laOverTrang2 =
      overIdStr.endsWith('-p2') ||
      overIdStr === 'a4-canvas-p2' ||
      cv.dinhDang?.phanBoTrangKhoi?.[overIdStr] === 2;
    const cleanOverId = overIdStr.replace('-p2', '');

    // =========================================================================
    // TRƯỜNG HỢP 1: Kéo một khối từ Sidebar thả sang tờ A4
    // =========================================================================
    if (activeIdStr.startsWith('sidebar-khoi-')) {
      const khoiId = activeIdStr.replace('sidebar-khoi-', '');
      batTatKhoi(khoiId, true);
      chuyenKhoiSangTrang(khoiId, laOverTrang2 ? 2 : 1);

      if (laCheDoNhieuCot) {
        const cotDich = danhSachCot.find(
          (c) => c.id === cleanOverId || c.khoiIds.includes(cleanOverId)
        );

        if (cotDich) {
          const targetIndex = cotDich.khoiIds.includes(cleanOverId)
            ? cotDich.khoiIds.indexOf(cleanOverId)
            : cotDich.khoiIds.length;
          chuyenKhoiSangCot(khoiId, cotDich.id, targetIndex);
        } else {
          const cotMacDinh = KHOI_COT_TRAI_MAC_DINH.has(khoiId)
            ? danhSachCot[0].id
            : danhSachCot[danhSachCot.length - 1].id;
          chuyenKhoiSangCot(khoiId, cotMacDinh);
        }
      } else {
        // Chế độ 1 Cột toàn khổ
        if (cleanOverId !== 'a4-canvas' && danhSachKhoiHienThi.includes(cleanOverId)) {
          const overIndex = danhSachKhoiHienThi.indexOf(cleanOverId);
          const newOrder = [...danhSachKhoiHienThi];
          if (!newOrder.includes(khoiId)) {
            newOrder.splice(overIndex, 0, khoiId);
          }
          sapXepKhoi(newOrder);
        } else {
          if (!danhSachKhoiHienThi.includes(khoiId)) {
            sapXepKhoi([...danhSachKhoiHienThi, khoiId]);
          }
        }
      }
      return;
    }

    // =========================================================================
    // TRƯỜNG HỢP 2: Kéo các khối đang có trên A4 để sắp xếp hoặc đổi giữa N cột
    // =========================================================================
    if (laCheDoNhieuCot) {
      const cotNguon = danhSachCot.find((c) => c.khoiIds.includes(activeIdStr));
      const cotDich = danhSachCot.find(
        (c) => c.id === cleanOverId || c.khoiIds.includes(cleanOverId)
      );

      if (!cotDich) return;

      if (overIdStr.endsWith('-p2')) {
        chuyenKhoiSangTrang(activeIdStr, 2);
      }

      // Cùng 1 cột -> Sắp xếp thứ tự trong cột đó
      if (cotNguon && cotNguon.id === cotDich.id) {
        if (activeIdStr !== cleanOverId && cotNguon.khoiIds.includes(cleanOverId)) {
          const oldIndex = cotNguon.khoiIds.indexOf(activeIdStr);
          const newIndex = cotNguon.khoiIds.indexOf(cleanOverId);
          const newOrder = arrayMove(cotNguon.khoiIds, oldIndex, newIndex);
          sapXepKhoiCot(cotNguon.id, newOrder);
        }
        return;
      }

      // Chuyển sang cột khác
      const targetIndex = cotDich.khoiIds.includes(cleanOverId)
        ? cotDich.khoiIds.indexOf(cleanOverId)
        : cotDich.khoiIds.length;
      chuyenKhoiSangCot(activeIdStr, cotDich.id, targetIndex);
    } else {
      // Chế độ 1 Cột: Sắp xếp thông thường
      if (overIdStr.endsWith('-p2')) {
        chuyenKhoiSangTrang(activeIdStr, 2);
      }
      if (
        activeIdStr !== cleanOverId &&
        danhSachKhoiHienThi.includes(activeIdStr) &&
        danhSachKhoiHienThi.includes(cleanOverId)
      ) {
        const oldIndex = danhSachKhoiHienThi.indexOf(activeIdStr);
        const newIndex = danhSachKhoiHienThi.indexOf(cleanOverId);
        const newOrder = arrayMove(danhSachKhoiHienThi, oldIndex, newIndex);
        sapXepKhoi(newOrder);
      }
    }
  };

  // Lấy thông tin khối đang kéo để hiển thị trên DragOverlay
  const getActiveKhoiInfo = () => {
    if (!activeId) return null;
    const cleanId = activeId.replace('sidebar-khoi-', '');
    const standard = DANH_SACH_KHOI.find((k) => k.id === cleanId);
    if (standard) return standard;
    const custom = cv.khoiTuyChinh?.find((k) => k.id === cleanId);
    if (custom) {
      return {
        id: custom.id,
        ten: custom.tieuDe || 'Mục Tùy Chỉnh',
        moTa: 'Mục tùy chỉnh của người dùng',
        icon: Layers,
      };
    }
    return null;
  };

  const activeKhoi = getActiveKhoiInfo();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-53px)] bg-[#f4f6fa] overflow-hidden print:overflow-visible print:min-h-0 print:h-auto print:block">
        {/* =================================================================== */}
        {/* CỘT TRÁI: SIDEBAR DANH SÁCH KHỐI & QUẢN LÝ CẤU TRÚC                 */}
        {/* =================================================================== */}
        <SidebarKhoi />

        {/* =================================================================== */}
        {/* CỘT PHẢI: TỜ GIẤY A4 KÍCH THƯỚC CHUẨN                               */}
        {/* =================================================================== */}
        <main className="flex-1 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
          <ToGiayA4 />
        </main>
      </div>

      {/* Hiệu ứng kéo thả 3D mượt mà với DragOverlay */}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeKhoi ? (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border-2 border-[#1a91f0] shadow-2xl scale-105 rotate-1 opacity-95 cursor-grabbing min-w-[260px] select-none pointer-events-none">
            <GripVertical size={18} className="text-[#1a91f0]" />
            <span
              className="p-2 rounded-xl text-white shadow-2xs"
              style={{ backgroundColor: cv.dinhDang.mauChuDao }}
            >
              {React.createElement(activeKhoi.icon, { size: 16 })}
            </span>
            <div>
              <p className="text-xs font-bold text-[#0f141e]">{activeKhoi.ten}</p>
              <p className="text-[10px] text-[#1a91f0] font-medium">Đang kéo vị trí...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TrinhThietKeCV;
