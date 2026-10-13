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
import { useKhoLuuTruCV } from '../../store';

export const TrinhThietKeCV: React.FC = () => {
  const { cv, batTatKhoi, sapXepKhoi } = useKhoLuuTruCV();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Di chuyển 6px mới bắt đầu kéo thả để không xung đột với click input
      },
    })
  );

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

    // =========================================================================
    // TRƯỜNG HỢP 1: Kéo một khối từ Sidebar thả sang tờ A4
    // =========================================================================
    if (activeIdStr.startsWith('sidebar-khoi-')) {
      const khoiId = activeIdStr.replace('sidebar-khoi-', '');

      // Bật hiển thị khối
      batTatKhoi(khoiId, true);

      // Nếu thả đè lên một khối cụ thể trên A4, chèn ngay vị trí khối đó
      if (overIdStr !== 'a4-canvas' && danhSachKhoiHienThi.includes(overIdStr)) {
        const overIndex = danhSachKhoiHienThi.indexOf(overIdStr);
        const newOrder = [...danhSachKhoiHienThi];
        if (!newOrder.includes(khoiId)) {
          newOrder.splice(overIndex, 0, khoiId);
        }
        sapXepKhoi(newOrder);
      } else {
        // Thả vào nền canvas A4 thì thêm vào cuối
        if (!danhSachKhoiHienThi.includes(khoiId)) {
          sapXepKhoi([...danhSachKhoiHienThi, khoiId]);
        }
      }
      return;
    }

    // =========================================================================
    // TRƯỜNG HỢP 2: Kéo các khối đang có trên A4 để đổi vị trí
    // =========================================================================
    if (
      activeIdStr !== overIdStr &&
      danhSachKhoiHienThi.includes(activeIdStr) &&
      danhSachKhoiHienThi.includes(overIdStr)
    ) {
      const oldIndex = danhSachKhoiHienThi.indexOf(activeIdStr);
      const newIndex = danhSachKhoiHienThi.indexOf(overIdStr);
      const newOrder = arrayMove(danhSachKhoiHienThi, oldIndex, newIndex);
      sapXepKhoi(newOrder);
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
      <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-53px)] bg-[#f7f9fc] overflow-hidden">
        {/* =================================================================== */}
        {/* CỘT TRÁI: SIDEBAR DANH SÁCH KHỐI & UPLOAD AVATAR                    */}
        {/* =================================================================== */}
        <SidebarKhoi />

        {/* =================================================================== */}
        {/* CỘT PHẢI: TỜ GIẤY A4 KÍCH THƯỚC CHUẨN                               */}
        {/* =================================================================== */}
        <main className="flex-1 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
          <ToGiayA4 />
        </main>
      </div>

      {/* Hiệu ứng kéo thả mượt mà với DragOverlay */}
      <DragOverlay>
        {activeKhoi ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border-2 border-[#1a91f0] shadow-2xl scale-105 opacity-90 cursor-grabbing min-w-[240px]">
            <GripVertical size={16} className="text-[#1a91f0]" />
            <span
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: cv.dinhDang.mauChuDao }}
            >
              {React.createElement(activeKhoi.icon, { size: 15 })}
            </span>
            <div>
              <p className="text-xs font-bold text-[#0f141e]">{activeKhoi.ten}</p>
              <p className="text-[10px] text-[#828ba2]">Đang kéo vào tờ A4...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TrinhThietKeCV;
