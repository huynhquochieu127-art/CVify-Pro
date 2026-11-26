import { create } from 'zustand';
import { dichToanBoNoiDungCV } from '../utils/dichCV';
import type {
  BoCucCV,
  CheDoBoCuc,
  ChungChiItem,
  CotTuChinh,
  DinhDangCV,
  DuAnItem,
  HocVanItem,
  KhoiTuyChinhItem,
  KieuChuItem,
  KinhNghiemItem,
  KyNangItem,
  ThongTinCV,
  TruongLienHeTuyChinh,
  ViTriCot,
} from '../types/cv';

// Re-export type definitions để tương thích 100% với các component hiện có
export type * from '../types/cv';

/**
 * Danh sách ID khối mặc định phân bổ vào Cột Trái (35%).
 */
export const KHOI_COT_TRAI_MAC_DINH = new Set<string>([
  'ky-nang',
  'hoc-van',
  'chung-chi',
]);

/**
 * Danh sách ID khối mặc định phân bổ vào Cột Phải (65%).
 */
export const KHOI_COT_PHAI_MAC_DINH = new Set<string>([
  'gioi-thieu',
  'kinh-nghiem',
  'du-an',
]);

/**
 * Từ điển dịch tiêu đề và nhãn CV đa ngôn ngữ:
 * Hỗ trợ 4 ngôn ngữ chuẩn: Tiếng Việt, Tiếng Anh, Tiếng Nhật, Tiếng Trung
 */
export const BAN_DICH_NGON_NGU: Record<
  string,
  {
    tenHienThi: string;
    co: string;
    tieuDeKhoi: Record<string, string>;
    nhanFooter: {
      banQuyen: string;
      trang: (tr: number, tongTrang: number) => string;
      miniHeader: string;
    };
  }
> = {
  vi: {
    tenHienThi: 'Tiếng Việt',
    co: '🇻🇳',
    tieuDeKhoi: {
      'gioi-thieu': 'Mục tiêu nghề nghiệp',
      'kinh-nghiem': 'Kinh nghiệm làm việc',
      'hoc-van': 'Học vấn & Bằng cấp',
      'ky-nang': 'Kỹ năng chuyên môn',
      'du-an': 'Dự án nổi bật',
      'chung-chi': 'Chứng chỉ & Giải thưởng',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • Hệ thống thiết kế CV chuẩn ATS',
      trang: (tr, tong) => `Trang ${tr}${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: 'HỒ SƠ ỨNG VIÊN',
    },
  },
  en: {
    tenHienThi: 'Tiếng Anh (English)',
    co: '🇬🇧',
    tieuDeKhoi: {
      'gioi-thieu': 'Professional Summary',
      'kinh-nghiem': 'Work Experience',
      'hoc-van': 'Education & Qualifications',
      'ky-nang': 'Technical & Soft Skills',
      'du-an': 'Featured Projects',
      'chung-chi': 'Certificates & Awards',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • ATS-Standard Professional Resume Builder',
      trang: (tr, tong) => `Page ${tr}${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: 'APPLICANT PROFILE',
    },
  },
  ja: {
    tenHienThi: 'Tiếng Nhật (日本語)',
    co: '🇯🇵',
    tieuDeKhoi: {
      'gioi-thieu': '自己PR / 志望動機',
      'kinh-nghiem': '職務経歴書',
      'hoc-van': '学歴・経歴',
      'ky-nang': 'スキル・技術',
      'du-an': '主なプロジェクト',
      'chung-chi': '免許・資格・表彰',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • ATS標準レジュメ作成システム',
      trang: (tr, tong) => `${tr} ページ${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: '応募者プロフィール',
    },
  },
  zh: {
    tenHienThi: 'Tiếng Trung (中文)',
    co: '🇨🇳',
    tieuDeKhoi: {
      'gioi-thieu': '个人简介 / 求职意向',
      'kinh-nghiem': '工作经历',
      'hoc-van': '教育背景',
      'ky-nang': '专业技能',
      'du-an': '项目经验',
      'chung-chi': '证书与荣誉',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • ATS标准专业简历系统',
      trang: (tr, tong) => `第 ${tr} 页${tong >= 2 ? ` / 共 ${tong} 页` : ''}`,
      miniHeader: '应聘者简历',
    },
  },
  ko: {
    tenHienThi: 'Tiếng Hàn (한국어)',
    co: '🇰🇷',
    tieuDeKhoi: {
      'gioi-thieu': '자기소개 / 지원동기',
      'kinh-nghiem': '경력사항',
      'hoc-van': '학력사항',
      'ky-nang': '보유 기술',
      'du-an': '주요 프로젝트',
      'chung-chi': '자격증 및 수상',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • ATS 표준 이력서 시스템',
      trang: (tr, tong) => `${tr} 페이지${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: '지원자 이력서',
    },
  },
  fr: {
    tenHienThi: 'Tiếng Pháp (Français)',
    co: '🇫🇷',
    tieuDeKhoi: {
      'gioi-thieu': 'Profil Professionnel',
      'kinh-nghiem': 'Expérience Professionnelle',
      'hoc-van': 'Formation & Diplômes',
      'ky-nang': 'Compétences',
      'du-an': 'Projets Clés',
      'chung-chi': 'Certifications & Distinctions',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • Constructeur de CV standard ATS',
      trang: (tr, tong) => `Page ${tr}${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: 'PROFIL CANDIDAT',
    },
  },
  de: {
    tenHienThi: 'Tiếng Đức (Deutsch)',
    co: '🇩🇪',
    tieuDeKhoi: {
      'gioi-thieu': 'Berufsprofil',
      'kinh-nghiem': 'Berufserfahrung',
      'hoc-van': 'Ausbildung & Studium',
      'ky-nang': 'Kenntnisse & Fähigkeiten',
      'du-an': 'Ausgewählte Projekte',
      'chung-chi': 'Zertifikate & Auszeichnungen',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • ATS-konformer Lebenslauf',
      trang: (tr, tong) => `Seite ${tr}${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: 'BEWERBERPROFIL',
    },
  },
  es: {
    tenHienThi: 'Tiếng Tây Ban Nha (Español)',
    co: '🇪🇸',
    tieuDeKhoi: {
      'gioi-thieu': 'Perfil Profesional',
      'kinh-nghiem': 'Experiencia Laboral',
      'hoc-van': 'Educación y Formación',
      'ky-nang': 'Habilidades',
      'du-an': 'Proyectos Destacados',
      'chung-chi': 'Certificaciones y Premios',
    },
    nhanFooter: {
      banQuyen: 'CVify Pro • Generador de CV estándar ATS',
      trang: (tr, tong) => `Página ${tr}${tong >= 2 ? ` / ${tong}` : ''}`,
      miniHeader: 'PERFIL DEL CANDIDATO',
    },
  },
};

export interface HinhNenCVConfig {
  id: string;
  ten: string;
  moTa: string;
  previewClass: string;
  canvasClass: string;
}

export const DANH_SACH_HINH_NEN: HinhNenCVConfig[] = [
  {
    id: 'trang-tron',
    ten: 'Trắng Tinh Tế',
    moTa: 'Chuẩn ATS tuyệt đối, tối ưu in ấn và quét hồ sơ',
    previewClass: 'bg-white border-slate-300',
    canvasClass: 'bg-white',
  },
  {
    id: 'gradient-xanh-suong',
    ten: 'Xanh Lam Sương Mờ',
    moTa: 'Gradient pastel nhẹ tạo cảm giác công nghệ, đáng tin cậy',
    previewClass: 'bg-gradient-to-br from-sky-100/90 via-blue-50/50 to-indigo-100/80',
    canvasClass: 'bg-gradient-to-br from-sky-50/70 via-white to-blue-50/50',
  },
  {
    id: 'gradient-tim-lavender',
    ten: 'Tím Lavender Mộng Mơ',
    moTa: 'Sắc tím dịu pastel cho sáng tạo, marketing & UI/UX',
    previewClass: 'bg-gradient-to-br from-purple-100/90 via-pink-50/50 to-indigo-100/80',
    canvasClass: 'bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/50',
  },
  {
    id: 'gradient-hoang-hon',
    ten: 'Hoàng Hôn Ấm Áp',
    moTa: 'Tông màu cam đào và hổ phách năng động, nhiệt huyết',
    previewClass: 'bg-gradient-to-br from-amber-100/90 via-orange-50/60 to-rose-100/70',
    canvasClass: 'bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40',
  },
  {
    id: 'gradient-ngoc-bich',
    ten: 'Ngọc Bích Tươi Mới',
    moTa: 'Sắc xanh ngọc mint thanh lịch, phát triển bền vững',
    previewClass: 'bg-gradient-to-br from-teal-100/90 via-emerald-50/50 to-cyan-100/70',
    canvasClass: 'bg-gradient-to-br from-teal-50/60 via-white to-emerald-50/40',
  },
  {
    id: 'gradient-hong-phan',
    ten: 'Hồng Phấn Nhẹ Nhàng',
    moTa: 'Tông hồng pastel dịu mắt, thân thiện và tinh tế',
    previewClass: 'bg-gradient-to-br from-rose-100/90 via-pink-50/50 to-orange-50/50',
    canvasClass: 'bg-gradient-to-br from-rose-50/50 via-white to-pink-50/30',
  },
  {
    id: 'luoi-cham-bi',
    ten: 'Chấm Bi Tối Giản',
    moTa: 'Lưới chấm bi vi hạt phong cách thiết kế hiện đại',
    previewClass: 'bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:10px_10px] bg-slate-50',
    canvasClass: 'bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:16px_16px] bg-white',
  },
  {
    id: 'luoi-cong-nghe',
    ten: 'Lưới Bản Vẽ Kỹ Thuật',
    moTa: 'Lưới ô vuông kiến trúc siêu mảnh dành cho Kỹ sư & IT',
    previewClass: 'bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-white',
    canvasClass: 'bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] bg-white',
  },
  {
    id: 'song-luon-mem',
    ten: 'Sóng Lượn Mềm Mại',
    moTa: 'Aura sóng trừu tượng tạo chiều sâu trang giấy',
    previewClass: 'bg-gradient-to-tr from-cyan-100/80 via-white to-violet-100/80',
    canvasClass: 'bg-gradient-to-tr from-cyan-50/40 via-white to-violet-50/30',
  },
  {
    id: 'goc-hinh-hoc',
    ten: 'Khối Góc Sang Trọng',
    moTa: 'Vát cong góc hiện đại tạo điểm nhấn thị giác đẳng cấp',
    previewClass: 'bg-white relative overflow-hidden before:absolute before:top-0 before:right-0 before:w-10 before:h-10 before:bg-blue-300/40 before:rounded-bl-full',
    canvasClass: 'bg-white relative before:absolute before:top-0 before:right-0 before:w-48 before:h-48 before:bg-gradient-to-bl before:from-blue-100/50 before:to-transparent before:rounded-bl-full before:pointer-events-none',
  },
  {
    id: 'vet-mau-pastel',
    ten: 'Vệt Màu Nghệ Thuật (Aura)',
    moTa: 'Vệt màu nước khuếch tán đa sắc phong cách Art & Design',
    previewClass: 'bg-white relative overflow-hidden before:absolute before:-top-2 before:-left-2 before:w-8 before:h-8 before:bg-pink-300/50 before:rounded-full before:blur-xs after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 after:bg-sky-300/50 after:rounded-full after:blur-xs',
    canvasClass: 'bg-white relative before:absolute before:-top-16 before:-left-16 before:w-64 before:h-64 before:bg-pink-200/30 before:rounded-full before:blur-3xl before:pointer-events-none after:absolute after:bottom-10 after:right-10 after:w-72 after:h-72 after:bg-sky-200/30 after:rounded-full after:blur-3xl after:pointer-events-none',
  },
  {
    id: 'vien-khung-sang',
    ten: 'Khung Viền Kép Cổ Điển',
    moTa: 'Đường viền đôi thanh mảnh chuẩn phong cách Executive',
    previewClass: 'bg-white p-1 border-2 border-slate-300',
    canvasClass: 'bg-white ring-1 ring-inset ring-slate-200/70',
  },
];

/**
 * Hàm phụ trợ phân bổ danh sách khối vào N cột một cách thông minh
 */
export function phanBoKhoiVaoDanhSachCot(
  danhSachKhoi: string[],
  soCot: number,
  tiLeMacDinh?: number[],
  cotHienTai?: CotTuChinh[]
): CotTuChinh[] {
  const numCols = Math.max(1, soCot);

  // Tính toán độ rộng mặc định cho từng cột
  let doRongArr: number[] = [];
  if (tiLeMacDinh && tiLeMacDinh.length === numCols) {
    doRongArr = [...tiLeMacDinh];
  } else if (numCols === 1) {
    doRongArr = [100];
  } else if (numCols === 2) {
    doRongArr = [35, 65];
  } else if (numCols === 3) {
    doRongArr = [28, 44, 28];
  } else {
    const base = Math.floor(100 / numCols);
    doRongArr = Array(numCols).fill(base);
    doRongArr[numCols - 1] += 100 - base * numCols;
  }

  // Tạo khung các cột
  const danhSachCotMoi: CotTuChinh[] = Array.from({ length: numCols }, (_, idx) => {
    const idMacDinh =
      numCols === 2
        ? idx === 0
          ? 'cot-trai'
          : 'cot-phai'
        : numCols === 3
        ? idx === 0
          ? 'cot-trai'
          : idx === 1
          ? 'cot-giua'
          : 'cot-phai'
        : `cot-${idx + 1}`;

    const cotCu = cotHienTai?.[idx];
    return {
      id: cotCu?.id || idMacDinh,
      ten: cotCu?.ten || `Cột ${idx + 1}`,
      doRong: doRongArr[idx],
      khoiIds: [],
    };
  });

  // Nếu có sẵn phân bổ từ cotHienTai, giữ nguyên vị trí các khối trong phạm vi số cột mới
  const daPhanBo = new Set<string>();
  if (cotHienTai && cotHienTai.length > 0) {
    cotHienTai.forEach((c, idx) => {
      const targetIdx = Math.min(idx, numCols - 1);
      for (const kId of c.khoiIds || []) {
        if (!daPhanBo.has(kId) && danhSachKhoi.includes(kId)) {
          danhSachCotMoi[targetIdx].khoiIds.push(kId);
          daPhanBo.add(kId);
        }
      }
    });
  }

  // Phân bổ các khối còn lại vào đúng vị trí cột hợp lý
  const khoiConLai = danhSachKhoi.filter((id) => !daPhanBo.has(id));
  for (const id of khoiConLai) {
    if (!id || typeof id !== 'string') continue;
    if (numCols === 1) {
      danhSachCotMoi[0].khoiIds.push(id);
    } else if (numCols === 2) {
      if (KHOI_COT_TRAI_MAC_DINH.has(id)) {
        danhSachCotMoi[0].khoiIds.push(id);
      } else {
        danhSachCotMoi[1].khoiIds.push(id);
      }
    } else if (numCols === 3) {
      if (id === 'hoc-van' || id === 'ky-nang') {
        danhSachCotMoi[0].khoiIds.push(id);
      } else if (id === 'gioi-thieu' || id === 'kinh-nghiem') {
        danhSachCotMoi[1].khoiIds.push(id);
      } else {
        danhSachCotMoi[2].khoiIds.push(id);
      }
    } else {
      // N cột: phân bổ vào cột đang có ít khối nhất
      let minIdx = 0;
      for (let i = 1; i < numCols; i++) {
        if (danhSachCotMoi[i].khoiIds.length < danhSachCotMoi[minIdx].khoiIds.length) {
          minIdx = i;
        }
      }
      danhSachCotMoi[minIdx].khoiIds.push(id);
    }
    daPhanBo.add(id);
  }

  return danhSachCotMoi;
}

/**
 * Đồng bộ ngược từ danhSachCot sang cotTrai, cotGiua, cotPhai để tương thích 100%
 */
function dongBoCotCoDinhTuDanhSachCot(danhSachCot: CotTuChinh[]) {
  const cotTrai = danhSachCot[0]?.khoiIds ? [...danhSachCot[0].khoiIds] : [];
  let cotGiua: string[] = [];
  let cotPhai: string[] = [];

  if (danhSachCot.length === 2) {
    cotPhai = [...(danhSachCot[1]?.khoiIds || [])];
  } else if (danhSachCot.length >= 3) {
    cotGiua = [...(danhSachCot[1]?.khoiIds || [])];
    cotPhai = danhSachCot.slice(2).flatMap((c) => c.khoiIds || []);
  }

  return { cotTrai, cotGiua, cotPhai };
}

/**
 * Chuẩn hóa cấu trúc bố cục BoCucCV, đảm bảo tương thích ngược 100% với dữ liệu cũ
 * và hỗ trợ hệ thống N cột tùy chỉnh mới.
 */
export function chuanHoaBoCuc(
  boCucDauVao?: Partial<BoCucCV> | null,
  thuTuKhoi?: string[]
): BoCucCV {
  const hopLe: CheDoBoCuc[] = [
    '1-cot',
    '2-cot',
    '2-cot-deu',
    '3-cot',
    '4-cot',
    'tuy-chinh',
  ];
  const cheDo: CheDoBoCuc =
    boCucDauVao?.cheDo && hopLe.includes(boCucDauVao.cheDo)
      ? boCucDauVao.cheDo
      : '2-cot';

  const danhSachKhoi =
    Array.isArray(thuTuKhoi) && thuTuKhoi.length > 0
      ? [...thuTuKhoi]
      : ['gioi-thieu', 'kinh-nghiem', 'hoc-van', 'ky-nang'];

  let cotTrai: string[] = Array.isArray(boCucDauVao?.cotTrai)
    ? [...boCucDauVao.cotTrai]
    : [];
  let cotGiua: string[] = Array.isArray(boCucDauVao?.cotGiua)
    ? [...boCucDauVao.cotGiua]
    : [];
  let cotPhai: string[] = Array.isArray(boCucDauVao?.cotPhai)
    ? [...boCucDauVao.cotPhai]
    : [];

  // Nếu đã có danhSachCot tùy chỉnh hợp lệ
  if (Array.isArray(boCucDauVao?.danhSachCot) && boCucDauVao.danhSachCot.length > 0) {
    const dsCot: CotTuChinh[] = boCucDauVao.danhSachCot.map((c, idx) => ({
      id: c.id || `cot-${idx + 1}`,
      ten: c.ten || `Cột ${idx + 1}`,
      doRong: typeof c.doRong === 'number' && c.doRong > 5 ? c.doRong : Math.floor(100 / boCucDauVao.danhSachCot!.length),
      khoiIds: Array.isArray(c.khoiIds) ? [...c.khoiIds] : [],
    }));

    // Đảm bảo không sót khối nào trong danhSachKhoi
    const daCo = new Set(dsCot.flatMap((c) => c.khoiIds));
    for (const id of danhSachKhoi) {
      if (typeof id === 'string' && id.trim() && !daCo.has(id)) {
        dsCot[dsCot.length - 1].khoiIds.push(id);
        daCo.add(id);
      }
    }

    const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);
    return {
      cheDo,
      cotTrai: synced.cotTrai,
      cotGiua: synced.cotGiua,
      cotPhai: synced.cotPhai,
      tiLe: dsCot.map((c) => c.doRong).join('-'),
      danhSachCot: dsCot,
    };
  }

  // Nếu chưa có danhSachCot, xây dựng từ cotTrai, cotGiua, cotPhai
  if (cotTrai.length === 0 && cotPhai.length === 0 && cotGiua.length === 0) {
    for (const id of danhSachKhoi) {
      if (typeof id !== 'string' || !id.trim()) continue;
      if (KHOI_COT_TRAI_MAC_DINH.has(id)) {
        cotTrai.push(id);
      } else {
        cotPhai.push(id);
      }
    }
  } else {
    const daCo = new Set([...cotTrai, ...cotGiua, ...cotPhai]);
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

  // Deduplicate
  const seen = new Set<string>();
  const cleanList = (arr: string[]) =>
    arr.filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

  const cotTraiKetQua = cleanList(cotTrai);
  const cotGiuaKetQua = cleanList(cotGiua);
  const cotPhaiKetQua = cleanList(cotPhai);

  let danhSachCot: CotTuChinh[] = [];
  if (cheDo === '1-cot') {
    danhSachCot = [
      {
        id: 'cot-1',
        ten: 'Cột 1',
        doRong: 100,
        khoiIds: Array.from(new Set([...danhSachKhoi, ...cotPhaiKetQua, ...cotTraiKetQua])),
      },
    ];
  } else if (cheDo === '3-cot') {
    const g = cotGiuaKetQua.length > 0 ? cotGiuaKetQua : cotPhaiKetQua.slice(0, 1);
    const p = cotGiuaKetQua.length > 0 ? cotPhaiKetQua : cotPhaiKetQua.slice(1);
    danhSachCot = [
      { id: 'cot-trai', ten: 'Cột 1', doRong: 28, khoiIds: cotTraiKetQua },
      { id: 'cot-giua', ten: 'Cột 2', doRong: 44, khoiIds: g },
      { id: 'cot-phai', ten: 'Cột 3', doRong: 28, khoiIds: p },
    ];
  } else if (cheDo === '4-cot') {
    danhSachCot = phanBoKhoiVaoDanhSachCot(danhSachKhoi, 4, [25, 25, 25, 25]);
  } else {
    const isDeu = cheDo === '2-cot-deu';
    danhSachCot = [
      { id: 'cot-trai', ten: 'Cột 1', doRong: isDeu ? 50 : 35, khoiIds: cotTraiKetQua },
      { id: 'cot-phai', ten: 'Cột 2', doRong: isDeu ? 50 : 65, khoiIds: cotPhaiKetQua },
    ];
  }

  return {
    cheDo,
    cotTrai: cotTraiKetQua,
    cotGiua: cotGiuaKetQua,
    cotPhai: cotPhaiKetQua,
    tiLe: danhSachCot.map((c) => c.doRong).join('-'),
    danhSachCot,
  };
}

/**
 * Sắp xếp lại danh sách mục con dựa trên mảng đối tượng hoặc mảng ID mới.
 */
export function sapXepDanhSachMuc<T extends { id: string }>(
  danhSachHienTai: T[],
  itemsOrIds: T[] | string[]
): T[] {
  if (!Array.isArray(itemsOrIds) || itemsOrIds.length === 0) {
    return [];
  }

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

    for (const itemConLai of mapHienTai.values()) {
      ketQua.push(itemConLai);
    }

    return ketQua;
  }

  const items = itemsOrIds as T[];
  const daThem = new Set<string>();
  const ketQua: T[] = [];

  for (const item of items) {
    if (item && item.id && !daThem.has(item.id)) {
      ketQua.push(item);
      daThem.add(item.id);
    }
  }

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
  dangDichCV: boolean;
  mauCVHienTai: string;
  doiMauChuDao: (mauMoi: string) => void;
  doiFontChu: (fontMoi: string) => void;
  doiCoChu: (coChuMoi: string) => void;
  doiNgonNguCV: (ngonNguMoi: string) => Promise<void>;
  doiHinhNenCV: (hinhNenMoi: string) => void;
  doiKhoangCachDong: (khoangCach: number) => void;
  capNhatDinhDang: (duLieu: Partial<DinhDangCV>) => void;
  datIconKhoi: (khoiId: string, iconName: string) => void;
  datTieuDeKhoi: (khoiId: string, tieuDeMoi: string) => void;
  capNhatKieuChu: (key: string, kieuMoi: Partial<KieuChuItem>) => void;
  batTatNgatTrangKhoi: (khoiId: string) => void;
  chuyenKhoiSangTrang: (khoiId: string, soTrang: number) => void;
  datSoTrangCV: (soTrang: number) => void;

  capNhatThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  setThongTinCaNhan: (duLieu: Partial<ThongTinCV['thongTinCaNhan']>) => void;
  themLienHeTuyChinh: (iconName?: string, giaTri?: string) => void;
  suaLienHeTuyChinh: (id: string, duLieu: Partial<TruongLienHeTuyChinh>) => void;
  xoaLienHeTuyChinh: (id: string) => void;

  capNhatGioiThieu: (noiDung: string) => void;
  setGioiThieu: (noiDung: string) => void;

  // Layout & Dynamic Custom Columns Actions
  chuyenCheDoBoCuc: (cheDo: CheDoBoCuc) => void;
  themCotMoi: () => void;
  xoaCot: (cotId: string) => void;
  doiDoRongCot: (cotId: string, doRongMoi: number) => void;
  doiTenCot: (cotId: string, tenMoi: string) => void;
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
  maNguoiSoHuuCV: number | null;
  tenNguoiSoHuuCV: string;
  tieuDeCVHienTai: string;
  datTieuDeCV: (tieuDe: string) => void;
  napDuLieuCVTuServer: (cvBackend: any) => void;
  khoiTaoCVMoi: (id?: number | null, tieuDe?: string) => void;
  nhapNoiDungTuCVCụ: (cvNguon: Partial<ThongTinCV>, cheDoBoCucMoi?: CheDoBoCuc) => void;
  apDungMauCV: (mauId: string, giuNguyenNoiDung?: boolean) => void;
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
    mauChuDao: '#1a91f0',
    coChu: '14px',
    fontChu: 'Inter',
    matDo: 'normal',
    cheDoBoCuc: '2-cot',
    iconKhoi: {
      'gioi-thieu': 'User',
      'kinh-nghiem': 'Briefcase',
      'hoc-van': 'GraduationCap',
      'ky-nang': 'Award',
      'du-an': 'FolderGit2',
      'chung-chi': 'ShieldCheck',
    },
    tieuDeKhoi: {},
    kieuChuTuyChinh: {},
    hienThiIconTruong: true,
    ngonNgu: 'vi',
    hinhNen: 'trang-tron',
    khoangCachDong: 1.45,
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
    iconLienHe: {
      email: 'Mail',
      soDienThoai: 'Phone',
      diaChi: 'MapPin',
      website: 'Globe',
    },
    lienHeTuyChinh: [],
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
    danhSachCot: [
      { id: 'cot-trai', ten: 'Cột 1', doRong: 35, khoiIds: ['hoc-van', 'ky-nang'] },
      { id: 'cot-phai', ten: 'Cột 2', doRong: 65, khoiIds: ['gioi-thieu', 'kinh-nghiem'] },
    ],
  },
};

export const useKhoLuuTruCV = create<KhoLuuTruCVState>()((set, get) => ({
  cv: DU_LIEU_MAC_DINH,
  dangDichCV: false,
  mauCVHienTai: 'mau-hien-dai',

  doiMauChuDao: (mauMoi) =>
    set((state) => {
      const kieuChuCu = state.cv.dinhDang.kieuChuTuyChinh || {};
      const kieuChuCapNhat: Record<string, KieuChuItem> = {};
      for (const [k, v] of Object.entries(kieuChuCu)) {
        if (k.startsWith('khoi-')) {
          kieuChuCapNhat[k] = { ...v, mauChu: undefined };
        } else {
          kieuChuCapNhat[k] = v;
        }
      }
      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            mauChuDao: mauMoi,
            kieuChuTuyChinh: kieuChuCapNhat,
          },
        },
      };
    }),

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

  doiCoChu: (coChuMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          coChu: coChuMoi,
        },
      },
    })),

  doiNgonNguCV: async (ngonNguMoi) => {
    const stateHienTai = get();
    const ngonNguCu = stateHienTai.cv.dinhDang.ngonNgu || 'vi';
    const dict =
      BAN_DICH_NGON_NGU[ngonNguMoi]?.tieuDeKhoi ||
      BAN_DICH_NGON_NGU['vi'].tieuDeKhoi;

    // 1. Cập nhật ngay lập tức tiêu đề các khối & cờ ngôn ngữ
    set((state) => {
      const tieuDeMoi = { ...(state.cv.dinhDang.tieuDeKhoi || {}) };
      for (const [kId, val] of Object.entries(dict)) {
        tieuDeMoi[kId] = val;
      }
      return {
        dangDichCV: ngonNguCu !== ngonNguMoi,
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            ngonNgu: ngonNguMoi,
            tieuDeKhoi: tieuDeMoi,
          },
        },
      };
    });

    if (ngonNguCu === ngonNguMoi) return;

    // 2. Dịch toàn bộ nội dung người dùng đã nhập sang ngôn ngữ mới
    try {
      const cvSauKhiDich = await dichToanBoNoiDungCV(get().cv, ngonNguMoi);
      set((state) => ({
        dangDichCV: false,
        cv: {
          ...state.cv,
          ...cvSauKhiDich,
        },
      }));
    } catch (err) {
      console.error('Lỗi khi dịch toàn bộ CV:', err);
      set({ dangDichCV: false });
    }
  },

  doiHinhNenCV: (hinhNenMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          hinhNen: hinhNenMoi,
        },
      },
    })),

  doiKhoangCachDong: (khoangCach) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          khoangCachDong: khoangCach,
        },
      },
    })),

  capNhatDinhDang: (duLieu) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          ...duLieu,
        },
      },
    })),

  datIconKhoi: (khoiId, iconName) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          iconKhoi: {
            ...(state.cv.dinhDang.iconKhoi || {}),
            [khoiId]: iconName,
          },
        },
      },
    })),

  datTieuDeKhoi: (khoiId, tieuDeMoi) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          tieuDeKhoi: {
            ...(state.cv.dinhDang.tieuDeKhoi || {}),
            [khoiId]: tieuDeMoi,
          },
        },
      },
    })),

  capNhatKieuChu: (key, kieuMoi) =>
    set((state) => {
      const hienTai = state.cv.dinhDang.kieuChuTuyChinh?.[key] || {};
      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            kieuChuTuyChinh: {
              ...(state.cv.dinhDang.kieuChuTuyChinh || {}),
              [key]: { ...hienTai, ...kieuMoi },
            },
          },
        },
      };
    }),

  batTatNgatTrangKhoi: (khoiId) =>
    set((state) => {
      const hienTai = state.cv.dinhDang.ngatTrangKhoi?.[khoiId] ?? false;
      const sangTrang2 = !hienTai;
      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            ngatTrangKhoi: {
              ...(state.cv.dinhDang.ngatTrangKhoi || {}),
              [khoiId]: sangTrang2,
            },
            phanBoTrangKhoi: {
              ...(state.cv.dinhDang.phanBoTrangKhoi || {}),
              [khoiId]: sangTrang2 ? 2 : 1,
            },
            soTrangCV: sangTrang2 ? 2 : (state.cv.dinhDang.soTrangCV || 1),
          },
        },
      };
    }),

  chuyenKhoiSangTrang: (khoiId, soTrang) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          phanBoTrangKhoi: {
            ...(state.cv.dinhDang.phanBoTrangKhoi || {}),
            [khoiId]: soTrang,
          },
          ngatTrangKhoi: {
            ...(state.cv.dinhDang.ngatTrangKhoi || {}),
            [khoiId]: soTrang === 2,
          },
          soTrangCV: Math.max(state.cv.dinhDang.soTrangCV || 1, soTrang),
        },
      },
    })),

  datSoTrangCV: (soTrang) =>
    set((state) => ({
      cv: {
        ...state.cv,
        dinhDang: {
          ...state.cv.dinhDang,
          soTrangCV: Math.max(1, Math.min(2, soTrang)),
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

  themLienHeTuyChinh: (iconName = 'Link', giaTri = '') =>
    set((state) => ({
      cv: {
        ...state.cv,
        thongTinCaNhan: {
          ...state.cv.thongTinCaNhan,
          lienHeTuyChinh: [
            ...(state.cv.thongTinCaNhan.lienHeTuyChinh || []),
            {
              id: `lh-${Date.now()}`,
              iconName,
              giaTri,
              placeholder: 'Nhập thông tin (Github, Ngày sinh, Portfolio...)',
            },
          ],
        },
      },
    })),

  suaLienHeTuyChinh: (id, duLieu) =>
    set((state) => ({
      cv: {
        ...state.cv,
        thongTinCaNhan: {
          ...state.cv.thongTinCaNhan,
          lienHeTuyChinh: (state.cv.thongTinCaNhan.lienHeTuyChinh || []).map((item) =>
            item.id === id ? { ...item, ...duLieu } : item
          ),
        },
      },
    })),

  xoaLienHeTuyChinh: (id) =>
    set((state) => ({
      cv: {
        ...state.cv,
        thongTinCaNhan: {
          ...state.cv.thongTinCaNhan,
          lienHeTuyChinh: (state.cv.thongTinCaNhan.lienHeTuyChinh || []).filter(
            (item) => item.id !== id
          ),
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
  // BỐ CỤC & HỆ THỐNG CỘT ĐỘNG TÙY CHỈNH
  // ==========================================

  chuyenCheDoBoCuc: (cheDo) =>
    set((state) => {
      const thuTuKhoiHienTai = state.cv.thuTuKhoi || [
        'gioi-thieu',
        'kinh-nghiem',
        'hoc-van',
        'ky-nang',
      ];
      const boCucHienTai =
        state.cv.boCuc || chuanHoaBoCuc(undefined, thuTuKhoiHienTai);

      let danhSachCotMoi: CotTuChinh[] = [];

      if (cheDo === '1-cot') {
        danhSachCotMoi = [
          {
            id: 'cot-1',
            ten: 'Cột 1',
            doRong: 100,
            khoiIds: [...thuTuKhoiHienTai],
          },
        ];
      } else if (cheDo === '2-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(thuTuKhoiHienTai, 2, [35, 65]);
      } else if (cheDo === '2-cot-deu') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(thuTuKhoiHienTai, 2, [50, 50]);
      } else if (cheDo === '3-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(thuTuKhoiHienTai, 3, [28, 44, 28]);
      } else if (cheDo === '4-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(thuTuKhoiHienTai, 4, [25, 25, 25, 25]);
      } else {
        danhSachCotMoi =
          boCucHienTai.danhSachCot && boCucHienTai.danhSachCot.length > 0
            ? [...boCucHienTai.danhSachCot]
            : phanBoKhoiVaoDanhSachCot(thuTuKhoiHienTai, 2, [35, 65]);
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(danhSachCotMoi);
      const thuTuKhoiDongBo = Array.from(
        new Set([...danhSachCotMoi.flatMap((c) => c.khoiIds), ...thuTuKhoiHienTai])
      );

      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            cheDoBoCuc: cheDo,
          },
          boCuc: {
            cheDo,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            tiLe: danhSachCotMoi.map((c) => c.doRong).join('-'),
            danhSachCot: danhSachCotMoi,
          },
          thuTuKhoi: thuTuKhoiDongBo,
        },
      };
    }),

  // Tự tạo thêm cột mới không giới hạn số lượng
  themCotMoi: () =>
    set((state) => {
      const boCucHienTai =
        state.cv.boCuc || chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const dsHienTai =
        boCucHienTai.danhSachCot && boCucHienTai.danhSachCot.length > 0
          ? [...boCucHienTai.danhSachCot]
          : phanBoKhoiVaoDanhSachCot(state.cv.thuTuKhoi || [], 2);

      const soCotMoi = dsHienTai.length + 1;
      const doRongDeu = Math.floor(100 / soCotMoi);
      const phanDu = 100 - doRongDeu * soCotMoi;

      const dsCapNhat: CotTuChinh[] = dsHienTai.map((c, idx) => ({
        ...c,
        ten: `Cột ${idx + 1}`,
        doRong: doRongDeu,
      }));

      dsCapNhat.push({
        id: `cot-custom-${Date.now()}`,
        ten: `Cột ${soCotMoi}`,
        doRong: doRongDeu + phanDu,
        khoiIds: [],
      });

      const cheDoMoi: CheDoBoCuc =
        soCotMoi === 2
          ? '2-cot-deu'
          : soCotMoi === 3
          ? '3-cot'
          : soCotMoi === 4
          ? '4-cot'
          : 'tuy-chinh';

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCapNhat);

      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            cheDoBoCuc: cheDoMoi,
          },
          boCuc: {
            cheDo: cheDoMoi,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            tiLe: dsCapNhat.map((c) => c.doRong).join('-'),
            danhSachCot: dsCapNhat,
          },
        },
      };
    }),

  // Xóa một cột bất kỳ và bảo toàn toàn bộ các khối bên trong sang cột kế bên
  xoaCot: (cotId) =>
    set((state) => {
      const boCucHienTai =
        state.cv.boCuc || chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const dsHienTai = boCucHienTai.danhSachCot || [];
      if (dsHienTai.length <= 1) return state;

      const idxXoa = dsHienTai.findIndex((c) => c.id === cotId);
      if (idxXoa === -1) return state;

      const khoiCanChuyen = dsHienTai[idxXoa].khoiIds || [];
      const dsConLai = dsHienTai
        .filter((c) => c.id !== cotId)
        .map((c) => ({ ...c, khoiIds: [...c.khoiIds] }));

      // Chuyển các khối của cột bị xóa sang cột liền kề để không mất dữ liệu
      const targetIdx = Math.max(0, idxXoa - 1);
      dsConLai[targetIdx].khoiIds.push(
        ...khoiCanChuyen.filter((id) => !dsConLai[targetIdx].khoiIds.includes(id))
      );

      const soCotMoi = dsConLai.length;
      const doRongDeu = Math.floor(100 / soCotMoi);
      const phanDu = 100 - doRongDeu * soCotMoi;

      const dsCapNhat = dsConLai.map((c, i) => ({
        ...c,
        ten: `Cột ${i + 1}`,
        doRong: i === soCotMoi - 1 ? doRongDeu + phanDu : doRongDeu,
      }));

      const cheDoMoi: CheDoBoCuc =
        soCotMoi === 1
          ? '1-cot'
          : soCotMoi === 2
          ? '2-cot-deu'
          : soCotMoi === 3
          ? '3-cot'
          : soCotMoi === 4
          ? '4-cot'
          : 'tuy-chinh';

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCapNhat);

      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            cheDoBoCuc: cheDoMoi,
          },
          boCuc: {
            cheDo: cheDoMoi,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            tiLe: dsCapNhat.map((c) => c.doRong).join('-'),
            danhSachCot: dsCapNhat,
          },
        },
      };
    }),

  // Chỉnh độ rộng phần trăm (%) của từng cột
  doiDoRongCot: (cotId, doRongMoi) =>
    set((state) => {
      const boCucHienTai =
        state.cv.boCuc || chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const dsHienTai = boCucHienTai.danhSachCot || [];
      if (dsHienTai.length <= 1) return state;

      const clamped = Math.max(15, Math.min(85, Math.round(doRongMoi)));
      const idx = dsHienTai.findIndex((c) => c.id === cotId);
      if (idx === -1) return state;

      const dsMoi = dsHienTai.map((c) => ({ ...c }));
      const chenhLech = clamped - dsMoi[idx].doRong;
      dsMoi[idx].doRong = clamped;

      // Điều chỉnh cột kế bên để tổng vẫn cân đối ~100%
      const neighborIdx = idx === dsMoi.length - 1 ? idx - 1 : idx + 1;
      dsMoi[neighborIdx].doRong = Math.max(15, dsMoi[neighborIdx].doRong - chenhLech);

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cheDo: dsMoi.length > 2 ? 'tuy-chinh' : boCucHienTai.cheDo,
            tiLe: dsMoi.map((c) => c.doRong).join('-'),
            danhSachCot: dsMoi,
          },
        },
      };
    }),

  doiTenCot: (cotId, tenMoi) =>
    set((state) => {
      const boCucHienTai =
        state.cv.boCuc || chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);
      const dsMoi = (boCucHienTai.danhSachCot || []).map((c) =>
        c.id === cotId ? { ...c, ten: tenMoi } : c
      );
      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            danhSachCot: dsMoi,
          },
        },
      };
    }),

  sapXepKhoiCot: (cot, thuTuMoi) =>
    set((state) => {
      const boCucHienTai = state.cv.boCuc
        ? { ...state.cv.boCuc }
        : chuanHoaBoCuc(undefined, state.cv.thuTuKhoi);

      const dsCot =
        boCucHienTai.danhSachCot && boCucHienTai.danhSachCot.length > 0
          ? boCucHienTai.danhSachCot.map((c) => ({ ...c, khoiIds: [...c.khoiIds] }))
          : chuanHoaBoCuc(boCucHienTai, state.cv.thuTuKhoi).danhSachCot!;

      const cotIdMap =
        cot === 'trai'
          ? 'cot-trai'
          : cot === 'phai'
          ? 'cot-phai'
          : (cot as string);

      let targetCol = dsCot.find((c) => c.id === cotIdMap);
      if (!targetCol) {
        if (cotIdMap === 'cot-trai') targetCol = dsCot[0];
        else if (cotIdMap === 'cot-giua' && dsCot.length >= 3) targetCol = dsCot[1];
        else if (cotIdMap === 'cot-phai') targetCol = dsCot[dsCot.length - 1];
      }

      if (targetCol) {
        const missing = targetCol.khoiIds.filter((id) => !thuTuMoi.includes(id));
        targetCol.khoiIds = [...thuTuMoi, ...missing];
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);
      const thuTuKhoiDongBo = Array.from(
        new Set([...dsCot.flatMap((c) => c.khoiIds), ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
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

      const dsCot =
        boCucHienTai.danhSachCot && boCucHienTai.danhSachCot.length > 0
          ? boCucHienTai.danhSachCot.map((c) => ({
              ...c,
              khoiIds: c.khoiIds.filter((id) => id !== khoiId),
            }))
          : chuanHoaBoCuc(boCucHienTai, state.cv.thuTuKhoi).danhSachCot!.map((c) => ({
              ...c,
              khoiIds: c.khoiIds.filter((id) => id !== khoiId),
            }));

      const cotIdMap =
        cotDich === 'trai'
          ? 'cot-trai'
          : cotDich === 'phai'
          ? 'cot-phai'
          : (cotDich as string);

      let targetCol = dsCot.find((c) => c.id === cotIdMap);
      if (!targetCol) {
        if (cotIdMap === 'cot-trai') targetCol = dsCot[0];
        else if (cotIdMap === 'cot-giua' && dsCot.length >= 3) targetCol = dsCot[1];
        else targetCol = dsCot[dsCot.length - 1];
      }

      if (targetCol) {
        if (
          typeof viTriIndex === 'number' &&
          viTriIndex >= 0 &&
          viTriIndex <= targetCol.khoiIds.length
        ) {
          targetCol.khoiIds.splice(viTriIndex, 0, khoiId);
        } else {
          targetCol.khoiIds.push(khoiId);
        }
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);
      const thuTuKhoiDongBo = Array.from(
        new Set([...dsCot.flatMap((c) => c.khoiIds), ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
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

      const dsCot =
        boCucHienTai.danhSachCot && boCucHienTai.danhSachCot.length > 0
          ? boCucHienTai.danhSachCot.map((c) => ({ ...c, khoiIds: [...c.khoiIds] }))
          : chuanHoaBoCuc(boCucHienTai, state.cv.thuTuKhoi).danhSachCot!;

      if (dsCot.length <= 1) return state;

      const curColIdx = dsCot.findIndex((c) => c.khoiIds.includes(khoiId));
      const nextColIdx = curColIdx === -1 ? 0 : (curColIdx + 1) % dsCot.length;

      dsCot.forEach((c) => {
        c.khoiIds = c.khoiIds.filter((id) => id !== khoiId);
      });
      dsCot[nextColIdx].khoiIds.push(khoiId);

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);
      const thuTuKhoiDongBo = Array.from(
        new Set([...dsCot.flatMap((c) => c.khoiIds), ...(state.cv.thuTuKhoi || [])])
      );

      return {
        cv: {
          ...state.cv,
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
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

      if (boCucHienTai.cheDo !== '1-cot') {
        const dsCot = (boCucHienTai.danhSachCot || []).map((c) => ({
          ...c,
          khoiIds: [...c.khoiIds],
        }));
        const col = dsCot.find((c) => c.khoiIds.includes(khoiId));
        if (!col) return state;

        const index = col.khoiIds.indexOf(khoiId);
        const targetIndex = huong === 'len' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= col.khoiIds.length) return state;

        [col.khoiIds[index], col.khoiIds[targetIndex]] = [
          col.khoiIds[targetIndex],
          col.khoiIds[index],
        ];

        const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);
        const thuTuKhoiDongBo = Array.from(
          new Set([...dsCot.flatMap((c) => c.khoiIds), ...(state.cv.thuTuKhoi || [])])
        );

        return {
          cv: {
            ...state.cv,
            thuTuKhoi: thuTuKhoiDongBo,
            boCuc: {
              ...boCucHienTai,
              cotTrai: synced.cotTrai,
              cotGiua: synced.cotGiua,
              cotPhai: synced.cotPhai,
              danhSachCot: dsCot,
            },
          },
        };
      } else {
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

      const dsCot = (boCucHienTai.danhSachCot || []).map((c) => ({
        ...c,
        khoiIds: [...c.khoiIds].sort((a, b) => {
          const idxA = thuTuIndex.has(a) ? thuTuIndex.get(a)! : 999;
          const idxB = thuTuIndex.has(b) ? thuTuIndex.get(b)! : 999;
          return idxA - idxB;
        }),
      }));

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);

      return {
        cv: {
          ...state.cv,
          thuTuKhoi: thuTuMoi,
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
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

      const dsCot = (boCucHienTai.danhSachCot || []).map((c) => ({
        ...c,
        khoiIds: [...c.khoiIds],
      }));

      if (isHien && dsCot.length > 0) {
        const daCoTrongCot = dsCot.some((c) => c.khoiIds.includes(khoiId));
        if (!daCoTrongCot) {
          if (dsCot.length >= 2 && KHOI_COT_TRAI_MAC_DINH.has(khoiId)) {
            dsCot[0].khoiIds.push(khoiId);
          } else {
            dsCot[dsCot.length - 1].khoiIds.push(khoiId);
          }
        }
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);

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
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
          },
        },
      };
    }),

  // ==========================================
  // SẮP XẾP MỤC CON LỒNG NHAU (R2)
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
            iconViTri: 'Briefcase',
            iconCongTy: 'Building2',
            iconThoiGian: 'Calendar',
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
            iconChuyenNganh: 'BookOpen',
            iconTruong: 'GraduationCap',
            iconThoiGian: 'Calendar',
            iconDiemSo: 'BadgeCheck',
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
            iconName: 'Sparkles',
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
            iconTen: 'Rocket',
            iconVaiTro: 'Code2',
            iconThoiGian: 'Calendar',
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
            iconTen: 'Trophy',
            iconToChuc: 'ShieldCheck',
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

      const dsCot = (boCucHienTai.danhSachCot || []).map((c) => ({
        ...c,
        khoiIds: [...c.khoiIds],
      }));
      if (dsCot.length > 0) {
        dsCot[dsCot.length - 1].khoiIds.push(idMoi);
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);

      return {
        cv: {
          ...state.cv,
          khoiTuyChinh: [
            ...(state.cv.khoiTuyChinh || []),
            {
              id: idMoi,
              tieuDe: tieuDe.trim() || 'Mục Tùy Chỉnh',
              noiDung,
              iconName: 'Layers',
            },
          ],
          thuTuKhoi: [...(state.cv.thuTuKhoi || []), idMoi],
          anHienKhoi: {
            ...state.cv.anHienKhoi,
            [idMoi]: true,
          },
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
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

      const dsCot = (boCucHienTai.danhSachCot || []).map((c) => ({
        ...c,
        khoiIds: c.khoiIds.filter((k) => k !== id),
      }));
      const synced = dongBoCotCoDinhTuDanhSachCot(dsCot);

      return {
        cv: {
          ...state.cv,
          khoiTuyChinh: (state.cv.khoiTuyChinh || []).filter((k) => k.id !== id),
          thuTuKhoi: (state.cv.thuTuKhoi || []).filter((k) => k !== id),
          anHienKhoi: conLaiAnHienKhoi,
          boCuc: {
            ...boCucHienTai,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            danhSachCot: dsCot,
          },
        },
      };
    }),

  khoiPhucMacDinh: () =>
    set(() => ({
      cv: DU_LIEU_MAC_DINH,
    })),

  idCVHienTai: null,
  maNguoiSoHuuCV: null,
  tenNguoiSoHuuCV: '',
  tieuDeCVHienTai: 'CV Chưa Đặt Tên',

  datTieuDeCV: (tieuDe) => set({ tieuDeCVHienTai: tieuDe }),

  khoiTaoCVMoi: (id = null, tieuDe = 'CV Mới Chưa Đặt Tên') =>
    set(() => {
      let currentUserId: number | null = null;
      let currentUserName = '';
      try {
        const raw = sessionStorage.getItem('nguoiDung');
        if (raw) {
          const u = JSON.parse(raw);
          currentUserId = u.id ? Number(u.id) : null;
          currentUserName = u.ho_ten || u.ten || '';
        }
      } catch {
        // ignore
      }
      return {
        idCVHienTai: id,
        maNguoiSoHuuCV: currentUserId,
        tenNguoiSoHuuCV: currentUserName,
        tieuDeCVHienTai: tieuDe,
        cv: DU_LIEU_MAC_DINH,
      };
    }),

  // =========================================================================
  // LẤY NỘI DUNG TỪ CV CŨ ĐƯA LÊN CV MỚI VỚI LAYOUT MỚI (TỰ ADD ĐÚNG VỊ TRÍ)
  // =========================================================================
  nhapNoiDungTuCVCụ: (cvNguon, cheDoBoCucMoi) =>
    set((state) => {
      if (!cvNguon) return state;

      const kinhNghiemMoi = Array.isArray(cvNguon.kinhNghiem)
        ? [...cvNguon.kinhNghiem]
        : state.cv.kinhNghiem;
      const hocVanMoi = Array.isArray(cvNguon.hocVan)
        ? [...cvNguon.hocVan]
        : state.cv.hocVan;
      const kyNangMoi = Array.isArray(cvNguon.kyNang)
        ? [...cvNguon.kyNang]
        : state.cv.kyNang;
      const duAnMoi = Array.isArray(cvNguon.duAn)
        ? [...cvNguon.duAn]
        : state.cv.duAn;
      const chungChiMoi = Array.isArray(cvNguon.chungChi)
        ? [...cvNguon.chungChi]
        : state.cv.chungChi;
      const khoiTuyChinhMoi = Array.isArray(cvNguon.khoiTuyChinh)
        ? [...cvNguon.khoiTuyChinh]
        : state.cv.khoiTuyChinh || [];

      const gioiThieuMoi =
        cvNguon.gioiThieu !== undefined ? cvNguon.gioiThieu : state.cv.gioiThieu;

      // Tự động bật hiển thị cho tất cả các khối có dữ liệu trong CV cũ
      const anHienKhoiMoi: Record<string, boolean> = {
        ...state.cv.anHienKhoi,
        'gioi-thieu': true,
        'kinh-nghiem': true,
        'hoc-van': true,
        'ky-nang': true,
        'du-an': duAnMoi.length > 0 ? true : state.cv.anHienKhoi['du-an'] ?? false,
        'chung-chi':
          chungChiMoi.length > 0 ? true : state.cv.anHienKhoi['chung-chi'] ?? false,
      };

      const danhSachKhoiDayDu = [
        'gioi-thieu',
        'kinh-nghiem',
        'hoc-van',
        'ky-nang',
        ...(duAnMoi.length > 0 || anHienKhoiMoi['du-an'] ? ['du-an'] : []),
        ...(chungChiMoi.length > 0 || anHienKhoiMoi['chung-chi'] ? ['chung-chi'] : []),
      ];

      for (const ktc of khoiTuyChinhMoi) {
        if (ktc?.id) {
          anHienKhoiMoi[ktc.id] = true;
          if (!danhSachKhoiDayDu.includes(ktc.id)) {
            danhSachKhoiDayDu.push(ktc.id);
          }
        }
      }

      // Giữ nguyên Layout của CV mới (hoặc áp dụng chế độ bố cục mới được chọn)
      const cheDoDich: CheDoBoCuc =
        cheDoBoCucMoi || state.cv.boCuc?.cheDo || state.cv.dinhDang.cheDoBoCuc || '2-cot';

      let danhSachCotMoi: CotTuChinh[] = [];
      const soCotHienTai = state.cv.boCuc?.danhSachCot?.length || 2;
      const tiLeHienTai = state.cv.boCuc?.danhSachCot?.map((c) => c.doRong);

      if (cheDoDich === '1-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(danhSachKhoiDayDu, 1, [100]);
      } else if (cheDoDich === '2-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(danhSachKhoiDayDu, 2, [35, 65]);
      } else if (cheDoDich === '2-cot-deu') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(danhSachKhoiDayDu, 2, [50, 50]);
      } else if (cheDoDich === '3-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(danhSachKhoiDayDu, 3, [28, 44, 28]);
      } else if (cheDoDich === '4-cot') {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(danhSachKhoiDayDu, 4, [25, 25, 25, 25]);
      } else {
        danhSachCotMoi = phanBoKhoiVaoDanhSachCot(
          danhSachKhoiDayDu,
          soCotHienTai,
          tiLeHienTai
        );
      }

      const synced = dongBoCotCoDinhTuDanhSachCot(danhSachCotMoi);

      // Tự động phân bổ 2 trang nếu nội dung CV dài (từ 3 kinh nghiệm hoặc 2 kinh nghiệm trong bố cục nhiều cột)
      const laCVDai =
        kinhNghiemMoi.length >= 3 ||
        (kinhNghiemMoi.length >= 2 && (duAnMoi.length > 0 || danhSachCotMoi.length >= 3));

      // Không ép toàn bộ khối kinh nghiệm sang trang 2, để KhoiKinhNghiem tự động ngắt từng item liền mạch
      const phanBoTrangKhoiMoi: Record<string, number> = {
        'gioi-thieu': 1,
        'hoc-van': 1,
        'ky-nang': 1,
        'kinh-nghiem': 1,
        ...(state.cv.dinhDang.phanBoTrangKhoi || {}),
      };

      const ngatTrangKhoiMoi: Record<string, boolean> = {
        ...(state.cv.dinhDang.ngatTrangKhoi || {}),
      };

      return {
        cv: {
          ...state.cv,
          dinhDang: {
            ...state.cv.dinhDang,
            cheDoBoCuc: cheDoDich,
            soTrangCV: laCVDai ? 2 : (state.cv.dinhDang.soTrangCV || 1),
            phanBoTrangKhoi: phanBoTrangKhoiMoi,
            ngatTrangKhoi: ngatTrangKhoiMoi,
          },
          thongTinCaNhan: cvNguon.thongTinCaNhan
            ? {
                ...state.cv.thongTinCaNhan,
                ...cvNguon.thongTinCaNhan,
                iconLienHe: {
                  ...state.cv.thongTinCaNhan.iconLienHe,
                  ...(cvNguon.thongTinCaNhan.iconLienHe || {}),
                },
              }
            : state.cv.thongTinCaNhan,
          gioiThieu: gioiThieuMoi,
          kinhNghiem: kinhNghiemMoi,
          hocVan: hocVanMoi,
          kyNang: kyNangMoi,
          duAn: duAnMoi,
          chungChi: chungChiMoi,
          khoiTuyChinh: khoiTuyChinhMoi,
          anHienKhoi: anHienKhoiMoi,
          thuTuKhoi: danhSachKhoiDayDu,
          boCuc: {
            cheDo: cheDoDich,
            cotTrai: synced.cotTrai,
            cotGiua: synced.cotGiua,
            cotPhai: synced.cotPhai,
            tiLe: danhSachCotMoi.map((c) => c.doRong).join('-'),
            danhSachCot: danhSachCotMoi,
          },
        },
      };
    }),

  // Áp dụng mẫu giao diện mới nhưng giữ nguyên nội dung CV đang có và tự đặt đúng vị trí
  apDungMauCV: (mauId, giuNguyenNoiDung = true) =>
    set((state) => {
      const CAU_HINH_MAU: Record<
        string,
        { mauChuDao: string; fontChu: string; cheDo: CheDoBoCuc; hinhNen?: string }
      > = {
        'mau-hien-dai': {
          mauChuDao: '#1a91f0',
          fontChu: 'Inter, sans-serif',
          cheDo: '2-cot',
          hinhNen: 'trang-tron',
        },
        'mau-toi-gian': {
          mauChuDao: '#1e2532',
          fontChu: 'Inter, sans-serif',
          cheDo: '1-cot',
          hinhNen: 'trang-tron',
        },
        'mau-chuyen-nghiep': {
          mauChuDao: '#0d9488',
          fontChu: 'Roboto, sans-serif',
          cheDo: '2-cot',
          hinhNen: 'vien-khung-sang',
        },
        'mau-sang-tao': {
          mauChuDao: '#5660e8',
          fontChu: 'Montserrat, sans-serif',
          cheDo: '2-cot-deu',
          hinhNen: 'gradient-tim-lavender',
        },
        'mau-3-cot': {
          mauChuDao: '#e11d48',
          fontChu: 'Inter, sans-serif',
          cheDo: '3-cot',
          hinhNen: 'goc-hinh-hoc',
        },
        'mau-co-dien': {
          mauChuDao: '#1e40af',
          fontChu: 'Merriweather, serif',
          cheDo: '1-cot',
          hinhNen: 'gradient-xanh-suong',
        },
      };

      const config = CAU_HINH_MAU[mauId] || {
        mauChuDao: '#1a91f0',
        fontChu: 'Inter, sans-serif',
        cheDo: '2-cot',
        hinhNen: 'trang-tron',
      };

      const baseCV = giuNguyenNoiDung ? state.cv : DU_LIEU_MAC_DINH;
      const thuTuKhoi = baseCV.thuTuKhoi || DU_LIEU_MAC_DINH.thuTuKhoi;
      const boCucMoi = chuanHoaBoCuc({ cheDo: config.cheDo }, thuTuKhoi);

      return {
        mauCVHienTai: mauId,
        cv: {
          ...baseCV,
          dinhDang: {
            ...baseCV.dinhDang,
            mauChuDao: config.mauChuDao,
            fontChu: config.fontChu,
            cheDoBoCuc: config.cheDo,
            ...(config.hinhNen ? { hinhNen: config.hinhNen } : {}),
          },
          boCuc: boCucMoi,
        },
      };
    }),

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

      const khoiTuyChinh = Array.isArray(noiDung.khoiTuyChinh)
        ? noiDung.khoiTuyChinh
        : [];
      for (const ktc of khoiTuyChinh) {
        if (ktc?.id && !thuTuKhoi.includes(ktc.id)) {
          thuTuKhoi.push(ktc.id);
        }
      }

      const boCucRaw = noiDung.boCuc || cvBackend.bo_cuc || null;
      const boCucChuan = chuanHoaBoCuc(boCucRaw, thuTuKhoi);

      const anHienKhoi = {
        ...DU_LIEU_MAC_DINH.anHienKhoi,
        ...(noiDung.anHienKhoi || {}),
      };
      for (const ktc of khoiTuyChinh) {
        if (ktc?.id && anHienKhoi[ktc.id] === undefined) {
          anHienKhoi[ktc.id] = true;
        }
      }

      const maChuCV =
        cvBackend.ma_nguoi_dung ?? cvBackend.nguoi_dung?.id ?? null;
      const tenChuCV =
        cvBackend.nguoi_dung?.ho_ten ||
        noiDung.thongTinCaNhan?.hoTen ||
        'Ứng viên';

      return {
        idCVHienTai: cvBackend.id ?? null,
        maNguoiSoHuuCV: maChuCV !== null ? Number(maChuCV) : null,
        tenNguoiSoHuuCV: tenChuCV,
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

// Tự động khôi phục & đồng bộ bản CV đang thiết kế vào sessionStorage để khi F5 không bị mất trạng thái
const ACTIVE_CV_SESSION_KEY = 'cvify_active_cv_state_v1';
try {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('shareId')) {
    const rawSaved = sessionStorage.getItem(ACTIVE_CV_SESSION_KEY);
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && parsed.cv) {
        useKhoLuuTruCV.setState({
          cv: parsed.cv,
          idCVHienTai: parsed.idCVHienTai ?? null,
          maNguoiSoHuuCV: parsed.maNguoiSoHuuCV ?? null,
          tenNguoiSoHuuCV: parsed.tenNguoiSoHuuCV ?? '',
          tieuDeCVHienTai: parsed.tieuDeCVHienTai || 'CV Chưa Đặt Tên',
        });
      }
    }
  }
} catch {
  // Bỏ qua nếu sessionStorage trống hoặc lỗi
}

useKhoLuuTruCV.subscribe((state) => {
  try {
    sessionStorage.setItem(
      ACTIVE_CV_SESSION_KEY,
      JSON.stringify({
        cv: state.cv,
        idCVHienTai: state.idCVHienTai,
        maNguoiSoHuuCV: state.maNguoiSoHuuCV,
        tenNguoiSoHuuCV: state.tenNguoiSoHuuCV,
        tieuDeCVHienTai: state.tieuDeCVHienTai,
      })
    );
  } catch {
    // Bỏ qua nếu vượt dung lượng sessionStorage
  }
});

export default useKhoLuuTruCV;
