import React from 'react';
import {
  FileWarning,
  ArrowRight,
  Clock,
  X,
} from 'lucide-react';
import {
  useKhoThongBao,
  dinhDangThoiGianTuongDoi,
} from '../../store/khoThongBao';

interface NhacNhoCVChuaLuuProps {
  onTiepTucChinhSua: () => void;
}

export const NhacNhoCVChuaLuu: React.FC<NhacNhoCVChuaLuuProps> = ({
  onTiepTucChinhSua,
}) => {
  const { cvChuaLuu, anPopupCVChuaLuu } = useKhoThongBao();

  if (!cvChuaLuu || cvChuaLuu.daAnPopup) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[340px] sm:w-[372px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-fade-in print:hidden">
      {/* Dải nhấn thương hiệu CVify Pro ở mép trên */}
      <div className="h-1 w-full bg-[#1a91f0]" />

      <div className="p-4 space-y-3.5">
        {/* Header thông báo */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a91f0] border border-blue-200/80 flex items-center justify-center shrink-0 relative">
              <FileWarning size={17} strokeWidth={1.9} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                Bản nháp CV chưa được lưu
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tiếp tục hoàn thiện để không mất thay đổi vừa nhập
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={anPopupCVChuaLuu}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Đóng thông báo này"
          >
            <X size={16} />
          </button>
        </div>

        {/* Khối thẻ xem nhanh CV đang làm dở */}
        <div className="bg-blue-50/40 rounded-xl border border-blue-100 p-3 flex items-center gap-3">
          {/* Mini A4 preview theo đúng màu chủ đạo của CV */}
          <div className="w-12 h-16 bg-white rounded border border-slate-200 shadow-2xs p-1.5 flex flex-col justify-between shrink-0">
            <div>
              <div
                className="h-1.5 w-full rounded-full mb-1"
                style={{ backgroundColor: cvChuaLuu.mauChuDao }}
              />
              <div className="h-1 bg-slate-300 rounded w-3/4 mb-1" />
              <div className="h-0.5 bg-slate-200 rounded w-full mb-0.5" />
              <div className="h-0.5 bg-slate-200 rounded w-5/6" />
            </div>
            <div className="h-0.5 bg-slate-100 rounded w-1/2" />
          </div>

          {/* Thông tin tiến độ */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-900 truncate">
                {cvChuaLuu.tieuDe}
              </p>
              <span className="text-[11px] font-extrabold text-[#1a91f0] shrink-0">
                {cvChuaLuu.tienDo}%
              </span>
            </div>

            {/* Thanh tiến độ xanh dương đồng bộ */}
            <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1a91f0] transition-all duration-300"
                style={{ width: `${cvChuaLuu.tienDo}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-slate-500">
              <span className="truncate max-w-[130px]">{cvChuaLuu.viTri}</span>
              <span className="inline-flex items-center gap-1 shrink-0 text-slate-400">
                <Clock size={10} />
                {dinhDangThoiGianTuongDoi(cvChuaLuu.thoiGianSuaCuoi)}
              </span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={anPopupCVChuaLuu}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            Để sau
          </button>
          <button
            type="button"
            onClick={onTiepTucChinhSua}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <span>Tiếp tục chỉnh sửa</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NhacNhoCVChuaLuu;
