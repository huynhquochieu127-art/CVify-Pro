import { useState, useEffect } from "react";
import { BangTinCongDong } from "./BangTinCongDong";
import {
  Sparkles,
  FileText,
  ArrowRight,
  Palette,
  Printer,
  Move,
  Save,
  CheckCircle2,
  LogIn,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Check,
  Send,
  Layers,
  Award,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

export interface TrangChuProps {
  onChuyenTrinhThietKe: () => void;
  onMoDangNhap: () => void;
  onMoDangKy: () => void;
  daDangNhap?: boolean;
  onChuyenBangDieuKhien?: () => void;
  onDangXuat?: () => void;
  tenNguoiDung?: string;
  avatarNguoiDung?: string;
  anHeader?: boolean;
}

// Danh sách 3 Slide Hero Banner — thuần thị giác, không có nút bấm
const DANH_SACH_SLIDES = [
  {
    tag: "✦ KÉO THẢ LINH HOẠT ✦",
    tieuDe1: "Tự Do Sắp Xếp",
    tieuDe2: "Mọi Khối Thông Tin",
    tieuDe3: "Bằng Kéo & Thả",
    moTa:
      "Kéo từng khối CV — Thông tin cá nhân, Kinh nghiệm, Học vấn, Kỹ năng — vào đúng vị trí bạn muốn. Hệ thống tự căn chỉnh chuẩn tỷ lệ A4 không lệch điểm nào.",
    accent: "#1a91f0",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600",
    huyHieu1: { icon: "🎯", tieu: "Kéo thả mượt", phu: "@dnd-kit" },
    huyHieu2: { icon: "📐", tieu: "Tỷ lệ A4 chuẩn", phu: "210 × 297mm" },
  },
  {
    tag: "✦ CHUẨN ATS TUYỂN DỤNG ✦",
    tieuDe1: "Vượt Qua Mọi",
    tieuDe2: "Hệ Thống Quét CV",
    tieuDe3: "Tự Động ATS",
    moTa:
      "Cấu trúc dữ liệu ngữ nghĩa chuẩn ATS, thứ tự từ khóa tối ưu cho từng ngành nghề. CV của bạn được robot HR đọc đúng 100% trước khi đến tay nhà tuyển dụng.",
    accent: "#7c3aed",
    gradientFrom: "from-violet-600",
    gradientTo: "to-purple-600",
    huyHieu1: { icon: "✅", tieu: "Điểm ATS: 99/100", phu: "Top 1%" },
    huyHieu2: { icon: "🤖", tieu: "AI phân tích CV", phu: "Tức thì" },
  },
  {
    tag: "✦ XUẤT PDF SẮC NÉT ✦",
    tieuDe1: "Xuất File PDF",
    tieuDe2: "Không Lỗi Font",
    tieuDe3: "Tiếng Việt Hoàn Hảo",
    moTa:
      "100% font tiếng Việt không vỡ dấu, màu sắc in ấn trung thực, độ phân giải 300dpi chuẩn in. Tải PDF trong 3 giây — sẵn sàng gửi nhà tuyển dụng ngay lập tức.",
    accent: "#059669",
    gradientFrom: "from-emerald-600",
    gradientTo: "to-teal-600",
    huyHieu1: { icon: "📄", tieu: "PDF Chuẩn A4", phu: "300 DPI" },
    huyHieu2: { icon: "⚡", tieu: "Xuất trong 3s", phu: "Không lỗi font" },
  },
];

export const TrangChu = ({
  onChuyenTrinhThietKe,
  onMoDangNhap,
  onMoDangKy,
  daDangNhap = false,
  onChuyenBangDieuKhien,
  onDangXuat,
  tenNguoiDung = "Người Dùng",
  avatarNguoiDung = "",
  anHeader = false,
}: TrangChuProps) => {
  // Scroll state cho header blur effect
  const [daScroll, setDaScroll] = useState(false);
  useEffect(() => {
    const xuLyScroll = () => setDaScroll(window.scrollY > 20);
    window.addEventListener('scroll', xuLyScroll, { passive: true });
    return () => window.removeEventListener('scroll', xuLyScroll);
  }, []);

  // Quản lý slide Carousel
  const [slideHienTai, setSlideHienTai] = useState(0);
  const [dangTamDung, setDangTamDung] = useState(false);

  // Tự động chuyển slide sau mỗi 5 giây (tự tạm dừng khi rê chuột)
  useEffect(() => {
    if (dangTamDung) return;
    const boDem = setInterval(() => {
      setSlideHienTai((prev) => (prev + 1) % DANH_SACH_SLIDES.length);
    }, 5000);
    return () => clearInterval(boDem);
  }, [dangTamDung]);

  const slideTiepTheo = () => {
    setSlideHienTai((prev) => (prev + 1) % DANH_SACH_SLIDES.length);
  };

  const slideTruocDo = () => {
    setSlideHienTai(
      (prev) => (prev - 1 + DANH_SACH_SLIDES.length) % DANH_SACH_SLIDES.length,
    );
  };

  // Cuộn mượt đến section
  const cuonDenPhan = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1e2532] font-sans">
      {/* ================= 1. HEADER PREMIUM (Resume.io Style) ================= */}
      {!anHeader && (
        <header
          className={`sticky top-0 z-50 transition-all duration-300 ${
            daScroll
              ? "glass border-b border-[#d9deeb] shadow-xs"
              : "bg-white border-b border-[#d9deeb]"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-4">

            {/* === LOGO === */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1a91f0] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                CV
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-extrabold text-[#0f141e] tracking-tight">
                  CVify
                </span>
                <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded bg-[#1a91f0] leading-none">
                  PRO
                </span>
              </div>
            </div>

            {/* === NAV LINKS (Desktop) === */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: "Trang Chủ", id: "" },
                { label: "Tính Năng", id: "tinh-nang" },
                { label: "Mẫu CV", id: "kho-mau" },
                { label: "Liên Hệ", id: "lien-he" },
              ].map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() =>
                    link.id
                      ? cuonDenPhan(link.id)
                      : window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="relative px-3.5 py-2 text-sm font-medium text-[#656e83] hover:text-[#0f141e] rounded-lg hover:bg-[#f7f9fc] transition-all duration-200 cursor-pointer group/nav"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full opacity-0 group-hover/nav:opacity-100 transition-all duration-300 bg-[#1a91f0]" />
                </button>
              ))}
            </nav>

            {/* === AUTH & CTA === */}
            <div className="flex items-center gap-3">
              {daDangNhap ? (
                <>
                  <div className="hidden sm:flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full bg-[#1a91f0] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      title={tenNguoiDung}
                    >
                      {tenNguoiDung ? tenNguoiDung.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-sm font-semibold text-[#0f141e] max-w-[110px] truncate">
                      {tenNguoiDung}
                    </span>
                  </div>
                  {onDangXuat && (
                    <button
                      type="button"
                      onClick={onDangXuat}
                      className="p-2 text-[#828ba2] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Đăng xuất"
                    >
                      <LogOut size={16} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onMoDangNhap}
                    className="hidden sm:block text-sm font-medium text-[#1e2532] hover:text-[#1a91f0] px-3.5 py-1.5 rounded-full hover:bg-[#f7f9fc] transition cursor-pointer"
                  >
                    Đăng Nhập
                  </button>
                  <button
                    type="button"
                    onClick={onMoDangKy}
                    className="text-xs font-medium text-white bg-[#1a91f0] hover:bg-[#016fd0] px-4 py-2 rounded-[36px] transition cursor-pointer shadow-xs"
                  >
                    Đăng Ký
                  </button>
                </>
              )}

              {/* CTA Button với 36px border radius */}
              <button
                type="button"
                onClick={onChuyenTrinhThietKe}
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-white bg-[#1a91f0] hover:bg-[#016fd0] px-5 py-2.5 rounded-[36px] shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles size={14} className="shrink-0" />
                <span>Tạo CV Ngay</span>
                <ArrowRight size={13} className="shrink-0" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ================= 2. HERO BANNER SLIDER CAROUSEL ================= */}
      <style>{`
        @keyframes blob-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.94); }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slide-up-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes block-in-top {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes block-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes block-in-bottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-blob { animation: blob-float 8s ease-in-out infinite; }
        .anim-blob-2 { animation: blob-float 11s ease-in-out infinite reverse; }
        .anim-blob-3 { animation: blob-float 14s ease-in-out infinite; }
        .anim-badge-1 { animation: badge-float 3s ease-in-out infinite; }
        .anim-badge-2 { animation: badge-float 3.8s ease-in-out infinite 0.6s; }
        .anim-slide-up { animation: slide-up-in 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-block-top { animation: block-in-top 0.5s ease-out both; }
        .anim-block-left { animation: block-in-left 0.5s ease-out 0.2s both; }
        .anim-block-bottom { animation: block-in-bottom 0.5s ease-out 0.4s both; }
      `}</style>

      <section
        className="group relative overflow-hidden select-none bg-[#f7f9fc] border-b border-[#d9deeb]"
        onMouseEnter={() => setDangTamDung(true)}
        onMouseLeave={() => setDangTamDung(false)}
      >
        {/* Subtle dot pattern wash */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#1e2532 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* === MŨI TÊN TRÁI === */}
        <button
          type="button"
          onClick={slideTruocDo}
          aria-label="Slide trước"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white border border-[#d9deeb] text-[#1e2532] hover:bg-[#f7f9fc] hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 cursor-pointer shadow-xs"
        >
          <ChevronLeft size={20} className="stroke-[2.5]" />
        </button>

        {/* === MŨI TÊN PHẢI === */}
        <button
          type="button"
          onClick={slideTiepTheo}
          aria-label="Slide tiếp theo"
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white border border-[#d9deeb] text-[#1e2532] hover:bg-[#f7f9fc] hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 cursor-pointer shadow-xs"
        >
          <ChevronRight size={20} className="stroke-[2.5]" />
        </button>

        {/* === NỘI DUNG CHÍNH === */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ---- CỘT TRÁI: TEXT (Resume.io Style) ---- */}
            <div
              key={`slide-left-${slideHienTai}`}
              className="text-center lg:text-left anim-slide-up"
            >
              {/* Tag badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[#d9deeb] bg-[#f1f2ff] text-[#1a91f0]">
                <Sparkles size={13} />
                <span>{DANH_SACH_SLIDES[slideHienTai].tag}</span>
              </div>

              {/* Tiêu đề H1 chuẩn Resume.io: Ink / Carbon với từ khóa Signal Blue */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] mb-6 text-[#0f141e]">
                <span className="block">{DANH_SACH_SLIDES[slideHienTai].tieuDe1}</span>
                <span className="text-[#1a91f0] block">
                  {DANH_SACH_SLIDES[slideHienTai].tieuDe2}
                </span>
                <span className="text-[#1e2532] block font-bold">{DANH_SACH_SLIDES[slideHienTai].tieuDe3}</span>
              </h1>

              {/* Mô tả: Pencil #656e83 */}
              <p className="text-[#656e83] text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                {DANH_SACH_SLIDES[slideHienTai].moTa}
              </p>

              {/* Nút bấm hành động CTA Resume.io (Pill 36px) */}
              <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={onChuyenTrinhThietKe}
                  className="bg-[#1a91f0] hover:bg-[#016fd0] text-white text-base font-medium px-8 py-3.5 rounded-[36px] shadow-xs hover:shadow transition active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Tạo CV Của Bạn</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => cuonDenPhan('kho-mau')}
                  className="text-[#1a91f0] hover:text-[#016fd0] hover:underline font-medium text-base px-4 py-3.5 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Khám phá mẫu CV →</span>
                </button>
              </div>

              {/* 3 điểm nổi bật */}
              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#656e83] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#10b981] shrink-0" />
                  Miễn phí 100%
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#10b981] shrink-0" />
                  Chuẩn quét ATS 99%
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#10b981] shrink-0" />
                  Xuất PDF tức thì
                </span>
              </div>

              {/* Thống kê social proof */}
              <div className="mt-9 pt-7 border-t border-[#d9deeb] grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
                {[
                  { so: "10,000+", nhan: "CV đã tạo" },
                  { so: "99%", nhan: "Điểm ATS" },
                  { so: "4.9 / 5", nhan: "Đánh giá" },
                ].map((item) => (
                  <div key={item.nhan} className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-[#1a91f0]">{item.so}</div>
                    <div className="text-xs text-[#828ba2] mt-0.5">{item.nhan}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---- CỘT PHẢI: CV MOCKUP ĐỘNG (Resume.io Preview Card) ---- */}
            <div
              key={`slide-right-${slideHienTai}`}
              className="flex justify-center relative"
            >
              {/* Tờ CV A4 thu nhỏ nghiêng -2° chuẩn Resume.io */}
              <div
                className="relative w-full max-w-[340px] rounded-2xl"
                style={{ transform: "rotate(-2deg)" }}
              >
                {/* Card CV */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#d9deeb] p-6 overflow-hidden">
                  {/* Header CV */}
                  <div className="anim-block-top flex items-center gap-3 mb-4 pb-4 border-b border-[#e7eaf4]">
                    <div className="w-12 h-12 rounded-full bg-[#1a91f0] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      NA
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#0f141e] truncate">NGUYỄN VĂN AN</div>
                      <div className="text-xs font-medium text-[#1a91f0] mt-0.5">
                        Senior Software Engineer
                      </div>
                      <div className="text-[10px] text-[#828ba2] mt-0.5">an.nguyen@gmail.com · TP. HCM</div>
                    </div>
                  </div>

                  {/* Khối Kinh Nghiệm */}
                  <div className="anim-block-left mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-2 py-0.5 rounded bg-[#f1f2ff] text-[#1a91f0] inline-block">
                      Kinh Nghiệm Làm Việc
                    </div>
                    <div className="text-[11px] font-bold text-[#1e2532] mb-1">Tech Group Vietnam · 2023 - Nay</div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-[#f7f9fc] border border-[#d9deeb] rounded-full w-full" />
                      <div className="h-1.5 bg-[#f7f9fc] border border-[#d9deeb] rounded-full w-5/6" />
                      <div className="h-1.5 bg-[#f7f9fc] border border-[#d9deeb] rounded-full w-4/5" />
                    </div>
                  </div>

                  {/* Khối Kỹ Năng */}
                  <div className="anim-block-bottom">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-2 px-2 py-0.5 rounded bg-[#f1f2ff] text-[#1a91f0] inline-block">
                      Kỹ Năng Nổi Bật
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "Node.js", "TailwindCSS"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#d9deeb] bg-[#f7f9fc] text-[#1e2532]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Huy hiệu nổi 1: ATS Score badge (Mint Whisper #e7f4ed) */}
                <div className="anim-badge-1 absolute -bottom-4 -left-4 bg-[#e7f4ed] px-3.5 py-2 rounded-xl shadow-xs border border-[#a3e635]/40 flex items-center gap-2 pointer-events-none">
                  <span className="text-xl">✅</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#059669]">Điểm ATS: 99/100</div>
                    <div className="text-[9px] text-[#059669]/80">Vượt qua mọi bộ lọc HR</div>
                  </div>
                </div>

                {/* Huy hiệu nổi 2: Tốc độ xuất (Blush Whisper #ffebe4) */}
                <div className="anim-badge-2 absolute -top-4 -right-4 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-[#d9deeb] flex items-center gap-2 pointer-events-none">
                  <span className="text-xl">⚡</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#0f141e]">Tải file trong 3s</div>
                    <div className="text-[9px] text-[#656e83]">Chuẩn A4 300 DPI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* === DOTS PAGINATION === */}
          <div className="flex items-center justify-center gap-3 mt-12">
            {DANH_SACH_SLIDES.map((_, index) => {
              const active = slideHienTai === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSlideHienTai(index)}
                  aria-label={`Slide ${index + 1}`}
                  className="transition-all duration-300 cursor-pointer rounded-full h-2"
                  style={{
                    width: active ? "28px" : "8px",
                    background: active ? "#1a91f0" : "#d9deeb",
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 2.5. BENTO GRID TÍNH NĂNG ================= */}
      {/* ================= 2.5. TINTED FEATURE CARDS (Resume.io Style) ================= */}
      <section className="py-20 px-6 bg-white border-b border-[#d9deeb]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 border border-[#d9deeb] bg-[#f1f2ff] text-[#1a91f0]">
              <Sparkles size={13} />
              <span>CÔNG CỤ TẠO CV TỐI ƯU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f141e] tracking-tight">
              Tất Cả Những Gì Bạn Cần Để Có Một Bản CV Xuất Sắc
            </h2>
            <p className="text-[#656e83] mt-3 max-w-xl mx-auto text-base">
              Bộ công cụ thiết kế hồ sơ hiện đại giúp bạn nổi bật trong mắt mọi nhà tuyển dụng
            </p>
          </div>

          {/* Feature Cards Grid (Resume.io Tinted Feature Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">

            {/* Card 1 LỚN — Kéo thả (Lavender Wash #f1f2ff) */}
            <div className="md:col-span-2 rounded-2xl p-8 border border-[#d9deeb] bg-[#f1f2ff] relative overflow-hidden group transition-all duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white border border-[#d9deeb] text-[#1a91f0] shadow-xs">
                  <Move size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0f141e] mb-2">Kéo Thả Trực Quan (@dnd-kit)</h3>
                <p className="text-[#656e83] text-sm leading-relaxed max-w-md">
                  Tự do sắp xếp vị trí các khối thông tin bằng thao tác kéo thả mượt mà. Hệ thống tự động căn chỉnh lề theo tỷ lệ A4 chuẩn 210 × 297mm.
                </p>
                {/* Mini blocks */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {["Thông Tin Cá Nhân", "Kinh Nghiệm", "Học Vấn", "Kỹ Năng"].map((label) => (
                    <div
                      key={label}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1a91f0] bg-white border border-[#d9deeb] shadow-xs"
                    >
                      ⠿ {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 — PDF (Mint Whisper #e7f4ed) */}
            <div className="rounded-2xl p-8 border border-[#a3e635]/40 bg-[#e7f4ed] relative overflow-hidden group transition-all duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white border border-[#d9deeb] text-[#059669] shadow-xs">
                  <Printer size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0f141e] mb-2">Xuất PDF Sắc Nét</h3>
                <p className="text-[#656e83] text-sm leading-relaxed">
                  100% không lỗi font tiếng Việt. Độ phân giải chuẩn in 300 DPI sẵn sàng ứng tuyển.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#a3e635]/50 text-xs font-bold text-[#059669]">
                  <span>⚡</span> Xuất trong 3 giây
                </div>
              </div>
            </div>

            {/* Card 3 — ATS (Blush Whisper #ffebe4) */}
            <div className="rounded-2xl p-8 border border-[#fecdd3] bg-[#ffebe4] relative overflow-hidden group transition-all duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white border border-[#fecdd3] text-[#e11d48] shadow-xs">
                  <Award size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0f141e] mb-2">Chuẩn ATS Tuyển Dụng</h3>
                <p className="text-[#656e83] text-sm leading-relaxed">
                  Cấu trúc dữ liệu ngữ nghĩa giúp robot của nhà tuyển dụng đọc hiểu chính xác 100%.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#fecdd3] text-xs font-bold text-[#e11d48]">
                  <span>🎯</span> Điểm ATS: 99/100
                </div>
              </div>
            </div>

            {/* Card 4 — Bảng màu (White Paper card) */}
            <div className="rounded-2xl p-8 border border-[#d9deeb] bg-white relative overflow-hidden group transition-all duration-300 shadow-xs">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#f7f9fc] border border-[#d9deeb] text-[#1a91f0]">
                  <Palette size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0f141e] mb-2">Đổi Màu Tức Thì</h3>
                <p className="text-[#656e83] text-sm leading-relaxed">
                  6 bảng màu chuyên nghiệp chuẩn ATS, thay đổi phong cách chỉ với 1 click.
                </p>
                <div className="mt-6 flex gap-2">
                  {["#1a91f0","#5660e8","#059669","#e11d48","#f59e0b","#1e2532"].map(c => (
                    <div key={c} className="w-6 h-6 rounded-full border border-white shadow-xs" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 5 LỚN — Chỉnh sửa trực tiếp (md:col-span-2) */}
            <div className="md:col-span-2 rounded-2xl p-8 border border-[#d9deeb] bg-[#f7f9fc] relative overflow-hidden group transition-all duration-300">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white border border-[#d9deeb] text-[#1a91f0] shadow-xs">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#0f141e] mb-2">Chỉnh Sửa Trực Tiếp Trên Tờ CV</h3>
                <p className="text-[#656e83] text-sm leading-relaxed max-w-md">
                  Click trực tiếp vào bất kỳ mục nào trên tờ giấy A4 để nhập liệu và xem kết quả cập nhật theo thời gian thực.
                </p>
                <div className="mt-6 font-mono text-xs text-[#1e2532] bg-white border border-[#d9deeb] rounded-lg px-4 py-2.5 inline-block shadow-xs">
                  <span className="text-[#828ba2]">Họ tên: </span>
                  <span className="font-bold text-[#0f141e]">Nguyễn Văn An</span>
                  <span className="inline-block w-0.5 h-3.5 bg-[#1a91f0] ml-1 animate-pulse">|</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. KHO MẪU CV THỊNH HÀNH ================= */}
      <section id="kho-mau" className="py-20 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#1a91f0] uppercase tracking-wider bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 mb-4">
            <Layers size={13} /> Kho Template Chuyên Nghiệp
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            Kho Mẫu CV Thịnh Hành 2026
          </h2>
          <p className="text-slate-500 mt-3 text-sm leading-relaxed">
            Được nghiên cứu bởi chuyên gia tuyển dụng — giúp hồ sơ nổi bật giữa hàng trăm ứng viên.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {["Tất Cả","IT & Công Nghệ","Marketing","Kinh Doanh","Thiết Kế"].map((tab, i) => (
            <button
              key={tab}
              type="button"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={
                i === 0
                  ? { background: "linear-gradient(135deg,#1a91f0,#7c3aed)", color: "white", boxShadow: "0 4px 12px rgba(10,102,194,0.3)" }
                  : { background: "white", color: "#475569", border: "1px solid #e2e8f0" }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

          {/* Card 1: Modern */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
            {/* Preview */}
            <div className="relative h-72 bg-gradient-to-br from-blue-50 to-indigo-100/60 p-5 flex items-center justify-center overflow-hidden">
              {/* Badge hot */}
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold text-white px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(135deg,#1a91f0,#7c3aed)" }}>
                🔥 Phổ Biến Nhất
              </span>
              {/* CV mockup */}
              <div className="w-3/4 h-full bg-white rounded-t-xl shadow-md border border-slate-200/80 p-3 transform group-hover:scale-105 transition-transform duration-500">
                <div className="h-5 rounded-lg mb-2" style={{ background: "linear-gradient(135deg,#1a91f0,#7c3aed)" }} />
                <div className="h-1 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 space-y-1.5">
                    <div className="h-1 bg-blue-200 rounded" /><div className="h-1 bg-blue-100 rounded" /><div className="h-1 bg-blue-100 rounded" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <div className="h-1.5 bg-slate-300 rounded w-4/5" /><div className="h-1 bg-slate-100 rounded" /><div className="h-1 bg-slate-100 rounded" />
                  </div>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button type="button" onClick={onChuyenTrinhThietKe} className="px-4 py-2 text-xs font-bold text-white rounded-full cursor-pointer" style={{ background: "linear-gradient(135deg,#1a91f0,#7c3aed)" }}>
                  Dùng Mẫu Này
                </button>
                <button type="button" className="px-4 py-2 text-xs font-bold text-white bg-white/20 backdrop-blur rounded-full border border-white/30 cursor-pointer">
                  Xem Trước
                </button>
              </div>
            </div>
            {/* Info */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Mẫu Hiện Đại</h3>
                  <p className="text-xs text-slate-500 mt-0.5">IT · Lập trình viên · UI/UX</p>
                </div>
                <span className="text-[11px] font-semibold text-[#1a91f0] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">2 Cột</span>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  ★★★★★ <span className="text-slate-400 font-normal ml-1">4.9</span>
                </div>
                <span className="text-[11px] text-slate-400">2.3k lượt dùng</span>
              </div>
            </div>
          </div>

          {/* Card 2: Minimalist */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
            <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200/50 p-5 flex items-center justify-center overflow-hidden">
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold text-white bg-slate-800 px-2.5 py-1 rounded-full">
                ✦ ATS Friendly
              </span>
              <div className="w-3/4 h-full bg-white rounded-t-xl shadow-md border border-slate-200/80 p-3 transform group-hover:scale-105 transition-transform duration-500">
                <div className="h-5 bg-slate-800 rounded-lg mb-2" />
                <div className="h-1 bg-slate-400 rounded w-2/5 mb-4 mx-auto" />
                <div className="space-y-2">
                  <div className="h-1 bg-slate-300 rounded w-1/3" /><div className="h-1 bg-slate-100 rounded w-full" /><div className="h-1 bg-slate-100 rounded w-5/6" />
                  <div className="h-1 bg-slate-300 rounded w-1/3 pt-1" /><div className="h-1 bg-slate-100 rounded w-full" />
                </div>
              </div>
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button type="button" onClick={onChuyenTrinhThietKe} className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-full cursor-pointer">
                  Dùng Mẫu Này
                </button>
                <button type="button" className="px-4 py-2 text-xs font-bold text-white bg-white/20 backdrop-blur rounded-full border border-white/30 cursor-pointer">
                  Xem Trước
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Mẫu Tối Giản</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kinh tế · Tài chính · Quản trị</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">1 Cột</span>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  ★★★★★ <span className="text-slate-400 font-normal ml-1">4.8</span>
                </div>
                <span className="text-[11px] text-slate-400">1.7k lượt dùng</span>
              </div>
            </div>
          </div>

          {/* Card 3: Creative */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
            <div className="relative h-72 bg-gradient-to-br from-purple-50 to-pink-50 p-5 flex items-center justify-center overflow-hidden">
              <span className="absolute top-3 left-3 z-10 text-[10px] font-bold text-white bg-purple-600 px-2.5 py-1 rounded-full">
                🎓 Sinh Viên & Fresher
              </span>
              <div className="w-3/4 h-full bg-white rounded-t-xl shadow-md border border-slate-200/80 p-3 transform group-hover:scale-105 transition-transform duration-500">
                <div className="h-5 bg-purple-600 rounded-lg mb-2" />
                <div className="h-1 bg-purple-400 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="w-1/3 bg-purple-50 p-1 rounded space-y-1"><div className="h-1 bg-purple-200 rounded" /><div className="h-1 bg-purple-200 rounded" /></div>
                  <div className="w-2/3 space-y-1"><div className="h-1.5 bg-slate-300 rounded w-3/4" /><div className="h-1 bg-slate-100 rounded" /><div className="h-1 bg-slate-100 rounded w-5/6" /></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button type="button" onClick={onChuyenTrinhThietKe} className="px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-full cursor-pointer">
                  Dùng Mẫu Này
                </button>
                <button type="button" className="px-4 py-2 text-xs font-bold text-white bg-white/20 backdrop-blur rounded-full border border-white/30 cursor-pointer">
                  Xem Trước
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Mẫu Sáng Tạo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Sinh viên · Truyền thông · Creative</p>
                </div>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">Trẻ Trung</span>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  ★★★★½ <span className="text-slate-400 font-normal ml-1">4.7</span>
                </div>
                <span className="text-[11px] text-slate-400">980 lượt dùng</span>
              </div>
            </div>
          </div>

        </div>

        {/* CTA "Xem Tất Cả" */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={onChuyenTrinhThietKe}
            className="flex items-center gap-2.5 text-sm font-bold px-7 py-3.5 rounded-full border-2 border-[#1a91f0] text-[#1a91f0] hover:text-white transition-all duration-300 cursor-pointer"
            style={{ position: "relative", overflow: "hidden" }}
            onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg,#1a91f0,#7c3aed)", e.currentTarget.style.borderColor = "transparent", e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent", e.currentTarget.style.borderColor = "#1a91f0", e.currentTarget.style.color = "#1a91f0")}
          >
            <Layers size={16} />
            <span>Xem Tất Cả 20+ Mẫu CV</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ================= 3.7. SOCIAL PROOF STATS ================= */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { so: "12,847", donVi: "+", nhan: "CV đã tạo", mauNen: "#1a91f0" },
              { so: "98.6", donVi: "%", nhan: "Điểm ATS TB", mauNen: "#7c3aed" },
              { so: "4.9", donVi: "★", nhan: "Đánh giá", mauNen: "#f59e0b" },
              { so: "< 3", donVi: "s", nhan: "Thời gian xuất PDF", mauNen: "#059669" },
            ].map((item, i) => (
              <div key={item.nhan} className="group">
                <div
                  className="text-4xl sm:text-5xl font-black mb-2 font-['Plus_Jakarta_Sans',sans-serif]"
                  style={{
                    background: `linear-gradient(135deg, white, ${item.mauNen})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {item.so}<span className="text-2xl">{item.donVi}</span>
                </div>
                <div className="text-slate-400 text-sm font-medium">{item.nhan}</div>
                <div className="h-0.5 w-8 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: item.mauNen }} />
              </div>
            ))}
          </div>

          {/* Dải brand logos */}
          <div className="mt-14 pt-10 border-t border-white/10">
            <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-6">Tin dùng bởi nhân viên tại</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["FPT Software","VNG Corporation","Tiki","MoMo","Shopee Vietnam","Zalo"].map(brand => (
                <span
                  key={brand}
                  className="text-slate-500 font-bold text-sm hover:text-white transition-colors duration-300 cursor-default"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3.5. BẢN TIN NGHỀ NGHIỆP & CỘNG ĐỒNG CHIA SẺ ================= */}
      <BangTinCongDong
        tenNguoiDung={tenNguoiDung}
        avatarNguoiDung={avatarNguoiDung}
        daDangNhap={daDangNhap}
        onYeuCauDangNhap={onMoDangNhap}
      />

      {/* ================= 4. 4 TÍNH NĂNG NỔI BẬT ================= */}
      <section
        id="tinh-nang"
        className="py-16 px-6 bg-[#f4f2ee] border-y border-[#e0dfdc]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#1a91f0] uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60 shadow-2xs">
              Ưu Thế Vượt Trội
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              4 Tính Năng Giúp Bạn Tạo CV Hoàn Hảo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Bộ công cụ mạnh mẽ được tối ưu hóa cho tốc độ và chất lượng hồ sơ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tính năng 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#1a91f0]/40 hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a91f0] flex items-center justify-center mb-4">
                <Move size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Kéo Thả Mượt Mà
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Ứng dụng thư viện <code>@dnd-kit</code> cao cấp, sắp xếp các
                khối thông tin linh hoạt chỉ bằng thao tác kéo chuột.
              </p>
            </div>

            {/* Tính năng 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#1a91f0]/40 hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Printer size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Chuẩn In Ấn A4
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tỷ lệ chuẩn 210 x 297mm. Xuất file PDF sắc nét từng chi tiết,
                không lo bị tràn lề hay vỡ font chữ khi in.
              </p>
            </div>

            {/* Tính năng 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#1a91f0]/40 hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Palette size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Đổi Màu Tức Thì
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bảng màu tuyển chọn (Xanh LinkedIn, Xám Slate, Ngọc lục bảo, Tím)
                thay đổi toàn bộ phong cách chỉ trong 1 giây.
              </p>
            </div>

            {/* Tính năng 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:border-[#1a91f0]/40 hover:shadow-sm transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Save size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Tự Động Lưu An Toàn
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Lưu trữ trạng thái tức thì vào kho dữ liệu Zustand, an tâm chỉnh
                sửa không lo mất nội dung khi thao tác.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. QUY TRÌNH 3 BƯỚC ĐƠN GIẢN ================= */}
      <section id="quy-trinh" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#1a91f0] uppercase tracking-wider bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60 shadow-2xs">
            Dễ Dàng & Nhanh Chóng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Quy Trình 3 Bước Đơn Giản
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Không cần kỹ năng thiết kế đồ họa, ai cũng có thể tạo được chiếc CV chuẩn chỉ trong 5 phút.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Bước 1 */}
          <div className="relative text-center p-6 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#1a91f0] text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Chọn Mẫu CV Phù Hợp
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Lựa chọn mẫu CV tương thích với ngành nghề bạn đang ứng tuyển từ kho mẫu thịnh hành.
            </p>
          </div>

          {/* Bước 2 */}
          <div className="relative text-center p-6 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#1a91f0] text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Kéo Thả & Sửa Thông Tin
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Điền thông tin cá nhân, kinh nghiệm làm việc, kỹ năng và kéo đổi vị trí các phần theo ý bạn.
            </p>
          </div>

          {/* Bước 3 */}
          <div className="relative text-center p-6 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-[#1a91f0] text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Tải File PDF & Ứng Tuyển
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Xuất file PDF chất lượng cao chuẩn A4 và tự tin gửi đến nhà tuyển dụng mơ ước.
            </p>
          </div>
        </div>

        {/* Banner CTA phụ giữa trang */}
        <div className="mt-12 p-8 rounded-2xl bg-[#1a91f0] text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-xl font-bold">
              Bắt đầu tạo hồ sơ CV ngay bây giờ?
            </h3>
            <p className="text-sm text-white/90 mt-1">
              Trải nghiệm hoàn toàn miễn phí, tối ưu hóa chuẩn ATS trong 5 phút.
            </p>
          </div>
          <button
            type="button"
            onClick={onChuyenTrinhThietKe}
            className="bg-white text-[#1a91f0] hover:bg-[#f7f9fc] font-bold text-sm px-7 py-3.5 rounded-[36px] shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            Tạo CV Ngay
          </button>
        </div>
      </section>

      {/* ================= 5.5. BEFORE / AFTER ================= */}
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-200 mb-4">
              <Sparkles size={13} /> Sự Khác Biệt Rõ Ràng
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Trước Khi &amp; Sau Khi
            </h2>
            <p className="text-slate-500 mt-3">Dùng CVify Pro — nhà tuyển dụng thấy sự khác biệt ngay lập tức</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">

            {/* Divider VS */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full items-center justify-center text-sm font-black text-white shadow-xl" style={{ background: "linear-gradient(135deg,#1a91f0,#7c3aed)" }}>
              VS
            </div>

            {/* === TRƯỚC === */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 p-6 relative">
              <div className="absolute top-4 right-4 text-xs font-bold text-white bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                <span>❌</span> Không Đạt
              </div>
              <h3 className="font-black text-slate-800 text-base mb-4">CV Word thông thường</h3>

              {/* Giả lập Word CV xấu */}
              <div className="bg-white rounded-lg p-5 border border-red-100 font-serif text-[12px] text-slate-700 space-y-2 shadow-sm">
                <div className="font-bold text-sm text-center">NGUYỄN VĂN AN</div>
                <div className="text-center text-[11px] text-slate-500">0123456789 | an@gmail.com</div>
                <hr className="border-slate-300" />
                <div className="font-bold text-[11px]">MỤC TIÊU NGHỀ NGHIỆP:</div>
                <div className="text-[10px] text-slate-600 leading-loose">Tìm kiếm vị trí phù hợp để phát triển bản thân và cống hiến cho công ty.</div>
                <div className="font-bold text-[11px]">KINH NGHIỆM:</div>
                <div className="text-[10px] text-slate-600">- Công ty ABC: 2021-2022<br/>- Công ty XYZ: 2022-2023</div>
              </div>

              {/* Checklist đỏ */}
              <div className="mt-4 space-y-2">
                {["ATS không đọc được cấu trúc","Font lỗi khi in ra giấy","Layout vỡ trên màn hình khác"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-red-600">
                    <span className="text-red-500 text-base">✗</span> {item}
                  </div>
                ))}
              </div>

              {/* ATS Score */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Điểm ATS</span><span className="text-red-600 font-bold">34%</span></div>
                <div className="h-2 bg-red-100 rounded-full">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: "34%" }} />
                </div>
              </div>
            </div>

            {/* === SAU === */}
            <div
              className="rounded-2xl border-2 p-6 relative"
              style={{ borderColor: "#1a91f0", background: "linear-gradient(135deg,#f0f7ff,#fff)", boxShadow: "0 0 40px rgba(10,102,194,0.15)" }}
            >
              <div className="absolute top-4 right-4 text-xs font-bold text-white px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "linear-gradient(135deg,#1a91f0,#059669)" }}>
                <span>✅</span> Đạt Chuẩn
              </div>
              <h3 className="font-black text-slate-800 text-base mb-4">CV tạo bằng CVify Pro</h3>

              {/* Giả lập CV đẹp */}
              <div className="bg-white rounded-lg overflow-hidden border border-blue-100 shadow-md">
                <div className="px-5 py-4" style={{ background: "linear-gradient(135deg,#1a91f0,#7c3aed)" }}>
                  <div className="text-white font-black text-sm">NGUYỄN VĂN AN</div>
                  <div className="text-blue-200 text-[11px]">Senior Software Engineer</div>
                  <div className="text-blue-200 text-[10px] mt-1">📧 an@gmail.com  📞 0123456789  📍 TP.HCM</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Kinh Nghiệm</div>
                    <div className="text-[11px] font-semibold text-slate-800">Tech Group Vietnam · 2023 - Nay</div>
                    <div className="h-1 bg-slate-200 rounded mt-1.5 w-5/6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Kỹ Năng</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {["React","TypeScript","Node.js"].map(s => (
                        <span key={s} className="text-[9px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist xanh */}
              <div className="mt-4 space-y-2">
                {["ATS đọc hoàn hảo 99/100","Font tiếng Việt chuẩn in A4","Layout pixel-perfect mọi màn hình"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-emerald-700">
                    <span className="text-emerald-500 text-base">✓</span> {item}
                  </div>
                ))}
              </div>

              {/* ATS Score */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Điểm ATS</span><span className="font-bold" style={{ color: "#1a91f0" }}>99%</span></div>
                <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full rounded-full shimmer" style={{ width: "99%", background: "linear-gradient(90deg,#1a91f0,#059669)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. FOOTER TOÀN DIỆN ================= */}
      <footer
        id="lien-he"
        className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-16 pb-12 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-3">
              <div className="w-7 h-7 rounded-md bg-[#1a91f0] text-white flex items-center justify-center font-bold text-xs">
                CV
              </div>
              <span className="font-bold text-sm tracking-tight">
                CVify <span className="text-[#1a91f0]">Pro</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Nền tảng thiết kế hồ sơ CV trực tuyến chuẩn mực, hiện đại và tối
              ưu hóa cho người tìm việc tại Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                title="Facebook"
              >
                <Share2 size={14} />
              </a>
              <a
                href="https://zalo.me/0855521052"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-500 hover:text-white flex items-center justify-center transition font-bold text-[11px]"
                title="Zalo: 0855521052"
              >
                Zalo
              </a>
              <a
                href="mailto:contact@cvify.pro"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition"
                title="Email"
              >
                <Mail size={14} />
              </a>
            </div>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => cuonDenPhan("kho-mau")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Kho Mẫu CV Thịnh Hành
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => cuonDenPhan("tinh-nang")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Tính Năng Nổi Bật
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => cuonDenPhan("quy-trinh")}
                  className="hover:text-white transition cursor-pointer"
                >
                  Quy Trình 3 Bước
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onChuyenTrinhThietKe}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition cursor-pointer"
                >
                  Mở Trình Thiết Kế A4
                </button>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Tài khoản */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Tài Khoản & Trợ Giúp
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onMoDangNhap}
                  className="hover:text-white transition cursor-pointer"
                >
                  Đăng Nhập Thành Viên
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onMoDangKy}
                  className="hover:text-white transition cursor-pointer"
                >
                  Đăng Ký Tài Khoản Mới
                </button>
              </li>
              <li>
                <span className="text-slate-500">Hướng Dẫn Viết CV Hay</span>
              </li>
              <li>
                <span className="text-slate-500">Chính Sách Bảo Mật</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ & Kênh truyền thông */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <Globe size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Website: <strong>https://cvify.pro</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <span>
                  Hotline / Zalo: <strong>0855521052</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-purple-400 shrink-0" />
                <span>
                  Email: <strong>hotro@cvify.pro</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Địa chỉ:{" "}
                  <strong>
                    520/72A Quốc lộ 13, Hiệp Bình Phước, Thủ Đức, TP.HCM
                  </strong>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 CVify Pro • Đồ án chuyên ngành Công nghệ thông tin. Bảo lưu
            mọi quyền.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition cursor-pointer">
              Điều khoản dịch vụ
            </span>
            <span>•</span>
            <span className="hover:text-slate-400 transition cursor-pointer">
              Bảo mật thông tin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrangChu;
