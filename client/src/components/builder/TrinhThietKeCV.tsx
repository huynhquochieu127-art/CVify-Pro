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

export const TrinhThietKeCV: React.FC = () => {
  const {
    cv,
    batTatKhoi,
    sapXepKhoi,
    sapXepKhoiCot,
    chuyenKhoiSangCot,
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

  const laCheDo2Cot = boCuc.cheDo === '2-cot';
  const cotTrai = boCuc.cotTrai || [];
  const cotPhai = boCuc.cotPhai || [];

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
      batTatKhoi(khoiId, true);

      if (laCheDo2Cot) {
        // Kiểm tra xem thả vào Cột Trái hay Cột Phải
        const thaVaoCotTrai =
          overIdStr === 'cot-trai' || cotTrai.includes(overIdStr);
        const thaVaoCotPhai =
          overIdStr === 'cot-phai' || cotPhai.includes(overIdStr);

        if (thaVaoCotTrai) {
          const targetIndex = cotTrai.includes(overIdStr)
            ? cotTrai.indexOf(overIdStr)
            : cotTrai.length;
          chuyenKhoiSangCot(khoiId, 'cot-trai', targetIndex);
        } else if (thaVaoCotPhai) {
          const targetIndex = cotPhai.includes(overIdStr)
            ? cotPhai.indexOf(overIdStr)
            : cotPhai.length;
          chuyenKhoiSangCot(khoiId, 'cot-phai', targetIndex);
        } else {
          // Thả vào nền A4 chung -> Phân bổ mặc định
          const cotMacDinh = KHOI_COT_TRAI_MAC_DINH.has(khoiId)
            ? 'cot-trai'
            : 'cot-phai';
          chuyenKhoiSangCot(khoiId, cotMacDinh);
        }
      } else {
        // Chế độ 1 Cột toàn khổ
        if (overIdStr !== 'a4-canvas' && danhSachKhoiHienThi.includes(overIdStr)) {
          const overIndex = danhSachKhoiHienThi.indexOf(overIdStr);
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
    // TRƯỜNG HỢP 2: Kéo các khối đang có trên A4 để sắp xếp hoặc đổi cột
    // =========================================================================
    if (laCheDo2Cot) {
      const nguonLaCotTrai = cotTrai.includes(activeIdStr);
      const nguonLaCotPhai = cotPhai.includes(activeIdStr);

      const dichLaCotTrai =
        overIdStr === 'cot-trai' || cotTrai.includes(overIdStr);
      const dichLaCotPhai =
        overIdStr === 'cot-phai' || cotPhai.includes(overIdStr);

      // Cùng Cột Trái -> Đổi thứ tự trong cột trái
      if (nguonLaCotTrai && dichLaCotTrai) {
        if (activeIdStr !== overIdStr && cotTrai.includes(overIdStr)) {
          const oldIndex = cotTrai.indexOf(activeIdStr);
          const newIndex = cotTrai.indexOf(overIdStr);
          const newOrder = arrayMove(cotTrai, oldIndex, newIndex);
          sapXepKhoiCot('cot-trai', newOrder);
        }
        return;
      }

      // Cùng Cột Phải -> Đổi thứ tự trong cột phải
      if (nguonLaCotPhai && dichLaCotPhai) {
        if (activeIdStr !== overIdStr && cotPhai.includes(overIdStr)) {
          const oldIndex = cotPhai.indexOf(activeIdStr);
          const newIndex = cotPhai.indexOf(overIdStr);
          const newOrder = arrayMove(cotPhai, oldIndex, newIndex);
          sapXepKhoiCot('cot-phai', newOrder);
        }
        return;
      }

      // Kéo xuyên cột: Từ Trái sang Phải
      if (nguonLaCotTrai && dichLaCotPhai) {
        const targetIndex = cotPhai.includes(overIdStr)
          ? cotPhai.indexOf(overIdStr)
          : cotPhai.length;
        chuyenKhoiSangCot(activeIdStr, 'cot-phai', targetIndex);
        return;
      }

      // Kéo xuyên cột: Từ Phải sang Trái
      if (nguonLaCotPhai && dichLaCotTrai) {
        const targetIndex = cotTrai.includes(overIdStr)
          ? cotTrai.indexOf(overIdStr)
          : cotTrai.length;
        chuyenKhoiSangCot(activeIdStr, 'cot-trai', targetIndex);
        return;
      }
    } else {
      // Chế độ 1 Cột: Sắp xếp thông thường
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
        {/* CỘT TRÁI: SIDEBAR DANH SÁCH KHỐI & QUẢN LÝ CẤU TRÚC                 */}
        {/* =================================================================== */}
        <SidebarKhoi />

        {/* =================================================================== */}
        {/* CỘT PHẢI: TỜ GIẤY A4 KÍCH THƯỚC CHUẨN                               */}
        {/* =================================================================== */}
        <main className="flex-1 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:overflow-visible">
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
