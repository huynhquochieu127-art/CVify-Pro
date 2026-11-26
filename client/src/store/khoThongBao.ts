import { create } from 'zustand';
import type { ThongTinCV } from '../types/cv';

export type LoaiThongBao = 'trang-thai-cv' | 'cong-dong' | 'admin-duyet';
export type TrangThaiDuyet = 'cho-duyet' | 'da-duyet' | 'tu-choi';

export interface ThongBaoItem {
  id: string;
  loai: LoaiThongBao;
  tieuDe: string;
  noiDung: string;
  thoiGian: string; // ISO string
  daDoc: boolean;
  trangThaiDuyet?: TrangThaiDuyet;
  hanhDong?: 'mo-trinh-thiet-ke' | 'mo-cong-dong' | 'mo-kho-mau';
}

export interface ThongTinCVChuaLuu {
  tieuDe: string;
  hoTen: string;
  viTri: string;
  mauChuDao: string;
  tienDo: number;
  thoiGianSuaCuoi: string; // ISO string
  daAnPopup: boolean;
  banNhapCV?: ThongTinCV;
}

const STORAGE_KEY_THONG_BAO = 'cvify_thong_bao_list_v1';
const STORAGE_KEY_CV_CHUA_LUU = 'cvify_cv_chua_luu_v1';

/**
 * Tính % tiến độ hoàn thành CV thực tế dựa trên các mục ứng viên đã nhập
 */
export function tinhTienDoCV(cv: ThongTinCV): number {
  let diem = 0;
  if (cv.thongTinCaNhan?.hoTen?.trim()) diem += 15;
  if (cv.thongTinCaNhan?.viTriUngTuyen?.trim()) diem += 10;
  if (
    cv.thongTinCaNhan?.email?.trim() ||
    cv.thongTinCaNhan?.soDienThoai?.trim()
  ) {
    diem += 15;
  }
  if (cv.gioiThieu?.trim()) diem += 15;
  if (cv.kinhNghiem && cv.kinhNghiem.length > 0 && cv.kinhNghiem.some((k) => k.viTri?.trim() || k.congTy?.trim())) {
    diem += 20;
  }
  if (cv.hocVan && cv.hocVan.length > 0 && cv.hocVan.some((h) => h.truong?.trim() || h.chuyenNganh?.trim())) {
    diem += 15;
  }
  if (cv.kyNang && cv.kyNang.length > 0) diem += 10;
  return Math.min(100, Math.max(10, diem));
}

export function dinhDangThoiGianTuongDoi(iso: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffPhut = Math.floor(diffMs / 60000);
    if (diffPhut < 1) return 'Vừa xong';
    if (diffPhut < 60) return `${diffPhut} phút trước`;
    const diffGio = Math.floor(diffPhut / 60);
    if (diffGio < 24) return `${diffGio} giờ trước`;
    const diffNgay = Math.floor(diffGio / 24);
    if (diffNgay === 1) return 'Hôm qua';
    return `${diffNgay} ngày trước`;
  } catch {
    return 'Vừa xong';
  }
}

const THONG_BAO_MAC_DINH: ThongBaoItem[] = [
  {
    id: 'tb-cong-dong-1',
    loai: 'cong-dong',
    tieuDe: 'Bài viết mới trên Bảng tin cộng đồng',
    noiDung: 'Trần Minh Quang vừa chia sẻ 3 nguyên tắc vàng giúp CV vượt qua hệ thống lọc ATS.',
    thoiGian: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    daDoc: false,
    hanhDong: 'mo-cong-dong',
  },
  {
    id: 'tb-admin-1',
    loai: 'admin-duyet',
    tieuDe: 'Cập nhật từ Quản trị viên CVify Pro',
    noiDung: 'Hệ thống đã bổ sung bộ lọc Mẫu CV theo vị trí ứng tuyển và 4 ngôn ngữ (VI, EN, JA, ZH).',
    thoiGian: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    daDoc: true,
    trangThaiDuyet: 'da-duyet',
    hanhDong: 'mo-kho-mau',
  },
];

function docThongBaoTuLocal(): ThongBaoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THONG_BAO);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return THONG_BAO_MAC_DINH;
}

function docCVChuaLuuTuLocal(): ThongTinCVChuaLuu | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CV_CHUA_LUU);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

interface KhoThongBaoState {
  danhSachThongBao: ThongBaoItem[];
  cvChuaLuu: ThongTinCVChuaLuu | null;

  capNhatCVChuaLuu: (cv: ThongTinCV, tieuDe: string) => void;
  xoaCVChuaLuu: () => void;
  anPopupCVChuaLuu: () => void;
  hienLaiPopupNeuCo: () => void;

  themThongBao: (tb: Omit<ThongBaoItem, 'id' | 'thoiGian' | 'daDoc'> & { id?: string }) => void;
  danhDauDaDoc: (id: string) => void;
  danhDauDocTatCa: () => void;
}

export const useKhoThongBao = create<KhoThongBaoState>((set, get) => ({
  danhSachThongBao: docThongBaoTuLocal(),
  cvChuaLuu: docCVChuaLuuTuLocal(),

  capNhatCVChuaLuu: (cv, tieuDe) => {
    const tienDo = tinhTienDoCV(cv);
    const now = new Date().toISOString();
    const truocDo = get().cvChuaLuu;

    const banGhiMoi: ThongTinCVChuaLuu = {
      tieuDe: tieuDe?.trim() || 'CV Chưa Đặt Tên',
      hoTen: cv.thongTinCaNhan?.hoTen?.trim() || 'Hồ sơ ứng viên',
      viTri: cv.thongTinCaNhan?.viTriUngTuyen?.trim() || 'Chưa cập nhật vị trí',
      mauChuDao: cv.dinhDang?.mauChuDao || '#1a91f0',
      tienDo,
      thoiGianSuaCuoi: now,
      daAnPopup: truocDo?.daAnPopup ?? false,
      banNhapCV: cv,
    };

    try {
      localStorage.setItem(STORAGE_KEY_CV_CHUA_LUU, JSON.stringify(banGhiMoi));
    } catch {
      // Bỏ qua nếu vượt dung lượng localStorage
    }

    // Đồng bộ trực tiếp vào Chuông Thông Báo (mục Trạng thái CV)
    const idThongBaoCV = 'tb-cv-chua-luu';
    const thongBaoCV: ThongBaoItem = {
      id: idThongBaoCV,
      loai: 'trang-thai-cv',
      tieuDe: `CV "${banGhiMoi.tieuDe}" chưa được lưu`,
      noiDung: `Tiến độ hoàn thiện ${tienDo}%. Nhấn để quay lại tiếp tục chỉnh sửa và lưu dữ liệu.`,
      thoiGian: now,
      daDoc: false,
      hanhDong: 'mo-trinh-thiet-ke',
    };

    const danhSachMoi = [
      thongBaoCV,
      ...get().danhSachThongBao.filter((item) => item.id !== idThongBaoCV),
    ];

    try {
      localStorage.setItem(STORAGE_KEY_THONG_BAO, JSON.stringify(danhSachMoi.slice(0, 30)));
    } catch {
      // ignore
    }

    set({ cvChuaLuu: banGhiMoi, danhSachThongBao: danhSachMoi });
  },

  xoaCVChuaLuu: () => {
    localStorage.removeItem(STORAGE_KEY_CV_CHUA_LUU);
    const danhSachMoi = get().danhSachThongBao.filter((item) => item.id !== 'tb-cv-chua-luu');
    try {
      localStorage.setItem(STORAGE_KEY_THONG_BAO, JSON.stringify(danhSachMoi));
    } catch {
      // ignore
    }
    set({ cvChuaLuu: null, danhSachThongBao: danhSachMoi });
  },

  anPopupCVChuaLuu: () => {
    const hienTai = get().cvChuaLuu;
    if (!hienTai) return;
    const capNhat = { ...hienTai, daAnPopup: true };
    try {
      localStorage.setItem(STORAGE_KEY_CV_CHUA_LUU, JSON.stringify(capNhat));
    } catch {
      // ignore
    }
    set({ cvChuaLuu: capNhat });
  },

  hienLaiPopupNeuCo: () => {
    const hienTai = get().cvChuaLuu;
    if (!hienTai) return;
    const capNhat = { ...hienTai, daAnPopup: false };
    try {
      localStorage.setItem(STORAGE_KEY_CV_CHUA_LUU, JSON.stringify(capNhat));
    } catch {
      // ignore
    }
    set({ cvChuaLuu: capNhat });
  },

  themThongBao: (tb) => {
    const moi: ThongBaoItem = {
      ...tb,
      id: tb.id || `tb-${Date.now()}`,
      thoiGian: new Date().toISOString(),
      daDoc: false,
    };
    const danhSachMoi = [moi, ...get().danhSachThongBao].slice(0, 30);
    try {
      localStorage.setItem(STORAGE_KEY_THONG_BAO, JSON.stringify(danhSachMoi));
    } catch {
      // ignore
    }
    set({ danhSachThongBao: danhSachMoi });
  },

  danhDauDaDoc: (id) => {
    const danhSachMoi = get().danhSachThongBao.map((item) =>
      item.id === id ? { ...item, daDoc: true } : item
    );
    try {
      localStorage.setItem(STORAGE_KEY_THONG_BAO, JSON.stringify(danhSachMoi));
    } catch {
      // ignore
    }
    set({ danhSachThongBao: danhSachMoi });
  },

  danhDauDocTatCa: () => {
    const danhSachMoi = get().danhSachThongBao.map((item) => ({
      ...item,
      daDoc: true,
    }));
    try {
      localStorage.setItem(STORAGE_KEY_THONG_BAO, JSON.stringify(danhSachMoi));
    } catch {
      // ignore
    }
    set({ danhSachThongBao: danhSachMoi });
  },
}));
