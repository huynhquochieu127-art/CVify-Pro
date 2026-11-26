import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Target,
  CheckCircle2,
  Plus,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Sparkles,
  FileSearch,
  Loader2,
  MessageSquareQuote,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RotateCw,
  AlertTriangle,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';
import {
  phanTichSoKhopCVVoiJD,
  type KetQuaSoKhopJD,
  type CauHoiPhongVan,
} from '../../utils/boSoKhopJD';

interface ModalSoKhopJDProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKetQua = 'so-khop' | 'phong-van';

const CAC_BUOC_PHAN_TICH = [
  { moc: 0, nhan: 'Đọc & chuẩn hóa nội dung tin tuyển dụng' },
  { moc: 26, nhan: 'Trích xuất chức danh, yêu cầu & từ khóa kỹ năng' },
  { moc: 56, nhan: 'Đối chiếu mức độ tương thích ATS với CV' },
  { moc: 82, nhan: 'Tổng hợp bộ câu hỏi phỏng vấn dự kiến' },
];

export const ModalSoKhopJD: React.FC<ModalSoKhopJDProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return <NoiDungModalSoKhopJD onClose={onClose} />;
};

const NoiDungModalSoKhopJD: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { cv, themKyNang, capNhatThongTinCaNhan } = useKhoLuuTruCV();

  const [vanBanJD, setVanBanJD] = useState('');
  const [vanBanJDDaDoc, setVanBanJDDaDoc] = useState('');
  const [dangDocJD, setDangDocJD] = useState(false);
  const [tienTrinhDoc, setTienTrinhDoc] = useState(0);
  const [tabKetQua, setTabKetQua] = useState<TabKetQua>('so-khop');
  const [cauHoiMoGoiY, setCauHoiMoGoiY] = useState<Record<string, boolean>>({
    'pv-vi-tri': true,
    'pv-chuyen-mon-nganh': true,
  });

  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string | null>(null);
  const [daCopy, setDaCopy] = useState(false);
  const [daCopyCauHoi, setDaCopyCauHoi] = useState(false);

  const timerRef = useRef<number | null>(null);

  const dungTienTrinh = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => dungTienTrinh();
  }, []);

  // Tính kết quả so khớp & bộ câu hỏi từ văn bản JD đã đọc (tự động cập nhật khi CV thay đổi)
  const ketQuaSoKhop: KetQuaSoKhopJD | null = useMemo(() => {
    if (!vanBanJDDaDoc.trim()) return null;
    return phanTichSoKhopCVVoiJD(cv, vanBanJDDaDoc);
  }, [cv, vanBanJDDaDoc]);

  const coThayDoiChuaDoc = Boolean(
    vanBanJDDaDoc.trim() && vanBanJD.trim() !== vanBanJDDaDoc.trim()
  );

  // Bắt đầu hiệu ứng thanh tiến trình ngang khi bấm đọc tin tuyển dụng
  const handleBatDauDocJD = () => {
    const noiDungSach = vanBanJD.trim();
    if (!noiDungSach || dangDocJD) return;

    dungTienTrinh();
    setDangDocJD(true);
    setTienTrinhDoc(4);
    setTabKetQua('so-khop');

    let tienDoHienTai = 4;
    timerRef.current = window.setInterval(() => {
      const buocNhay =
        tienDoHienTai < 35
          ? 7
          : tienDoHienTai < 70
          ? 6
          : tienDoHienTai < 90
          ? 5
          : 4;
      tienDoHienTai = Math.min(100, tienDoHienTai + buocNhay);
      setTienTrinhDoc(tienDoHienTai);

      if (tienDoHienTai >= 100) {
        dungTienTrinh();
        window.setTimeout(() => {
          setVanBanJDDaDoc(noiDungSach);
          setDangDocJD(false);
        }, 220);
      }
    }, 85);
  };

  const handleHuyDocJD = () => {
    dungTienTrinh();
    setDangDocJD(false);
    setTienTrinhDoc(0);
  };

  const handleXoaJD = () => {
    dungTienTrinh();
    setVanBanJD('');
    setVanBanJDDaDoc('');
    setDangDocJD(false);
    setTienTrinhDoc(0);
  };

  // Thêm 1 kỹ năng còn thiếu vào CV
  const handleThem1KyNang = (tenKyNang: string) => {
    themKyNang(tenKyNang, 'Thành thạo');
    setThongBaoThanhCong(`Đã thêm "${tenKyNang}" vào CV`);
    setTimeout(() => setThongBaoThanhCong(null), 2500);
  };

  // Thêm tất cả kỹ năng còn thiếu vào CV
  const handleThemTatCaKyNang = (danhSach: string[]) => {
    danhSach.forEach((kn) => {
      themKyNang(kn, 'Thành thạo');
    });
    setThongBaoThanhCong(`Đã thêm ${danhSach.length} kỹ năng vào CV`);
    setTimeout(() => setThongBaoThanhCong(null), 3000);
  };

  // Đổi vị trí ứng tuyển theo JD
  const handleDoiViTriCV = (viTriMoi: string) => {
    capNhatThongTinCaNhan({ viTriUngTuyen: viTriMoi });
    setThongBaoThanhCong(`Đã đổi vị trí thành "${viTriMoi}"`);
    setTimeout(() => setThongBaoThanhCong(null), 2500);
  };

  // Sao chép báo cáo kết quả so khớp
  const handleSaoChepBaoCao = () => {
    if (!ketQuaSoKhop) return;
    const danhSachCauHoiText = ketQuaSoKhop.cauHoiPhongVan
      .map(
        (q, idx) =>
          `${idx + 1}. [${q.nhanNhom}] ${q.cauHoi}\n   -> Gợi ý: ${q.goiYTraLoi}`
      )
      .join('\n');

    const baoCao = `KẾT QUẢ SO KHỚP CV VỚI TIN TUYỂN DỤNG
- Điểm phù hợp: ${ketQuaSoKhop.tongDiem}% (${ketQuaSoKhop.xepLoai.nhan})
- Vị trí: CV: ${ketQuaSoKhop.chiTiet.viTri.viTriCV} | JD: ${ketQuaSoKhop.chiTiet.viTri.viTriJD}
- Kỹ năng khớp (${ketQuaSoKhop.chiTiet.kyNang.kyNangKhop.length}): ${ketQuaSoKhop.chiTiet.kyNang.kyNangKhop.join(', ')}
- Kỹ năng thiếu (${ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.length}): ${ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.join(', ')}

CÂU HỎI PHỎNG VẤN DỰ KIẾN:
${danhSachCauHoiText}`;

    navigator.clipboard.writeText(baoCao);
    setDaCopy(true);
    setTimeout(() => setDaCopy(false), 2000);
  };

  // Sao chép riêng bộ câu hỏi phỏng vấn
  const handleSaoChepCauHoi = () => {
    if (!ketQuaSoKhop) return;
    const noiDung = ketQuaSoKhop.cauHoiPhongVan
      .map(
        (q, idx) =>
          `Câu ${idx + 1} (${q.nhanNhom}): ${q.cauHoi}\nGợi ý trả lời: ${q.goiYTraLoi}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(
      `BỘ CÂU HỎI PHỎNG VẤN DỰ KIẾN - VỊ TRÍ: ${ketQuaSoKhop.chiTiet.viTri.viTriJD.toUpperCase()}\n\n${noiDung}`
    );
    setDaCopyCauHoi(true);
    setTimeout(() => setDaCopyCauHoi(false), 2000);
  };

  const toggleGoiY = (id: string) => {
    setCauHoiMoGoiY((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const layNhanTrangThaiDoc = (pct: number) => {
    if (pct < 26) return 'Đang đọc & chuẩn hóa nội dung tin tuyển dụng...';
    if (pct < 56) return 'Đang trích xuất chức danh, yêu cầu & từ khóa kỹ năng...';
    if (pct < 82) return 'Đang chấm điểm đối chiếu ATS với hồ sơ CV...';
    return 'Đang tổng hợp bộ câu hỏi phỏng vấn dự kiến...';
  };

  const layStyleNhomCauHoi = (nhom: CauHoiPhongVan['nhom']) => {
    switch (nhom) {
      case 'ky-nang-thieu':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'chuyen-mon':
        return 'bg-blue-50 text-[#016fd0] border-blue-200';
      case 'tinh-huong':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vi-tri':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative max-h-[94vh] my-auto flex flex-col">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* TIÊU ĐỀ */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 pr-8">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-[#1a91f0] rounded-xl">
              <Target size={20} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                So Khớp CV & Dự Đoán Phỏng Vấn Theo Tin Tuyển Dụng
              </h2>
            </div>
          </div>

          {ketQuaSoKhop && !dangDocJD && (
            <button
              type="button"
              onClick={handleSaoChepBaoCao}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-2xs shrink-0"
            >
              {daCopy ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Sao chép kết quả</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* THÔNG BÁO HOÀN THÀNH */}
        {thongBaoThanhCong && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{thongBaoThanhCong}</span>
          </div>
        )}

        {/* BỐ CỤC 2 CỘT: KHUNG NHẬP BÊN TRÁI & KẾT QUẢ BÊN PHẢI */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5 pr-1">
          {/* CỘT TRÁI (5/12): DÁN VĂN BẢN TIN TUYỂN DỤNG + NÚT ĐỌC */}
          <div className="lg:col-span-5 flex flex-col min-h-[320px] gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Dán tin tuyển dụng (JD):
              </label>
              {vanBanJD && (
                <button
                  type="button"
                  onClick={handleXoaJD}
                  className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>

            <textarea
              value={vanBanJD}
              onChange={(e) => setVanBanJD(e.target.value)}
              placeholder="Dán toàn bộ nội dung tin tuyển dụng vào đây, sau đó bấm nút 'Đọc & Phân tích tin tuyển dụng' bên dưới..."
              className="w-full flex-1 p-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#1a91f0] transition leading-relaxed resize-none font-mono placeholder:font-sans placeholder:italic placeholder:text-slate-400 min-h-[270px]"
            />

            {/* Nút kích hoạt đọc & phân tích chuyên nghiệp */}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                disabled={!vanBanJD.trim() || dangDocJD}
                onClick={handleBatDauDocJD}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm ${
                  !vanBanJD.trim() || dangDocJD
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : coThayDoiChuaDoc
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    : 'bg-[#1a91f0] hover:bg-[#016fd0] text-white cursor-pointer'
                }`}
              >
                {dangDocJD ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Đang đọc tin tuyển dụng ({tienTrinhDoc}%)...</span>
                  </>
                ) : coThayDoiChuaDoc ? (
                  <>
                    <RotateCw size={15} />
                    <span>Đọc & Phân tích lại tin mới</span>
                  </>
                ) : (
                  <>
                    <FileSearch size={15} />
                    <span>Đọc & Phân tích tin tuyển dụng</span>
                  </>
                )}
              </button>

              {coThayDoiChuaDoc && !dangDocJD && (
                <p className="text-[11px] text-amber-600 font-medium text-center">
                  Nội dung tin vừa thay đổi — bấm nút trên để hệ thống đọc lại.
                </p>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (7/12): PROGRESS BAR HOẶC KẾT QUẢ */}
          <div className="lg:col-span-7 flex flex-col">
            {dangDocJD ? (
              /* TRẠNG THÁI ĐANG ĐỌC: THANH TIẾN TRÌNH NGANG KIỂU UPLOAD/DOWNLOAD CHUYÊN NGHIỆP */
              <div className="h-full flex flex-col items-center justify-center p-6 sm:p-8 border border-blue-100 bg-gradient-to-b from-blue-50/40 to-white rounded-2xl">
                <div className="w-full max-w-md space-y-5">
                  {/* Tiêu đề & Phần trăm lớn */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1a91f0] flex items-center justify-center shrink-0">
                        <FileSearch size={20} className="animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Đang phân tích mô tả tuyển dụng
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {layNhanTrangThaiDoc(tienTrinhDoc)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-black text-[#1a91f0] tabular-nums shrink-0">
                      {tienTrinhDoc}%
                    </span>
                  </div>

                  {/* THANH TIẾN TRÌNH NGANG (Horizontal Progress Bar) */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1a91f0] via-blue-500 to-indigo-500 transition-all duration-150 relative overflow-hidden bg-progress-stripes"
                        style={{ width: `${tienTrinhDoc}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-progress-shimmer" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Đã xử lý {vanBanJD.trim().length.toLocaleString('vi-VN')} ký tự</span>
                      <span>{tienTrinhDoc < 100 ? 'Đang tải dữ liệu...' : 'Hoàn tất 100%'}</span>
                    </div>
                  </div>

                  {/* 4 CHẶNG TIẾN ĐỘ CHI TIẾT */}
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                    {CAC_BUOC_PHAN_TICH.map((buoc, index) => {
                      const mocKeTiep =
                        CAC_BUOC_PHAN_TICH[index + 1]?.moc ?? 101;
                      const daXong = tienTrinhDoc >= mocKeTiep || tienTrinhDoc === 100;
                      const dangChay =
                        !daXong && tienTrinhDoc >= buoc.moc && tienTrinhDoc < mocKeTiep;

                      return (
                        <div
                          key={buoc.nhan}
                          className="flex items-center gap-2.5 text-xs"
                        >
                          {daXong ? (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-500 shrink-0"
                            />
                          ) : dangChay ? (
                            <Loader2
                              size={15}
                              className="text-[#1a91f0] animate-spin shrink-0"
                            />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-200 shrink-0 mx-[1px]" />
                          )}
                          <span
                            className={
                              daXong
                                ? 'text-slate-700 font-semibold'
                                : dangChay
                                ? 'text-[#016fd0] font-bold'
                                : 'text-slate-400'
                            }
                          >
                            {buoc.nhan}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleHuyDocJD}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    >
                      Hủy thao tác
                    </button>
                  </div>
                </div>
              </div>
            ) : !ketQuaSoKhop ? (
              /* TRẠNG THÁI CHƯA ĐỌC JD */
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-400 p-6 border-2 border-dashed border-slate-200 rounded-2xl">
                <Target size={38} className="text-slate-300 mb-3 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Chưa có dữ liệu phân tích tin tuyển dụng
                </p>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Dán nội dung tin tuyển dụng vào khung bên trái, sau đó bấm{' '}
                  <strong className="text-slate-600">
                    “Đọc & Phân tích tin tuyển dụng”
                  </strong>{' '}
                  để chấm điểm ATS và gợi ý câu hỏi phỏng vấn.
                </p>
              </div>
            ) : (
              /* TRẠNG THÁI ĐÃ ĐỌC XONG: HIỂN THỊ 2 TAB GỌN GÀNG */
              <div className="space-y-3.5">
                {/* THANH CHUYỂN TAB: KẾT QUẢ SO KHỚP vs GỢI Ý PHỎNG VẤN */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTabKetQua('so-khop')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                      tabKetQua === 'so-khop'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Target size={14} className="text-[#1a91f0]" />
                    <span>Kết quả So khớp ATS</span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-[#016fd0]">
                      {ketQuaSoKhop.tongDiem}%
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTabKetQua('phong-van')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                      tabKetQua === 'phong-van'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquareQuote size={14} className="text-indigo-600" />
                    <span>Câu hỏi Phỏng vấn</span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                      {ketQuaSoKhop.cauHoiPhongVan.length} câu
                    </span>
                  </button>
                </div>

                {tabKetQua === 'so-khop' ? (
                  <>
                    {/* 1. ĐIỂM SỐ PHÙ HỢP */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                          Mức độ phù hợp
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {ketQuaSoKhop.xepLoai.nhan}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                        <span className="text-2xl font-black text-amber-400">
                          {ketQuaSoKhop.tongDiem}%
                        </span>
                      </div>
                    </div>

                    {/* 2. CÁC TIÊU CHÍ */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                          <span>Vị trí</span>
                          <span className="font-bold text-slate-800">
                            {ketQuaSoKhop.chiTiet.viTri.diem}/
                            {ketQuaSoKhop.chiTiet.viTri.toiDa}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (ketQuaSoKhop.chiTiet.viTri.diem /
                                  ketQuaSoKhop.chiTiet.viTri.toiDa) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                          <span>Kỹ năng</span>
                          <span className="font-bold text-[#1a91f0]">
                            {ketQuaSoKhop.chiTiet.kyNang.diem}/
                            {ketQuaSoKhop.chiTiet.kyNang.toiDa}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1a91f0] rounded-full"
                            style={{
                              width: `${
                                (ketQuaSoKhop.chiTiet.kyNang.diem /
                                  ketQuaSoKhop.chiTiet.kyNang.toiDa) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                          <span>Kinh nghiệm</span>
                          <span className="font-bold text-emerald-600">
                            {ketQuaSoKhop.chiTiet.kinhNghiem.diem}/
                            {ketQuaSoKhop.chiTiet.kinhNghiem.toiDa}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${
                                (ketQuaSoKhop.chiTiet.kinhNghiem.diem /
                                  ketQuaSoKhop.chiTiet.kinhNghiem.toiDa) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                          <span>Học vấn</span>
                          <span className="font-bold text-purple-600">
                            {ketQuaSoKhop.chiTiet.hocVanVaChungChi.diem}/
                            {ketQuaSoKhop.chiTiet.hocVanVaChungChi.toiDa}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{
                              width: `${
                                (ketQuaSoKhop.chiTiet.hocVanVaChungChi.diem /
                                  ketQuaSoKhop.chiTiet.hocVanVaChungChi.toiDa) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. ĐỐI CHIẾU VỊ TRÍ ỨNG TUYỂN */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs min-w-0">
                        <span className="text-slate-600 truncate">
                          CV: <strong>{ketQuaSoKhop.chiTiet.viTri.viTriCV}</strong>
                        </span>
                        <ArrowRight size={12} className="text-slate-400 shrink-0" />
                        <span className="text-[#1a91f0] truncate">
                          JD: <strong>{ketQuaSoKhop.chiTiet.viTri.viTriJD}</strong>
                        </span>
                      </div>

                      {!ketQuaSoKhop.chiTiet.viTri.khopNhau &&
                        ketQuaSoKhop.chiTiet.viTri.viTriJD && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDoiViTriCV(ketQuaSoKhop.chiTiet.viTri.viTriJD)
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                          >
                            <Sparkles size={11} />
                            <span>Đổi vị trí theo JD</span>
                          </button>
                        )}
                    </div>

                    {/* 4. KỸ NĂNG & TỪ KHÓA */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Layers size={13} className="text-[#1a91f0]" />
                          <span>Kỹ năng & Từ khóa</span>
                        </h4>

                        {ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleThemTatCaKyNang(
                                ketQuaSoKhop.chiTiet.kyNang.kyNangThieu
                              )
                            }
                            className="flex items-center gap-1 text-[11px] font-bold text-[#1a91f0] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg transition cursor-pointer"
                          >
                            <Plus size={11} />
                            <span>+ Thêm tất cả vào CV</span>
                          </button>
                        )}
                      </div>

                      {/* Kỹ năng đã có */}
                      <div>
                        <div className="text-[11px] font-bold text-emerald-700 mb-1">
                          Đã có ({ketQuaSoKhop.chiTiet.kyNang.kyNangKhop.length}):
                        </div>
                        {ketQuaSoKhop.chiTiet.kyNang.kyNangKhop.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">
                            Chưa có kỹ năng trùng khớp
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {ketQuaSoKhop.chiTiet.kyNang.kyNangKhop.map((kn) => (
                              <span
                                key={kn}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                              >
                                <Check size={10} className="text-emerald-600" />
                                {kn}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Kỹ năng còn thiếu */}
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold text-rose-700 mb-1">
                          Còn thiếu ({ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.length}):
                        </div>
                        {ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.length === 0 ? (
                          <p className="text-[11px] text-emerald-600 font-medium">
                            Đã có đầy đủ từ khóa của tin tuyển dụng
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {ketQuaSoKhop.chiTiet.kyNang.kyNangThieu.map((kn) => (
                              <button
                                key={kn}
                                type="button"
                                onClick={() => handleThem1KyNang(kn)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition cursor-pointer"
                                title={`Thêm ${kn} vào CV`}
                              >
                                <span>{kn}</span>
                                <Plus size={10} className="text-rose-600" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. BANNER CHUYỂN NHANH SANG CÂU HỎI PHỎNG VẤN */}
                    <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-100 shrink-0">
                          <MessageSquareQuote size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-indigo-950 truncate">
                            Đã tổng hợp {ketQuaSoKhop.cauHoiPhongVan.length} câu hỏi
                            phỏng vấn dự kiến
                          </p>
                          <p className="text-[11px] text-indigo-700 truncate">
                            Bám sát mô tả công việc & kỹ năng cần chuẩn bị trước khi
                            đi phỏng vấn.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTabKetQua('phong-van')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                      >
                        <span>Xem câu hỏi</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* TAB 2: DANH SÁCH CÂU HỎI PHỎNG VẤN DỰ KIẾN */
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <MessageSquareQuote
                          size={18}
                          className="text-indigo-600 shrink-0"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-indigo-950">
                            Câu hỏi phỏng vấn có thể gặp cho vị trí:{' '}
                            {ketQuaSoKhop.chiTiet.viTri.viTriJD}
                          </h4>
                          <p className="text-[11px] text-indigo-700">
                            Tổng hợp từ nội dung JD vừa đọc và các kỹ năng cần lưu ý
                            trên CV.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaoChepCauHoi}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-indigo-100/70 border border-indigo-200 text-indigo-700 text-[11px] font-bold transition cursor-pointer shrink-0"
                      >
                        {daCopyCauHoi ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600">Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Chép bộ câu hỏi</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {ketQuaSoKhop.cauHoiPhongVan.map((item, idx) => {
                        const dangMo = Boolean(cauHoiMoGoiY[item.id]);
                        return (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 hover:border-slate-300 transition"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-extrabold text-slate-400">
                                  CÂU {idx + 1}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${layStyleNhomCauHoi(
                                    item.nhom
                                  )}`}
                                >
                                  {item.nhom === 'ky-nang-thieu' && (
                                    <AlertTriangle size={10} />
                                  )}
                                  {item.nhanNhom}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => toggleGoiY(item.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a91f0] hover:text-blue-700 cursor-pointer shrink-0"
                              >
                                <Lightbulb size={12} />
                                <span>{dangMo ? 'Ẩn gợi ý' : 'Gợi ý trả lời'}</span>
                                {dangMo ? (
                                  <ChevronUp size={12} />
                                ) : (
                                  <ChevronDown size={12} />
                                )}
                              </button>
                            </div>

                            <p className="text-xs font-bold text-slate-800 leading-relaxed">
                              {item.cauHoi}
                            </p>

                            {dangMo && (
                              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-950 leading-relaxed flex items-start gap-2">
                                <Lightbulb
                                  size={14}
                                  className="text-amber-500 shrink-0 mt-0.5"
                                />
                                <div>
                                  <span className="font-bold">Gợi ý trả lời: </span>
                                  {item.goiYTraLoi}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalSoKhopJD;
