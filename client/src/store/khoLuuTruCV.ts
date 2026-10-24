import { create } from 'zustand';
import type {
  BoCucCV,
  CheDoBoCuc,
  ChungChiItem,
  DuAnItem,
  HocVanItem,
  KhoiTuyChinhItem,
  KinhNghiemItem,
  KyNangItem,
  ThongTinCV,
  ViTriCot,
} from '../types/cv';

// Re-export type definitions để tương thích 100% với các component hiện có
export type * from '../types/cv';

/**
 * Danh sách ID khối mặc định phân bổ vào Cột Trái (35%).
 * Thích hợp cho các khối có nội dung ngắn gọn, dạng thẻ, danh sách kỹ năng, chứng chỉ.
 */
export const KHOI_COT_TRAI_MAC_DINH = new Set<string>([
  'ky-nang',
  'hoc-van',
  'chung-chi',
]);

/**
 * Danh sách ID khối mặc định phân bổ vào Cột Phải (65%).
 * Thích hợp cho các khối nội dung dài, dòng thời gian, mô tả dự án và khối tùy chỉnh.
 */
export const KHOI_COT_PHAI_MAC_DINH = new Set<string>([
  'gioi-thieu',
  'kinh-nghiem',
  'du-an',
]);

/**
 * Chuẩn hóa cấu trúc bố cục BoCucCV, đảm bảo tương thích ngược 100% với dữ liệu cũ.
 * Bất kỳ CV nào chưa có boCuc sẽ tự động được phân bổ thành:
 * - Cột Trái (35%): kỹ năng, học vấn, chứng chỉ
 * - Cột Phải (65%): giới thiệu, kinh nghiệm, dự án, tùy chỉnh
 * Tuyệt đối không làm mất bất kỳ khối nào có trong thuTuKhoi (0 data loss).
 *
 * @param boCucDauVao Bố cục hiện có (nếu có, có thể partial hoặc null/undefined)
 * @param thuTuKhoi Danh sách thứ tự khối phẳng (thuTuKhoi của CV cũ)
 * @returns BoCucCV chuẩn hóa hợp lệ
 */
export function chuanHoaBoCuc(
  boCucDauVao?: Partial<BoCucCV> | null,
  thuTuKhoi?: string[]
): BoCucCV {
  const cheDo: CheDoBoCuc =
    boCucDauVao?.cheDo === '1-cot' || boCucDauVao?.cheDo === '2-cot'
      ? boCucDauVao.cheDo
      : '2-cot';

  const tiLe = boCucDauVao?.tiLe || '35-65';

  const danhSachKhoi =
    Array.isArray(thuTuKhoi) && thuTuKhoi.length > 0
      ? [...thuTuKhoi]
      : ['gioi-thieu', 'kinh-nghiem', 'hoc-van', 'ky-nang'];

  let cotTrai: string[] = Array.isArray(boCucDauVao?.cotTrai)
    ? [...boCucDauVao.cotTrai]
    : [];
  let cotPhai: string[] = Array.isArray(boCucDauVao?.cotPhai)
    ? [...boCucDauVao.cotPhai]
    : [];

  // Nếu cả 2 cột đều rỗng (CV cũ hoàn toàn chưa có cấu trúc 2 cột)
  if (cotTrai.length === 0 && cotPhai.length === 0) {
    for (const id of danhSachKhoi) {
      if (typeof id !== 'string' || !id.trim()) continue;
      if (KHOI_COT_TRAI_MAC_DINH.has(id)) {
        cotTrai.push(id);
      } else {
        cotPhai.push(id);
      }
    }
  } else {
    // Đã có một phần hoặc toàn bộ boCuc:
    // Kiểm tra và bổ sung bất kỳ khối nào có trong thuTuKhoi nhưng bị thiếu trong cả 2 cột
    const daCo = new Set([...cotTrai, ...cotPhai]);
    for (const id of danhSachKhoi) {
      if (typeof id !== 'string' || !id.trim()) continue;
      if (!daCo.has(id)) {
        if (KHOI_COT_TRAI_MAC_DINH.has(id)) {
          cotTrai.push(id);
        } else {
          cotPhai.push(id);
        }
        daCo.add(id);
      }
    }
  }

  // Deduplicate để đảm bảo không trùng lặp khối trong cùng một cột hoặc giữa hai cột
  const cotTraiSet = new Set<string>();
  const cotTraiKetQua: string[] = [];
  for (const id of cotTrai) {
    if (!cotTraiSet.has(id)) {
      cotTraiSet.add(id);
      cotTraiKetQua.push(id);
    }
  }

  const cotPhaiKetQua: string[] = [];
  for (const id of cotPhai) {
    if (!cotTraiSet.has(id) && !cotPhaiKetQua.includes(id)) {
      cotPhaiKetQua.push(id);
    }
  }

  return {
    cheDo,
    cotTrai: cotTraiKetQua,
    cotPhai: cotPhaiKetQua,
    tiLe,
  };
}

/**
 * Sắp xếp lại danh sách mục con dựa trên mảng đối tượng hoặc mảng ID mới.
 * - Bảo toàn 100% các mục con hiện có (nếu caller truyền mảng thiếu).
 * - Lọc bỏ ID không tồn tại hoặc ID null/undefined.
 * - Loại bỏ các mục trùng lặp (duplicate IDs) để bảo vệ React key.
 */
export function sapXepDanhSachMuc<T extends { id: string }>(
  danhSachHienTai: T[],
  itemsOrIds: T[] | string[]
): T[] {
  if (!Array.isArray(itemsOrIds) || itemsOrIds.length === 0) {
    return [];
  }

  // Trường hợp 1: itemsOrIds là mảng ID chuỗi (string[])
  if (typeof itemsOrIds[0] === 'string') {
    const ids = itemsOrIds as string[];
    const mapHienTai = new Map<string, T>(
      (danhSachHienTai || []).map((item) => [item.id, item])
    );
    const ketQua: T[] = [];
    const daThem = new Set<string>();

    for (const id of ids) {
      if (typeof id === 'string' && mapHienTai.has(id) && !daThem.has(id)) {
        ketQua.push(mapHienTai.get(id)!);
        daThem.add(id);
        mapHienTai.delete(id);
      }
    }

    // Bảo tồn các mục chưa xuất hiện trong danh sách ID (phòng ngừa mất dữ liệu)
    for (const itemConLai of mapHienTai.values()) {
      ketQua.push(itemConLai);
    }

    return ketQua;
  }

  // Trường hợp 2: itemsOrIds là mảng các đối tượng (T[])
  const items = itemsOrIds as T[];
  const daThem = new Set<string>();
  const ketQua: T[] = [];

  for (const item of items) {
    if (item && item.id && !daThem.has(item.id)) {
      ketQua.push(item);
      daThem.add(item.id);
    }
  }

  // Bảo tồn các mục hiện tại chưa xuất hiện trong items mới (phòng ngừa mất dữ liệu)
  for (const itemHienTai of danhSachHienTai || []) {
    if (itemHienTai && itemHienTai.id && !daThem.has(itemHienTai.id)) {
      ketQua.push(itemHienTai);
      daThem.add(itemHienTai.id);
    }
  }

  return ketQua;
}

export interface KhoLuuTruCVState {
  cv: ThongTinCV;
  doiMauChuDao: (mauMoi: string) => void;
  doiFontChu: (fontMoi: string) => void;
  capNhatThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  setThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  capNhatGioiThieu: (noiDung: string) => void;
  setGioiThieu: (noiDung: string) => void;

  // Layout & Column Actions (R1)
  chuyenCheDoBoCuc: (cheDo: CheDoBoCuc) => void;
  sapXepKhoiCot: (cot: ViTriCot | 'trai' | 'phai', thuTuMoi: string[]) => void;
  chuyenKhoiSangCot: (
    khoiId: string,
    cotDich: ViTriCot | 'trai' | 'phai',
    viTriIndex?: number
  ) => void;
  doiCotKhoi: (khoiId: string) => void;
  diChuyenKhoiLenXuong: (khoiId: string, huong: 'len' | 'xuong') => void;

  // Block ordering & visibility
  sapXepKhoi: (thuTuMoi: string[]) => void;
  batTatKhoi: (khoiId: string, trangThai?: boolean) => void;

  // Nested Section Items Sorting (R2)
  sapXepKinhNghiem: (itemsOrIds: KinhNghiemItem[] | string[]) => void;
  sapXepHocVan: (itemsOrIds: HocVanItem[] | string[]) => void;
  sapXepKyNang: (itemsOrIds: KyNangItem[] | string[]) => void;
  sapXepDuAn: (itemsOrIds: DuAnItem[] | string[]) => void;
  sapXepChungChi: (itemsOrIds: ChungChiItem[] | string[]) => void;

  // Section item CRUD
  themKinhNghiem: (item?: Partial<Omit<KinhNghiemItem, 'id'>>) => void;
  suaKinhNghiem: (id: string, item: Partial<KinhNghiemItem>) => void;
  xoaKinhNghiem: (id: string) => void;
  themHocVan: (item?: Partial<Omit<HocVanItem, 'id'>>) => void;
  suaHocVan: (id: string, item: Partial<HocVanItem>) => void;
  xoaHocVan: (id: string) => void;
  themKyNang: (ten: string, mucDo?: string) => void;
  suaKyNang: (id: string, item: Partial<KyNangItem>) => void;
  xoaKyNang: (id: string) => void;
  themDuAn: (item?: Partial<Omit<DuAnItem, 'id'>>) => void;
  suaDuAn: (id: string, item: Partial<DuAnItem>) => void;
  xoaDuAn: (id: string) => void;
  themChungChi: (item?: Partial<Omit<ChungChiItem, 'id'>>) => void;
  suaChungChi: (id: string, item: Partial<ChungChiItem>) => void;
  xoaChungChi: (id: string) => void;
  themKhoiTuyChinh: (tieuDe: string, noiDung?: string) => string;
  suaKhoiTuyChinh: (id: string, item: Partial<KhoiTuyChinhItem>) => void;
  xoaKhoiTuyChinh: (id: string) => void;

  khoiPhucMacDinh: () => void;
  idCVHienTai: number | null;
  tieuDeCVHienTai: string;
  datTieuDeCV: (tieuDe: string) => void;
  napDuLieuCVTuServer: (cvBackend: any) => void;
  khoiTaoCVMoi: (id?: number | null, tieuDe?: string) => void;
}

const layThongTinNguoiDungMacDinh = () => {
  try {
    const raw = sessionStorage.getItem('nguoiDung');
    if (raw) {
      const u = JSON.parse(raw);
      return {
        hoTen: u.ho_ten || u.ten || '',
        email: u.email || '',
      };
    }
  } catch {
    // ignore
  }
  return { hoTen: '', email: '' };
};

const userMacDinh = layThongTinNguoiDungMacDinh();

export const DU_LIEU_MAC_DINH: ThongTinCV = {
  dinhDang: {
    mauChuDao: '#1a91f0', // Resume.io Signal Blue
    coChu: '14px',
    fontChu: 'Inter',
    matDo: 'normal',
    cheDoBoCuc: '2-cot',
  },
  thongTinCaNhan: {
    hoTen: userMacDinh.hoTen || '',
    viTriUngTuyen: '',
    email: userMacDinh.email || '',
    soDienThoai: '',
    diaChi: '',
    website: '',
    avatarUrl: '',
    coverColor: '#1a91f0',
  },
  gioiThieu: '',
  kinhNghiem: [],
  hocVan: [],
  kyNang: [],
  duAn: [],
  chungChi: [],
  khoiTuyChinh: [],
  thuTuKhoi: ['gioi-thieu', 'kinh-nghiem', 'hoc-van', 'ky-nang'],
  anHienKhoi: {
    'gioi-thieu': true,
    'kinh-nghiem': true,
    'hoc-van': true,
    'ky-nang': true,
    'du-an': false,
    'chung-chi': false,
  },
  boCuc: {
    cheDo: '2-cot',
    cotTrai: ['hoc-van', 'ky-nang'],
    cotPhai: ['gioi-thieu', 'kinh-nghiem'],
    tiLe: '35-65',
  },
};

export const useKhoLuuTruCV = create<KhoLuuTruCVState>()((set) => ({
  cv: DU_LIEU_MAC_DINH,

  doiMauChuDao: (mauMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          mauChuDao: mauMoi,
        },
      },
    })),

  doiFontChu: (fontMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          fontChu: fontMoi,
        },
      },
    })),

  capNhatThongTinCaNhan: (duLieu) =>
    set((state) => ({
      cv: {
        ...state.cv,
        thongTinCaNhan: {
          ...state.cv.thongTinCaNhan,
          ...duLieu,
        },
      },
    })),

  setThongTinCaNhan: (duLieu) =>
    set((state) => ({
      cv: {
        ...state.cv,
        thongTinCaNhan: {
          ...state.cv.thongTinCaNhan,
          ...duLieu,
        },
      },
    })),

  capNhatGioiThieu: (noiDung) =>
    set((state) => ({
      cv: {
        ...state.cv,
        gioiThieu: noiDung,
      },
    })),

  setGioiThieu: (noiDung) =>
    set((state) => ({
      cv: {
        ...state.cv,
        gioiThieu: noiDung,
      },
    })),

  // ==========================================
  // BỐ CỤC & ĐIỀU KHIỂN CỘT (R1)
  // ==========================================

  chuyenCheDoBoCuc: (cheDo) =>
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);

      let cotTrai = Array.isArray(boCucHienTai.cotTrai) ? [...boCucHienTai.cotTrai] : [];
      let cotPhai = Array.isArray(boCucHienTai.cotPhai) ? [...boCucHienTai.cotPhai] : [];
      const thuTuKhoiHienTai = state.cv.thuTuKhoi || [];

      // Đảm bảo mọi khối có trong thuTuKhoi đều được phân bổ vào ít nhất một cột
      for (const id of thuTuKhoiHienTai) {
        if (!cotTrai.includes(id) && !cotPhai.includes(id)) {
          if (KHOI_COT_TRAI_MAC_DINH.has(id)) {
            cotTrai.push(id);
          } else {
            cotPhai.push(id);
          }
        }
      }

      // Loại bỏ trùng lặp nếu có giữa 2 cột (ưu tiên cột trái giữ trước)
      const cotTraiSet = new Set(cotTrai);
      cotPhai = cotPhai.filter((id) => !cotTraiSet.has(id));

      // Đồng bộ mảng phẳng thuTuKhoi: Nội dung chính (cột phải) + Nội dung phụ (cột trái)
      const thuTuKhoiDongBo = Array.from(
        new Set([...cotPhai, ...cotTrai, ...thuTuKhoiHienTai])
      );

      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            cheDoBoCuc: cheDo,
          },
          boCuc: {
            ...boCucHienTai,
            cheDo,
            cotTrai,
            cotPhai,
          },
          thuTuKhoi: thuTuKhoiDongBo,
        },
      };
    }),

  sapXepKhoiCot: (cot, thuTuMoi) =>
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);

      const isCotTrai = cot === 'cot-trai' || (cot as string) === 'trai';
      const existingItems = isCotTrai
        ? (boCucHienTai.cotTrai || [])
        : (boCucHienTai.cotPhai || []);

      // Giữ lại các khối ẩn hoặc khối không nằm trong mảng hiển thị thuTuMoi
      const missingItems = existingItems.filter((id) => !thuTuMoi.includes(id));
      const danhSachMoi = [...thuTuMoi, ...missingItems];

      const cotTraiMoi = isCotTrai ? danhSachMoi : boCucHienTai.cotTrai;
      const cotPhaiMoi = isCotTrai ? boCucHienTai.cotPhai : danhSachMoi;

      // Đồng bộ thuTuKhoi phẳng
      const thuTuKhoiDongBo = Array.from(
        new Set([...cotPhaiMoi, ...cotTraiMoi, ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: cotTraiMoi,
            cotPhai: cotPhaiMoi,
          },
          thuTuKhoi: thuTuKhoiDongBo,
        },
      };
    }),

  chuyenKhoiSangCot: (khoiId, cotDich, viTriIndex) =>
    set((state) => {
      if (!khoiId) return state;

      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);

      const isDichTrai = cotDich === 'cot-trai' || (cotDich as string) === 'trai';

      // Loại bỏ khối khỏi cả hai cột trước khi chèn để chống trùng lặp
      const danhSachTrai = (boCucHienTai.cotTrai || []).filter((id) => id !== khoiId);
      const danhSachPhai = (boCucHienTai.cotPhai || []).filter((id) => id !== khoiId);

      const danhSachDich = isDichTrai ? danhSachTrai : danhSachPhai;

      // Chèn vào vị trí chỉ định hoặc thêm vào cuối
      if (
        typeof viTriIndex === 'number' &&
        viTriIndex >= 0 &&
        viTriIndex <= danhSachDich.length
      ) {
        danhSachDich.splice(viTriIndex, 0, khoiId);
      } else {
        danhSachDich.push(khoiId);
      }

      const cotTraiMoi = isDichTrai ? danhSachDich : danhSachTrai;
      const cotPhaiMoi = isDichTrai ? danhSachPhai : danhSachDich;

      // Đồng bộ thuTuKhoi
      const thuTuKhoiDongBo = Array.from(
        new Set([...cotPhaiMoi, ...cotTraiMoi, ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: cotTraiMoi,
            cotPhai: cotPhaiMoi,
          },
          thuTuKhoi: thuTuKhoiDongBo,
        },
      };
    }),

  doiCotKhoi: (khoiId) =>
    set((state) => {
      if (!khoiId) return state;

      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);

      let cotTraiMoi = Array.isArray(boCucHienTai.cotTrai) ? [...boCucHienTai.cotTrai] : [];
      let cotPhaiMoi = Array.isArray(boCucHienTai.cotPhai) ? [...boCucHienTai.cotPhai] : [];

      const dangOCotTrai = cotTraiMoi.includes(khoiId);
      const dangOCotPhai = cotPhaiMoi.includes(khoiId);

      if (dangOCotTrai) {
        cotTraiMoi = cotTraiMoi.filter((id) => id !== khoiId);
        if (!cotPhaiMoi.includes(khoiId)) {
          cotPhaiMoi.push(khoiId);
        }
      } else if (dangOCotPhai) {
        cotPhaiMoi = cotPhaiMoi.filter((id) => id !== khoiId);
        if (!cotTraiMoi.includes(khoiId)) {
          cotTraiMoi.push(khoiId);
        }
      } else {
        // Nếu khối chưa thuộc cột nào, lấy theo quy tắc mặc định và đảo
        if (KHOI_COT_TRAI_MAC_DINH.has(khoiId)) {
          cotPhaiMoi.push(khoiId);
        } else {
          cotTraiMoi.push(khoiId);
        }
      }

      // Đồng bộ thuTuKhoi
      const thuTuKhoiDongBo = Array.from(
        new Set([...cotPhaiMoi, ...cotTraiMoi, ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: cotTraiMoi,
            cotPhai: cotPhaiMoi,
          },
          thuTuKhoi: thuTuKhoiDongBo,
        },
      };
    }),

  diChuyenKhoiLenXuong: (khoiId, huong) =>
    set((state) => {
      if (!khoiId) return state;

      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const la2Cot = boCucHienTai.cheDo === '2-cot';

      if (la2Cot) {
        const laCotTrai = boCucHienTai.cotTrai.includes(khoiId);
        const laCotPhai = boCucHienTai.cotPhai.includes(khoiId);
        if (!laCotTrai && !laCotPhai) return state;

        const danhSach = laCotTrai
          ? [...boCucHienTai.cotTrai]
          : [...boCucHienTai.cotPhai];
        const index = danhSach.indexOf(khoiId);
        if (index === -1) return state;

        const targetIndex = huong === 'len' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= danhSach.length) return state;

        [danhSach[index], danhSach[targetIndex]] = [
          danhSach[targetIndex],
          danhSach[index],
        ];

        const cotTraiMoi = laCotTrai ? danhSach : boCucHienTai.cotTrai;
        const cotPhaiMoi = !laCotTrai ? danhSach : boCucHienTai.cotPhai;
        const thuTuKhoiDongBo = Array.from(
          new Set([...cotPhaiMoi, ...cotTraiMoi, ...(state.cv.thuTuKhoi || [])])
        );

        return {
          cv: {
            ...state.cv,
            thuTuKhoi: thuTuKhoiDongBo,
            boCuc: {
              ...boCucHienTai,
              cotTrai: cotTraiMoi,
              cotPhai: cotPhaiMoi,
            },
          },
        };
      } else {
        // Chế độ 1 cột
        const danhSach = [...(state.cv.thuTuKhoi || [])];
        const index = danhSach.indexOf(khoiId);
        if (index === -1) return state;

        const targetIndex = huong === 'len' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= danhSach.length) return state;

        [danhSach[index], danhSach[targetIndex]] = [
          danhSach[targetIndex],
          danhSach[index],
        ];

        return {
          cv: {
            ...state.cv,
            thuTuKhoi: danhSach,
          },
        };
      }
    }),

  sapXepKhoi: (thuTuMoi) =>
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const thuTuIndex = new Map(thuTuMoi.map((id, idx) => [id, idx]));
      const cotTraiMoi = [...boCucHienTai.cotTrai].sort((a, b) => {
        const idxA = thuTuIndex.has(a) ? thuTuIndex.get(a)! : 999;
        const idxB = thuTuIndex.has(b) ? thuTuIndex.get(b)! : 999;
        return idxA - idxB;
      });
      const cotPhaiMoi = [...boCucHienTai.cotPhai].sort((a, b) => {
        const idxA = thuTuIndex.has(a) ? thuTuIndex.get(a)! : 999;
        const idxB = thuTuIndex.has(b) ? thuTuIndex.get(b)! : 999;
        return idxA - idxB;
      });

      return {
        cv: {
          ...state.cv,
          thuTuKhoi: thuTuMoi,
          boCuc: {
            ...boCucHienTai,
            cotTrai: cotTraiMoi,
            cotPhai: cotPhaiMoi,
          },
        },
      };
    }),

  batTatKhoi: (khoiId, trangThai) =>
    set((state) => {
      const isHien =
        trangThai !== undefined ? trangThai : !state.cv.anHienKhoi[khoiId];
      const newThuTu = [...(state.cv.thuTuKhoi || [])];
      if (isHien && !newThuTu.includes(khoiId)) {
        newThuTu.push(khoiId);
      }

      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const cotTraiMoi = [...boCucHienTai.cotTrai];
      const cotPhaiMoi = [...boCucHienTai.cotPhai];

      if (isHien) {
        if (!cotTraiMoi.includes(khoiId) && !cotPhaiMoi.includes(khoiId)) {
          if (KHOI_COT_TRAI_MAC_DINH.has(khoiId)) {
            cotTraiMoi.push(khoiId);
          } else {
            cotPhaiMoi.push(khoiId);
          }
        }
      }

      return {
        cv: {
          ...state.cv,
          thuTuKhoi: newThuTu,
          anHienKhoi: {
            ...state.cv.anHienKhoi,
            [khoiId]: isHien,
          },
          boCuc: {
            ...boCucHienTai,
            cotTrai: cotTraiMoi,
            cotPhai: cotPhaiMoi,
          },
        },
      };
    }),

  // ==========================================
  // SẮP XẾP MỤC CON LỒNG NHAU (R2 - NESTED SORTABLE)
  // ==========================================

  sapXepKinhNghiem: (itemsOrIds) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kinhNghiem: sapXepDanhSachMuc(state.cv.kinhNghiem, itemsOrIds),
      },
    })),

  sapXepHocVan: (itemsOrIds) =>
    set((state) => ({
      cv: {
        ...state.cv,
        hocVan: sapXepDanhSachMuc(state.cv.hocVan, itemsOrIds),
      },
    })),

  sapXepKyNang: (itemsOrIds) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: sapXepDanhSachMuc(state.cv.kyNang, itemsOrIds),
      },
    })),

  sapXepDuAn: (itemsOrIds) =>
    set((state) => ({
      cv: {
        ...state.cv,
        duAn: sapXepDanhSachMuc(state.cv.duAn, itemsOrIds),
      },
    })),

  sapXepChungChi: (itemsOrIds) =>
    set((state) => ({
      cv: {
        ...state.cv,
        chungChi: sapXepDanhSachMuc(state.cv.chungChi, itemsOrIds),
      },
    })),

  // ==========================================
  // QUẢN LÝ DỮ LIỆU TỪNG KHỐI (CRUD)
  // ==========================================

  themKinhNghiem: (item = {}) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kinhNghiem: [
          ...state.cv.kinhNghiem,
          {
            congTy: '',
            viTri: '',
            thoiGian: '',
            moTa: '',
            ...item,
            id: `kn-${Date.now()}`,
          },
        ],
      },
    })),

  suaKinhNghiem: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kinhNghiem: state.cv.kinhNghiem.map((kn) =>
          kn.id === id ? { ...kn, ...item } : kn
        ),
      },
    })),

  xoaKinhNghiem: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kinhNghiem: state.cv.kinhNghiem.filter((kn) => kn.id !== id),
      },
    })),

  themHocVan: (item = {}) =>
    set((state) => ({
      cv: {
        ...state.cv,
        hocVan: [
          ...state.cv.hocVan,
          {
            truong: '',
            chuyenNganh: '',
            thoiGian: '',
            thanhTich: '',
            ...item,
            id: `hv-${Date.now()}`,
          },
        ],
      },
    })),

  suaHocVan: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        hocVan: state.cv.hocVan.map((hv) =>
          hv.id === id ? { ...hv, ...item } : hv
        ),
      },
    })),

  xoaHocVan: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        hocVan: state.cv.hocVan.filter((hv) => hv.id !== id),
      },
    })),

  themKyNang: (ten, mucDo = 'Thành thạo') =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: [
          ...state.cv.kyNang,
          {
            id: `knang-${Date.now()}`,
            ten,
            mucDo,
          },
        ],
      },
    })),

  suaKyNang: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: state.cv.kyNang.map((kn) =>
          kn.id === id ? { ...kn, ...item } : kn
        ),
      },
    })),

  xoaKyNang: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: state.cv.kyNang.filter((kn) => kn.id !== id),
      },
    })),

  themDuAn: (item = {}) =>
    set((state) => ({
      cv: {
        ...state.cv,
        duAn: [
          ...state.cv.duAn,
          {
            ten: '',
            vaiTro: '',
            thoiGian: '',
            moTa: '',
            ...item,
            id: `da-${Date.now()}`,
          },
        ],
      },
    })),

  suaDuAn: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        duAn: state.cv.duAn.map((da) =>
          da.id === id ? { ...da, ...item } : da
        ),
      },
    })),

  xoaDuAn: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        duAn: state.cv.duAn.filter((da) => da.id !== id),
      },
    })),

  themChungChi: (item = {}) =>
    set((state) => ({
      cv: {
        ...state.cv,
        chungChi: [
          ...state.cv.chungChi,
          {
            ten: '',
            toChuc: '',
            nam: '',
            ...item,
            id: `cc-${Date.now()}`,
          },
        ],
      },
    })),

  suaChungChi: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        chungChi: state.cv.chungChi.map((cc) =>
          cc.id === id ? { ...cc, ...item } : cc
        ),
      },
    })),

  xoaChungChi: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        chungChi: state.cv.chungChi.filter((cc) => cc.id !== id),
      },
    })),

  themKhoiTuyChinh: (tieuDe, noiDung = '') => {
    const idMoi = `tc-${Date.now()}`;
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const cotPhaiMoi = boCucHienTai.cotPhai.includes(idMoi)
        ? boCucHienTai.cotPhai
        : [...boCucHienTai.cotPhai, idMoi];

      return {
        cv: {
          ...state.cv,
          khoiTuyChinh: [
            ...(state.cv.khoiTuyChinh || []),
            { id: idMoi, tieuDe: tieuDe.trim() || 'Mục Tùy Chỉnh', noiDung },
          ],
          thuTuKhoi: [...(state.cv.thuTuKhoi || []), idMoi],
          anHienKhoi: {
            ...state.cv.anHienKhoi,
            [idMoi]: true,
          },
          boCuc: {
            ...boCucHienTai,
            cotPhai: cotPhaiMoi,
          },
        },
      };
    });
    return idMoi;
  },

  suaKhoiTuyChinh: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        khoiTuyChinh: (state.cv.khoiTuyChinh || []).map((k) =>
          k.id === id ? { ...k, ...item } : k
        ),
      },
    })),

  xoaKhoiTuyChinh: (id) =>
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const conLaiAnHienKhoi = { ...state.cv.anHienKhoi };
      delete conLaiAnHienKhoi[id];

      return {
        cv: {
          ...state.cv,
          khoiTuyChinh: (state.cv.khoiTuyChinh || []).filter((k) => k.id !== id),
          thuTuKhoi: (state.cv.thuTuKhoi || []).filter((k) => k !== id),
          anHienKhoi: conLaiAnHienKhoi,
          boCuc: {
            ...boCucHienTai,
            cotTrai: boCucHienTai.cotTrai.filter((k) => k !== id),
            cotPhai: boCucHienTai.cotPhai.filter((k) => k !== id),
          },
        },
      };
    }),

  khoiPhucMacDinh: () =>
    set(() => ({
      cv: DU_LIEU_MAC_DINH,
    })),

  idCVHienTai: null,
  tieuDeCVHienTai: 'CV Chưa Đặt Tên',

  datTieuDeCV: (tieuDe) => set({ tieuDeCVHienTai: tieuDe }),

  khoiTaoCVMoi: (id = null, tieuDe = 'CV Mới Chưa Đặt Tên') =>
    set(() => ({
      idCVHienTai: id,
      tieuDeCVHienTai: tieuDe,
      cv: DU_LIEU_MAC_DINH,
    })),

  napDuLieuCVTuServer: (cvBackend) =>
    set(() => {
      if (!cvBackend) return {};

      const noiDung = cvBackend.noi_dung_cv || {};
      const dinhDang = cvBackend.dinh_dang_cv || DU_LIEU_MAC_DINH.dinhDang;
      const thuTuKhoiRaw =
        cvBackend.thu_tu_khoi || noiDung.thuTuKhoi || DU_LIEU_MAC_DINH.thuTuKhoi;
      const thuTuKhoi = Array.isArray(thuTuKhoiRaw)
        ? [...thuTuKhoiRaw]
        : [...DU_LIEU_MAC_DINH.thuTuKhoi];

      // Khôi phục khối tùy chỉnh
      const khoiTuyChinh = Array.isArray(noiDung.khoiTuyChinh)
        ? noiDung.khoiTuyChinh
        : [];
      for (const ktc of khoiTuyChinh) {
        if (ktc?.id && !thuTuKhoi.includes(ktc.id)) {
          thuTuKhoi.push(ktc.id);
        }
      }

      // Chuẩn hóa cấu trúc bố cục (từ noiDung.boCuc hoặc cvBackend.bo_cuc hoặc auto-generated)
      const boCucRaw = noiDung.boCuc || cvBackend.bo_cuc || null;
      const boCucChuan = chuanHoaBoCuc(boCucRaw, thuTuKhoi);

      // Đồng bộ trạng thái ẩn/hiện
      const anHienKhoi = {
        ...DU_LIEU_MAC_DINH.anHienKhoi,
        ...(noiDung.anHienKhoi || {}),
      };
      for (const ktc of khoiTuyChinh) {
        if (ktc?.id && anHienKhoi[ktc.id] === undefined) {
          anHienKhoi[ktc.id] = true;
        }
      }

      return {
        idCVHienTai: cvBackend.id ?? null,
        tieuDeCVHienTai: cvBackend.tieu_de_cv || 'CV Chưa Đặt Tên',
        cv: {
          dinhDang: {
            ...DU_LIEU_MAC_DINH.dinhDang,
            ...dinhDang,
            cheDoBoCuc: boCucChuan.cheDo,
          },
          thongTinCaNhan: {
            ...DU_LIEU_MAC_DINH.thongTinCaNhan,
            ...(noiDung.thongTinCaNhan || {}),
          },
          gioiThieu:
            typeof noiDung.gioiThieu === 'string'
              ? noiDung.gioiThieu
              : DU_LIEU_MAC_DINH.gioiThieu,
          kinhNghiem: Array.isArray(noiDung.kinhNghiem) ? noiDung.kinhNghiem : [],
          hocVan: Array.isArray(noiDung.hocVan) ? noiDung.hocVan : [],
          kyNang: Array.isArray(noiDung.kyNang) ? noiDung.kyNang : [],
          duAn: Array.isArray(noiDung.duAn) ? noiDung.duAn : [],
          chungChi: Array.isArray(noiDung.chungChi) ? noiDung.chungChi : [],
          khoiTuyChinh,
          thuTuKhoi,
          anHienKhoi,
          boCuc: boCucChuan,
        },
      };
    }),
}));

export const useStoreCV = useKhoLuuTruCV;
export default useKhoLuuTruCV;
