import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  SlidersHorizontal,
  Bold,
  Italic,
  Underline,
  CaseUpper,
  Type,
  Palette,
  Minus,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useKhoLuuTruCV,
  DANH_SACH_HINH_NEN,
  BAN_DICH_NGON_NGU,
} from '../../store/khoLuuTruCV';
import type { CotTuChinh, KieuChuItem } from '../../types/cv';
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

const MAU_CHU_NHANH = [
  '#0f141e',
  '#1a91f0',
  '#2563eb',
  '#059669',
  '#7c3aed',
  '#e11d48',
  '#d97706',
  '#475569',
];

const KY_HIEU_CHEN_NHANH = [
  '✦', '★', '⚡', '🎯', '💼', '🎓', '🏆', '📌',
  '🚀', '💻', '🌐', '📧', '📞', '📍', '🔥', '💡',
  '✓', '▸', '•', '◆', '🏅', '📊', '🛠️', '✨',
];

// Component Droppable cho từng cột động (hỗ trợ không giới hạn số cột)
interface CotDroppableProps {
  cot: CotTuChinh;
  khoiHienThi: string[];
  renderKhoi: (id: string) => React.ReactNode;
  soLuongCot: number;
  droppableId?: string;
  trang: number;
}

const CotDroppable: React.FC<CotDroppableProps> = ({
  cot,
  khoiHienThi,
  renderKhoi,
  soLuongCot,
  droppableId,
  trang,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId || cot.id,
  });

  // Render các khối thực tế và lọc bỏ những khối trả về null ở trang này
  const danhSachPhanTu = khoiHienThi
    .map((khoiId) => renderKhoi(khoiId))
    .filter(Boolean);

  const coNoiDung = danhSachPhanTu.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: `${Math.max(10, cot.doRong || Math.round(100 / soLuongCot))} 1 0%`,
        minWidth: 0,
      }}
      className={`min-h-[120px] rounded-xl transition-all p-1.5 -m-1.5 ${
        isOver
          ? 'ring-2 ring-[#1a91f0] bg-blue-50/40'
          : 'border border-dashed border-transparent hover:border-slate-200/80'
      }`}
    >
      <SortableContext
        items={khoiHienThi}
        strategy={verticalListSortingStrategy}
      >
        {!coNoiDung ? (
          /* Ở Trang 1: nếu cột thực sự chưa có khối nào gán vào */
          trang === 1 && khoiHienThi.length === 0 ? (
            <div className="py-6 px-2 text-center border-2 border-dashed border-slate-200/80 rounded-xl bg-slate-50/40 print:hidden">
              <p className="text-[11px] font-bold text-slate-400">
                {cot.ten} ({cot.doRong}%)
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Kéo thả khối vào đây
              </p>
            </div>
          ) : (
            /* Ở Trang 2 hoặc khi cột đã kết thúc nội dung từ Trang 1: để khoảng trống sạch sẽ, KHÔNG HIỆN KHUNG NÉT ĐỨT */
            <div className="min-h-[60px] h-full" />
          )
        ) : (
          danhSachPhanTu
        )}
      </SortableContext>
    </div>
  );
};

// Hàm gán giá trị trực tiếp vào input để kích hoạt sự kiện onChange của React
function capNhatGiaTriInputReact(
  el: HTMLInputElement | HTMLTextAreaElement,
  giaTriMoi: string
) {
  const prototype =
    el instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  if (nativeSetter) {
    nativeSetter.call(el, giaTriMoi);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

export const ToGiayA4: React.FC<ToGiayA4Props> = () => {
  const {
    cv,
    chuyenCheDoBoCuc,
    themCotMoi,
    xoaCot,
    doiDoRongCot,
    doiTenCot,
    capNhatKieuChu,
    chuyenKhoiSangTrang,
    datSoTrangCV,
  } = useKhoLuuTruCV();

  const { thuTuKhoi, anHienKhoi, khoiTuyChinh, boCuc, dinhDang } = cv;
  const cheDo = boCuc?.cheDo || '2-cot';

  const [hienQuanLyCot, setHienQuanLyCot] = useState(false);

  // Lấy danh sách cột động
  const danhSachCot: CotTuChinh[] =
    boCuc?.danhSachCot && boCuc.danhSachCot.length > 0
      ? boCuc.danhSachCot
      : cheDo === '1-cot'
      ? [{ id: 'cot-1', ten: 'Cột chính', doRong: 100, khoiIds: thuTuKhoi || [] }]
      : cheDo === '3-cot'
      ? [
          { id: 'cot-trai', ten: 'Cột 1', doRong: 28, khoiIds: boCuc?.cotTrai || [] },
          { id: 'cot-giua', ten: 'Cột 2', doRong: 44, khoiIds: boCuc?.cotGiua || [] },
          { id: 'cot-phai', ten: 'Cột 3', doRong: 28, khoiIds: boCuc?.cotPhai || [] },
        ]
      : [
          {
            id: 'cot-trai',
            ten: 'Cột Trái',
            doRong: cheDo === '2-cot-deu' ? 50 : 35,
            khoiIds: boCuc?.cotTrai || [],
          },
          {
            id: 'cot-phai',
            ten: 'Cột Phải',
            doRong: cheDo === '2-cot-deu' ? 50 : 65,
            khoiIds: boCuc?.cotPhai || [],
          },
        ];

  // Lấy cấu hình hình nền và từ điển ngôn ngữ hiện tại
  const hinhNenConfig =
    DANH_SACH_HINH_NEN.find((h) => h.id === dinhDang.hinhNen) ||
    DANH_SACH_HINH_NEN[0];
  const banDich =
    BAN_DICH_NGON_NGU[dinhDang.ngonNgu || 'vi'] || BAN_DICH_NGON_NGU['vi'];

  // =========================================================================
  // TỰ ĐỘNG PHÁT HIỆN SỐ TRANG (TỰ ĐỘNG QUA TRANG 2 KHI NỘI DUNG DÀI)
  // =========================================================================
  const soTrangCV = React.useMemo(() => {
    // 1. Nếu có cấu hình số trang rõ ràng >= 2
    if (dinhDang?.soTrangCV && dinhDang.soTrangCV >= 2) return 2;
    if (Object.values(dinhDang?.ngatTrangKhoi || {}).some(Boolean)) return 2;
    if (Object.values(dinhDang?.phanBoTrangKhoi || {}).some((tr) => tr === 2)) return 2;

    // 2. TỰ ĐỘNG: Nếu có từ 3 công việc trở lên -> Tự động kích hoạt Trang 2
    const soKN = cv.kinhNghiem?.length || 0;
    const soDA = cv.duAn?.length || 0;
    const soCC = cv.chungChi?.length || 0;
    const soCot = danhSachCot.length;

    if (soKN >= 3) return 2;
    if (soKN >= 2 && (soDA >= 1 || soCC >= 1 || soCot >= 3)) return 2;

    return dinhDang?.soTrangCV || 1;
  }, [
    dinhDang?.soTrangCV,
    dinhDang?.ngatTrangKhoi,
    dinhDang?.phanBoTrangKhoi,
    cv.kinhNghiem?.length,
    cv.duAn?.length,
    cv.chungChi?.length,
    danhSachCot.length,
  ]);

  const [trangHienTai, setTrangHienTai] = useState<number>(1);
  const [cheDoXem, setCheDoXem] = useState<'tung-trang' | 'tat-ca-trang'>('tung-trang');

  // Đảm bảo số trang hiện tại không vượt quá tổng số trang
  useEffect(() => {
    if (trangHienTai > soTrangCV) {
      setTrangHienTai(soTrangCV);
    }
  }, [soTrangCV, trangHienTai]);

  const handleThemTrang2 = () => {
    datSoTrangCV(2);
    setTrangHienTai(2);
  };

  const handleGopVe1Trang = () => {
    datSoTrangCV(1);
    setTrangHienTai(1);
    (thuTuKhoi || []).forEach((kId) => {
      chuyenKhoiSangTrang(kId, 1);
    });
  };

  // Quản lý thanh định dạng chữ nổi cho mọi ô input trên tờ A4
  const pageA4Ref = useRef<HTMLDivElement>(null);
  const floatingBarRef = useRef<HTMLDivElement>(null);
  const [focusedInput, setFocusedInput] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [focusedStyleKey, setFocusedStyleKey] = useState<string | null>(null);
  const [moChonKyHieu, setMoChonKyHieu] = useState(false);

  const { setNodeRef: setA4DroppableRef, isOver: isA4Over } = useDroppable({
    id: 'a4-canvas',
  });

  const danhSachKhoiHienThi = (thuTuKhoi || []).filter(
    (khoiId) => anHienKhoi[khoiId] !== false
  );

  // Đồng bộ định dạng chữ tùy chỉnh lên các ô input trên A4
  useEffect(() => {
    if (!pageA4Ref.current) return;
    const inputs = pageA4Ref.current.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input[type="text"], input[type="email"], input:not([type]), textarea');

    inputs.forEach((el, idx) => {
      let key = el.getAttribute('data-style-key');
      if (!key) {
        const ph = (el.getAttribute('placeholder') || 'field')
          .toLowerCase()
          .replace(/\s+/g, '-');
        key = `auto-${ph}-${idx}`;
        el.setAttribute('data-style-key', key);
      }

      const styleCfg: KieuChuItem | undefined = dinhDang.kieuChuTuyChinh?.[key];
      if (styleCfg) {
        el.style.fontWeight =
          styleCfg.inDam !== undefined ? (styleCfg.inDam ? '700' : '400') : '';
        el.style.fontStyle =
          styleCfg.inNghieng !== undefined
            ? styleCfg.inNghieng
              ? 'italic'
              : 'normal'
            : '';
        el.style.textDecoration =
          styleCfg.gachChan !== undefined
            ? styleCfg.gachChan
              ? 'underline'
              : 'none'
            : '';
        el.style.textTransform =
          styleCfg.inHoa !== undefined
            ? styleCfg.inHoa
              ? 'uppercase'
              : 'none'
            : '';
        if (styleCfg.mauChu) el.style.color = styleCfg.mauChu;
        if (styleCfg.coChu) {
          el.style.fontSize = String(styleCfg.coChu).endsWith('px')
            ? String(styleCfg.coChu)
            : `${styleCfg.coChu}px`;
        }
      }
    });
  }, [cv, dinhDang.kieuChuTuyChinh]);

  // Bắt sự kiện focus vào bất kỳ ô input nào trong trang A4
  const handleFocusCaptureA4 = (e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target;
    if (
      (target instanceof HTMLInputElement &&
        target.type !== 'color' &&
        target.type !== 'file' &&
        target.type !== 'number') ||
      target instanceof HTMLTextAreaElement
    ) {
      let key = target.getAttribute('data-style-key');
      if (!key) {
        key = `field-${target.placeholder || 'text'}`;
        target.setAttribute('data-style-key', key);
      }
      setFocusedInput(target);
      setFocusedStyleKey(key);
    }
  };

  // Đóng thanh công cụ chữ khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        floatingBarRef.current?.contains(target) ||
        (focusedInput && focusedInput.contains(target))
      ) {
        return;
      }
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      setFocusedInput(null);
      setFocusedStyleKey(null);
      setMoChonKyHieu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focusedInput]);

  const currentInputStyle: KieuChuItem =
    (focusedStyleKey && dinhDang.kieuChuTuyChinh?.[focusedStyleKey]) || {};

  // Chèn ký hiệu vào input
  const handleChenKyHieuVaoInput = (kyHieu: string) => {
    if (!focusedInput) return;
    const start = focusedInput.selectionStart ?? focusedInput.value.length;
    const end = focusedInput.selectionEnd ?? focusedInput.value.length;
    const val = focusedInput.value;
    const newVal = val.slice(0, start) + `${kyHieu} ` + val.slice(end);
    capNhatGiaTriInputReact(focusedInput, newVal);
    focusedInput.focus();
    setTimeout(() => {
      const pos = start + kyHieu.length + 1;
      focusedInput.setSelectionRange(pos, pos);
    }, 10);
  };

  // Đổi chữ thường ⇄ IN HOA
  const handleToggleInHoaInput = () => {
    if (!focusedStyleKey || !focusedInput) return;
    const nextInHoa = !currentInputStyle.inHoa;
    capNhatKieuChu(focusedStyleKey, { inHoa: nextInHoa });
    focusedInput.focus();
  };

  // Render từng khối nội dung dựa vào ID và số trang
  const renderKhoi = (khoiId: string, soTrang: number) => {
    switch (khoiId) {
      case 'gioi-thieu':
        // Giới thiệu bản thân luôn ở đầu Trang 1
        return soTrang === 1 ? <KhoiGioiThieu key="gioi-thieu" /> : null;
      case 'kinh-nghiem':
        // Kinh nghiệm tự động chia: Công việc 1, 2 ở Trang 1, Công việc 3 ở Trang 2
        return <KhoiKinhNghiem key={`kinh-nghiem-p${soTrang}`} trang={soTrang} />;
      case 'hoc-van':
        return <KhoiHocVan key={`hoc-van-p${soTrang}`} trang={soTrang} />;
      case 'ky-nang':
        return <KhoiKyNang key={`ky-nang-p${soTrang}`} trang={soTrang} />;
      case 'du-an':
        return <KhoiDuAn key={`du-an-p${soTrang}`} trang={soTrang} />;
      case 'chung-chi':
        return <KhoiChungChi key={`chung-chi-p${soTrang}`} trang={soTrang} />;
      default: {
        const itemTuyChinh = (khoiTuyChinh || []).find((k) => k.id === khoiId);
        if (itemTuyChinh) {
          const trangCustom = dinhDang?.phanBoTrangKhoi?.[khoiId] || 1;
          return trangCustom === soTrang ? (
            <KhoiTuyChinh key={itemTuyChinh.id} item={itemTuyChinh} />
          ) : null;
        }
        return null;
      }
    }
  };

  // Render nội dung của 1 trang A4 (theo các cột bố cục đã chọn)
  const renderNoiDungTrang = (soTrang: number) => {
    if (cheDo !== '1-cot' && danhSachCot.length > 1) {
      return (
        <div className="flex flex-col md:flex-row print:flex-row gap-6 mt-4 items-stretch">
          {danhSachCot.map((cot) => {
            const cacKhoiTrongCot = (cot.khoiIds || []).filter(
              (khoiId) => anHienKhoi[khoiId] !== false
            );
            return (
              <CotDroppable
                key={`${cot.id}-p${soTrang}`}
                droppableId={soTrang === 2 ? `${cot.id}-p2` : cot.id}
                cot={cot}
                khoiHienThi={cacKhoiTrongCot}
                renderKhoi={(id) => renderKhoi(id, soTrang)}
                soLuongCot={danhSachCot.length}
                trang={soTrang}
              />
            );
          })}
        </div>
      );
    }

    // Chế độ 1 Cột toàn khổ
    return (
      <div className="mt-4">
        <SortableContext items={danhSachKhoiHienThi} strategy={verticalListSortingStrategy}>
          {danhSachKhoiHienThi.map((khoiId) => renderKhoi(khoiId, soTrang))}
        </SortableContext>
      </div>
    );
  };

  return (
    <div
      ref={setA4DroppableRef}
      className={`w-full flex flex-col items-center pb-16 print:p-0 print:m-0 select-text transition-all ${
        isA4Over ? 'ring-2 ring-blue-500/40 rounded-sm' : ''
      }`}
    >
      {/* ===================================================================== */}
      {/* 1. THANH ĐIỀU HƯỚNG TRANG KIỂU STUDIO                                 */}
      {/* ===================================================================== */}
      <div className="w-full max-w-[800px] mb-2.5 flex flex-wrap items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs print:hidden">
        {/* Nhóm nút bấm chuyển qua lại trang 1, trang 2 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const prev = Math.max(1, trangHienTai - 1);
              setTrangHienTai(prev);
              if (cheDoXem === 'tat-ca-trang') {
                document.getElementById(`cv-trang-${prev}`)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={trangHienTai === 1}
            className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 text-xs font-medium"
            title="Về Trang trước"
          >
            <ChevronLeft size={14} strokeWidth={1.75} />
            <span className="hidden sm:inline">Trang trước</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setTrangHienTai(1);
                if (cheDoXem === 'tat-ca-trang') {
                  document.getElementById('cv-trang-1')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                trangHienTai === 1
                  ? 'bg-white text-[#1a91f0] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText size={13} strokeWidth={1.75} />
              <span>Trang 1</span>
            </button>

            {soTrangCV >= 2 ? (
              <button
                type="button"
                onClick={() => {
                  setTrangHienTai(2);
                  if (cheDoXem === 'tat-ca-trang') {
                    document.getElementById('cv-trang-2')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  trangHienTai === 2
                    ? 'bg-white text-[#1a91f0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText size={13} strokeWidth={1.75} />
                <span>Trang 2</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleThemTrang2}
                className="px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 hover:text-[#1a91f0] hover:bg-white/80 transition cursor-pointer flex items-center gap-1"
                title="Tạo thêm Trang 2 cho CV khi nội dung dài"
              >
                <Plus size={12} strokeWidth={2} />
                <span>Thêm Trang 2</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const next = Math.min(soTrangCV, trangHienTai + 1);
              setTrangHienTai(next);
              if (cheDoXem === 'tat-ca-trang') {
                document.getElementById(`cv-trang-${next}`)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            disabled={trangHienTai >= soTrangCV}
            className="px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer flex items-center gap-1 text-xs font-medium"
            title="Sang Trang sau"
          >
            <span className="hidden sm:inline">Trang sau</span>
            <ChevronRight size={14} strokeWidth={1.75} />
          </button>

          <span className="text-[11px] font-semibold text-slate-500 ml-1 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
            {trangHienTai} / {soTrangCV}
          </span>
        </div>

        {/* Chế độ xem: Từng trang ⇄ Xem cả 2 trang */}
        <div className="flex items-center gap-1.5">
          {soTrangCV >= 2 && (
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setCheDoXem('tung-trang')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  cheDoXem === 'tung-trang'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Xem và chỉnh sửa riêng từng trang"
              >
                Từng trang
              </button>
              <button
                type="button"
                onClick={() => setCheDoXem('tat-ca-trang')}
                className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                  cheDoXem === 'tat-ca-trang'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Xem cả 2 trang liền mạch như trang giấy Word"
              >
                Cả 2 trang
              </button>
            </div>
          )}

          {soTrangCV >= 2 && (
            <button
              type="button"
              onClick={handleGopVe1Trang}
              className="text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer"
              title="Gộp toàn bộ nội dung về lại 1 trang duy nhất"
            >
              Gộp về 1 trang
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. THANH ĐIỀU KHIỂN BỐ CỤC ĐA CỘT TÙY CHỈNH                            */}
      {/* ===================================================================== */}
      <div className="w-full max-w-[800px] mb-3 space-y-2 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-wrap items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-lg">
            {[
              { id: '1-cot' as const, nhan: '1 Cột', title: 'Bố cục 1 Cột toàn chiều rộng chuẩn ATS', cols: 1, active: cheDo === '1-cot' && danhSachCot.length === 1 },
              { id: '2-cot' as const, nhan: '2 Cột (35-65)', title: 'Bố cục 2 Cột lệch (35% - 65%)', cols: 2, active: cheDo === '2-cot' && danhSachCot.length === 2 },
              { id: '2-cot-deu' as const, nhan: '2 Cột (50-50)', title: 'Bố cục 2 Cột cân đối (50% - 50%)', cols: 2, active: cheDo === '2-cot-deu' && danhSachCot.length === 2 },
              { id: '3-cot' as const, nhan: '3 Cột', title: 'Bố cục 3 Cột', cols: 3, active: cheDo === '3-cot' && danhSachCot.length === 3 },
              { id: '4-cot' as const, nhan: '4 Cột', title: 'Bố cục 4 Cột đều nhau', cols: 4, active: cheDo === '4-cot' && danhSachCot.length === 4 },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chuyenCheDoBoCuc(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  item.active
                    ? 'bg-white text-[#1a91f0] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={item.title}
              >
                <IconBoCuc kieu={item.id} />
                <span>{item.nhan}</span>
              </button>
            ))}
          </div>

          {/* Nút tự tạo thêm cột mới & nút chỉnh tỉ lệ */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                themCotMoi();
                setHienQuanLyCot(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1a91f0] border border-slate-200 hover:border-slate-300 transition cursor-pointer"
              title="Tự tạo thêm cột mới tùy thích"
            >
              <Plus size={12} strokeWidth={2} />
              <span>Thêm cột ({danhSachCot.length})</span>
            </button>

            {danhSachCot.length > 1 && (
              <button
                type="button"
                onClick={() => setHienQuanLyCot(!hienQuanLyCot)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  hienQuanLyCot
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Tùy chỉnh độ rộng (%) và tên từng cột"
              >
                <SlidersHorizontal size={12} strokeWidth={1.75} />
                <span>Tỉ lệ cột</span>
              </button>
            )}
          </div>
        </div>

        {/* BẢNG TÙY CHỈNH TỈ LỆ % VÀ QUẢN LÝ CỘT */}
        {(hienQuanLyCot || danhSachCot.length >= 4) && danhSachCot.length > 1 && (
          <div className="bg-white p-3 rounded-2xl border border-blue-200/80 shadow-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal size={12} className="text-[#1a91f0]" />
                Đang hiển thị {danhSachCot.length} cột tùy chỉnh:
              </span>
              <span className="text-[10px] text-slate-400">
                Khi xóa cột, nội dung bên trong sẽ tự dồn sang cột kế bên
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {danhSachCot.map((cot, index) => (
                <div
                  key={cot.id}
                  className="flex flex-col gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/90"
                >
                  <div className="flex items-center justify-between gap-1">
                    <input
                      type="text"
                      value={cot.ten}
                      onChange={(e) => doiTenCot(cot.id, e.target.value)}
                      className="text-[11px] font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-[#1a91f0] focus:outline-none w-full truncate"
                      title="Đổi tên cột"
                    />
                    {danhSachCot.length > 1 && (
                      <button
                        type="button"
                        onClick={() => xoaCot(cot.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer shrink-0"
                        title={`Xóa ${cot.ten}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => doiDoRongCot(cot.id, Math.max(10, cot.doRong - 5))}
                      className="p-0.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                      title="Giảm 5%"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-[11px] font-extrabold text-[#1a91f0]">
                      Cột {index + 1}: {cot.doRong}%
                    </span>
                    <button
                      type="button"
                      onClick={() => doiDoRongCot(cot.id, Math.min(85, cot.doRong + 5))}
                      className="p-0.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                      title="Tăng 5%"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THANH ĐỊNH DẠNG CHỮ NỔI CHO Ô NHẬP LIỆU */}
        {focusedInput && focusedStyleKey && (
          <div
            ref={floatingBarRef}
            onMouseDown={(e) => {
              const tag = (e.target as HTMLElement)?.tagName;
              if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'OPTION' && tag !== 'LABEL') {
                e.preventDefault();
              }
            }}
            className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-2xl shadow-lg border border-slate-700 animate-in fade-in duration-150"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <Type size={13} className="text-blue-400" />
              <span>Định dạng ô đang nhập:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  capNhatKieuChu(focusedStyleKey, {
                    inDam: !currentInputStyle.inDam,
                  })
                }
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  currentInputStyle.inDam
                    ? 'bg-[#1a91f0] text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="In đậm"
              >
                <Bold size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  capNhatKieuChu(focusedStyleKey, {
                    inNghieng: !currentInputStyle.inNghieng,
                  })
                }
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  currentInputStyle.inNghieng
                    ? 'bg-[#1a91f0] text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="In nghiêng"
              >
                <Italic size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  capNhatKieuChu(focusedStyleKey, {
                    gachChan: !currentInputStyle.gachChan,
                  })
                }
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  currentInputStyle.gachChan
                    ? 'bg-[#1a91f0] text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Gạch chân"
              >
                <Underline size={13} />
              </button>

              <button
                type="button"
                onClick={handleToggleInHoaInput}
                className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  currentInputStyle.inHoa
                    ? 'bg-[#1a91f0] text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
                title="Bật/Tắt IN HOA"
              >
                <CaseUpper size={14} />
                <span>IN HOA</span>
              </button>

              <div className="w-px h-4 bg-slate-700 mx-1" />

              <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg">
                <span className="text-[10px] text-slate-400">Cỡ:</span>
                <select
                  value={(currentInputStyle.coChu || '').replace('px', '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    capNhatKieuChu(focusedStyleKey, {
                      coChu: val ? `${val}px` : undefined,
                    });
                  }}
                  className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
                  title="Chọn cỡ chữ"
                >
                  <option value="" className="text-slate-900">Mặc định</option>
                  {[10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32].map(
                    (sz) => (
                      <option key={sz} value={sz} className="text-slate-900">
                        {sz}px
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="w-px h-4 bg-slate-700 mx-1" />

              <div className="flex items-center gap-1">
                {MAU_CHU_NHANH.map((mau) => (
                  <button
                    key={mau}
                    type="button"
                    onClick={() => {
                      capNhatKieuChu(focusedStyleKey, { mauChu: mau });
                      capNhatKieuChu(`icon-color-${focusedStyleKey}`, {
                        mauChu: mau,
                      });
                    }}
                    className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                      currentInputStyle.mauChu === mau
                        ? 'scale-125 border-white ring-2 ring-blue-400'
                        : 'border-slate-600 hover:scale-110'
                    }`}
                    style={{ backgroundColor: mau }}
                    title={`Đổi màu sang ${mau}`}
                  />
                ))}
                <label
                  className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-600"
                  title="Chọn màu tự do"
                >
                  <Palette size={11} className="text-amber-300" />
                  <input
                    type="color"
                    value={currentInputStyle.mauChu || dinhDang.mauChuDao}
                    onChange={(e) => {
                      const mauMoi = e.target.value;
                      capNhatKieuChu(focusedStyleKey, { mauChu: mauMoi });
                      capNhatKieuChu(`icon-color-${focusedStyleKey}`, {
                        mauChu: mauMoi,
                      });
                    }}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="w-px h-4 bg-slate-700 mx-1" />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoChonKyHieu(!moChonKyHieu)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    moChonKyHieu
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                  }`}
                  title="Chèn ký hiệu"
                >
                  <Plus size={12} strokeWidth={2} />
                  <span>Ký hiệu</span>
                </button>

                {moChonKyHieu && (
                  <div className="absolute right-0 top-full mt-2 z-50 w-64 p-2.5 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 grid grid-cols-8 gap-1">
                    {KY_HIEU_CHEN_NHANH.map((kh) => (
                      <button
                        key={kh}
                        type="button"
                        onClick={() => handleChenKyHieuVaoInput(kh)}
                        className="p-1.5 text-sm hover:bg-blue-50 rounded-lg transition text-center cursor-pointer"
                        title={`Chèn ${kh}`}
                      >
                        {kh}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. TỜ GIẤY A4 TRANG 1 (210 x 297mm)                                   */}
      {/* ===================================================================== */}
      <div
        id="cv-trang-1"
        data-page="1"
        ref={pageA4Ref}
        onFocusCapture={handleFocusCaptureA4}
        style={{
          fontFamily: dinhDang.fontChu || 'Inter, sans-serif',
          fontSize: dinhDang.coChu
            ? String(dinhDang.coChu).endsWith('px')
              ? dinhDang.coChu
              : `${dinhDang.coChu}px`
            : '14px',
          lineHeight: dinhDang.khoangCachDong || 1.45,
        }}
        className={`page-a4 w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 ${
          hinhNenConfig.canvasClass
        } border border-[#d9deeb] shadow-sm rounded-sm text-[#1e2532] flex-col justify-between print:border-none print:shadow-none print:m-0 print:p-8 ${
          cheDoXem === 'tung-trang' && trangHienTai !== 1
            ? 'hidden print:flex'
            : 'flex'
        }`}
      >
        <div className="flex-1">
          {/* HEADER THÔNG TIN CÁ NHÂN & AVATAR TRANG 1 */}
          <KhoiThongTinCaNhan />

          {/* CÁC MỤC NỘI DUNG THUỘC TRANG 1 (4 CỘT HOẶC 1 CỘT ĐỀU ĐỦ) */}
          {renderNoiDungTrang(1)}
        </div>

        {/* Chân trang Trang 1 */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 mt-6 border-t border-slate-200/80">
          <span>{banDich.nhanFooter.banQuyen}</span>
          <span className="font-semibold text-slate-500">
            {banDich.nhanFooter.trang(1, soTrangCV)}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VẠCH PHÂN CÁCH TRANG KIỂU WORD (CHỈ HIỆN KHI XEM CẢ 2 TRANG)         */}
      {/* ===================================================================== */}
      {soTrangCV >= 2 && cheDoXem === 'tat-ca-trang' && (
        <div className="w-full max-w-[800px] flex items-center justify-center my-6 select-none print:hidden">
          <div className="h-px bg-slate-300 flex-1" />
          <div className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a91f0]" />
            <span>Hết Trang 1 (297mm) • Bắt đầu Trang 2</span>
          </div>
          <div className="h-px bg-slate-300 flex-1" />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TỜ GIẤY A4 TRANG 2 (210 x 297mm)                                   */}
      {/* ===================================================================== */}
      {soTrangCV >= 2 && (
        <div
          id="cv-trang-2"
          data-page="2"
          onFocusCapture={handleFocusCaptureA4}
          style={{
            fontFamily: dinhDang.fontChu || 'Inter, sans-serif',
            fontSize: dinhDang.coChu
              ? String(dinhDang.coChu).endsWith('px')
                ? dinhDang.coChu
                : `${dinhDang.coChu}px`
              : '14px',
            lineHeight: dinhDang.khoangCachDong || 1.45,
          }}
          className={`page-a4 w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 ${
            hinhNenConfig.canvasClass
          } border border-[#d9deeb] shadow-sm rounded-sm text-[#1e2532] flex-col justify-between print:border-none print:shadow-none print:m-0 print:p-8 ${
            cheDoXem === 'tung-trang' && trangHienTai !== 2
              ? 'hidden print:flex'
              : 'flex'
          }`}
        >
          <div className="flex-1">
            {/* MINI HEADER TRANG 2: Tên ứng viên & Vị trí ứng tuyển */}
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#1e2532] uppercase tracking-wide">
                  {cv.thongTinCaNhan.hoTen || banDich.nhanFooter.miniHeader}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-[#1a91f0]">
                  {cv.thongTinCaNhan.viTriUngTuyen || 'Curriculum Vitae'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {banDich.nhanFooter.trang(2, soTrangCV)}
              </span>
            </div>

            {/* CÁC MỤC NỘI DUNG TIẾP TỤC Ở TRANG 2 (HIỂN THỊ TIẾP NỘI DUNG 4 CỘT) */}
            {renderNoiDungTrang(2)}
          </div>

          {/* Chân trang Trang 2 */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 mt-6 border-t border-slate-200/80">
            <span>{banDich.nhanFooter.banQuyen}</span>
            <span className="font-semibold text-slate-500">
              {banDich.nhanFooter.trang(2, soTrangCV)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const IconBoCuc: React.FC<{
  kieu: '1-cot' | '2-cot' | '2-cot-deu' | '3-cot' | '4-cot';
}> = ({ kieu }) => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect x="1.5" y="2" width="13" height="12" rx="2" />
      {kieu === '2-cot' && <line x1="6" y1="2" x2="6" y2="14" />}
      {kieu === '2-cot-deu' && <line x1="8" y1="2" x2="8" y2="14" />}
      {kieu === '3-cot' && (
        <>
          <line x1="5.8" y1="2" x2="5.8" y2="14" />
          <line x1="10.2" y1="2" x2="10.2" y2="14" />
        </>
      )}
      {kieu === '4-cot' && (
        <>
          <line x1="4.75" y1="2" x2="4.75" y2="14" />
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="11.25" y1="2" x2="11.25" y2="14" />
        </>
      )}
    </svg>
  );
};

export default ToGiayA4;
