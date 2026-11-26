/**
 * client/src/types/cv.ts
 *
 * Định nghĩa kiểu dữ liệu toàn diện cho hệ thống CVify Pro:
 * - Hỗ trợ Bố Cục Đa Cột Tùy Biến (1 cột, 2 cột, 3 cột, N cột tùy ý do người dùng tự tạo).
 * - Hỗ trợ định dạng chữ chuyên sâu (IN HOA, Đậm, Nghiêng, Gạch chân, Màu sắc, Cỡ chữ).
 * - Hỗ trợ Custom Icon cho mọi mục, trường thông tin liên hệ và nội dung.
 * - Hoàn toàn tương thích tsconfig.app.json (verbatimModuleSyntax: true, erasableSyntaxOnly: true).
 */

// ==========================================
// 1. CÁC KIỂU BỐ CỤC ĐA CỘT TÙY CHỈNH (LAYOUT TYPES)
// ==========================================

/**
 * Chế độ hiển thị bố cục CV:
 * - '1-cot': Hiển thị 1 cột duy nhất toàn chiều rộng (Full-width)
 * - '2-cot': Hiển thị 2 cột lệch (Cột Trái 35% - Cột Phải 65%)
 * - '2-cot-deu': Hiển thị 2 cột đều nhau (Cột Trái 50% - Cột Phải 50%)
 * - '3-cot': Hiển thị 3 cột (Trái 25% - Giữa 50% - Phải 25%)
 * - '4-cot': Hiển thị 4 cột đều nhau (25% x 4)
 * - 'tuy-chinh': Bố cục N cột tùy chỉnh tự do (người dùng tự thêm/xóa/chỉnh tỉ lệ cột)
 */
export type CheDoBoCuc =
  | '1-cot'
  | '2-cot'
  | '2-cot-deu'
  | '3-cot'
  | '4-cot'
  | 'tuy-chinh';

/**
 * Định danh vị trí cột trong bố cục đa cột (hỗ trợ cả cột cố định và cột động 'cot-1', 'cot-2', ...)
 */
export type ViTriCot = 'cot-trai' | 'cot-phai' | 'cot-giua' | string;

/**
 * Cấu trúc 1 cột tùy chỉnh trong hệ thống đa cột động
 */
export interface CotTuChinh {
  /** ID duy nhất của cột (VD: 'cot-trai', 'cot-phai', 'cot-giua', 'cot-4', ...) */
  id: string;
  /** Tên hiển thị của cột (VD: 'Cột 1', 'Cột 2', ...) */
  ten: string;
  /** Tỉ lệ phần trăm chiều rộng của cột (tổng các cột = 100) */
  doRong: number;
  /** Danh sách ID các khối nội dung nằm trong cột này */
  khoiIds: string[];
}

/**
 * Cấu trúc dữ liệu cấu hình Bố Cục CV
 */
export interface BoCucCV {
  /** Chế độ bố cục hiện tại */
  cheDo: CheDoBoCuc;
  /** Danh sách ID các khối nằm ở Cột Trái (tương thích ngược) */
  cotTrai: string[];
  /** Danh sách ID các khối nằm ở Cột Phải (tương thích ngược) */
  cotPhai: string[];
  /** Danh sách ID các khối nằm ở Cột Giữa (nếu có) */
  cotGiua?: string[];
  /** Tỉ lệ phân chia độ rộng cột */
  tiLe?: string;
  /** Danh sách các cột động tùy chỉnh (cho phép tạo bao nhiêu cột tùy thích) */
  danhSachCot?: CotTuChinh[];
}

// ==========================================
// 2. KIỂU ĐỊNH DẠNG CHỮ & CUSTOM ICON
// ==========================================

/**
 * Cấu hình kiểu chữ cho từng trường hoặc tiêu đề (IN HOA, Đậm, Nghiêng, Gạch chân, Màu sắc, Cỡ chữ)
 */
export interface KieuChuItem {
  inDam?: boolean;
  inNghieng?: boolean;
  gachChan?: boolean;
  inHoa?: boolean;
  coChu?: string;
  mauChu?: string;
}

/**
 * Trường thông tin liên hệ tùy chỉnh dùng Icon
 */
export interface TruongLienHeTuyChinh {
  id: string;
  iconName: string;
  giaTri: string;
  placeholder?: string;
}

// ==========================================
// 3. CÁC KIỂU MỤC CON TỪNG KHỐI (SECTION ITEM TYPES)
// ==========================================

export interface KinhNghiemItem {
  id: string;
  congTy: string;
  viTri: string;
  thoiGian: string;
  diaDiem?: string;
  loaiHinh?: string;
  moTa: string;
  iconViTri?: string;
  iconCongTy?: string;
  iconThoiGian?: string;
}

export interface HocVanItem {
  id: string;
  truong: string;
  chuyenNganh: string;
  thoiGian: string;
  thanhTich: string;
  gpa?: string;
  diemSo?: string;
  iconChuyenNganh?: string;
  iconTruong?: string;
  iconThoiGian?: string;
  iconDiemSo?: string;
}

export interface KyNangItem {
  id: string;
  ten: string;
  mucDo: string;
  endorsements?: number;
  nhom?: string;
  iconName?: string;
}

export interface DuAnItem {
  id: string;
  ten: string;
  vaiTro: string;
  thoiGian: string;
  lienKet?: string;
  congNghe?: string[];
  moTa: string;
  iconTen?: string;
  iconVaiTro?: string;
  iconThoiGian?: string;
}

export interface ChungChiItem {
  id: string;
  ten: string;
  toChuc: string;
  nam: string;
  maChungChi?: string;
  iconTen?: string;
  iconToChuc?: string;
}

export interface CotConTuyChinh {
  id: string;
  tieuDeCot?: string;
  noiDung: string;
}

export interface KhoiTuyChinhItem {
  id: string;
  tieuDe: string;
  noiDung: string;
  iconName?: string;
  /** Cho phép chia nhiều cột ngay bên trong một mục tùy chỉnh */
  danhSachCotCon?: CotConTuyChinh[];
}

// Type aliases ngắn gọn tương thích với Interface Contracts
export type KinhNghiem = KinhNghiemItem;
export type HocVan = HocVanItem;
export type KyNang = KyNangItem;
export type DuAn = DuAnItem;
export type ChungChi = ChungChiItem;
export type KhoiTuyChinh = KhoiTuyChinhItem;

// ==========================================
// 4. ĐỊNH DẠNG & THÔNG TIN CÁ NHÂN
// ==========================================

export interface DinhDangCV {
  mauChuDao: string;
  coChu: string;
  fontChu: string;
  matDo: 'compact' | 'normal' | 'relaxed';
  cheDoBoCuc?: CheDoBoCuc;
  /** Lưu trữ icon tùy chỉnh cho từng khối (VD: { 'hoc-van': 'GraduationCap', 'ky-nang': 'Sparkles' }) */
  iconKhoi?: Record<string, string>;
  /** Lưu trữ tiêu đề tùy chỉnh cho các khối chuẩn */
  tieuDeKhoi?: Record<string, string>;
  /** Lưu trữ kiểu chữ tùy chỉnh (in hoa, đậm, nghiêng, màu, cỡ chữ) cho các trường/tiêu đề */
  kieuChuTuyChinh?: Record<string, KieuChuItem>;
  /** Hiển thị icon trước các trường thông tin con */
  hienThiIconTruong?: boolean;
  /** Đánh dấu khối nào cần ngắt sang trang mới (Page Break) khi in & thiết kế */
  ngatTrangKhoi?: Record<string, boolean>;
  /** Phân bổ từng khối vào Trang 1 hay Trang 2 (1 = Trang 1, 2 = Trang 2) */
  phanBoTrangKhoi?: Record<string, number>;
  /** Phân bổ từng item vào Trang 1 hay Trang 2 */
  phanBoTrangItem?: Record<string, number>;
  /** Tổng số trang CV đang thiết kế (1 hoặc 2) */
  soTrangCV?: number;
  /** Ngôn ngữ CV: vi, en, ja, zh */
  ngonNgu?: 'vi' | 'en' | 'ja' | 'zh' | string;
  /** Mẫu hình nền CV (background pattern/gradient) */
  hinhNen?: string;
  /** Khoảng cách dòng (line-height: 1.0 - 2.0) */
  khoangCachDong?: number;
}

export interface ThongTinCaNhan {
  hoTen: string;
  viTriUngTuyen: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  website: string;
  avatarUrl?: string;
  coverColor?: string;
  /** Icon tùy chỉnh cho các trường liên hệ mặc định */
  iconLienHe?: {
    email?: string;
    soDienThoai?: string;
    diaChi?: string;
    website?: string;
  };
  /** Danh sách các trường thông tin liên hệ mở rộng dùng icon tùy thích */
  lienHeTuyChinh?: TruongLienHeTuyChinh[];
}

// ==========================================
// 5. MÔ HÌNH DỮ LIỆU CV TỔNG THỂ (ROOT CV MODEL)
// ==========================================

export interface ThongTinCV {
  dinhDang: DinhDangCV;
  thongTinCaNhan: ThongTinCaNhan;
  gioiThieu: string;
  kinhNghiem: KinhNghiemItem[];
  hocVan: HocVanItem[];
  kyNang: KyNangItem[];
  duAn: DuAnItem[];
  chungChi: ChungChiItem[];
  khoiTuyChinh?: KhoiTuyChinhItem[];
  /** Danh sách thứ tự khối phẳng cho Bố Cục 1 Cột & tương thích ngược */
  thuTuKhoi: string[];
  /** Trạng thái bật/tắt (ẩn/hiện) từng khối */
  anHienKhoi: Record<string, boolean>;
  /** Cấu trúc phân bổ và thứ tự khối cho Bố Cục Đa Cột */
  boCuc?: BoCucCV;
}
