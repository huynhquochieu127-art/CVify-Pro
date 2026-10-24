import React, { useState, useEffect, type ReactNode } from "react";
import { BangTinCongDong } from "./BangTinCongDong";

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

type IconName =
  | "arrow"
  | "check"
  | "chevron"
  | "download"
  | "drag"
  | "file"
  | "layers"
  | "menu"
  | "shield"
  | "spark"
  | "users";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    drag: (
      <>
        <circle cx="9" cy="6" r="1" />
        <circle cx="15" cy="6" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="9" cy="18" r="1" />
        <circle cx="15" cy="18" r="1" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4z" />
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  };

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "small";
  href?: string;
  onClick?: () => void;
}) => {
  if (onClick) {
    return (
      <button
        type="button"
        className={`button button-${variant}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  return (
    <a className={`button button-${variant}`} href={href || "#templates"}>
      {children}
    </a>
  );
};

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="CVify Pro trang chủ">
      <span className="logo-mark">
        <span />
      </span>
      <span>
        CVify <strong>Pro</strong>
      </span>
    </a>
  );
}

function MiniResume({
  accent = "#2563EB",
  name = "Olivia Martin",
  role = "Product Designer",
  compact = false,
}: {
  accent?: string;
  name?: string;
  role?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`mini-resume ${compact ? "compact" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="resume-top">
        <div className="resume-avatar" />
        <div>
          <b>{name}</b>
          <span>{role}</span>
        </div>
      </div>
      <div className="resume-body">
        <div className="resume-side">
          <i className="line strong" />
          <i className="line" />
          <i className="line short" />
          <small>KỸ NĂNG</small>
          <div className="tag-lines">
            <i />
            <i />
            <i />
          </div>
          <small>HỌC VẤN</small>
          <i className="line" />
          <i className="line short" />
        </div>
        <div className="resume-main">
          <small>MỤC TIÊU</small>
          <i className="line" />
          <i className="line" />
          <i className="line short" />
          <small>KINH NGHIỆM</small>
          <b className="job-line">Senior {role}</b>
          <i className="line" />
          <i className="line" />
          <i className="line short" />
          <b className="job-line">Lead {role}</b>
          <i className="line" />
          <i className="line short" />
        </div>
      </div>
    </div>
  );
}

function BuilderMockup({ onExport }: { onExport?: () => void }) {
  const [columns, setColumns] = useState<1 | 2>(2);
  const sections = [
    "Thông tin liên hệ",
    "Kinh nghiệm làm việc",
    "Học vấn & Bằng cấp",
    "Kỹ năng chuyên môn",
  ];

  return (
    <div className="builder-shell">
      <div className="builder-bar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <div className="layout-toggle">
          <button
            className={columns === 1 ? "active" : ""}
            onClick={() => setColumns(1)}
          >
            1 Cột
          </button>
          <button
            className={columns === 2 ? "active" : ""}
            onClick={() => setColumns(2)}
          >
            2 Cột
          </button>
        </div>
        <button
          className="export-button"
          onClick={onExport}
          title="Xuất file PDF chuẩn in ấn A4 300 DPI"
        >
          <Icon name="download" size={14} /> Xuất PDF <span>300 DPI</span>
        </button>
      </div>
      <div className="builder-content">
        <div className="section-panel">
          <div className="panel-heading">
            <span>CÁC MỤC HỒ SƠ</span>
            <b>+</b>
          </div>
          {sections.map((item, i) => (
            <div
              className={`section-item ${i === 1 ? "selected" : ""}`}
              key={item}
            >
              <Icon name="drag" size={16} />
              <span className="section-icon">{["@", "B", "E", "S"][i]}</span>
              <b>{item}</b>
              {i === 1 && <span className="editing">Đang sửa</span>}
            </div>
          ))}
          <div className="ats-score">
            <div>
              <Icon name="shield" size={18} />
              <b>Điểm ATS</b>
              <strong>96</strong>
            </div>
            <div className="score-track">
              <i />
            </div>
            <span>Tương thích xuất sắc</span>
          </div>
        </div>
        <div className="document-stage">
          <div className={`document-preview columns-${columns}`}>
            <div className="doc-header">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Chân dung ứng viên Maya Chen"
              />
              <div>
                <h3>Maya Chen</h3>
                <p>Senior Product Designer</p>
                <span>maya.chen@email.com · TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div className="doc-grid">
              <aside>
                <DocSection title="KỸ NĂNG">
                  <p>Product Strategy</p>
                  <p>Design Systems</p>
                  <p>Figma & Prototype</p>
                  <p>User Research</p>
                </DocSection>
                <DocSection title="HỌC VẤN">
                  <b>Cử nhân Thiết kế</b>
                  <p>ĐH Mỹ Thuật · 2018</p>
                </DocSection>
              </aside>
              <main>
                <DocSection title="MỤC TIÊU">
                  <p>
                    Chuyên gia thiết kế sản phẩm tập trung kiến tạo trải nghiệm
                    tinh gọn, đột phá cho các sản phẩm công nghệ tăng trưởng
                    cao.
                  </p>
                </DocSection>
                <DocSection title="KINH NGHIỆM">
                  <b>Senior Product Designer</b>
                  <em>Northstar Labs · 2022—Nay</em>
                  <p>
                    Dẫn dắt dự án tái cấu trúc UI giúp tăng 34% tỷ lệ kích hoạt
                    và giảm 40% thời gian làm quen ứng dụng.
                  </p>
                  <b>Product Designer</b>
                  <em>Nova Systems · 2019—2022</em>
                  <p>
                    Xây dựng và chuẩn hóa hệ thống Design System dùng chung cho
                    4 đội ngũ sản phẩm.
                  </p>
                </DocSection>
              </main>
            </div>
          </div>
          <div className="zoom-pill">Khổ A4 · 84%</div>
        </div>
      </div>
    </div>
  );
}

function DocSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

const templateData = [
  {
    name: "Nordic Tech",
    role: "Kỹ Sư Phần Mềm",
    category: "Công Nghệ (IT)",
    accent: "#2563EB",
    person: "Daniel Kim",
  },
  {
    name: "Strata Growth",
    role: "Giám Đốc Sản Phẩm",
    category: "Kinh Doanh",
    accent: "#0F766E",
    person: "Amelia Jones",
  },
  {
    name: "Atelier Art",
    role: "Giám Đốc Sáng Tạo",
    category: "Sáng Tạo",
    accent: "#C2410C",
    person: "Sofia Rossi",
  },
  {
    name: "Mono AI",
    role: "Chuyên Gia Dữ Liệu",
    category: "Công Nghệ (IT)",
    accent: "#4F46E5",
    person: "Ethan Brooks",
  },
  {
    name: "Ledger Finance",
    role: "Quản Lý Tài Chính",
    category: "Kinh Doanh",
    accent: "#334155",
    person: "Noah Williams",
  },
  {
    name: "Studio Brand",
    role: "Thiết Kế Thương Hiệu",
    category: "Sáng Tạo",
    accent: "#BE185D",
    person: "Emma Laurent",
  },
];

function Templates({ onSelectTemplate }: { onSelectTemplate: () => void }) {
  const [filter, setFilter] = useState("Tất cả");
  const categories = ["Tất cả", "Công Nghệ (IT)", "Kinh Doanh", "Sáng Tạo"];
  const filtered =
    filter === "Tất cả"
      ? templateData
      : templateData.filter((item) => item.category === filter);

  return (
    <section
      className="section templates-section reveal-on-scroll"
      id="templates"
    >
      <div className="section-heading split-heading">
        <div>
          <span className="eyebrow">THIẾT KẾ ĐỂ TỎA SÁNG</span>
          <h2>Kho Mẫu CV Tuyển Dụng Chuyên Nghiệp</h2>
        </div>
        <p>
          Bố cục được chuẩn hóa vượt qua mọi hệ thống lọc hồ sơ tự động ATS mà
          vẫn giữ trọn vẻ đẹp thẩm mỹ cao cấp.
        </p>
      </div>
      <div className="filter-row" role="group" aria-label="Bộ lọc mẫu CV">
        {categories.map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="template-grid">
        {filtered.map((template, idx) => (
          <article
            className={`template-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
            key={template.name}
          >
            <div className="template-paper-wrap">
              <MiniResume
                accent={template.accent}
                name={template.person}
                role={template.role}
              />
            </div>
            <div className="template-meta">
              <div>
                <h3>{template.name}</h3>
                <p>{template.category} · Chuẩn tối ưu ATS</p>
              </div>
              <Button variant="small" onClick={onSelectTemplate}>
                Dùng Mẫu Này <Icon name="arrow" size={14} />
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  const items = [
    ["Daniel Kim", "Software Engineer", "#2563EB"],
    ["Olivia Martin", "Product Designer", "#BE185D"],
    ["Marcus Lee", "Growth Marketing", "#0F766E"],
    ["Anika Patel", "AI Specialist", "#4F46E5"],
  ];
  return (
    <section className="showcase reveal-on-scroll">
      <div className="showcase-intro">
        <span>ĐƯỢC TẠO VỚI CVIFY PRO</span>
        <h2>
          Hồ sơ thực tế.
          <br />
          Cơ hội thực tế.
        </h2>
        <p>
          Gia nhập cộng đồng ứng viên đang tự tin mở ra chương mới cho sự nghiệp
          của mình.
        </p>
      </div>
      <div className="showcase-track">
        {items.map(([name, role, accent], index) => (
          <div
            className={`showcase-card card-${index} reveal-on-scroll reveal-delay-${index + 1}`}
            key={name}
          >
            <MiniResume compact name={name} role={role} accent={accent} />
            <div>
              <span>{role}</span>
              <b>{name}</b>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      className="section feature-section reveal-on-scroll"
      id="features"
    >
      <div className="section-heading centered">
        <span className="eyebrow">HOÀN THIỆN ĐẾN TỪNG CHI TIẾT</span>
        <h2>Tạo CV chuyên nghiệp chưa bao giờ dễ dàng đến thế.</h2>
        <p>
          Công cụ thông minh tự động chuẩn hóa định dạng, để bạn tập trung trọn
          vẹn vào câu chuyện sự nghiệp của mình.
        </p>
      </div>
      <div className="bento-grid">
        <article className="bento-card reorder-card reveal-on-scroll reveal-delay-1">
          <div className="bento-copy">
            <span className="feature-icon">
              <Icon name="layers" />
            </span>
            <h3>Sắp xếp trong vài giây</h3>
            <p>
              Kéo thả bất kỳ mục nào vào vị trí mong muốn. Toàn bộ tài liệu tự
              động căn chỉnh lại mượt mà.
            </p>
          </div>
          <div className="reorder-demo">
            {["Kinh nghiệm làm việc", "Dự án thực tế", "Học vấn & Bằng cấp"].map(
              (item, i) => (
                <div className={i === 1 ? "floating" : ""} key={item}>
                  <Icon name="drag" />
                  <span>{item}</span>
                  <small>
                    {i === 0
                      ? "3 vị trí"
                      : i === 1
                      ? "4 dự án"
                      : "2 bằng cấp"}
                  </small>
                </div>
              )
            )}
          </div>
        </article>

        <article className="bento-card layout-card reveal-on-scroll reveal-delay-2">
          <div className="bento-copy">
            <span className="feature-icon">
              <Icon name="file" />
            </span>
            <h3>1 Click đổi bố cục</h3>
            <p>
              Chuyển đổi linh hoạt giữa 1 cột và 2 cột mà không mất bất kỳ dòng
              chữ hay định dạng nào.
            </p>
          </div>
          <div className="layout-demo">
            <div>
              <i className="wide" />
              <i />
              <i />
              <i className="short" />
            </div>
            <span>
              <Icon name="arrow" />
            </span>
            <div className="two-col">
              <aside>
                <i />
                <i />
                <i />
              </aside>
              <main>
                <i className="wide" />
                <i />
                <i />
                <i className="short" />
              </main>
            </div>
          </div>
        </article>

        <article className="bento-card ats-card reveal-on-scroll reveal-delay-3">
          <div className="ats-visual">
            <div className="score-ring">
              <span>98</span>
              <small>ĐIỂM ATS</small>
            </div>
            <div className="checks">
              <span>
                <Icon name="check" /> Định dạng chuẩn hóa
              </span>
              <span>
                <Icon name="check" /> UTF-8 sạch dấu tiếng Việt
              </span>
              <span>
                <Icon name="check" /> Nhúng font chữ đầy đủ
              </span>
            </div>
          </div>
          <div className="bento-copy">
            <span className="feature-icon">
              <Icon name="shield" />
            </span>
            <h3>Tương thích mọi hệ thống ATS</h3>
            <p>
              Cấu trúc ngữ nghĩa chuẩn xác, đảm bảo phần mềm tuyển dụng bóc tách
              chính xác kỹ năng và học vấn.
            </p>
          </div>
        </article>

        <article className="bento-card pdf-card reveal-on-scroll reveal-delay-4">
          <div className="pdf-visual">
            <div className="a4-page">
              <span>A4</span>
              <i />
              <i />
              <i />
            </div>
            <div className="quality-badge">
              <Icon name="spark" />
              <b>300 DPI</b>
              <span>CHẤT LƯỢNG VECTOR</span>
            </div>
          </div>
          <div className="bento-copy">
            <span className="feature-icon">
              <Icon name="download" />
            </span>
            <h3>Xuất bản PDF Vector sắc nét</h3>
            <p>
              Sắc nét ở mọi mức độ thu phóng. Chuẩn kích thước in ấn ISO 216 A4
              cho mọi lần xuất file.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section
      className="comparison-section reveal-on-scroll"
      id="comparison"
    >
      <div className="section section-heading centered">
        <span className="eyebrow">KHÁC BIỆT RÕ RÀNG</span>
        <h2>Đừng để định dạng làm rào cản sự nghiệp.</h2>
        <p>
          Bản CV nên là chìa khóa mở ra cánh cửa phỏng vấn, không phải gánh nặng
          căn chỉnh lề thủ công.
        </p>
      </div>
      <div className="section comparison-grid">
        <article className="comparison-card traditional reveal-on-scroll reveal-delay-1">
          <div className="comparison-title">
            <div>
              <span>TRƯỚC ĐÂY</span>
              <h3>CV Làm Bằng Word Thủ Công</h3>
            </div>
            <small>Phát hiện lỗi định dạng</small>
          </div>
          <div className="broken-page">
            <div className="broken-heading">
              <i />
              <div>
                <b>JASON MORRIS</b>
                <span>Marketing Manager</span>
              </div>
            </div>
            <div className="broken-content">
              <i />
              <i />
              <i className="too-long" />
              <h4>KINH NGHIỆM</h4>
              <b>Marketing Director</b>
              <i />
              <i />
              <div className="page-break">LỖI NHẢY TRANG NGOÀI Ý MUỐN</div>
              <i />
              <i />
            </div>
            <div className="error-note note-one">Chữ bị tràn lề</div>
            <div className="error-note note-two">Mục bị chia cắt</div>
          </div>
          <ul>
            <li>Font chữ bị thay đổi giữa các máy</li>
            <li>Nội dung tự tràn sang trang trắng thừa</li>
            <li>Máy quét ATS đọc sai cấu trúc bảng biểu</li>
          </ul>
        </article>

        <article className="comparison-card cvify reveal-on-scroll reveal-delay-2">
          <div className="comparison-title">
            <div>
              <span>HIỆN TẠI</span>
              <h3>CVify Pro</h3>
            </div>
            <small>
              <Icon name="check" size={14} /> Đã kiểm định chuẩn ATS
            </small>
          </div>
          <div className="perfect-page">
            <div className="perfect-header">
              <div>
                <b>JASON MORRIS</b>
                <span>Marketing Manager</span>
              </div>
              <div className="initials">JM</div>
            </div>
            <div className="perfect-grid">
              <aside>
                <h4>LIÊN HỆ</h4>
                <i />
                <i />
                <h4>KỸ NĂNG</h4>
                <i />
                <i />
                <i />
              </aside>
              <main>
                <h4>MỤC TIÊU</h4>
                <i />
                <i />
                <i />
                <h4>KINH NGHIỆM</h4>
                <b>Marketing Director</b>
                <i />
                <i />
                <i />
                <b>Brand Manager</b>
                <i />
                <i />
              </main>
            </div>
          </div>
          <ul>
            <li>Nhúng font chữ vector 300 DPI sắc nét</li>
            <li>Căn lề chuẩn A4 cố định 1:1 hoàn hảo</li>
            <li>Cấu trúc dữ liệu chuẩn cho máy quét ATS</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

const faqs = [
  [
    "CVify Pro có thực sự vượt qua được hệ thống lọc hồ sơ ATS không?",
    "Có! Mọi mẫu thiết kế đều sử dụng mã chuẩn ngữ nghĩa, tiêu đề mục tiêu chuẩn quốc tế, font chữ vector nhúng sâu và văn bản có thể bóc tách chính xác bởi mọi phần mềm ATS hiện đại.",
  ],
  [
    "Tôi có thể tạo và tải CV hoàn toàn miễn phí không?",
    "Hoàn toàn có thể! Bạn có thể tự do xây dựng, tùy chỉnh màu sắc, sắp xếp các khối và xuất file PDF chuẩn in ấn A4 miễn phí mà không bị chèn hình mờ (watermark).",
  ],
  [
    "Hệ thống có hỗ trợ đầy đủ tiếng Việt có dấu không?",
    "Có! CVify Pro sử dụng bảng mã chuẩn Unicode UTF-8 sạch, tương thích hoàn hảo với mọi ký tự tiếng Việt có dấu, đảm bảo không bao giờ bị lỗi font chữ khi nộp hồ sơ.",
  ],
  [
    "Tôi có thể đổi qua lại giữa bố cục 1 cột và 2 cột được không?",
    "Có! Bạn chỉ cần nhấn chọn chế độ 1 Cột hoặc 2 Cột trong trình thiết kế. Toàn bộ nội dung Kinh nghiệm, Học vấn và Kỹ năng sẽ tự động được sắp xếp lại một cách hài hòa.",
  ],
  [
    "Dữ liệu cá nhân và hồ sơ của tôi có được bảo mật an toàn không?",
    "Tuyệt đối an toàn. Dữ liệu của bạn được mã hóa an toàn và chỉ bạn mới có quyền chỉnh sửa, tải về hoặc chia sẻ liên kết CV của mình.",
  ],
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section reveal-on-scroll" id="faq">
      <div className="faq-aside">
        <span className="eyebrow">GIẢI ĐÁP THẮC MẮC</span>
        <h2>Chúng tôi luôn sẵn sàng hỗ trợ bạn.</h2>
        <p>
          Tìm câu trả lời nhanh chóng cho thắc mắc của bạn, hoặc trò chuyện với
          cố vấn tuyển dụng chuyên nghiệp.
        </p>
        <div className="mentor-card">
          <div className="mentor-avatars">
            <span>AM</span>
            <span>JK</span>
            <span>+</span>
          </div>
          <div>
            <b>Cần cố vấn góp ý CV?</b>
            <p>Đội ngũ chuyên gia HR sẵn sàng hỗ trợ phản hồi trong 24 giờ.</p>
            <a href="mailto:hotro@cvify.pro">
              Hỏi chuyên gia <Icon name="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
      <div className="accordion">
        {faqs.map(([question, answer], index) => (
          <div
            className={`faq-item ${open === index ? "open" : ""}`}
            key={question}
          >
            <button
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-expanded={open === index}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{question}</b>
              <i>
                <Icon name="chevron" />
              </i>
            </button>
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    [
      "Mẫu CV Theo Ngành",
      "Kỹ Sư Phần Mềm IT",
      "Kinh Doanh & B2B",
      "Thiết Kế Sáng Tạo",
      "Marketing & Tăng Trưởng",
    ],
    [
      "Tính Năng Nổi Bật",
      "Trình Tạo Bố Cục",
      "Bộ Quét Điểm ATS",
      "Xuất PDF Vector",
      "Thư Xin Việc (Cover Letter)",
    ],
    [
      "Tài Nguyên Tuyển Dụng",
      "Cẩm Nang Viết CV",
      "Nhật Ký Sự Nghiệp",
      "Mẹo Phỏng Vấn",
      "Cộng Đồng Nghề Nghiệp",
    ],
    ["Pháp Lý & Hỗ Trợ", "Chính Sách Bảo Mật", "Điều Khoản Dịch Vụ", "Liên Hệ", "hotro@cvify.pro"],
  ];
  return (
    <footer className="figma-footer reveal-on-scroll">
      <div className="footer-top">
        <div className="footer-brand">
          <Logo />
          <p>
            Xây dựng bản CV thể hiện trọn vẹn năng lực tốt nhất của bạn—và được
            đọc bởi đúng nhà tuyển dụng.
          </p>
          <div className="footer-badge">
            <Icon name="shield" size={16} /> Bảo mật dữ liệu hàng đầu
          </div>
        </div>
        {columns.map(([title, ...items]) => (
          <div className="footer-column" key={title}>
            <h3>{title}</h3>
            {items.map((item) => (
              <a href="#templates" key={item}>
                {item}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© 2026 CVify Pro. Phát triển phục vụ Đồ án Chuyên ngành CNTT.</span>
        <span>Tiếng Việt (VN) · Chuẩn ISO 216 A4</span>
      </div>
    </footer>
  );
}

export const TrangChu = ({
  onChuyenTrinhThietKe,
  onMoDangNhap,
  onMoDangKy,
  daDangNhap = false,
  onDangXuat,
  tenNguoiDung = "Người Dùng",
  avatarNguoiDung,
  anHeader = false,
}: TrangChuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Hiệu ứng cuộn tới đâu xuất hiện tới đó (Scroll-Triggered Reveal)
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-white font-sans antialiased selection:bg-[#2563eb] selection:text-white">
      {/* 1. Header Navigation */}
      {!anHeader && (
        <header className="figma-header">
          <nav className="figma-nav">
            <Logo />
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
              <a href="#templates" onClick={() => setMenuOpen(false)}>
                Mẫu CV
              </a>
              <a href="#features" onClick={() => setMenuOpen(false)}>
                Tính Năng
              </a>
              <a href="#comparison" onClick={() => setMenuOpen(false)}>
                So Sánh
              </a>
              <a href="#community" onClick={() => setMenuOpen(false)}>
                Cộng Đồng
              </a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>
                Hỏi Đáp
              </a>
            </div>

            <div className="flex items-center gap-3">
              {daDangNhap ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      {tenNguoiDung ? tenNguoiDung[0].toUpperCase() : "U"}
                    </span>
                    <span>{tenNguoiDung}</span>
                  </div>
                  {onDangXuat && (
                    <button
                      type="button"
                      onClick={onDangXuat}
                      className="text-xs text-slate-400 hover:text-rose-600 transition p-1"
                      title="Đăng xuất"
                    >
                      Đăng xuất
                    </button>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onMoDangNhap}
                    className="text-[13px] font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 transition"
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    onClick={onMoDangKy}
                    className="text-[13px] font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 transition"
                  >
                    Đăng ký
                  </button>
                </div>
              )}

              <Button variant="small" onClick={onChuyenTrinhThietKe}>
                Tạo CV Miễn Phí <Icon name="arrow" size={15} />
              </Button>
            </div>

            <button
              className="menu-button"
              aria-label="Mở menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="menu" />
            </button>
          </nav>
        </header>
      )}

      <main>
        {/* 2. Hero Section — Nổi bật màu sắc chuyển sắc, tương phản với phần thân */}
        <section className="hero section">
          <div className="hero-copy">
            <div className="announcement">
              <span>MỚI</span> Hệ thống chấm điểm ATS thông minh hơn{" "}
              <Icon name="arrow" size={14} />
            </div>
            <h1>
              Tạo bản CV chuẩn ATS giúp bạn <em>trúng tuyển.</em>
            </h1>
            <p className="hero-sub">
              Thiết kế hồ sơ chuyên nghiệp chuẩn ATS trong vài phút với định dạng
              thông minh, bố cục được nhà tuyển dụng chứng nhận và xuất bản in A4
              sắc nét.
            </p>
            <div className="hero-actions">
              <Button onClick={onChuyenTrinhThietKe}>
                Bắt đầu tạo CV miễn phí <Icon name="arrow" />
              </Button>
              <Button variant="secondary" href="#templates">
                Xem mẫu CV
              </Button>
            </div>
            <div className="social-proof">
              <div className="avatar-stack">
                <span>MC</span>
                <span>DL</span>
                <span>AR</span>
                <span>+15K</span>
              </div>
              <div>
                <div className="stars">
                  ★★★★★ <b>4.9/5</b>
                </div>
                <p>Hơn 15,000+ ứng viên tin dùng</p>
              </div>
            </div>
            <div className="hero-trust">
              <span>Được tin dùng bởi ứng viên tại các tập đoàn hàng đầu</span>
              <div className="hero-logos">
                <b>Google</b>
                <b>Meta</b>
                <b>TikTok</b>
                <b>VNG Corp</b>
                <b>MoMo</b>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="blue-orbit" />
            <div className="mockup-layer mockup-layer-one" />
            <div className="mockup-layer mockup-layer-two" />
            <BuilderMockup onExport={onChuyenTrinhThietKe} />
            <svg
              className="motion-path path-top"
              viewBox="0 0 180 90"
              aria-hidden="true"
            >
              <path d="M8 76C52 9 106 10 169 43" />
              <path className="motion-arrow" d="m159 35 11 8-13 4" />
            </svg>
            <svg
              className="motion-path path-bottom"
              viewBox="0 0 190 100"
              aria-hidden="true"
            >
              <path d="M8 17c29 69 96 82 173 39" />
              <path className="motion-arrow" d="m172 50 10 6-11 7" />
            </svg>
            <div className="drag-cursor cursor-one">
              <Icon name="drag" size={13} />
            </div>
            <div className="floating-stat stat-top">
              <span className="stat-icon stat-icon-blue">
                <Icon name="spark" size={16} />
              </span>
              <span>
                <b>Từ khóa nổi bật</b>Đã nhận diện động từ hành động
              </span>
            </div>
            <div className="floating-stat stat-score">
              <span className="stat-icon stat-icon-green">
                <Icon name="shield" size={16} />
              </span>
              <span>
                <b>
                  Điểm ATS <strong>96</strong>
                </b>
                Tương thích xuất sắc
              </span>
            </div>
            <div className="floating-stat stat-bottom">
              <span className="stat-icon stat-icon-green">
                <Icon name="check" size={16} />
              </span>
              <span>
                <b>Sẵn sàng xuất file</b>Đạt mọi tiêu chuẩn A4
              </span>
            </div>
          </div>
        </section>

        {/* 3. Showcase */}
        <Showcase />

        {/* 4. Kho mẫu CV tuyển chọn */}
        <Templates onSelectTemplate={onChuyenTrinhThietKe} />

        {/* 5. Tính năng Bento Grid */}
        <Features />

        {/* 6. So sánh trực quan Word vs CVify Pro */}
        <Comparison />

        {/* 7. Banner kêu gọi hành động CTA */}
        <section className="cta-section reveal-on-scroll" id="community">
          <div>
            <span className="eyebrow">CƠ HỘI NGHỀ NGHIỆP BẮT ĐẦU TỪ ĐÂY</span>
            <h2>Biến kinh nghiệm của bạn thành ấn tượng không thể bỏ qua.</h2>
            <p>
              Cùng hàng ngàn ứng viên xây dựng hồ sơ nổi bật thu hút nhà tuyển
              dụng ngay hôm nay.
            </p>
            <Button onClick={onChuyenTrinhThietKe}>
              Tạo CV Miễn Phí Ngay <Icon name="arrow" />
            </Button>
            <small>Không yêu cầu thẻ tín dụng · Xuất file bất kỳ lúc nào</small>
          </div>
          <div className="cta-decoration">
            <span>CV</span>
            <i />
            <i />
            <i />
          </div>
        </section>

        {/* 7b. Bảng tin cộng đồng nghề nghiệp tương tác */}
        <section className="section py-16 border-t border-slate-100 reveal-on-scroll">
          <BangTinCongDong
            tenNguoiDung={tenNguoiDung}
            avatarNguoiDung={avatarNguoiDung}
            daDangNhap={daDangNhap}
            onYeuCauDangNhap={onMoDangNhap}
          />
        </section>

        {/* 8. Hỏi đáp FAQ */}
        <FAQ />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default TrangChu;
