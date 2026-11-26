# CVify Pro - Website Thiết Kế và Quản Lý CV Chuyên Nghiệp

> **ĐỒ ÁN CHUYÊN NGÀNH - ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)**  
> **Sinh viên thực hiện:** Huỳnh Quốc Hiệu — **MSSV:** 2380600685  
> **Giảng viên hướng dẫn:** ThS. Trần Gia Huy  
> **Tài liệu đặc tả chi tiết:** Xem file [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)  

---

## 🎯 Giới thiệu Đề tài
**CVify Pro** là nền tảng web thiết kế CV trực tuyến theo chuẩn khổ giấy A4 in ấn WYSIWYG, tích hợp cơ chế kéo thả đa khối (`@dnd-kit`), quản lý hồ sơ gốc thông minh (1-Click Auto Fill) và xuất file PDF vector sắc nét không lỗi font tiếng Việt.

## 🚀 Công nghệ sử dụng
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, `@dnd-kit`, Zustand.
- **Backend**: Node.js, Express.js (ES Modules), JWT, Bcrypt, Multer, Nodemailer (OTP Gmail).
- **Cơ sở dữ liệu**: MySQL + Prisma ORM (4 bảng: `nguoi_dung`, `ho_so_goc`, `mau_cv`, `danh_sach_cv`).
- **Dịch vụ xuất file**: Puppeteer PDF Service (chuẩn in ấn A4 300 DPI).
- **Lưu trữ ảnh**: Cloudinary CDN.

## 🛠️ Hướng dẫn Khởi chạy Nhanh

### 1. Khởi chạy Backend (`server/`)
```bash
cd server
npm install
npx prisma db push
npm run dev
```

### 2. Khởi chạy Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```

Chi tiết kiến trúc hệ thống, sơ đồ CSDL ERD và lộ trình 10 tuần xem tại: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).
