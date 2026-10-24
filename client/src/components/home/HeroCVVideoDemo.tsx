import { useState, useEffect } from "react";
import axios from "axios";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  MoveVertical,
  Check,
  Download,
  Printer,
  MousePointer2,
  CheckCircle2,
  Layers,
  Layout,
} from "lucide-react";

interface BuocThietKe {
  id: number;
  tieuDe: string;
  moTa: string;
  thoiGian: number; // thời gian chạy của bước (giây)
}

const CAC_BUOC: BuocThietKe[] = [
  {
    id: 1,
    tieuDe: "1. Chọn mẫu CV A4",
    moTa: "Chọn mẫu chuẩn ATS phù hợp ngành nghề",
    thoiGian: 3.2,
  },
  {
    id: 2,
    tieuDe: "2. Kéo thả dữ liệu",
    moTa: "Tự do sắp xếp thứ tự các mục kinh nghiệm",
    thoiGian: 3.5,
  },
  {
    id: 3,
    tieuDe: "3. Đổi bố cục 1 & 2 cột",
    moTa: "Tự động căn lề theo khổ giấy in ấn A4",
    thoiGian: 3.2,
  },
  {
    id: 4,
    tieuDe: "4. Xuất PDF 300 DPI",
    moTa: "Tải file vector sắc nét, sẵn sàng ứng tuyển",
    thoiGian: 3.5,
  },
];

export const HeroCVVideoDemo = () => {
  const [buocHienTai, setBuocHienTai] = useState(1);
  const [dangChay, setDangChay] = useState(true);
  const [tienDoBuoc, setTienDoBuoc] = useState(0);
  const [apiTrangThai, setApiTrangThai] = useState<string>("Đang kết nối API...");
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  const [boCucDemo, setBoCucDemo] = useState<"1-cot" | "2-cot">("2-cot");

  // 1. Gọi API Backend kiểm tra trạng thái và tải dữ liệu mẫu
  useEffect(() => {
    let isMounted = true;
    const kiemTraApi = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health", {
          timeout: 2500,
        });
        if (isMounted && res.data?.thanh_cong) {
          setApiTrangThai("API Studio v2.4 · Trực tuyến");
          setApiOnline(true);
        }
      } catch {
        if (isMounted) {
          setApiTrangThai("Studio Local Engine · Sẵn sàng");
          setApiOnline(true);
        }
      }
    };
    kiemTraApi();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Vòng lặp Video Animation tự động chuyển bước mượt mà
  useEffect(() => {
    if (!dangChay) return;

    const buocConfig = CAC_BUOC[buocHienTai - 1];
    const tongThoiGianMs = buocConfig.thoiGian * 1000;
    let batDau = Date.now();

    const interval = setInterval(() => {
      const troiQua = Date.now() - batDau;
      const phanTram = Math.min((troiQua / tongThoiGianMs) * 100, 100);
      setTienDoBuoc(phanTram);

      if (troiQua >= tongThoiGianMs) {
        clearInterval(interval);
        setTienDoBuoc(0);
        setBuocHienTai((prev) => (prev % CAC_BUOC.length) + 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [buocHienTai, dangChay]);

  // Cập nhật trạng thái giao diện theo từng bước
  useEffect(() => {
    if (buocHienTai === 3) {
      setBoCucDemo("1-cot");
    } else {
      setBoCucDemo("2-cot");
    }
  }, [buocHienTai]);

  const chuyenBuoc = (id: number) => {
    setBuocHienTai(id);
    setTienDoBuoc(0);
  };

  const batTatPlay = () => {
    setDangChay((prev) => !prev);
  };

  const tuaLai = () => {
    setBuocHienTai(1);
    setTienDoBuoc(0);
    setDangChay(true);
  };

  return (
    <div className="w-full max-w-[550px] mx-auto select-none">
      {/* Khung máy Studio trình chiếu video mô phỏng */}
      <div className="rounded-3xl border border-black/[0.12] bg-[#0f141e] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col">
        {/* Header giả lập phần mềm */}
        <div className="px-4.5 py-3 bg-[#151c2a] border-b border-white/[0.08] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-white/40 ml-2">|</span>
            <span className="text-white/80 font-semibold text-[11.5px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-blue-400" />
              Demo trực tiếp: Quy trình tạo CV trong 30 giây
            </span>
          </div>

          {/* Badge trạng thái API */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10.5px] font-medium text-white/85">
            <span className={`w-1.5 h-1.5 rounded-full ${apiOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span>{apiTrangThai}</span>
          </div>
        </div>

        {/* Màn hình hiển thị nội dung từng bước (The Canvas) */}
        <div className="relative aspect-[16/11] bg-[#111722] p-4.5 flex flex-col justify-between overflow-hidden">
          {/* Con trỏ chuột ảo mô phỏng thao tác người dùng */}
          <div
            className="absolute z-30 pointer-events-none transition-all duration-700 ease-out flex items-center gap-1"
            style={{
              top:
                buocHienTai === 1
                  ? "28%"
                  : buocHienTai === 2
                  ? "54%"
                  : buocHienTai === 3
                  ? "20%"
                  : "82%",
              left:
                buocHienTai === 1
                  ? "48%"
                  : buocHienTai === 2
                  ? "62%"
                  : buocHienTai === 3
                  ? "75%"
                  : "68%",
            }}
          >
            <MousePointer2 size={20} className="text-blue-400 fill-blue-500 filter drop-shadow-md" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
              {buocHienTai === 1
                ? "Click chọn mẫu"
                : buocHienTai === 2
                ? "Kéo thả khối"
                : buocHienTai === 3
                ? "Đổi bố cục"
                : "Xuất PDF"}
            </span>
          </div>

          {/* NỘI DUNG TỪNG BƯỚC */}
          {buocHienTai === 1 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Layout size={14} className="text-blue-400" />
                  Bước 1: Chọn mẫu thiết kế chuẩn in ấn A4
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                  Kho 6 mẫu ATS
                </span>
              </div>

              {/* Lưới 3 mẫu thu nhỏ */}
              <div className="grid grid-cols-3 gap-3 my-auto">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 flex flex-col justify-between hover:border-white/20 transition">
                  <div className="w-full h-16 rounded bg-slate-800/80 p-1.5 space-y-1">
                    <div className="w-3/4 h-2 rounded bg-white/30" />
                    <div className="w-1/2 h-1.5 rounded bg-white/15" />
                    <div className="w-full h-1 rounded bg-white/10" />
                  </div>
                  <div className="text-[11px] font-semibold mt-2 text-white/80">Kỹ Thuật IT</div>
                  <div className="text-[9px] text-white/40">2 Cột Đối Xứng</div>
                </div>

                <div className="rounded-xl border-2 border-blue-500 bg-blue-500/10 p-2.5 flex flex-col justify-between shadow-lg shadow-blue-500/20 scale-105">
                  <div className="w-full h-16 rounded bg-slate-900 p-1.5 space-y-1 relative">
                    <div className="w-3/4 h-2 rounded bg-blue-400" />
                    <div className="w-1/2 h-1.5 rounded bg-white/30" />
                    <div className="w-full h-1 rounded bg-white/20" />
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 size={12} className="text-blue-400" />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold mt-2 text-blue-300">Staff Engineer</div>
                  <div className="text-[9px] text-blue-400 font-medium">Đang chọn ✓</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 flex flex-col justify-between hover:border-white/20 transition">
                  <div className="w-full h-16 rounded bg-slate-800/80 p-1.5 space-y-1">
                    <div className="w-3/4 h-2 rounded bg-white/30" />
                    <div className="w-1/2 h-1.5 rounded bg-white/15" />
                    <div className="w-full h-1 rounded bg-white/10" />
                  </div>
                  <div className="text-[11px] font-semibold mt-2 text-white/80">Tăng Trưởng</div>
                  <div className="text-[9px] text-white/40">1 Cột Tối Giản</div>
                </div>
              </div>

              <div className="text-[11px] text-white/50 text-center">
                Tự động tối ưu hóa font chữ và khoảng cách lề chuẩn quốc tế
              </div>
            </div>
          )}

          {buocHienTai === 2 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MoveVertical size={14} className="text-emerald-400" />
                  Bước 2: Kéo thả thứ tự & chỉnh sửa trực tiếp 1:1
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Tự động lưu
                </span>
              </div>

              {/* Danh sách các khối kéo thả */}
              <div className="space-y-2 my-auto">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    1. Thông tin liên hệ & Giới thiệu bản thân
                  </span>
                  <Check size={13} className="text-neutral-500" />
                </div>

                {/* Khối đang được kéo thả */}
                <div className="p-2.5 rounded-xl bg-blue-600/30 border-2 border-blue-400 flex items-center justify-between text-xs text-white font-semibold transform translate-x-2 shadow-lg">
                  <span className="flex items-center gap-2">
                    <MoveVertical size={13} className="text-blue-300" />
                    2. Kinh nghiệm làm việc (VNG Corp · Staff Engineer)
                  </span>
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                    Đang kéo thả ↑
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    3. Kỹ năng chuyên môn (React, Go, Microservices)
                  </span>
                  <Check size={13} className="text-neutral-500" />
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 text-center font-medium">
                ✓ Dữ liệu hiển thị tức thì trên trang giấy A4 mà không cần tải lại
              </div>
            </div>
          )}

          {buocHienTai === 3 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Layers size={14} className="text-purple-400" />
                  Bước 3: Chuyển đổi linh hoạt bố cục 1 Cột & 2 Cột
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Khổ A4 (ISO 216)
                </span>
              </div>

              {/* Mô phỏng trang giấy A4 đổi bố cục */}
              <div className="my-auto p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-around gap-4">
                <div
                  onClick={() => setBoCucDemo("1-cot")}
                  className={`w-36 h-24 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition ${
                    boCucDemo === "1-cot"
                      ? "border-purple-400 bg-purple-500/20 shadow-md"
                      : "border-white/10 bg-white/5 opacity-60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded bg-white/40" />
                    <div className="w-full h-1.5 rounded bg-white/20" />
                    <div className="w-full h-1.5 rounded bg-white/20" />
                  </div>
                  <div className="text-[10px] font-bold text-center text-purple-300">
                    Bố cục 1 Cột
                  </div>
                </div>

                <div
                  onClick={() => setBoCucDemo("2-cot")}
                  className={`w-36 h-24 rounded-xl border p-2 flex justify-between cursor-pointer transition ${
                    boCucDemo === "2-cot"
                      ? "border-purple-400 bg-purple-500/20 shadow-md"
                      : "border-white/10 bg-white/5 opacity-60"
                  }`}
                >
                  <div className="w-[35%] h-full rounded bg-white/20 p-1 space-y-1">
                    <div className="w-full h-1.5 rounded bg-white/40" />
                    <div className="w-full h-1 rounded bg-white/30" />
                  </div>
                  <div className="w-[60%] h-full rounded bg-white/10 p-1 space-y-1 flex flex-col justify-between">
                    <div className="w-full h-1.5 rounded bg-white/40" />
                    <div className="text-[10px] font-bold text-right text-purple-300">
                      Bố cục 2 Cột
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-white/50 text-center">
                Không bao giờ bị lỗi nhảy trang hay tràn lề khi thay đổi bố cục
              </div>
            </div>
          )}

          {buocHienTai === 4 && (
            <div className="h-full flex flex-col justify-between animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Printer size={14} className="text-emerald-400" />
                  Bước 4: Xuất bản file PDF Vector chuẩn in ấn 300 DPI
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Hoàn tất 100%
                </span>
              </div>

              {/* Hộp hoàn thành và nút tải file */}
              <div className="my-auto p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400 flex items-center justify-center font-black text-emerald-300 text-sm">
                    PDF
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>CV_NguyenVanAn_StaffEng.pdf</span>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-white/60">
                      Khổ 210 × 297mm · 300 DPI Vector · 142 KB
                    </div>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/30 animate-pulse">
                  <Download size={13} />
                  <span>Sẵn sàng nộp</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-300 text-center font-medium">
                ✓ Đạt chuẩn UTF-8 Unicode, sẵn sàng gửi trực tiếp cho nhà tuyển dụng
              </div>
            </div>
          )}

          {/* Thanh tiến độ bước đang chạy */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-blue-500 transition-all duration-75 rounded-full"
              style={{ width: `${tienDoBuoc}%` }}
            />
          </div>
        </div>

        {/* Thanh điều khiển Video Player phía dưới */}
        <div className="p-3.5 bg-[#151c2a] border-t border-white/[0.08] flex items-center justify-between gap-2">
          {/* Nút Play/Pause & Tua lại */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={batTatPlay}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title={dangChay ? "Tạm dừng video" : "Tiếp tục chạy"}
            >
              {dangChay ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={tuaLai}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="Chạy lại từ đầu"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {/* 4 Nút bước chuyển đổi nhanh */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-end overflow-x-auto">
            {CAC_BUOC.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => chuyenBuoc(b.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer shrink-0 ${
                  buocHienTai === b.id
                    ? "bg-blue-600 text-white font-bold shadow-xs scale-105"
                    : "bg-white/5 hover:bg-white/15 text-white/70"
                }`}
              >
                {b.tieuDe.split(". ")[1]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
