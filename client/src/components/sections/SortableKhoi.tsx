import React from 'react';
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  EyeOff,
  Bold,
  Italic,
  CaseUpper,
  Palette,
  FileText,
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';
import { NutChonIconTuyChinh } from '../ui/BangChonIcon';
import { AutoResizeInput } from '../ui/AutoResizeInput';

export interface SortableKhoiProps {
  id: string;
  tieuDe: string;
  icon: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  mauChuDao?: string;
  nutThem?: React.ReactNode;
  onXoaKhoi?: () => void;
  onDoiTieuDe?: (tieuDeMoi: string) => void;
  children: React.ReactNode;
}

export const SortableKhoi: React.FC<SortableKhoiProps> = ({
  id,
  tieuDe,
  icon,
  mauChuDao,
  nutThem,
  onXoaKhoi,
  onDoiTieuDe,
  children,
}) => {
  const {
    cv,
    batTatKhoi,
    doiCotKhoi,
    diChuyenKhoiLenXuong,
    datIconKhoi,
    datTieuDeKhoi,
    capNhatKieuChu,
    chuyenKhoiSangTrang,
  } = useKhoLuuTruCV();

  const laNgatTrang = cv.dinhDang?.ngatTrangKhoi?.[id] ?? false;
  const trangHienTaiKhoi =
    cv.dinhDang?.phanBoTrangKhoi?.[id] || (laNgatTrang ? 2 : 1);

  const kieuTieuDe = cv.dinhDang?.kieuChuTuyChinh?.[`khoi-${id}`] || {};
  const mau = kieuTieuDe.mauChu || mauChuDao || cv.dinhDang?.mauChuDao || '#1a91f0';
  const laNhieuCot =
    cv.boCuc?.cheDo !== '1-cot' && (cv.boCuc?.danhSachCot?.length ?? 2) > 1;

  const iconTuyChinh = cv.dinhDang?.iconKhoi?.[id];
  const tieuDeHienThi = cv.dinhDang?.tieuDeKhoi?.[id] ?? tieuDe;

  const inDam = kieuTieuDe.inDam ?? true;
  const inNghieng = kieuTieuDe.inNghieng ?? false;
  const inHoa = kieuTieuDe.inHoa ?? true;
  const coChuTieuDe = kieuTieuDe.coChu || '12px';

  const [moChonMauKhoi, setMoChonMauKhoi] = React.useState(false);
  const MAU_KHOI_NHANH = [
    '#0f141e',
    '#1a91f0',
    '#2563eb',
    '#059669',
    '#7c3aed',
    '#e11d48',
    '#d97706',
    '#475569',
  ];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleXoa = () => {
    if (onXoaKhoi) {
      onXoaKhoi();
    } else {
      batTatKhoi(id, false);
    }
  };

  const handleSuaTieuDe = (val: string) => {
    if (onDoiTieuDe) {
      onDoiTieuDe(val);
    } else {
      datTieuDeKhoi(id, val);
    }
  };

  return (
    <div
        ref={setNodeRef}
        id={`cv-khoi-${id}`}
        style={{
          ...style,
          ...(laNgatTrang ? { breakBefore: 'page', pageBreakBefore: 'always' } : {}),
        }}
        onMouseLeave={() => setMoChonMauKhoi(false)}
        className={`group relative rounded-xl transition-all duration-200 p-2 mb-4 w-full max-w-full box-border border ${
          laNgatTrang ? 'print:[break-before:page] print:[page-break-before:always]' : ''
        } break-inside-avoid print:break-inside-avoid print:page-break-inside-avoid ${
          isDragging
            ? 'opacity-30 ring-2 ring-[#1a91f0] bg-blue-50/50 shadow-lg z-30 border-blue-300'
            : isOver
            ? 'border-t-2 border-t-[#1a91f0] bg-blue-50/20'
            : 'border-transparent hover:border-slate-200/90 hover:bg-slate-50/60'
        }`}
      >
      {/* ========================================================================= */}
      {/* FLOATING ACTION BAR: ĐỊNH DẠNG TIÊU ĐỀ, ĐỔI CỘT & DI CHUYỂN KHỐI          */}
      {/* ========================================================================= */}
      <div className="absolute -top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center gap-0.5 bg-white border border-slate-200 shadow-md rounded-full px-2 py-0.5 z-20 print:hidden scale-95 group-hover:scale-100">
        {/* Định dạng chữ tiêu đề: Đậm */}
        <button
          type="button"
          onClick={() => capNhatKieuChu(`khoi-${id}`, { inDam: !inDam })}
          className={`p-1 rounded-full transition cursor-pointer ${
            inDam ? 'bg-blue-50 text-[#1a91f0]' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="In đậm tiêu đề mục"
        >
          <Bold size={11} />
        </button>

        {/* Định dạng chữ tiêu đề: Nghiêng */}
        <button
          type="button"
          onClick={() => capNhatKieuChu(`khoi-${id}`, { inNghieng: !inNghieng })}
          className={`p-1 rounded-full transition cursor-pointer ${
            inNghieng ? 'bg-blue-50 text-[#1a91f0]' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="In nghiêng tiêu đề mục"
        >
          <Italic size={11} />
        </button>

        {/* Định dạng chữ tiêu đề: IN HOA / Chữ thường */}
        <button
          type="button"
          onClick={() => capNhatKieuChu(`khoi-${id}`, { inHoa: !inHoa })}
          className={`p-1 rounded-full transition cursor-pointer ${
            inHoa ? 'bg-blue-50 text-[#1a91f0]' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Bật/Tắt chữ IN HOA tiêu đề mục"
        >
          <CaseUpper size={12} />
        </button>

        {/* Đổi cỡ chữ tiêu đề */}
        <select
          value={coChuTieuDe}
          onChange={(e) => capNhatKieuChu(`khoi-${id}`, { coChu: e.target.value })}
          className="text-[10px] font-bold text-slate-600 bg-transparent hover:bg-slate-100 rounded px-1 py-0.5 focus:outline-none cursor-pointer"
          title="Cỡ chữ tiêu đề mục"
        >
          <option value="11px">11px</option>
          <option value="12px">12px</option>
          <option value="13px">13px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
        </select>

        {/* Đổi màu riêng cho mục này (kèm bảng màu nhanh & tùy chọn) */}
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setMoChonMauKhoi((p) => !p)}
            className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer flex items-center"
            title="Đổi màu cho toàn bộ mục & icon này"
          >
            <Palette size={12} style={{ color: mau }} />
          </button>

          {moChonMauKhoi && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-full right-0 mt-1.5 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50 flex items-center gap-1.5"
            >
              {MAU_KHOI_NHANH.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    capNhatKieuChu(`khoi-${id}`, { mauChu: m });
                    setMoChonMauKhoi(false);
                  }}
                  className={`w-4.5 h-4.5 rounded-full border transition cursor-pointer ${
                    mau === m
                      ? 'scale-120 border-slate-900 ring-2 ring-blue-400'
                      : 'border-white shadow-2xs hover:scale-110'
                  }`}
                  style={{ backgroundColor: m }}
                  title={`Chọn màu ${m}`}
                />
              ))}
              <label
                className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-300"
                title="Chọn màu tùy ý"
              >
                <Palette size={11} style={{ color: mau }} />
                <input
                  type="color"
                  value={mau}
                  onChange={(e) =>
                    capNhatKieuChu(`khoi-${id}`, { mauChu: e.target.value })
                  }
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>

        <span className="w-[1px] h-3 bg-slate-200 mx-0.5" />

        {/* Nút di chuyển lên */}
        <button
          type="button"
          onClick={() => diChuyenKhoiLenXuong(id, 'len')}
          className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
          title="Di chuyển khối lên 1 vị trí"
        >
          <ChevronUp size={13} />
        </button>

        {/* Nút di chuyển xuống */}
        <button
          type="button"
          onClick={() => diChuyenKhoiLenXuong(id, 'xuong')}
          className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
          title="Di chuyển khối xuống 1 vị trí"
        >
          <ChevronDown size={13} />
        </button>

        {/* Nút đổi cột (nếu đang ở chế độ nhiều cột) */}
        {laNhieuCot && (
          <button
            type="button"
            onClick={() => doiCotKhoi(id)}
            className="p-1 text-slate-500 hover:text-[#1a91f0] hover:bg-slate-100 rounded-full transition cursor-pointer"
            title="Chuyển nhanh sang cột kế tiếp"
          >
            <ArrowLeftRight size={13} />
          </button>
        )}

        <span className="w-[1px] h-3 bg-slate-200 mx-0.5" />

        {/* Nút chuyển trang (Trang 1 ⇄ Trang 2) */}
        <button
          type="button"
          onClick={() => {
            if (trangHienTaiKhoi === 1) {
              chuyenKhoiSangTrang(id, 2);
            } else {
              chuyenKhoiSangTrang(id, 1);
            }
          }}
          className={`p-1 rounded-full transition cursor-pointer flex items-center gap-1 px-2 ${
            trangHienTaiKhoi === 2
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title={
            trangHienTaiKhoi === 2
              ? 'Mục này đang ở Trang 2 (Bấm để chuyển về Trang 1)'
              : 'Chuyển mục này sang Trang 2'
          }
        >
          <FileText size={12} />
          <span className="text-[10px]">
            {trangHienTaiKhoi === 2 ? 'Về Trang 1' : 'Sang Trang 2'}
          </span>
        </button>

        <span className="w-[1px] h-3 bg-slate-200 mx-0.5" />

        {/* Nút ẩn khối */}
        <button
          type="button"
          onClick={() => batTatKhoi(id, false)}
          className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition cursor-pointer"
          title="Ẩn tạm thời khối này khỏi CV"
        >
          <EyeOff size={13} />
        </button>

        {/* Nút xóa khối */}
        <button
          type="button"
          onClick={handleXoa}
          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition cursor-pointer"
          title="Xóa hẳn khối này"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAY CẦM KÉO THẢ TACTILE GRIP (Icon 6 chấm ngoài lề trái)                  */}
      {/* ========================================================================= */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-3 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-[#1a91f0] hover:bg-white rounded-md shadow-xs transition-all cursor-grab active:cursor-grabbing z-20 print:hidden"
        title="Bấm giữ và kéo thả để di chuyển khối này"
      >
        <GripVertical size={16} />
      </div>

      {/* ========================================================================= */}
      {/* TIÊU ĐỀ KHỐI VỚI CUSTOM ICON PICKER & SỬA TIÊU ĐỀ TRỰC TIẾP               */}
      {/* ========================================================================= */}
      <div
        className="flex items-center justify-between border-b pb-1.5 mb-2.5"
        style={{ borderColor: mau }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Nút bấm chọn Custom Icon trực tiếp */}
          <NutChonIconTuyChinh
            iconName={iconTuyChinh}
            fallback={icon}
            onChonIcon={(newIcon) => datIconKhoi(id, newIcon)}
            size={15}
            mauChuDao={mau}
            styleKey={`khoi-${id}`}
            title="Nhấn vào icon để đổi biểu tượng & màu icon mục này"
          />

          <AutoResizeInput
            dataStyleKey={`khoi-${id}`}
            value={tieuDeHienThi}
            onChange={(e) => handleSuaTieuDe(e.target.value)}
            className="tracking-wider bg-transparent border-b border-dashed border-transparent hover:border-slate-300 focus:border-[#1a91f0] focus:outline-none px-1 rounded transition-colors flex-1 min-w-0"
            style={{
              color: mau,
              fontSize: coChuTieuDe,
              fontWeight: inDam ? 700 : 500,
              fontStyle: inNghieng ? 'italic' : 'normal',
              textTransform: inHoa ? 'uppercase' : 'none',
            }}
            title="Nhấp để đổi tên mục này (hỗ trợ chỉnh IN HOA, Đậm, Nghiêng, Màu, Cỡ chữ trên thanh nổi)"
            placeholder="TÊN MỤC..."
          />
        </div>

        {/* Nút thêm mục */}
        <div className="flex items-center gap-2 print:hidden">{nutThem}</div>
      </div>

      {/* Nội dung khối */}
      <div className="relative">{children}</div>
    </div>
  );
};

export default SortableKhoi;
