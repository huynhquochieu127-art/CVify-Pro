import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutTemplate,
  ChevronRight,
  Check,
  FileText,
  Sparkles,
  Briefcase,
  Globe,
  PenLine,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';

export type LoaiPhongCachCV = 'don-gian' | 'an-tuong' | 'chuyen-nghiep';
export type NgonNguMauCV = 'vi' | 'en' | 'ja' | 'zh';

/**
 * 4 vị trí ứng tuyển nổi bật hiển thị mặc định.
 * Khi Role Admin thêm mẫu cho bất kỳ vị trí mới nào khác, người dùng gõ vào ô tìm kiếm vẫn lọc ra đầy đủ.
 */
export const VI_TRI_NOI_BAT = [
  'Nhân viên kinh doanh',
  'Lập trình viên',
  'Nhân viên kế toán',
  'Chuyên viên marketing',
] as const;

/**
 * Cấu trúc chuẩn của 1 mẫu CV — thiết kế sẵn để sau này Role Admin upload mẫu mới
 * (ảnh preview + vị trí ứng tuyển bất kỳ + cấu hình bố cục + ngôn ngữ + loại phong cách) từ Database.
 */
export interface MauCVItem {
  id: string;
  mauHeThongId: string;
  ten: string;
  loaiPhongCach: LoaiPhongCachCV;
  ngonNgu: NgonNguMauCV;
  viTriUngTuyen: string;
  nganhNghe: string;
  moTa: string;
  mauChuDao: string;
  soCot: string;
  kieuCot: '1-cot' | '2-cot' | '2-cot-deu' | '3-cot';
  hinhAnhPreview?: string;
}

export const NHAN_PHONG_CACH: Record<
  LoaiPhongCachCV,
  { ten: string; badgeClass: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }
> = {
  'don-gian': {
    ten: 'Đơn giản',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
    icon: FileText,
  },
  'an-tuong': {
    ten: 'Ấn tượng',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
    icon: Sparkles,
  },
  'chuyen-nghiep': {
    ten: 'Chuyên nghiệp',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: Briefcase,
  },
};

export const NHAN_NGON_NGU: Record<NgonNguMauCV, { ma: string; ten: string }> = {
  vi: { ma: 'VI', ten: 'Tiếng Việt' },
  en: { ma: 'EN', ten: 'Tiếng Anh' },
  ja: { ma: 'JA', ten: 'Tiếng Nhật' },
  zh: { ma: 'ZH', ten: 'Tiếng Trung' },
};

/**
 * Danh sách mẫu CV dùng chung cho:
 * 1. Trang Chủ (Landing Page)
 * 2. Trang Kho Mẫu CV
 * 3. Tab Đổi Mẫu bên trong Trình Thiết Kế
 * (Sau này khi Role Admin thêm mẫu vào DB, chỉ cần nạp vào nguồn chung này là đồng bộ cả 3 nơi)
 */
export const DANH_SACH_MAU_CV: MauCVItem[] = [
  {
    id: 'mau-don-gian-vi',
    mauHeThongId: 'mau-toi-gian',
    ten: 'Tiêu Chuẩn ATS (Đơn giản)',
    loaiPhongCach: 'don-gian',
    ngonNgu: 'vi',
    viTriUngTuyen: 'Nhân viên kế toán',
    nganhNghe: 'Kế toán • Tài chính • Hành chính',
    moTa: 'Bố cục 1 cột tinh gọn, dễ đọc, tối ưu 100% cho hệ thống lọc hồ sơ tự động ATS của doanh nghiệp Việt Nam.',
    mauChuDao: '#334155',
    soCot: '1 Cột ATS',
    kieuCot: '1-cot',
  },
  {
    id: 'mau-chuyen-nghiep-vi',
    mauHeThongId: 'mau-chuyen-nghiep',
    ten: 'Chuyên Nghiệp Doanh Nghiệp (Corporate)',
    loaiPhongCach: 'chuyen-nghiep',
    ngonNgu: 'vi',
    viTriUngTuyen: 'Nhân viên kinh doanh',
    nganhNghe: 'Kinh doanh • Sales • Quản lý',
    moTa: 'Định dạng 2 cột 35-65 chuyên nghiệp, nổi bật doanh số KPI, kỹ năng đàm phán và kinh nghiệm thực chiến.',
    mauChuDao: '#059669',
    soCot: '2 Cột (35-65)',
    kieuCot: '2-cot',
  },
  {
    id: 'mau-an-tuong-vi',
    mauHeThongId: 'mau-sang-tao',
    ten: 'Sáng Tạo Năng Động (Creative)',
    loaiPhongCach: 'an-tuong',
    ngonNgu: 'vi',
    viTriUngTuyen: 'Chuyên viên marketing',
    nganhNghe: 'Marketing • Content • Truyền thông',
    moTa: 'Bố cục 2 cột cân đối 50-50 với tông màu nhấn hiện đại, giúp nổi bật chiến dịch, dự án cá nhân và kỹ năng.',
    mauChuDao: '#7c3aed',
    soCot: '2 Cột (50-50)',
    kieuCot: '2-cot-deu',
  },
  {
    id: 'mau-an-tuong-en',
    mauHeThongId: 'mau-hien-dai',
    ten: 'Modern Tech ATS (English)',
    loaiPhongCach: 'an-tuong',
    ngonNgu: 'en',
    viTriUngTuyen: 'Lập trình viên',
    nganhNghe: 'Software Engineer • Frontend • Backend',
    moTa: 'Thiết kế hiện đại tối ưu cho ngành Công nghệ thông tin, làm nổi bật Tech Stack, GitHub và dự án thực tế.',
    mauChuDao: '#1a91f0',
    soCot: '2 Cột (35-65)',
    kieuCot: '2-cot',
  },
  {
    id: 'mau-don-gian-en',
    mauHeThongId: 'mau-co-dien',
    ten: 'Harvard Minimalist (English)',
    loaiPhongCach: 'don-gian',
    ngonNgu: 'en',
    viTriUngTuyen: 'Nhân viên kế toán',
    nganhNghe: 'Accounting • Finance • Audit',
    moTa: 'Mẫu CV tiếng Anh tối giản chuẩn quốc tế, tập trung vào chứng chỉ chuyên môn và mốc thời gian sự nghiệp.',
    mauChuDao: '#1e40af',
    soCot: '1 Cột ATS',
    kieuCot: '1-cot',
  },
  {
    id: 'mau-don-gian-ja',
    mauHeThongId: 'mau-toi-gian',
    ten: 'Rirekisho Chuẩn Nhật (日本語)',
    loaiPhongCach: 'don-gian',
    ngonNgu: 'ja',
    viTriUngTuyen: 'Lập trình viên',
    nganhNghe: 'IT Comtor • BrSE • Kỹ sư Nhật Bản',
    moTa: 'Phong cách trình bày gọn gàng, chỉn chu theo tiêu chuẩn tuyển dụng của các doanh nghiệp công nghệ Nhật Bản.',
    mauChuDao: '#0f172a',
    soCot: '1 Cột ATS',
    kieuCot: '1-cot',
  },
  {
    id: 'mau-chuyen-nghiep-en',
    mauHeThongId: 'mau-3-cot',
    ten: 'Executive 3 Columns (English)',
    loaiPhongCach: 'chuyen-nghiep',
    ngonNgu: 'en',
    viTriUngTuyen: 'Lập trình viên',
    nganhNghe: 'Tech Lead • Senior Engineer • Manager',
    moTa: 'Bố cục 3 cột cao cấp cho ứng viên nhiều kinh nghiệm, trình bày súc tích hàng loạt kỹ năng và dự án lớn.',
    mauChuDao: '#0f766e',
    soCot: '3 Cột (28-44-28)',
    kieuCot: '3-cot',
  },
  {
    id: 'mau-an-tuong-zh',
    mauHeThongId: 'mau-sang-tao',
    ten: 'Ấn Tượng Tiếng Trung (中文简历)',
    loaiPhongCach: 'an-tuong',
    ngonNgu: 'zh',
    viTriUngTuyen: 'Chuyên viên marketing',
    nganhNghe: 'Marketing • Thương mại điện tử • Hoa ngữ',
    moTa: 'Mẫu CV tiếng Trung bố cục hiện đại, rõ ràng, phù hợp ứng tuyển vào các công ty, tập đoàn Hoa ngữ.',
    mauChuDao: '#e11d48',
    soCot: '2 Cột (50-50)',
    kieuCot: '2-cot-deu',
  },
  {
    id: 'mau-chuyen-nghiep-zh',
    mauHeThongId: 'mau-chuyen-nghiep',
    ten: 'Chuyên Nghiệp Tiếng Trung (标准简历)',
    loaiPhongCach: 'chuyen-nghiep',
    ngonNgu: 'zh',
    viTriUngTuyen: 'Nhân viên kinh doanh',
    nganhNghe: 'Kinh doanh • Xuất nhập khẩu • Logistics',
    moTa: 'Mẫu CV tiếng Trung phong cách doanh nghiệp nghiêm túc, đầy đủ mục tiêu nghề nghiệp, học vấn và kinh nghiệm.',
    mauChuDao: '#0369a1',
    soCot: '2 Cột (35-65)',
    kieuCot: '2-cot',
  },
];

const chuanHoaTimKiem = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

export function locDanhSachMauCV(
  danhSach: MauCVItem[],
  boLoc: {
    phongCach: LoaiPhongCachCV | 'tat-ca';
    viTri: string;
    ngonNgu: NgonNguMauCV | 'tat-ca';
    tuKhoa: string;
  }
): MauCVItem[] {
  const kw = chuanHoaTimKiem(boLoc.tuKhoa);
  const vt = boLoc.viTri === 'tat-ca' ? '' : chuanHoaTimKiem(boLoc.viTri);

  return danhSach.filter((mau) => {
    const khopPhongCach =
      boLoc.phongCach === 'tat-ca' || mau.loaiPhongCach === boLoc.phongCach;
    const khopNgonNgu =
      boLoc.ngonNgu === 'tat-ca' || mau.ngonNgu === boLoc.ngonNgu;
    const khopViTri =
      !vt ||
      chuanHoaTimKiem(mau.viTriUngTuyen).includes(vt) ||
      chuanHoaTimKiem(mau.nganhNghe).includes(vt);
    const khopTuKhoa =
      !kw ||
      chuanHoaTimKiem(mau.ten).includes(kw) ||
      chuanHoaTimKiem(mau.viTriUngTuyen).includes(kw) ||
      chuanHoaTimKiem(mau.nganhNghe).includes(kw) ||
      chuanHoaTimKiem(mau.moTa).includes(kw);

    return khopPhongCach && khopNgonNgu && khopViTri && khopTuKhoa;
  });
}

interface KhoCVMauProps {
  loaiMacDinh?: LoaiPhongCachCV | 'tat-ca';
  viTriMacDinh?: string;
  onChuyenTrinhThietKe: (mauId?: string) => void;
  onTaoCVTuViet?: () => void;
}

export const KhoCVMau: React.FC<KhoCVMauProps> = ({
  loaiMacDinh = 'tat-ca',
  viTriMacDinh = 'tat-ca',
  onChuyenTrinhThietKe,
  onTaoCVTuViet,
}) => {
  const { cv, apDungMauCV, doiNgonNguCV } = useKhoLuuTruCV();
  const [giuNoiDungCu, setGiuNoiDungCu] = useState(true);
  const [boLocPhongCach, setBoLocPhongCach] = useState<LoaiPhongCachCV | 'tat-ca'>(loaiMacDinh);
  const [boLocViTri, setBoLocViTri] = useState<string>(viTriMacDinh);
  const [boLocNgonNgu, setBoLocNgonNgu] = useState<NgonNguMauCV | 'tat-ca'>('tat-ca');
  const [tuKhoa, setTuKhoa] = useState('');

  useEffect(() => {
    setBoLocPhongCach(loaiMacDinh);
  }, [loaiMacDinh]);

  useEffect(() => {
    setBoLocViTri(viTriMacDinh);
  }, [viTriMacDinh]);

  const danhSachLoc = useMemo(
    () =>
      locDanhSachMauCV(DANH_SACH_MAU_CV, {
        phongCach: boLocPhongCach,
        viTri: boLocViTri,
        ngonNgu: boLocNgonNgu,
        tuKhoa,
      }),
    [boLocPhongCach, boLocViTri, boLocNgonNgu, tuKhoa]
  );

  const handleChonMau = (mau: MauCVItem) => {
    apDungMauCV(mau.mauHeThongId, giuNoiDungCu);
    if ((cv.dinhDang.ngonNgu || 'vi') !== mau.ngonNgu) {
      doiNgonNguCV(mau.ngonNgu);
    }
    onChuyenTrinhThietKe(mau.mauHeThongId);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5 animate-fade-in">
      {/* Header Kho Mẫu */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#1a91f0] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 inline-flex items-center gap-1.5 mb-2">
            <LayoutTemplate size={13} />
            Kho Mẫu CV Chuẩn ATS
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Chọn Mẫu CV Phù Hợp Với Bạn
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lọc theo phong cách thiết kế, vị trí ứng tuyển và ngôn ngữ tham khảo (Việt, Anh, Nhật, Trung).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setGiuNoiDungCu(!giuNoiDungCu)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              giuNoiDungCu
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center ${
                giuNoiDungCu ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
              }`}
            >
              {giuNoiDungCu && <Check size={11} />}
            </span>
            <span>Giữ nội dung CV hiện tại</span>
          </button>

          <button
            type="button"
            onClick={() => (onTaoCVTuViet ? onTaoCVTuViet() : onChuyenTrinhThietKe())}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
          >
            <PenLine size={14} className="text-[#1a91f0]" />
            <span>Tạo CV trống tự viết</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc tổng hợp: Tìm kiếm vị trí bất kỳ + 3 Phong cách + 4 Vị trí nổi bật + Ngôn ngữ */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
        {/* Hàng 1: 3 loại phong cách + Tìm kiếm tự do + Ngôn ngữ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'tat-ca' as const, nhan: 'Tất cả mẫu', icon: LayoutTemplate },
              { id: 'don-gian' as const, nhan: 'Đơn giản', icon: FileText },
              { id: 'an-tuong' as const, nhan: 'Ấn tượng', icon: Sparkles },
              { id: 'chuyen-nghiep' as const, nhan: 'Chuyên nghiệp', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              const dangChon = boLocPhongCach === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBoLocPhongCach(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    dangChon
                      ? 'bg-[#1a91f0] text-white border-[#1a91f0] shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  <span>{tab.nhan}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Ô tìm kiếm vị trí ứng tuyển bất kỳ (kể cả vị trí mới do Admin thêm) */}
            <div className="relative flex-1 sm:w-56">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={tuKhoa}
                onChange={(e) => setTuKhoa(e.target.value)}
                placeholder="Tìm vị trí, ngành nghề..."
                className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1a91f0] rounded-xl pl-8 pr-7 py-2 text-slate-800 focus:outline-none transition"
              />
              {tuKhoa && (
                <button
                  type="button"
                  onClick={() => setTuKhoa('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Lọc Ngôn ngữ */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Globe size={14} className="text-[#1a91f0] hidden sm:block" />
              <select
                value={boLocNgonNgu}
                onChange={(e) => setBoLocNgonNgu(e.target.value as NgonNguMauCV | 'tat-ca')}
                className="text-xs font-semibold bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#1a91f0] cursor-pointer"
              >
                <option value="tat-ca">Tất cả ngôn ngữ</option>
                <option value="vi">VI • Tiếng Việt</option>
                <option value="en">EN • Tiếng Anh</option>
                <option value="ja">JA • Tiếng Nhật</option>
                <option value="zh">ZH • Tiếng Trung</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hàng 2: Mẫu CV theo vị trí ứng tuyển (4 vị trí nổi bật) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 inline-flex items-center gap-1">
              <Briefcase size={12} className="text-emerald-600" />
              Vị trí ứng tuyển:
            </span>
            <button
              type="button"
              onClick={() => setBoLocViTri('tat-ca')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                boLocViTri === 'tat-ca'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Tất cả vị trí
            </button>
            {VI_TRI_NOI_BAT.map((viTri) => {
              const active = boLocViTri === viTri;
              return (
                <button
                  key={viTri}
                  type="button"
                  onClick={() => setBoLocViTri(viTri)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {viTri}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            Hiển thị {danhSachLoc.length} mẫu
          </span>
        </div>
      </div>

      {/* Lưới các mẫu CV */}
      {danhSachLoc.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">
            Chưa có mẫu CV nào khớp với bộ lọc hiện tại
          </p>
          <p className="text-xs text-slate-500">
            Thử đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc. Các vị trí mới sẽ tự động hiển thị ngay khi Quản trị viên cập nhật thêm mẫu.
          </p>
          <button
            type="button"
            onClick={() => {
              setBoLocPhongCach('tat-ca');
              setBoLocViTri('tat-ca');
              setBoLocNgonNgu('tat-ca');
              setTuKhoa('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Xem tất cả mẫu</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {danhSachLoc.map((mau) => {
            const infoPhongCach = NHAN_PHONG_CACH[mau.loaiPhongCach];
            const infoNgonNgu = NHAN_NGON_NGU[mau.ngonNgu];

            return (
              <div
                key={mau.id}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-[#1a91f0]/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Khung xem trước mẫu */}
                  <div className="h-56 bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
                    {mau.hinhAnhPreview ? (
                      <img
                        src={mau.hinhAnhPreview}
                        alt={mau.ten}
                        className="h-full w-auto object-contain rounded shadow-sm border border-slate-200 group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-36 h-48 bg-white rounded-sm shadow-sm border border-slate-200 p-2.5 flex flex-col justify-between transform group-hover:scale-105 transition duration-300">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <div
                              className="w-5 h-5 rounded-full shrink-0"
                              style={{
                                backgroundColor: `${mau.mauChuDao}20`,
                                border: `1.5px solid ${mau.mauChuDao}`,
                              }}
                            />
                            <div className="flex-1 space-y-1">
                              <div
                                className="h-1.5 rounded-xs w-4/5"
                                style={{ backgroundColor: mau.mauChuDao }}
                              />
                              <div className="h-1 bg-slate-300 rounded-xs w-1/2" />
                            </div>
                          </div>

                          {mau.kieuCot === '1-cot' ? (
                            <div className="space-y-1.5">
                              <div className="h-1 bg-slate-200 rounded w-full" />
                              <div className="h-1 bg-slate-200 rounded w-5/6" />
                              <div className="h-1 bg-slate-100 rounded w-4/6" />
                              <div className="h-1 bg-slate-200 rounded w-full mt-2" />
                              <div className="h-1 bg-slate-100 rounded w-3/4" />
                            </div>
                          ) : mau.kieuCot === '3-cot' ? (
                            <div className="grid grid-cols-3 gap-1">
                              <div className="space-y-1">
                                <div className="h-1 bg-slate-300 rounded w-full" />
                                <div className="h-1 bg-slate-200 rounded w-4/5" />
                              </div>
                              <div className="space-y-1">
                                <div className="h-1 bg-slate-300 rounded w-full" />
                                <div className="h-1 bg-slate-200 rounded w-full" />
                                <div className="h-1 bg-slate-100 rounded w-3/4" />
                              </div>
                              <div className="space-y-1">
                                <div className="h-1 bg-slate-300 rounded w-full" />
                                <div className="h-1 bg-slate-200 rounded w-4/5" />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`grid gap-1.5 ${
                                mau.kieuCot === '2-cot-deu' ? 'grid-cols-2' : 'grid-cols-12'
                              }`}
                            >
                              <div
                                className={`space-y-1 ${
                                  mau.kieuCot === '2-cot-deu' ? '' : 'col-span-4'
                                }`}
                              >
                                <div className="h-1 bg-slate-300 rounded w-full" />
                                <div className="h-1 bg-slate-200 rounded w-3/4" />
                                <div className="h-1 bg-slate-100 rounded w-5/6" />
                              </div>
                              <div
                                className={`space-y-1 ${
                                  mau.kieuCot === '2-cot-deu' ? '' : 'col-span-8'
                                }`}
                              >
                                <div className="h-1 bg-slate-300 rounded w-4/5" />
                                <div className="h-1 bg-slate-200 rounded w-full" />
                                <div className="h-1 bg-slate-200 rounded w-11/12" />
                                <div className="h-1 bg-slate-100 rounded w-3/4" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex gap-1">
                          <span className="w-1/3 h-1 bg-slate-200 rounded" />
                          <span className="w-1/3 h-1 bg-slate-200 rounded" />
                          <span className="w-1/3 h-1 bg-slate-200 rounded" />
                        </div>
                      </div>
                    )}

                    {/* Nhãn Ngôn ngữ góc trên trái */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 border border-slate-200/90 shadow-2xs">
                      <span className="text-[#1a91f0]">{infoNgonNgu.ma}</span>
                      <span>{infoNgonNgu.ten}</span>
                    </span>

                    {/* Nhãn Loại phong cách góc trên phải */}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-2xs ${infoPhongCach.badgeClass}`}
                    >
                      {infoPhongCach.ten}
                    </span>
                  </div>

                  {/* Thông tin mô tả mẫu */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {mau.ten}
                      </h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                        {mau.soCot}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-700 mb-1.5 flex items-center gap-1 truncate">
                      <Briefcase size={11} className="shrink-0" />
                      <span>{mau.viTriUngTuyen}</span>
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {mau.moTa}
                    </p>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => handleChonMau(mau)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#1a91f0] hover:bg-[#016fd0] text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    <span>
                      {giuNoiDungCu ? 'Dùng Mẫu Này (Giữ Nội Dung)' : 'Dùng Mẫu Này'}
                    </span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KhoCVMau;
