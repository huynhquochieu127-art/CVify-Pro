/**
 * client/src/types/cv.ts
 *
 * Định nghĩa kiểu dữ liệu toàn diện cho hệ thống CVify Pro:
 * - Hỗ trợ Bố Cục 1 Cột (Full-width) & Bố Cục 2 Cột (Trái 35% - Phải 65%).
 * - Hoàn toàn tương thích tsconfig.app.json (verbatimModuleSyntax: true, erasableSyntaxOnly: true).
 * - Không sử dụng runtime enum; chỉ sử dụng union type và interface để dễ dàng xóa bỏ khi compile (erasable syntax).
 */

// ==========================================
// 1. CÁC KIỂU BỐ CỤC (LAYOUT TYPES)
// ==========================================

/**
 * Chế độ hiển thị bố cục CV:
 * - '1-cot': Hiển thị 1 cột duy nhất toàn chiều rộng (Full-width)
 * - '2-cot': Hiển thị 2 cột (Cột Trái 35% - Cột Phải 65%)
 */
export type CheDoBoCuc = '1-cot' | '2-cot';

/**
 * Định danh vị trí cột trong bố cục 2 cột:
 * - 'cot-trai': Cột bên trái (chiếm 35% chiều rộng)
 * - 'cot-phai': Cột bên phải (chiếm 65% chiều rộng)
 */
export type ViTriCot = 'cot-trai' | 'cot-phai';

/**
 * Cấu trúc dữ liệu cấu hình Bố Cục CV
 */
export interface BoCucCV {
  /** Chế độ bố cục hiện tại ('1-cot' hoặc '2-cot') */
  cheDo: CheDoBoCuc;
  /** Danh sách ID các khối nằm ở Cột Trái (35%) */
  cotTrai: string[];
  /** Danh sách ID các khối nằm ở Cột Phải (65%) */
  cotPhai: string[];
  /** Tỉ lệ phân chia độ rộng cột (mặc định: '35-65') */
  tiLe?: string;
}

// ==========================================
// 2. CÁC KIỂU MỤC CON TỪNG KHỐI (SECTION ITEM TYPES)
// ==========================================

export interface KinhNghiemItem {
  id: string;
  congTy: string;
  viTri: string;
  thoiGian: string;
  diaDiem?: string;
  loaiHinh?: string;
  moTa: string;
}

export interface HocVanItem {
  id: string;
  truong: string;
  chuyenNganh: string;
  thoiGian: string;
  thanhTich: string;
  gpa?: string;
  diemSo?: string;
}

export interface KyNangItem {
  id: string;
  ten: string;
  mucDo: string;
  endorsements?: number;
  nhom?: string;
}

export interface DuAnItem {
  id: string;
  ten: string;
  vaiTro: string;
  thoiGian: string;
  lienKet?: string;
  congNghe?: string[];
  moTa: string;
}

export interface ChungChiItem {
  id: string;
  ten: string;
  toChuc: string;
  nam: string;
  maChungChi?: string;
}

export interface KhoiTuyChinhItem {
  id: string;
  tieuDe: string;
  noiDung: string;
}

// Type aliases ngắn gọn tương thích với Interface Contracts trong PROJECT.md
export type KinhNghiem = KinhNghiemItem;
export type HocVan = HocVanItem;
export type KyNang = KyNangItem;
export type DuAn = DuAnItem;
export type ChungChi = ChungChiItem;
export type KhoiTuyChinh = KhoiTuyChinhItem;

// ==========================================
// 3. ĐỊNH DẠNG & THÔNG TIN CÁ NHÂN
// ==========================================

export interface DinhDangCV {
  mauChuDao: string;
  coChu: string;
  fontChu: string;
  matDo: 'compact' | 'normal' | 'relaxed';
  cheDoBoCuc?: CheDoBoCuc;
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
}

// ==========================================
// 4. MÔ HÌNH DỮ LIỆU CV TỔNG THỂ (ROOT CV MODEL)
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
  /** Cấu trúc phân bổ và thứ tự khối cho Bố Cục 2 Cột */
  boCuc?: BoCucCV;
}
