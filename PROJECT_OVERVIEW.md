# ĐỒ ÁN CHUYÊN NGÀNH: XÂY DỰNG WEBSITE THIẾT KẾ VÀ QUẢN LÝ CV - CVIFY PRO

> **ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)**  
> **KHOA CÔNG NGHỆ THÔNG TIN**  
> **Sinh viên thực hiện:** Huỳnh Quốc Hiệu — **MSSV:** 2380600685  
> **Giảng viên hướng dẫn:** ThS. Trần Gia Huy  
> **Repository:** [CVify-Pro](https://github.com/huynhquochieu127-art/CVify-Pro)  

---

## 1. Giới Thiệu & Mục Tiêu Đề Tài

### 1.1. Bối cảnh & Đặt vấn đề
Trong quá trình tìm kiếm việc làm, bản CV (Curriculum Vitae) là cầu nối đầu tiên và mang tính quyết định giữa ứng viên và nhà tuyển dụng. Tuy nhiên, đa số người tìm việc, đặc biệt là sinh viên mới tốt nghiệp, thường gặp các khó khăn:
- **Lỗi định dạng khi xuất file**: Xuất file Word dễ bị nhảy layout, vỡ dòng hoặc lệch lề khi mở trên các thiết bị khác nhau; xuất file PDF từ các công cụ kém chất lượng thường bị lỗi font chữ tiếng Việt có dấu.
- **Mất thời gian nhập lại dữ liệu**: Mỗi lần đổi mẫu giao diện CV trên các nền tảng thông thường, người dùng phải gõ lại từ đầu toàn bộ kinh nghiệm và học vấn.
- **Bố cục cứng nhắc, thiếu linh hoạt**: Các mẫu CV truyền thống không cho phép tùy biến vị trí các khối (ví dụ: đưa khối Kỹ năng lên trước Kinh nghiệm hoặc chia 2 cột theo ý muốn).
- **Khó tối ưu cho hệ thống lọc hồ sơ (ATS)**: Font chữ lạ, cấu trúc phân mảnh làm bộ đọc ATS (Applicant Tracking System) không trích xuất được thông tin ứng viên.

### 1.2. Mục tiêu của dự án CVify Pro
**CVify Pro** là nền tảng web ứng dụng hiện đại, giải quyết triệt để các hạn chế trên với các mục tiêu trọng tâm:
1. **Trình thiết kế trực quan WYSIWYG theo chuẩn khổ giấy in A4** (210mm x 297mm): Thao tác trực tiếp trên giao diện thực tế như khi in ra giấy.
2. **Cơ chế Kéo - Thả đa khối không mất dữ liệu** (`@dnd-kit`): Tự do sắp xếp thứ tự các khối (Thông tin, Kinh nghiệm, Kỹ năng, Học vấn, Chứng chỉ, Dự án), di chuyển qua lại giữa các cột.
3. **Mô hình "Hồ sơ gốc" (Master Profile - 1-Click Auto Fill)**: Nhập thông tin sự nghiệp 1 lần duy nhất, tự động đổ dữ liệu vào bất kỳ mẫu CV nào chỉ với 1 click.
4. **Bộ tùy biến phong cách chuyên sâu**: Tự do đổi màu chủ đạo (Primary/Accent), bảng font Google Fonts tiếng Việt chuẩn, lề trang và khoảng cách dòng.
5. **Xuất PDF chuẩn in ấn bằng Puppeteer**: Kết xuất vector PDF sắc nét, tuyệt đối không lỗi font tiếng Việt, đúng kích thước A4.
6. **Chia sẻ hồ sơ trực tuyến**: Cung cấp đường link xem CV công khai (Public Portfolio Link) tối ưu cho nhà tuyển dụng xem ngay trên điện thoại hoặc máy tính.

---

## 2. Kiến Trúc Kỹ Thuật (Tech Stack & Architecture)

### 2.1. Ngăn xếp Công nghệ (Tech Stack)

| Thành phần | Công nghệ chính | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite** | Tối ưu hiệu năng, render nhanh, kiểm soát chặt chẽ kiểu dữ liệu |
| **Giao diện & UI** | **Tailwind CSS v4 + Lucide Icons** | Thiết kế giao diện hiện đại, responsive, icon tối giản sắc nét |
| **Kéo Thả Khối** | **@dnd-kit/core & @dnd-kit/sortable** | Kéo thả hoán đổi vị trí khối, chuyển cột mượt mà, hỗ trợ touch/mouse |
| **Quản lý State** | **Zustand** | Quản lý state toàn cục gọn nhẹ, hỗ trợ Undo/Redo (`Ctrl + Z` / `Ctrl + Y`) |
| **Backend Runtime** | **Node.js + Express.js (ES Modules)** | Xây dựng RESTful API chuẩn chuẩn `import/export`, mở rộng dễ dàng |
| **Cơ sở Dữ liệu** | **MySQL Database** | Lưu trữ quan hệ ACID, hỗ trợ cột dữ liệu JSON linh hoạt |
| **ORM Database** | **Prisma ORM** | Quản lý Schema, migrations an toàn, type-safe query tự động |
| **Xác thực & Bảo mật** | **JWT (JSON Web Token) + Bcrypt** | Xác thực phân quyền người dùng, mã hóa mật khẩu an toàn |
| **Gửi mã OTP** | **Nodemailer (Gmail SMTP)** | Gửi mã xác thực OTP 6 số qua email khi đăng ký tài khoản |
| **Lưu trữ Ảnh đại diện** | **Cloudinary API + Multer** | Tải ảnh đại diện, tự động cắt tròn/vuông và tối ưu hóa CDN |
| **Xuất PDF A4** | **Puppeteer (Headless Chromium)** | Render CV trên backend và xuất file PDF vector A4 chuẩn in ấn |

### 2.2. Sơ đồ Kiến trúc Hệ thống

```mermaid
graph TD
    User([Người dùng / Ứng viên]) --> FE[Frontend: React 19 + TypeScript + Tailwind CSS]
    
    subgraph Client [Trình duyệt Web Client-side]
        FE --> Canvas[Canvas A4 WYSIWYG]
        Canvas --> DND[Engine Kéo Thả: @dnd-kit]
        Canvas --> InlineEdit[Chỉnh sửa trực tiếp ContentEditable]
        FE --> State[Quản lý State: Zustand + Undo/Redo]
    end
    
    FE -->|RESTful API Calls / Bearer JWT| API[Backend: Node.js Express 5]
    
    subgraph Server [Máy chủ Backend - ES Modules]
        API --> AuthCtrl[Auth & OTP Nodemailer]
        API --> CVCtrl[CV CRUD & Layout Management]
        API --> ProfileCtrl[Master Profile Management]
        API --> PDFService[Puppeteer PDF Generator Service]
        API --> Cloudinary[Cloudinary Avatar Storage Service]
        
        AuthCtrl --> Prisma[Prisma ORM Client]
        CVCtrl --> Prisma
        ProfileCtrl --> Prisma
    end
    
    Prisma --> MySQL[(Cơ sở dữ liệu MySQL)]
    PDFService -->|Trả về file PDF chuẩn A4| FE
```

---

## 3. Thiết Kế Cơ Sở Dữ Liệu MySQL (Database Schema)

Hệ thống sử dụng cơ chế kết hợp giữa **quan hệ khóa ngoại chặt chẽ (Relational Foreign Keys)** và **cấu trúc dữ liệu động (JSON Columns)**. Giải pháp này giúp người dùng tự do tùy biến cấu trúc CV mà không cần phải thay đổi cấu trúc bảng CSDL (no schema migration overhead).

### 3.1. Sơ đồ Quan hệ Thực thể (ERD)

```mermaid
erDiagram
    nguoi_dung ||--o| ho_so_goc : "so_huu (1 - 1)"
    nguoi_dung ||--o{ danh_sach_cv : "tao_ra (1 - N)"
    mau_cv ||--o{ danh_sach_cv : "ap_dung (1 - N)"

    nguoi_dung {
        int id PK "Tự tăng"
        string email UK "Email đăng nhập"
        string mat_khau "Mã hóa bcrypt"
        string ho_ten "Họ và tên"
        string vai_tro "nguoi_dung / quan_tri"
        datetime ngay_tao "Múi giờ GMT+7"
        datetime ngay_cap_nhat "Múi giờ GMT+7"
    }

    ho_so_goc {
        int id PK "Tự tăng"
        int ma_nguoi_dung FK,UK "Khóa ngoại tới nguoi_dung"
        string anh_dai_dien "URL Cloudinary"
        json thong_tin_ca_nhan "Tên, title, email, phone, địa chỉ, website"
        json kinh_nghiem "Danh sách quá trình công tác"
        json hoc_van "Danh sách trường lớp, ngành học"
        json ky_nang "Danh sách kỹ năng chuyên môn"
        json du_an "Danh sách dự án đã tham gia"
        json chung_chi "Chứng chỉ & Giải thưởng"
    }

    mau_cv {
        int id PK "Tự tăng"
        string ten_mau "Tên mẫu (Modern, Minimalist...)"
        string anh_xem_truoc "Thumbnail template"
        json bo_cuc_mac_dinh "Cấu hình phân cột và thứ tự khối"
        json dinh_dang_mac_dinh "Màu sắc, font chữ chuẩn"
        boolean dang_hoat_dong "Trạng thái hiển thị"
    }

    danh_sach_cv {
        int id PK "Tự tăng"
        int ma_nguoi_dung FK "Khóa ngoại tới nguoi_dung"
        int ma_mau FK "Khóa ngoại tới mau_cv (nullable)"
        string tieu_de_cv "Tên bản CV cá nhân"
        string ma_chia_se UK "Mã UUID chia sẻ online"
        boolean cong_khai "Bật/Tắt chế độ xem công khai"
        json thu_tu_khoi "Layout vị trí các khối kéo thả"
        json noi_dung_cv "Toàn bộ dữ liệu chữ trên CV"
        json dinh_dang_cv "Font chữ, mã màu chủ đạo, lề trang"
        datetime ngay_tao "Múi giờ GMT+7"
        datetime ngay_sua "Múi giờ GMT+7"
    }
```

### 3.2. Chi tiết Prisma Schema File (`server/prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model NguoiDung {
  id            Int          @id @default(autoincrement())
  email         String       @unique
  mat_khau      String
  ho_ten        String
  vai_tro       String       @default("nguoi_dung")
  ngay_tao      DateTime     @default(now())
  ngay_cap_nhat DateTime     @updatedAt

  ho_so_goc     HoSoGoc?
  danh_sach_cv  DanhSachCv[]

  @@map("nguoi_dung")
}

model MauCv {
  id                 Int          @id @default(autoincrement())
  ten_mau            String
  anh_xem_truoc      String?
  bo_cuc_mac_dinh    Json?
  dinh_dang_mac_dinh Json?
  dang_hoat_dong     Boolean      @default(true)

  danh_sach_cv       DanhSachCv[]

  @@map("mau_cv")
}

model HoSoGoc {
  id                Int       @id @default(autoincrement())
  ma_nguoi_dung     Int       @unique
  anh_dai_dien      String?
  thong_tin_ca_nhan Json?
  kinh_nghiem       Json?
  hoc_van           Json?
  ky_nang           Json?
  du_an             Json?
  chung_chi         Json?

  nguoi_dung        NguoiDung @relation(fields: [ma_nguoi_dung], references: [id], onDelete: Cascade)

  @@map("ho_so_goc")
}

model DanhSachCv {
  id            Int       @id @default(autoincrement())
  ma_nguoi_dung Int
  ma_mau        Int?
  tieu_de_cv    String    @default("CV Chưa đặt tên")
  ma_chia_se    String?   @unique
  cong_khai     Boolean   @default(false)
  thu_tu_khoi   Json?
  noi_dung_cv   Json?
  dinh_dang_cv  Json?
  ngay_tao      DateTime  @default(now())
  ngay_sua      DateTime  @updatedAt

  nguoi_dung    NguoiDung @relation(fields: [ma_nguoi_dung], references: [id], onDelete: Cascade)
  mau_cv        MauCv?    @relation(fields: [ma_mau], references: [id], onDelete: SetNull)

  @@map("danh_sach_cv")
}
```

---

## 4. Đặc Tả 5 Phân Hệ Chức Năng Chính (Core Modules)

### 4.1. Module 1: Xác thực & Quản lý Hồ sơ gốc (Auth & Master Profile)
- **Đăng ký / Đăng nhập đa kênh**:
  - Đăng ký qua Email có xác minh OTP 6 số gửi tự động qua Gmail (Nodemailer).
  - Đăng nhập bảo mật JWT, lưu trữ token an toàn tại Client.
  - Tự động chuẩn hóa múi giờ Việt Nam (GMT+7) cho toàn bộ nhật ký tài khoản.
- **Master Profile (Hồ sơ gốc)**:
  - Cho phép người dùng nhập đầy đủ thông tin cá nhân: Họ tên, Mục tiêu nghề nghiệp, Kinh nghiệm làm việc, Học vấn, Kỹ năng, Chứng chỉ, Dự án.
  - Upload avatar lên Cloudinary CDN (hỗ trợ tự động căn góc và tối ưu dung lượng).
- **Tính năng 1-Click Auto-Fill**:
  - Khi tạo một CV mới, người dùng chỉ cần nhấn **"Tự động điền từ Hồ sơ gốc"**, toàn bộ dữ liệu mẫu sẽ được đồng bộ vào CV ngay lập tức mà không cần gõ lại.

### 4.2. Module 2: Bảng điều khiển & Thư viện mẫu (Dashboard & Template Gallery)
- **Kho mẫu CV (Template Gallery)**:
  - *Mẫu Hiện đại (Modern)*: Bố cục 2 cột bất đối xứng, thanh thông tin bên trái, kinh nghiệm bên phải.
  - *Mẫu Tối giản (Minimalist)*: Bố cục 1 cột truyền thống, chuẩn ATS cho các ngành kỹ thuật.
  - *Mẫu Sáng tạo (Creative)*: Phù hợp Designer, Marketing với điểm nhấn màu sắc và tiêu đề nổi bật.
- **Quản lý danh sách CV cá nhân**:
  - Hiển thị danh sách CV đã tạo kèm ảnh xem trước thu nhỏ.
  - Đổi tên CV theo vị trí ứng tuyển (ví dụ: *CV Frontend Developer*, *CV Node.js Fresher*).
  - Nhân bản CV (Duplicate) để tạo bản biến thể nộp cho nhiều công ty khác nhau.
  - Xóa CV có hộp thoại xác nhận an toàn.

### 4.3. Module 3: Trình thiết kế Live A4 WYSIWYG Canvas (Trọng tâm Đề tài)
- **Tờ giấy A4 chuẩn in ấn**:
  - Canvas hiển thị trực tiếp theo tỉ lệ chuẩn kích thước thực của khổ A4 ($210\text{ mm} \times 297\text{ mm}$).
  - Thước đo và đường căn lề an toàn (Safe Margin) tránh việc chữ bị sát mép giấy khi in.
- **Kéo thả sắp xếp khối linh hoạt (@dnd-kit)**:
  - Hoán đổi vị trí các khối chỉ bằng thao tác kéo chuột (kéo khối *Kỹ năng* lên trên *Học vấn*).
  - Kéo chuyển khối giữa cột trái và cột phải (đối với mẫu 2 cột).
  - Ẩn / Hiện khối (Toggle Section Visibility): Ẩn các khối chưa có dữ liệu (như Chứng chỉ) mà không làm mất thông tin đã nhập.
  - Thêm khối tùy chỉnh (Custom Section) tự do đặt tiêu đề.
- **Chỉnh sửa nội dung trực tiếp (Inline Editing)**:
  - Bấm trực tiếp vào văn bản trên CV để sửa tương tự Microsoft Word / Google Docs.
  - Thêm, bớt nhanh các gạch đầu dòng mô tả kinh nghiệm hoặc các tag kỹ năng.
- **Thanh công cụ tùy biến phong cách (Toolbar & Style Inspector)**:
  - Bộ sưu tập font chữ tiếng Việt chuẩn Google Fonts: Inter, Roboto, Montserrat, Merriweather, Plus Jakarta Sans.
  - Bảng chọn màu chủ đạo (Primary Color, Accent Color) cho tiêu đề, icon và đường viền.
  - Điều chỉnh khoảng cách dòng, đệm khối (Padding/Spacing) để dàn đều trang A4.
- **Lịch sử thao tác & Tự động lưu**:
  - Hỗ trợ phím tắt `Ctrl + Z` (Undo) và `Ctrl + Y` (Redo) thông qua Zustand store.
  - Cơ chế Auto-save tự động gửi API lưu nháp sau 1.5 giây ngừng gõ (Debounce).

### 4.4. Module 4: Xuất PDF Chuẩn In Ấn & Chia Sẻ Trực Tuyến
- **Dịch vụ Puppeteer PDF Service (Backend)**:
  - Trình duyệt ảo Headless Chromium nạp trang CV và render file PDF vector.
  - Đảm bảo độ phân giải cao 300 DPI, nét chữ và biểu tượng sắc sảo, không bao giờ bị nhảy layout hay vỡ dấu tiếng Việt.
- **Chia sẻ CV Online (Public Share Link)**:
  - Tự động tạo liên kết duy nhất có mã UUID (ví dụ: `https://cvify.pro/cv/share/f81d4fae-7dec-11d0-a765-00a0c91e6bf6`).
  - Nhà tuyển dụng có thể mở trực tiếp trên điện thoại để xem CV với định dạng chuẩn mà không cần cài phần mềm đọc PDF.

### 4.5. Module 5: Quản trị Hệ thống (Admin & Settings)
- Quản trị viên quản lý danh sách người dùng trong hệ thống.
- Bật/Tắt và cập nhật các mẫu template CV mặc định của hệ thống.

---

## 5. Cấu Trúc Thư Mục Dự Án (Project Structure)

Dự án được tổ chức theo mô hình Monorepo rõ ràng giữa Frontend (`client/`) và Backend (`server/`):

```
CVify-Pro/
├── client/                                    # Frontend React 19 + TypeScript + Vite
│   ├── public/                                # Assets tĩnh, favicon
│   ├── src/
│   │   ├── assets/                            # Hình ảnh minh họa, logo HUTECH, vector
│   │   ├── components/
│   │   │   ├── auth/                          # Đăng ký, Đăng nhập, Modal OTP
│   │   │   │   ├── DangKy.tsx
│   │   │   │   ├── DangNhap.tsx
│   │   │   │   └── HopThoaiXacThuc.tsx
│   │   │   ├── builder/                       # Không gian thiết kế A4 kéo thả
│   │   │   │   ├── TrinhThietKeCV.tsx         # Component trung tâm bộ soạn thảo
│   │   │   │   ├── ToGiayA4.tsx               # Khung giấy A4 WYSIWYG
│   │   │   │   ├── ThanhCongCu.tsx            # Toolbar đổi font, màu, tải PDF, undo/redo
│   │   │   │   └── SidebarKhoi.tsx            # Bảng điều khiển bật/tắt & thêm khối
│   │   │   ├── dashboard/                     # Quản lý CV & Hồ sơ gốc
│   │   │   │   ├── BangDieuKhien.tsx
│   │   │   │   ├── QuanLyCV.tsx
│   │   │   │   └── HoSoCaNhan.tsx
│   │   │   ├── home/                          # Trang chủ quảng bá & tương tác
│   │   │   │   ├── TrangChu.tsx
│   │   │   │   ├── FigmaHeroWorkspace.tsx
│   │   │   │   └── HeroCVVideoDemo.tsx
│   │   │   ├── kho-mau/                       # Kho giao diện CV mẫu
│   │   │   │   └── KhoCVMau.tsx
│   │   │   ├── layout/                        # Header, Navigation, Footer
│   │   │   │   ├── ThanhDauTrang.tsx
│   │   │   │   ├── ThanhBenTrai.tsx
│   │   │   │   └── ThanhTaskbar.tsx
│   │   │   ├── sections/                      # Từng khối nội dung CV kéo thả
│   │   │   │   ├── SortableKhoi.tsx           # Wrapper tích hợp Sortable của @dnd-kit
│   │   │   │   ├── KhoiThongTinCaNhan.tsx
│   │   │   │   ├── KhoiGioiThieu.tsx
│   │   │   │   ├── KhoiKinhNghiem.tsx
│   │   │   │   ├── KhoiHocVan.tsx
│   │   │   │   ├── KhoiKyNang.tsx
│   │   │   │   ├── KhoiDuAn.tsx
│   │   │   │   ├── KhoiChungChi.tsx
│   │   │   │   └── KhoiTuyChinh.tsx
│   │   │   └── ui/                            # Thư viện UI tái sử dụng (Button, Card...)
│   │   ├── store/
│   │   │   └── khoLuuTruCV.ts                 # Zustand Store quản lý state CV, layout, undo/redo
│   │   ├── types/
│   │   │   └── cv.ts                          # Định nghĩa Type & Interface TypeScript cho CV
│   │   ├── services/                          # Gọi Axios RESTful API
│   │   ├── App.tsx                            # Định tuyến Router chính
│   │   └── main.tsx                           # Entry point React
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                                    # Backend Node.js Express (ES Modules)
│   ├── prisma/
│   │   ├── schema.prisma                      # Định nghĩa CSDL MySQL 4 bảng
│   │   └── migrations/                        # Lịch sử đồng bộ cơ sở dữ liệu
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                          # Khởi tạo kết nối Prisma Client
│   │   │   └── mail.js                        # Cấu hình dịch vụ gửi mail OTP Gmail
│   │   ├── controllers/
│   │   │   ├── authController.js              # Xử lý Đăng ký, Đăng nhập, OTP, Timezone GMT+7
│   │   │   └── cvController.js                # Xử lý CRUD CV, Layout JSON, Timezone GMT+7
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js              # Middleware xác thực JWT Bearer Token
│   │   ├── routes/
│   │   │   ├── authRoutes.js                  # Tuyến API tài khoản & xác thực
│   │   │   └── cvRoutes.js                    # Tuyến API CV & Hồ sơ
│   │   ├── services/                          # Dịch vụ Puppeteer PDF & Cloudinary
│   │   └── app.js                             # File khởi động máy chủ Express
│   ├── .env                                   # Biến môi trường (DATABASE_URL, JWT_SECRET...)
│   └── package.json                           # Cấu hình "type": "module"
│
├── .gitignore                                 # Loại trừ node_modules, .env, log, skills-lock.json
└── PROJECT_OVERVIEW.md                        # Tài liệu tổng quan chi tiết đồ án
```

---

## 6. Lộ Trình Triển Khai 10 Tuần (Project Roadmap)

| Tuần | Mục tiêu công việc | Chi tiết triển khai | Kết quả đầu ra | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **Tuần 1** | **Khảo sát & Lập kế hoạch** | - Khảo sát các nền tảng CV (TopCV, Canva, Resume.io).<br>- Xác định yêu cầu đề tài, chọn công nghệ.<br>- Lập kế hoạch đồ án và nộp Đề cương Tuần 1. | Bản báo cáo Tuần 1, Đề cương chi tiết được GVHD thông qua. | ✅ **Hoàn thành** |
| **Tuần 2** | **Thiết kế CSDL & Backend Khung** | - Cài đặt MySQL và cấu hình Prisma ORM với 4 bảng chuẩn.<br>- Xây dựng API Đăng ký, Đăng nhập và xác thực OTP Gmail.<br>- Chuẩn hóa múi giờ Việt Nam (GMT+7) cho hệ thống.<br>- Nộp Báo cáo Tiến độ Tuần 2 kèm sơ đồ thực thể ERD. | Cơ sở dữ liệu MySQL hoạt động, API Auth hoàn thiện, Báo cáo Tuần 2. | ✅ **Hoàn thành** |
| **Tuần 3** | **Khởi tạo Frontend & Khung Live A4** | - Khởi tạo dự án React 19 + TypeScript + Vite + Tailwind CSS.<br>- Xây dựng khung hiển thị tờ giấy A4 tỉ lệ chuẩn.<br>- Thiết lập Zustand store quản lý state nội dung và layout. | Canvas A4 chuẩn WYSIWYG hiển thị trên trình duyệt. | ⏳ Đang tiến hành |
| **Tuần 4** | **Tích hợp Kéo thả @dnd-kit** | - Tích hợp thư viện `@dnd-kit/sortable` vào các khối nội dung.<br>- Thao tác kéo đổi thứ tự các section (Kinh nghiệm, Học vấn...).<br>- Hỗ trợ ẩn/hiện khối và thêm khối tùy biến mới. | Cơ chế kéo thả mượt mà, không giật lag, giữ nguyên dữ liệu. | ⏳ Kế hoạch |
| **Tuần 5** | **Trình soạn thảo trực tiếp (Inline Editing)** | - Xây dựng cơ chế ContentEditable sửa chữ trực tiếp trên CV.<br>- Thêm/bớt nhanh các gạch đầu dòng và danh sách kỹ năng.<br>- Hoàn thiện thanh công cụ chọn font Google Fonts tiếng Việt. | Chỉnh sửa trực quan như Microsoft Word trên trang A4. | ⏳ Kế hoạch |
| **Tuần 6** | **Tùy biến Màu sắc & Chức năng Undo/Redo** | - Bộ chọn mã màu chủ đạo (Primary/Accent Color).<br>- Tích hợp tính năng Undo/Redo (`Ctrl + Z` / `Ctrl + Y`).<br>- Cơ chế Auto-save tự động lưu nháp sau 1.5s lên MySQL. | Bộ công cụ Style Inspector hoàn chỉnh và tính năng tự động lưu. | ⏳ Kế hoạch |
| **Tuần 7** | **Master Profile & 1-Click Auto Fill** | - Xây dựng giao diện Hồ sơ cá nhân gốc (Master Profile).<br>- Tích hợp Cloudinary tải và cắt ảnh đại diện trực tiếp.<br>- Nút "1-Click Auto Fill" đổ dữ liệu từ hồ sơ vào bất kỳ CV nào. | Tính năng đồng bộ hồ sơ gốc LinkedIn-style hoàn thiện. | ⏳ Kế hoạch |
| **Tuần 8** | **Xuất PDF Puppeteer & Chia sẻ Link Public** | - Cài đặt Puppeteer trên Backend render file PDF A4 sắc nét.<br>- Kiểm tra lỗi vỡ font tiếng Việt và căn lề in ấn.<br>- Xây dựng trang xem CV trực tuyến qua mã chia sẻ công khai. | Xuất PDF chuẩn in ấn và chia sẻ link online mượt mà. | ⏳ Kế hoạch |
| **Tuần 9** | **Hoàn thiện Thư viện mẫu & Dashboard** | - Xây dựng 3 bộ mẫu template mặc định: Modern, Minimalist, Creative.<br>- Hoàn thiện Dashboard: Nhân bản CV, đổi tên, xóa CV.<br>- Tối ưu hóa hiệu năng, responsive trên các kích thước màn hình. | Hệ thống hoạt động trơn tru toàn bộ các phân hệ chức năng. | ⏳ Kế hoạch |
| **Tuần 10** | **Kiểm thử Toàn diện & Báo cáo Tổng kết** | - Kiểm thử bảo mật API, test tải và stress test việc in PDF.<br>- Rà soát toàn bộ tài liệu, viết báo cáo tổng kết đồ án chuyên ngành.<br>- Đóng gói mã nguồn, chuẩn bị slide và demo bảo vệ đồ án. | Bộ sản phẩm hoàn chỉnh, Báo cáo đồ án đầy đủ sẵn sàng bảo vệ. | ⏳ Kế hoạch |

---

## 7. Hướng Dẫn Cài Đặt & Chạy Dự Án (Getting Started)

### 7.1. Yêu cầu Môi trường
- **Node.js**: Phiên bản 18.x trở lên (khuyên dùng Node.js 20 LTS).
- **MySQL**: Phiên bản 8.0 trở lên.
- **Trình quản lý gói**: `npm` hoặc `yarn`.

### 7.2. Cài đặt & Khởi động Backend Server
```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt các gói phụ thuộc
npm install

# Cấu hình biến môi trường trong file .env
# DATABASE_URL="mysql://root:mat_khau@localhost:3306/cvify_pro"
# JWT_SECRET="your_jwt_secret_key"
# EMAIL_USER="your_email@gmail.com"
# EMAIL_PASS="your_app_password"

# Đồng bộ Schema với cơ sở dữ liệu MySQL
npx prisma db push
# hoặc chạy migration
npx prisma migrate dev --name init

# Khởi chạy máy chủ Backend (mặc định cổng 5000)
npm run dev
# hoặc: node src/app.js
```

### 7.3. Cài đặt & Khởi động Frontend Client
```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy máy chủ phát triển Vite (mặc định http://localhost:5173)
npm run dev
```

---

## 8. Tiêu Chuẩn Nghiệm Thu & Kiểm Thử (Verification Criteria)

1. **Hiển thị giao diện**:
   - Tờ giấy A4 hiển thị đúng tỉ lệ chuẩn trên màn hình máy tính.
   - Thao tác kéo thả khối bằng `@dnd-kit` diễn ra mượt mà ở tần số 60fps, không bị giật, rung lắc hoặc mất dữ liệu khi thả.
2. **Soạn thảo trực tiếp**:
   - Chỉnh sửa văn bản tức thời, gõ tiếng Việt có dấu chuẩn xác (Telex/VNI).
   - Phím tắt `Ctrl + Z` và `Ctrl + Y` hoạt động chính xác cho cả thay đổi nội dung lẫn vị trí sắp xếp.
3. **Độ trung thực của bản xuất PDF**:
   - File PDF tải về từ nút "Tải PDF" (thông qua Puppeteer) hoàn toàn trùng khớp từng pixel với bản xem trước trên giao diện web.
   - Các ký tự tiếng Việt hiển thị sắc nét, các liên kết (URL, Email) có thể nhấp được.
4. **Bảo mật và toàn vẹn dữ liệu**:
   - Mật khẩu người dùng được băm an toàn với thuật toán `bcrypt`.
   - Các API nhạy cảm được bảo vệ nghiêm ngặt qua JWT Authentication Middleware.
   - Cơ sở dữ liệu lưu vết thời gian theo múi giờ chuẩn Việt Nam (GMT+7).
