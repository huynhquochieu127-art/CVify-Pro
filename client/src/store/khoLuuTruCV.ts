import { create } from 'zustand';

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

export interface ThongTinCV {
  dinhDang: {
    mauChuDao: string;
    coChu: string;
    fontChu: string;
    matDo: 'compact' | 'normal' | 'relaxed';
  };
  thongTinCaNhan: {
    hoTen: string;
    viTriUngTuyen: string;
    email: string;
    soDienThoai: string;
    diaChi: string;
    website: string;
    avatarUrl?: string;
    coverColor?: string;
  };
  gioiThieu: string;
  kinhNghiem: KinhNghiemItem[];
  hocVan: HocVanItem[];
  kyNang: KyNangItem[];
  duAn: DuAnItem[];
  chungChi: ChungChiItem[];
  khoiTuyChinh?: KhoiTuyChinhItem[];
  thuTuKhoi: string[];
  anHienKhoi: Record<string, boolean>;
}

export interface KhoLuuTruCVState {
  cv: ThongTinCV;
  doiMauChuDao: (mauMoi: string) => void;
  doiFontChu: (fontMoi: string) => void;
  capNhatThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  setThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  capNhatGioiThieu: (noiDung: string) => void;
  setGioiThieu: (noiDung: string) => void;
  sapXepKhoi: (thuTuMoi: string[]) => void;
  batTatKhoi: (khoiId: string, trangThai?: boolean) => void;
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

const DU_LIEU_MAC_DINH: ThongTinCV = {
  dinhDang: {
    mauChuDao: '#1a91f0', // Resume.io Signal Blue
    coChu: '14px',
    fontChu: 'Inter',
    matDo: 'normal',
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

  sapXepKhoi: (thuTuMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        thuTuKhoi: thuTuMoi,
      },
    })),

  batTatKhoi: (khoiId, trangThai) =>
    set((state) => {
      const isHien =
        trangThai !== undefined ? trangThai : !state.cv.anHienKhoi[khoiId];
      let newThuTu = [...(state.cv.thuTuKhoi || [])];
      if (isHien && !newThuTu.includes(khoiId)) {
        newThuTu.push(khoiId);
      }
      return {
        cv: {
          ...state.cv,
          thuTuKhoi: newThuTu,
          anHienKhoi: {
            ...state.cv.anHienKhoi,
            [khoiId]: isHien,
          },
        },
      };
    }),

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
        kinhNghiem: state.cv.kinhNghiem.map((kn) => (kn.id === id ? { ...kn, ...item } : kn)),
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
        hocVan: state.cv.hocVan.map((hv) => (hv.id === id ? { ...hv, ...item } : hv)),
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
            id: `sk-${Date.now()}`,
            ten,
            mucDo,
            endorsements: Math.floor(Math.random() * 20) + 10,
          },
        ],
      },
    })),

  suaKyNang: (id, item) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: state.cv.kyNang.map((sk) => (sk.id === id ? { ...sk, ...item } : sk)),
      },
    })),

  xoaKyNang: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        kyNang: state.cv.kyNang.filter((sk) => sk.id !== id),
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
            lienKet: '',
            congNghe: [],
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
        duAn: state.cv.duAn.map((da) => (da.id === id ? { ...da, ...item } : da)),
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
        chungChi: state.cv.chungChi.map((cc) => (cc.id === id ? { ...cc, ...item } : cc)),
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
    set((state) => ({
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
      },
    }));
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
    set((state) => ({
      cv: {
        ...state.cv,
        khoiTuyChinh: (state.cv.khoiTuyChinh || []).filter((k) => k.id !== id),
        thuTuKhoi: (state.cv.thuTuKhoi || []).filter((k) => k !== id),
      },
    })),

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
      const noiDung = cvBackend.noi_dung_cv || {};
      const dinhDang = cvBackend.dinh_dang_cv || DU_LIEU_MAC_DINH.dinhDang;
      const thuTuKhoi = cvBackend.thu_tu_khoi || DU_LIEU_MAC_DINH.thuTuKhoi;
      return {
        idCVHienTai: cvBackend.id,
        tieuDeCVHienTai: cvBackend.tieu_de_cv || 'CV Chưa Đặt Tên',
        cv: {
          dinhDang: {
            ...DU_LIEU_MAC_DINH.dinhDang,
            ...dinhDang,
          },
          thongTinCaNhan: {
            ...DU_LIEU_MAC_DINH.thongTinCaNhan,
            ...(noiDung.thongTinCaNhan || {}),
          },
          gioiThieu: noiDung.gioiThieu !== undefined ? noiDung.gioiThieu : DU_LIEU_MAC_DINH.gioiThieu,
          kinhNghiem: noiDung.kinhNghiem || [],
          hocVan: noiDung.hocVan || [],
          kyNang: noiDung.kyNang || [],
          duAn: noiDung.duAn || [],
          chungChi: noiDung.chungChi || [],
          khoiTuyChinh: noiDung.khoiTuyChinh || [],
          thuTuKhoi: Array.isArray(thuTuKhoi) ? thuTuKhoi : DU_LIEU_MAC_DINH.thuTuKhoi,
          anHienKhoi: noiDung.anHienKhoi || DU_LIEU_MAC_DINH.anHienKhoi,
        },
      };
    }),
}));

export const useStoreCV = useKhoLuuTruCV;
export default useKhoLuuTruCV;
