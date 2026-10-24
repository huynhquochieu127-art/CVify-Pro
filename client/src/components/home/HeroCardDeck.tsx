import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  CheckCircle2,
  MapPin,
  Briefcase,
} from "lucide-react";

export interface HeroCardData {
  id: string;
  tag: string;
  accentColor: string;
  headerBg: string;
  avatarUrl: string;
  ten: string;
  chucDanh: string;
  diaDiem: string;
  kinhNghiemNam: string;
  atsScore: number;
  boCuc: string;
  tomTat: string;
  kinhNghiem: Array<{
    viTri: string;
    congTy: string;
    thoiGian: string;
    diemNhan: string;
  }>;
  kyNang: string[];
}

export const HERO_CARDS: HeroCardData[] = [
  {
    id: "card-tech-lead",
    tag: "KỸ THUẬT & PHẦN MỀM",
    accentColor: "#2563eb",
    headerBg: "bg-[#0f172a]",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80",
    ten: "Nguyễn Văn An",
    chucDanh: "Staff Software Engineer",
    diaDiem: "TP. Hồ Chí Minh",
    kinhNghiemNam: "6 năm kinh nghiệm",
    atsScore: 99,
    boCuc: "2 Cột Chuẩn In A4",
    tomTat:
      "Chuyên gia kiến trúc hệ thống phân tán với 6 năm phát triển các nền tảng chịu tải 50k+ req/giây. Thành thạo TypeScript, Node.js, Go và Kubernetes.",
    kinhNghiem: [
      {
        viTri: "Lead Frontend Engineer",
        congTy: "VNG Corporation",
        thoiGian: "2022 - Hiện tại",
        diemNhan: "Tối ưu hóa kiến trúc web portal, giảm 42% thời gian tải trang.",
      },
      {
        viTri: "Senior Software Engineer",
        congTy: "FPT Software",
        thoiGian: "2020 - 2022",
        diemNhan: "Xây dựng hệ sinh thái microservices cho đối tác tài chính Nhật Bản.",
      },
    ],
    kyNang: ["React", "TypeScript", "Node.js", "Docker", "Kubernetes", "GraphQL"],
  },
  {
    id: "card-business-director",
    tag: "KINH DOANH & TĂNG TRƯỞNG",
    accentColor: "#059669",
    headerBg: "bg-[#064e3b]",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80",
    ten: "Trần Minh Hoàng",
    chucDanh: "Head of Business Growth",
    diaDiem: "Hà Nội",
    kinhNghiemNam: "7 năm kinh nghiệm",
    atsScore: 100,
    boCuc: "1 Cột Tối Giản ATS",
    tomTat:
      "Hơn 7 năm lãnh đạo mảng mở rộng thị trường B2B SaaS. Tăng trưởng doanh thu thường niên đạt 180% và xây dựng mạng lưới 40+ đối tác chiến lược.",
    kinhNghiem: [
      {
        viTri: "Director of Partnerships",
        congTy: "Fintech Global Hub",
        thoiGian: "2021 - Hiện tại",
        diemNhan: "Mở rộng 40+ tài khoản doanh nghiệp chủ chốt với ARR đạt $1.2M.",
      },
      {
        viTri: "Senior Account Executive",
        congTy: "NextTech Group",
        thoiGian: "2018 - 2021",
        diemNhan: "Vượt 145% KPI doanh số năm liên tiếp trong 3 năm.",
      },
    ],
    kyNang: ["B2B SaaS Sales", "Đàm Phán", "P&L Management", "Chiến Lược Thị Trường"],
  },
  {
    id: "card-product-designer",
    tag: "THIẾT KẾ SẢN PHẨM",
    accentColor: "#7c3aed",
    headerBg: "bg-[#3b0764]",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80",
    ten: "Phạm Thu Linh",
    chucDanh: "Principal Product Designer",
    diaDiem: "TP. Hồ Chí Minh",
    kinhNghiemNam: "5 năm kinh nghiệm",
    atsScore: 98,
    boCuc: "2 Cột Đối Xứng",
    tomTat:
      "Dẫn dắt thiết kế hệ thống trải nghiệm người dùng quy mô lớn. Tối ưu tỷ lệ chuyển đổi giỏ hàng tăng 24% cho nền tảng thương mại điện tử 3 triệu người dùng.",
    kinhNghiem: [
      {
        viTri: "Lead UI/UX Designer",
        congTy: "Creative Studio Lab",
        thoiGian: "2022 - Hiện tại",
        diemNhan: "Thiết kế toàn diện Design System đa nền tảng phục vụ 12 sản phẩm con.",
      },
      {
        viTri: "Senior Product Designer",
        congTy: "Be Group Vietnam",
        thoiGian: "2019 - 2022",
        diemNhan: "Thiết kế luồng thanh toán và bản đồ đặt xe với 1.5 triệu lượt giao dịch/ngày.",
      },
    ],
    kyNang: ["Design System", "Figma", "User Research", "Prototyping", "A/B Testing"],
  },
  {
    id: "card-ai-scientist",
    tag: "AI & MACHINE LEARNING",
    accentColor: "#0284c7",
    headerBg: "bg-[#082f49]",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&h=240&q=80",
    ten: "Lê Hoàng Nam",
    chucDanh: "Senior Machine Learning Engineer",
    diaDiem: "Hà Nội",
    kinhNghiemNam: "4 năm kinh nghiệm",
    atsScore: 99,
    boCuc: "2 Cột Kỹ Thuật",
    tomTat:
      "Tập trung vào tối ưu hóa mô hình ngôn ngữ lớn (LLM Fine-tuning) và pipeline xử lý dữ liệu thời gian thực. Tác giả 2 công bố khoa học tại hội nghị quốc tế.",
    kinhNghiem: [
      {
        viTri: "Senior AI Engineer",
        congTy: "VinAI Research",
        thoiGian: "2022 - Hiện tại",
        diemNhan: "Huấn luyện mô hình xử lý ngôn ngữ tiếng Việt quy mô 7B tham số.",
      },
      {
        viTri: "Data Scientist",
        congTy: "Vingroup Big Data",
        thoiGian: "2020 - 2022",
        diemNhan: "Xây dựng hệ thống khuyến nghị thời gian thực với độ trễ dưới 25ms.",
      },
    ],
    kyNang: ["PyTorch", "HuggingFace", "Python", "Docker", "MLOps", "LLM Inference"],
  },
];

export const HeroCardDeck = () => {
  const [indexHienTai, setIndexHienTai] = useState(0);
  const [dangTamDung, setDangTamDung] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const deckRef = useRef<HTMLDivElement>(null);

  // Tự động lật thẻ sau mỗi 4.5 giây nếu không rê chuột vào
  useEffect(() => {
    if (dangTamDung) return;
    const interval = setInterval(() => {
      setIndexHienTai((prev) => (prev + 1) % HERO_CARDS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [dangTamDung]);

  // Hiệu ứng tương tác rê chuột 3D Parallax mượt mà
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!deckRef.current) return;
    const rect = deckRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((x * 10).toFixed(2)),
      y: Number((-y * 8).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setDangTamDung(false);
    setTilt({ x: 0, y: 0 });
  };

  const cardSau = () => {
    setIndexHienTai((prev) => (prev + 1) % HERO_CARDS.length);
  };

  const cardTruoc = () => {
    setIndexHienTai((prev) => (prev - 1 + HERO_CARDS.length) % HERO_CARDS.length);
  };

  const chonThe = (i: number) => {
    setIndexHienTai(i);
  };

  return (
    <div
      ref={deckRef}
      className="w-full flex flex-col items-center select-none"
      onMouseEnter={() => setDangTamDung(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Khung chứa hiệu ứng 3D Deck */}
      <div className="relative w-full max-w-[530px] perspective-container">
        {/* Vầng sáng nền mềm mại tạo độ sâu thị giác */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-25 blur-3xl pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${HERO_CARDS[indexHienTai].accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Khung 3D Stacked Cards */}
        <div
          onClick={cardSau}
          className="relative aspect-[16/11.8] w-full cursor-pointer outline-none"
          title="Bấm vào thẻ để chuyển mẫu tiếp theo"
        >
          {HERO_CARDS.map((card, i) => {
            const offset = (i - indexHienTai + HERO_CARDS.length) % HERO_CARDS.length;

            let transform = "";
            let opacity = 0;
            let zIndex = 1;
            let filter = "none";

            if (offset === 0) {
              // Thẻ chính trên cùng kết hợp góc nghiêng theo chuột
              transform = `translate3d(0px, 0px, 20px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1)`;
              opacity = 1;
              zIndex = 10;
            } else if (offset === 1) {
              // Thẻ thứ 2 phía sau
              transform = `translate3d(0px, -20px, -35px) rotateX(${tilt.y * 0.5}deg) rotateY(${tilt.x * 0.5}deg) scale(0.94)`;
              opacity = 0.95;
              zIndex = 9;
            } else if (offset === 2) {
              // Thẻ thứ 3 sâu hơn
              transform = `translate3d(0px, -40px, -70px) scale(0.88)`;
              opacity = 0.8;
              zIndex = 8;
            } else {
              // Thẻ luân chuyển
              transform = "translate3d(0px, 25px, 40px) scale(1.02)";
              opacity = 0;
              zIndex = 11;
              filter = "blur(4px)";
            }

            return (
              <div
                key={card.id}
                className="card-deck-item absolute inset-x-0 bottom-0 aspect-[16/11.4] origin-top overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.02),0_20px_45px_-12px_rgba(0,0,0,0.18)] text-left flex flex-col transition-all duration-[600ms]"
                style={{
                  transform,
                  opacity,
                  zIndex,
                  filter,
                }}
              >
                {/* Header thẻ CV có ảnh chân dung ứng viên thật */}
                <div
                  className={`px-5 py-3.5 text-white ${card.headerBg} flex items-center justify-between shrink-0`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={card.avatarUrl}
                      alt={card.ten}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white/40 shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight text-white truncate">
                          {card.ten}
                        </span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white/95 shrink-0">
                          {card.tag}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/85 font-medium truncate">
                        {card.chucDanh}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold shrink-0">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>ATS {card.atsScore}/100</span>
                  </div>
                </div>

                {/* Nội dung bên trong CV (đậm nét thiết kế in ấn) */}
                <div className="p-4 sm:p-4.5 space-y-2.5 bg-white text-[#111111] flex-1 flex flex-col justify-between">
                  {/* Tóm tắt & Thông tin địa điểm */}
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-400 mb-1.5 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {card.diaDiem}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={11} />
                        {card.kinhNghiemNam}
                      </span>
                    </div>
                    <p className="text-[12px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {card.tomTat}
                    </p>
                  </div>

                  {/* Kinh nghiệm làm việc sắc nét */}
                  <div className="border-t border-black/[0.06] pt-2">
                    <div className="text-[9.5px] font-bold tracking-wider text-neutral-400 mb-1.5 uppercase">
                      Kinh nghiệm gần nhất
                    </div>
                    <div className="space-y-1.5">
                      {card.kinhNghiem.slice(0, 2).map((kn) => (
                        <div
                          key={kn.viTri}
                          className="border-l-2 pl-2 text-[11px]"
                          style={{ borderColor: card.accentColor }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-900">{kn.viTri}</span>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {kn.thoiGian}
                            </span>
                          </div>
                          <div className="text-neutral-500 text-[10.5px]">
                            {kn.congTy} ·{" "}
                            <span className="text-neutral-600 italic">{kn.diemNhan}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kỹ năng & Bố cục */}
                  <div className="border-t border-black/[0.06] pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                      {card.kyNang.slice(0, 4).map((k) => (
                        <span
                          key={k}
                          className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-700"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                      {card.boCuc}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thanh điều khiển chuyển thẻ & nút chọn nhanh vai trò */}
        <div className="mt-3.5 space-y-3">
          {/* Nút bấm trực tiếp từng ứng viên */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {HERO_CARDS.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  chonThe(i);
                }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  i === indexHienTai
                    ? "bg-[#111111] text-white shadow-xs scale-105"
                    : "bg-white text-neutral-600 border border-black/10 hover:border-black/25 hover:text-black"
                }`}
              >
                {card.chucDanh.split(" ")[0]} · {card.ten.split(" ").slice(-1)[0]}
              </button>
            ))}
          </div>

          {/* Dòng chỉ dẫn & nút lùi / tiến */}
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:text-black transition"
              onClick={cardSau}
            >
              <MousePointerClick size={13} className="text-neutral-400" />
              <span>Bấm vào thẻ để lật mẫu</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cardTruoc();
                }}
                aria-label="Xem mẫu CV trước"
                className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-neutral-100 transition cursor-pointer"
                title="Mẫu trước"
              >
                <ChevronLeft size={14} />
              </button>

              <div className="flex items-center gap-1.5">
                {HERO_CARDS.map((_, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      chonThe(i);
                    }}
                    className={`h-1.5 rounded-full cursor-pointer transition-all ${
                      i === indexHienTai ? "w-5 bg-[#111111]" : "w-1.5 bg-neutral-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cardSau();
                }}
                aria-label="Xem mẫu CV tiếp theo"
                className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-neutral-100 transition cursor-pointer"
                title="Mẫu tiếp theo"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
