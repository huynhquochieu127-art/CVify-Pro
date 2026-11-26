import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck2,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store/khoLuuTruCV';

interface ModalChecklistLoiCVProps {
  isOpen: boolean;
  onClose: () => void;
  onChuyenTab?: (tab: string) => void;
}

interface TieuChiKiemTra {
  id: string;
  tieuDe: string;
  moTa: string;
  loiThuongGap: string;
  cachKhacPhuc: string;
  datYeuCau: boolean;
  chiTietTrangThai: string;
}

export const ModalChecklistLoiCV: React.FC<ModalChecklistLoiCVProps> = ({
  isOpen,
  onClose,
}) => {
  const { cv } = useKhoLuuTruCV();
  const [checkedManual, setCheckedManual] = useState<Record<string, boolean>>({});

  const danhSachTieuChi: TieuChiKiemTra[] = useMemo(() => {
    const { thongTinCaNhan, gioiThieu, kinhNghiem, kyNang, hocVan, dinhDang } = cv;

    // 1. Tiêu đề CV & Chức danh
    const coHoTen = Boolean(thongTinCaNhan.hoTen && thongTinCaNhan.hoTen.trim().length >= 2);
    const coViTri = Boolean(
      thongTinCaNhan.viTriUngTuyen && thongTinCaNhan.viTriUngTuyen.trim().length >= 2
    );
    const tieuChi1Dat = coHoTen && coViTri;

    // 2. Thông tin liên hệ
    const emailHopLe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(thongTinCaNhan.email || '');
    const sdtHopLe = Boolean(
      thongTinCaNhan.soDienThoai && thongTinCaNhan.soDienThoai.replace(/\D/g, '').length >= 9
    );
    const tieuChi2Dat = emailHopLe && sdtHopLe;

    // 3. Mục tiêu / Tóm tắt bản thân
    const textGioiThieu = (gioiThieu || '').replace(/<[^>]*>/g, '').trim();
    const doDaiTu = textGioiThieu ? textGioiThieu.split(/\s+/).length : 0;
    const coTuKhoaSaoRong =
      /tìm kiếm cơ hội|phát triển bản thân|thăng tiến trong sự nghiệp|học hỏi kinh nghiệm/i.test(
        textGioiThieu
      );
    const tieuChi3Dat = doDaiTu >= 20 && !coTuKhoaSaoRong;

    // 4. Kỹ năng chuyên môn
    const soLuongKyNang = (kyNang || []).length;
    const tieuChi4Dat = soLuongKyNang >= 4;

    // 5. Định lượng kinh nghiệm (Con số, %, doanh số, kết quả)
    const textKinhNghiem = (kinhNghiem || [])
      .map((k) => `${k.viTri} ${k.congTy} ${k.moTa || ''}`)
      .join(' ');
    const coConSo = /\d+(\.\d+)?%|\d+\s*(triệu|tỷ|usd|k|người|khách hàng|dự án|kpi)/i.test(
      textKinhNghiem
    ) || /\d{2,}/.test(textKinhNghiem);
    const tieuChi5Dat = Boolean(kinhNghiem.length > 0 && coConSo);

    // 6. Kinh nghiệm sắp xếp theo thời gian mới nhất lên đầu
    const tieuChi6Dat = (kinhNghiem || []).length > 0;

    // 7. Học vấn & Bằng cấp
    const coHocVan = (hocVan || []).length > 0 && Boolean(hocVan[0].truong);
    const tieuChi7Dat = coHocVan;

    // 8. Định dạng khoảng cách dòng và cỡ chữ
    const khoangCach = dinhDang?.khoangCachDong || 1.45;
    const tieuChi8Dat = khoangCach >= 1.2 && khoangCach <= 1.7;

    // 9. Độ dài CV chuẩn
    const soTrang = dinhDang?.soTrangCV || 1;
    const tieuChi9Dat = soTrang <= 2;

    // 10. Không dính watermark hay ký tự rác
    const toanBoCV = JSON.stringify(cv).toLowerCase();
    const coWatermark = /topcv\.vn|vietnamworks|timviecnhanh|-- \d of \d --/i.test(toanBoCV);
    const tieuChi10Dat = !coWatermark;

    return [
      {
        id: 'tc-1',
        tieuDe: 'Họ tên & Vị trí ứng tuyển mục tiêu rõ ràng',
        moTa: 'Tên bạn và chức danh ứng tuyển phải nổi bật nhất ở đầu trang, trùng khớp với JD.',
        loiThuongGap: 'Để tiêu đề chung chung "Curriculum Vitae" hoặc quên ghi rõ vị trí ứng tuyển.',
        cachKhacPhuc: 'Điền chính xác chức danh mong muốn (VD: "Chuyên Viên Digital Marketing" thay vì ghi chung chung).',
        datYeuCau: tieuChi1Dat,
        chiTietTrangThai: tieuChi1Dat
          ? `Đã có họ tên "${thongTinCaNhan.hoTen}" và vị trí "${thongTinCaNhan.viTriUngTuyen}".`
          : 'Chưa điền đầy đủ họ tên hoặc vị trí ứng tuyển.',
      },
      {
        id: 'tc-2',
        tieuDe: 'Thông tin liên hệ chuẩn mực & chính xác',
        moTa: 'Email chuyên nghiệp, số điện thoại hoạt động và địa chỉ thành phố.',
        loiThuongGap: 'Dùng email thời đi học có biệt danh tuổi teen (hoangtubuon@...), sai số điện thoại.',
        cachKhacPhuc: 'Dùng email định dạng hoten.career@gmail.com, bổ sung link LinkedIn hoặc Portfolio.',
        datYeuCau: tieuChi2Dat,
        chiTietTrangThai: tieuChi2Dat
          ? 'Email và số điện thoại đầy đủ, định dạng chuẩn.'
          : 'Vui lòng kiểm tra lại email hoặc số điện thoại của bạn.',
      },
      {
        id: 'tc-3',
        tieuDe: 'Mục tiêu nghề nghiệp súc tích, tránh sáo rỗng',
        moTa: 'Trình bày giá trị bạn sẽ mang lại cho công ty trong 2-3 câu ngắn (30-60 từ).',
        loiThuongGap: 'Viết sáo rỗng kiểu "Tìm kiếm cơ hội thăng tiến, học hỏi nâng cao bản thân".',
        cachKhacPhuc: 'Tập trung vào lợi ích cho nhà tuyển dụng: "Ứng dụng 3 năm kinh nghiệm Telesales để đẩy nhanh tốc độ chốt đơn 25% cho công ty".',
        datYeuCau: tieuChi3Dat,
        chiTietTrangThai: tieuChi3Dat
          ? `Độ dài ${doDaiTu} từ, văn phong hướng tới giá trị doanh nghiệp.`
          : doDaiTu < 20
          ? 'Mục tiêu còn quá ngắn (dưới 20 từ). Hãy viết thêm 2-3 câu nêu thế mạnh nổi bật.'
          : 'Phát hiện cụm từ sáo rỗng. Hãy sửa thành mục tiêu định lượng cụ thể.',
      },
      {
        id: 'tc-4',
        tieuDe: 'Kỹ năng cốt lõi (Hard skills & Soft skills)',
        moTa: 'Cần có từ 4-8 kỹ năng then chốt liên quan mật thiết tới vị trí ứng tuyển.',
        loiThuongGap: 'Chỉ ghi kỹ năng mềm chung chung (Giao tiếp tốt, Chăm chỉ, Thật thà) thiếu kỹ năng nghề.',
        cachKhacPhuc: 'Thêm kỹ năng công cụ chuyên môn (VD: Excel nâng cao, CRM, Canva, Python, B2B Sales...).',
        datYeuCau: tieuChi4Dat,
        chiTietTrangThai: tieuChi4Dat
          ? `Đã có ${soLuongKyNang} kỹ năng trong CV.`
          : `Mới có ${soLuongKyNang} kỹ năng. Bạn nên bổ sung thêm ít nhất ${4 - soLuongKyNang} kỹ năng chuyên môn nữa.`,
      },
      {
        id: 'tc-5',
        tieuDe: 'Kinh nghiệm có số liệu định lượng (%, số tiền, KPI)',
        moTa: 'Các bộ lọc ATS và nhà tuyển dụng đặc biệt săn tìm những con số chứng minh hiệu quả.',
        loiThuongGap: 'Kinh nghiệm chỉ liệt kê đầu việc được giao hàng ngày mà không có thành quả đạt được.',
        cachKhacPhuc: 'Áp dụng công thức STAR / Google XYZ: "Đạt 115% KPI doanh số quý, mang về 350 triệu doanh thu".',
        datYeuCau: tieuChi5Dat,
        chiTietTrangThai: tieuChi5Dat
          ? 'Đã phát hiện các chỉ số định lượng trong phần kinh nghiệm!'
          : 'Chưa thấy có con số cụ thể (%, doanh thu, số lượng khách, tiến độ hoàn thành). Hãy bổ sung vào mô tả công việc!',
      },
      {
        id: 'tc-6',
        tieuDe: 'Sắp xếp thời gian từ gần nhất đến xa nhất',
        moTa: 'Thứ tự thời gian đảo ngược (Reverse chronological) là tiêu chuẩn vàng của mọi CV.',
        loiThuongGap: 'Để công việc đầu tiên từ nhiều năm trước lên đầu, công ty hiện tại lại ở cuối cùng.',
        cachKhacPhuc: 'Kéo thả mục công việc gần đây nhất lên vị trí trên cùng trong khối kinh nghiệm.',
        datYeuCau: tieuChi6Dat,
        chiTietTrangThai: tieuChi6Dat
          ? 'Đã có danh sách kinh nghiệm làm việc theo thứ tự.'
          : 'Chưa có mục kinh nghiệm làm việc nào.',
      },
      {
        id: 'tc-7',
        tieuDe: 'Học vấn & Bằng cấp minh bạch',
        moTa: 'Nêu tên trường, chuyên ngành, xếp loại hoặc điểm số nếu tốt.',
        loiThuongGap: 'Ghi tên trường viết tắt gây khó hiểu cho hệ thống ATS quốc tế.',
        cachKhacPhuc: 'Ghi đầy đủ tên trường Đại học / Cao đẳng và chuyên ngành tốt nghiệp.',
        datYeuCau: tieuChi7Dat,
        chiTietTrangThai: tieuChi7Dat
          ? 'Học vấn đã được cập nhật đầy đủ.'
          : 'Chưa điền thông tin học vấn hoặc tên trường.',
      },
      {
        id: 'tc-8',
        tieuDe: 'Khoảng cách dòng & Phông chữ thoáng đãng',
        moTa: 'Khoảng cách dòng lý tưởng từ 1.3 đến 1.6 giúp mắt người đọc không bị mỏi.',
        loiThuongGap: 'Chữ quá khít nhau (line-height < 1.1) hoặc quá thưa thớt làm vỡ trang.',
        cachKhacPhuc: 'Điều chỉnh thanh trượt Khoảng cách dòng trong mục "Thiết Kế & Nền" về mức 1.35 - 1.5.',
        datYeuCau: tieuChi8Dat,
        chiTietTrangThai: tieuChi8Dat
          ? `Khoảng cách dòng hiện tại là ${khoangCach} (Rất đẹp mắt & thoáng đãng).`
          : `Khoảng cách dòng hiện tại là ${khoangCach}. Khuyên dùng mức 1.35 - 1.5.`,
      },
      {
        id: 'tc-9',
        tieuDe: 'Độ dài CV chuẩn mực (Tối đa 2 trang A4)',
        moTa: 'CV lý tưởng cho người dưới 5 năm kinh nghiệm là 1-2 trang A4 cân đối.',
        loiThuongGap: 'Nội dung tràn sang trang thứ 3 chỉ với 2 dòng chữ thừa, hoặc trang 2 bị trống quá nhiều.',
        cachKhacPhuc: 'Sử dụng công cụ chia cột hoặc thu nhỏ cỡ chữ để nội dung vừa khít trong 1 hoặc 2 trang.',
        datYeuCau: tieuChi9Dat,
        chiTietTrangThai: tieuChi9Dat
          ? `CV đang hiển thị ${soTrang} trang A4 chuẩn.`
          : 'CV đang quá dài, nên tinh gọn lại trong 2 trang.',
      },
      {
        id: 'tc-10',
        tieuDe: 'Sạch sẽ, không dính Watermark hoặc thông tin thừa',
        moTa: 'CV không được có logo chèn đè, bản quyền website bên thứ ba hay số trang thừa.',
        loiThuongGap: 'Copy paste từ nguồn khác dính mã số trang hay bản quyền website cũ.',
        cachKhacPhuc: 'Hệ thống CVify Pro tự động lọc sạch các mã độc hại và watermark cũ.',
        datYeuCau: tieuChi10Dat,
        chiTietTrangThai: tieuChi10Dat
          ? 'CV sạch sẽ hoàn toàn, không có watermark rác!'
          : 'Phát hiện có dấu vết bản quyền bên thứ ba. Hãy kiểm tra lại các mục!',
      },
    ];
  }, [cv]);

  if (!isOpen) return null;

  const soLuongDat = danhSachTieuChi.filter((t) => t.datYeuCau).length;
  const phanTram = Math.round((soLuongDat / danhSachTieuChi.length) * 100);

  const toggleCheckManual = (id: string) => {
    setCheckedManual((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
              <FileCheck2 size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Bảng Kiểm Tra Lỗi CV Thường Gặp
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                  ATS AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                10 tiêu chí vàng giúp CV vượt qua 100% bộ lọc tự động và lọt mắt xanh nhà tuyển dụng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Đóng bảng kiểm tra"
          >
            <X size={18} />
          </button>
        </div>

        {/* THANH ĐIỂM SỐ TỔNG THỂ */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm ring-2 ${
                phanTram >= 80
                  ? 'bg-emerald-500 text-white ring-emerald-200'
                  : phanTram >= 50
                  ? 'bg-amber-500 text-white ring-amber-200'
                  : 'bg-rose-500 text-white ring-rose-200'
              }`}
            >
              {phanTram}%
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Độ Sẵn Sàng Ứng Tuyển:</span>
                <span
                  className={
                    phanTram >= 80
                      ? 'text-emerald-600'
                      : phanTram >= 50
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }
                >
                  {phanTram >= 80
                    ? 'Xuất Sắc (Chuẩn ATS)'
                    : phanTram >= 50
                    ? 'Khá Tốt - Cần Tối Ưu Thêm'
                    : 'Cần Hoàn Thiện'}
                </span>
              </p>
              <p className="text-[11px] text-slate-500">
                CV của bạn đạt <strong>{soLuongDat}/{danhSachTieuChi.length}</strong> tiêu chuẩn tuyển dụng chuyên nghiệp.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                phanTram >= 80
                  ? 'bg-emerald-500'
                  : phanTram >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${phanTram}%` }}
            />
          </div>
        </div>

        {/* NỘI DUNG 10 TIÊU CHÍ CHECKLIST */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {danhSachTieuChi.map((item, idx) => {
            const isManualChecked = checkedManual[item.id] ?? item.datYeuCau;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.datYeuCau
                    ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/60'
                    : 'bg-amber-50/30 border-amber-200/80 hover:bg-amber-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleCheckManual(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 transition"
                      title="Đánh dấu đã hoàn thành"
                    >
                      {isManualChecked ? (
                        <CheckSquare size={18} className="text-emerald-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-800">
                          {idx + 1}. {item.tieuDe}
                        </span>
                        {item.datYeuCau ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={11} />
                            <span>Đạt chuẩn</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full">
                            <AlertTriangle size={11} />
                            <span>Cần tối ưu</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600">{item.moTa}</p>

                      <div className="text-[11px] pt-1">
                        <span className="font-semibold text-slate-700">Trạng thái CV hiện tại: </span>
                        <span
                          className={
                            item.datYeuCau ? 'text-emerald-700 font-medium' : 'text-amber-800 font-medium'
                          }
                        >
                          {item.chiTietTrangThai}
                        </span>
                      </div>

                      {!item.datYeuCau && (
                        <div className="mt-2 p-2.5 rounded-xl bg-white/80 border border-amber-200/60 text-[11px] space-y-1">
                          <p className="text-rose-700">
                            <strong>⚠️ Lỗi thường gặp:</strong> {item.loiThuongGap}
                          </p>
                          <p className="text-blue-700">
                            <strong>💡 Cách khắc phục:</strong> {item.cachKhacPhuc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Áp dụng theo tiêu chuẩn sàng lọc ứng viên quốc tế ATS</span>
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
          >
            Đã hiểu, quay lại chỉnh sửa CV
          </button>
        </div>
      </div>
    </div>
  );
};
export default ModalChecklistLoiCV;
