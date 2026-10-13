import React from 'react';
import {
  LayoutTemplate,
  ChevronRight,
  Sparkles,
  Check,
  Eye,
} from 'lucide-react';

interface KhoCVMauProps {
  onChuyenTrinhThietKe: (mauId?: string) => void;
}

const DANH_SACH_MAU_CV = [
  {
    id: 'mau-hien-dai',
    ten: 'Mẫu Hiện Đại (Modern ATS)',
    phanLoai: 'IT & Kỹ Thuật',
    tag: 'Phổ biến nhất',
    tagMau: 'bg-[#1a91f0] text-white',
    moTa: 'Tối ưu đặc biệt cho ngành Công nghệ thông tin, Lập trình viên, UI/UX Designer với bố cục kỹ năng & kinh nghiệm rõ ràng.',
    mauChuDao: '#1a91f0',
    soCot: '2 Cột',
  },
  {
    id: 'mau-toi-gian',
    ten: 'Mẫu Tối Giản (Minimalist)',
    phanLoai: 'Kinh Tế & Quản Trị',
    tag: 'Chuẩn quốc tế',
    tagMau: 'bg-slate-800 text-white',
    moTa: 'Trang nhã, tinh giản tối đa, tập trung làm nổi bật mốc thời gian sự nghiệp cho ngành Tài chính, Kế toán, Marketing.',
    mauChuDao: '#334155',
    soCot: '1 Cột',
  },
  {
    id: 'mau-chuyen-nghiep',
    ten: 'Mẫu Chuyên Nghiệp (Corporate)',
    phanLoai: 'Quản Lý & Doanh Nghiệp',
    tag: 'ATS 99%',
    tagMau: 'bg-emerald-600 text-white',
    moTa: 'Định dạng chuẩn mực vượt qua mọi hệ thống quét tự động của tập đoàn đa quốc gia, điểm số định lượng rõ ràng.',
    mauChuDao: '#059669',
    soCot: '2 Cột',
  },
  {
    id: 'mau-sang-tao',
    ten: 'Mẫu Sáng Tạo (Creative)',
    phanLoai: 'Sinh Viên & Fresher',
    tag: 'Năng động',
    tagMau: 'bg-purple-600 text-white',
    moTa: 'Phong cách trẻ trung, làm nổi bật đồ án tốt nghiệp, hoạt động ngoại khóa và tinh thần học hỏi dành cho ứng viên mới ra trường.',
    mauChuDao: '#7c3aed',
    soCot: '2 Cột',
  },
];

export const KhoCVMau: React.FC<KhoCVMauProps> = ({ onChuyenTrinhThietKe }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header Kho Mẫu */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1a91f0] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 inline-flex items-center gap-1.5 mb-2">
            <LayoutTemplate size={13} />
            Kho Template Chuẩn Tuyển Dụng
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kho Mẫu CV Thịnh Hành
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Lựa chọn mẫu thiết kế phù hợp với ngành nghề và kinh nghiệm của bạn. Tất cả các mẫu đều tương thích khổ in chuẩn A4.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChuyenTrinhThietKe()}
          className="px-4 py-2.5 bg-[#1a91f0] hover:bg-[#004182] text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles size={15} />
          <span>Tạo CV Mới Ngay</span>
        </button>
      </div>

      {/* Lưới các mẫu CV */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {DANH_SACH_MAU_CV.map((mau) => (
          <div
            key={mau.id}
            className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#1a91f0]/40 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Khung mô phỏng tờ CV thu nhỏ */}
              <div className="h-56 bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                <div className="w-36 h-48 bg-white rounded-sm shadow-sm border border-slate-200 p-2.5 flex flex-col justify-between transform group-hover:scale-105 transition duration-300">
                  {/* Dải header mô phỏng */}
                  <div>
                    <div
                      className="h-2 rounded-xs w-3/4 mb-1.5"
                      style={{ backgroundColor: mau.mauChuDao }}
                    />
                    <div className="h-1 bg-slate-300 rounded-xs w-1/2 mb-3" />
                    <div className="space-y-1">
                      <div className="h-1 bg-slate-200 rounded w-full" />
                      <div className="h-1 bg-slate-200 rounded w-5/6" />
                      <div className="h-1 bg-slate-100 rounded w-4/6" />
                    </div>
                  </div>
                  {/* Dòng kỹ năng phía dưới */}
                  <div className="pt-2 border-t border-slate-100 flex gap-1">
                    <span className="w-1/3 h-1 bg-slate-200 rounded" />
                    <span className="w-1/3 h-1 bg-slate-200 rounded" />
                    <span className="w-1/3 h-1 bg-slate-200 rounded" />
                  </div>
                </div>

                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${mau.tagMau}`}
                >
                  {mau.tag}
                </span>
              </div>

              {/* Thông tin mô tả mẫu */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {mau.ten}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                    {mau.soCot}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#1a91f0] mb-1.5">
                  {mau.phanLoai}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {mau.moTa}
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => onChuyenTrinhThietKe(mau.id)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#1a91f0] hover:bg-[#004182] text-white font-bold text-xs py-2 rounded-lg transition active:scale-98 cursor-pointer shadow-2xs"
              >
                <span>Dùng Mẫu Này</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KhoCVMau;
