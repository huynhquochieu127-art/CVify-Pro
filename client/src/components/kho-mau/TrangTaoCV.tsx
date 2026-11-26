import React from 'react';
import {
  PenLine,
  LayoutTemplate,
  ArrowRight,
  FileText,
  Sparkles,
  Briefcase,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import type { LoaiPhongCachCV } from './KhoCVMau';

interface TrangTaoCVProps {
  onTaoCVTuViet: () => void;
  onChonKhoMau: (loaiMacDinh?: LoaiPhongCachCV | 'tat-ca') => void;
}

export const TrangTaoCV: React.FC<TrangTaoCVProps> = ({
  onTaoCVTuViet,
  onChonKhoMau,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Tiêu đề trung tâm */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1a91f0] bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
          Bắt đầu tạo hồ sơ mới
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bạn muốn tạo CV theo cách nào?
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Chọn tự thiết kế từ trang trắng hoặc bắt đầu nhanh từ kho mẫu CV được phân loại sẵn theo phong cách và ngôn ngữ.
        </p>
      </div>

      {/* 2 Option lớn cân đối */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OPTION 1: TẠO CV RỒI TỰ VIẾT */}
        <div
          onClick={onTaoCVTuViet}
          className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#1a91f0] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a91f0] border border-blue-100 flex items-center justify-center">
                <PenLine size={22} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Lựa chọn 1
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-[#1a91f0] transition">
                Tạo CV mới &amp; Tự viết
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Mở ngay trình thiết kế chuẩn A4 để bạn tự nhập thông tin, thêm/bớt các mục, kéo thả bố cục cột và tùy biến màu sắc theo ý muốn.
              </p>
            </div>

            <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Hỗ trợ kéo thả bố cục 1 cột, 2 cột, 3 cột linh hoạt</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Tích hợp nhập CV cũ từ file PDF và so khớp tin tuyển dụng</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Có thể đổi sang bất kỳ mẫu CV nào khác sau khi viết xong</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTaoCVTuViet();
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs sm:text-sm font-bold transition shadow-2xs cursor-pointer"
          >
            <span>Bắt đầu tự viết CV</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* OPTION 2: CHỌN MẪU CV CÓ SẴN */}
        <div
          onClick={() => onChonKhoMau('tat-ca')}
          className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <LayoutTemplate size={22} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-md">
                Lựa chọn 2
              </span>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
                Chọn mẫu CV có sẵn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Tham khảo và chọn nhanh từ thư viện mẫu CV theo 3 phong cách phổ biến cùng bộ lọc đa ngôn ngữ (Việt, Anh, Nhật, Trung).
              </p>
            </div>

            {/* 3 loại phong cách chọn nhanh */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Chọn nhanh theo phong cách:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonKhoMau('don-gian');
                  }}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-[#1a91f0] text-slate-700 hover:text-[#1a91f0] transition cursor-pointer"
                >
                  <FileText size={15} strokeWidth={1.75} />
                  <span className="text-xs font-bold">Đơn giản</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonKhoMau('an-tuong');
                  }}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-500 text-slate-700 hover:text-purple-600 transition cursor-pointer"
                >
                  <Sparkles size={15} strokeWidth={1.75} />
                  <span className="text-xs font-bold">Ấn tượng</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChonKhoMau('chuyen-nghiep');
                  }}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 transition cursor-pointer"
                >
                  <Briefcase size={15} strokeWidth={1.75} />
                  <span className="text-xs font-bold">Chuyên nghiệp</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChonKhoMau('tat-ca');
            }}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-2xs cursor-pointer"
          >
            <span>Xem tất cả Kho Mẫu CV</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Ghi chú hỗ trợ đa ngôn ngữ */}
      <div className="bg-white/80 rounded-xl border border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
          <Globe size={14} className="text-[#1a91f0]" />
          Hỗ trợ lọc &amp; tạo CV đa ngôn ngữ:
        </span>
        <span>Tiếng Việt (VI)</span>
        <span className="text-slate-300">•</span>
        <span>Tiếng Anh (EN)</span>
        <span className="text-slate-300">•</span>
        <span>Tiếng Nhật (JA)</span>
        <span className="text-slate-300">•</span>
        <span>Tiếng Trung (ZH)</span>
      </div>
    </div>
  );
};

export default TrangTaoCV;
