// client/src/utils/boSoKhopJD.ts
import type { ThongTinCV } from '../types/cv';

export interface CauHoiPhongVan {
  id: string;
  nhom: 'chuyen-mon' | 'ky-nang-thieu' | 'tinh-huong' | 'vi-tri';
  nhanNhom: string;
  cauHoi: string;
  goiYTraLoi: string;
  tuKhoaLienQuan?: string;
}

export interface KetQuaSoKhopJD {
  tongDiem: number; // 0 - 100%
  xepLoai: {
    nhan: string;
    mauSac: string;
    moTa: string;
  };
  chiTiet: {
    viTri: {
      diem: number;
      toiDa: number;
      viTriCV: string;
      viTriJD: string;
      khopNhau: boolean;
      nhanXet: string;
    };
    kyNang: {
      diem: number;
      toiDa: number;
      kyNangKhop: string[];
      kyNangThieu: string[];
      tiLe: number; // %
    };
    kinhNghiem: {
      diem: number;
      toiDa: number;
      soNamYeuCau: string;
      soNamCV: string;
      datYeuCau: boolean;
      nhanXet: string;
    };
    hocVanVaChungChi: {
      diem: number;
      toiDa: number;
      hocVanKhop: boolean;
      chungChiKhop: string[];
      chungChiThieu: string[];
      nhanXet: string;
    };
  };
  loiKhuyenToiUu: Array<{
    loai: 'khan-cap' | 'can-thiet' | 'nen-co';
    noiDung: string;
    hanhDong?: {
      kieu: 'them-ky-nang' | 'doi-vi-tri' | 'them-chung-chi';
      duLieu: string | string[];
      nhanNut: string;
    };
  }>;
  cauHoiPhongVan: CauHoiPhongVan[];
}

// Bảng danh mục từ khóa kỹ năng chuẩn hóa (bao gồm các alias viết tắt)
const TU_KHOA_KY_NANG_PHO_BIEN: Record<string, string[]> = {
  // IT - Frontend
  React: ['react', 'reactjs', 'react.js'],
  TypeScript: ['typescript', 'ts'],
  JavaScript: ['javascript', 'js', 'es6'],
  HTML5: ['html', 'html5'],
  CSS3: ['css', 'css3'],
  'Tailwind CSS': ['tailwind', 'tailwindcss', 'tailwind css'],
  'Next.js': ['nextjs', 'next.js', 'next'],
  VueJS: ['vue', 'vuejs', 'vue.js'],
  Redux: ['redux', 'redux toolkit', 'rtk'],
  Bootstrap: ['bootstrap'],

  // IT - Backend / DB / DevOps
  'Node.js': ['node', 'nodejs', 'node.js'],
  ExpressJS: ['express', 'expressjs', 'express.js'],
  NestJS: ['nestjs', 'nest.js'],
  Python: ['python', 'django', 'fastapi', 'flask'],
  Java: ['java', 'spring', 'spring boot'],
  PHP: ['php', 'laravel'],
  '.NET': ['.net', 'c#', 'dotnet', 'asp.net'],
  MySQL: ['mysql', 'sql'],
  PostgreSQL: ['postgresql', 'postgres'],
  MongoDB: ['mongodb', 'mongo'],
  Redis: ['redis'],
  Docker: ['docker'],
  Kubernetes: ['kubernetes', 'k8s'],
  AWS: ['aws', 'amazon web services'],
  Git: ['git', 'github', 'gitlab'],
  'RESTful API': ['rest', 'restful', 'rest api', 'restful api', 'api'],
  GraphQL: ['graphql'],
  CI_CD: ['ci/cd', 'cicd'],
  Agile_Scrum: ['agile', 'scrum'],

  // Marketing & Truyền thông
  SEO: ['seo', 'search engine optimization', 'onpage', 'offpage'],
  'Google Ads': ['google ads', 'adwords'],
  'Facebook Ads': ['facebook ads', 'fb ads', 'meta ads'],
  'TikTok Ads': ['tiktok ads'],
  'Content Marketing': ['content', 'content marketing', 'copywriting', 'viết bài'],
  'Google Analytics': ['google analytics', 'ga4', 'analytics'],
  Canva: ['canva', 'photoshop', 'illustrator'],
  'Email Marketing': ['email marketing', 'mailchimp'],

  // Kinh doanh / Sales
  Sales_B2B: ['b2b', 'sales b2b', 'khách hàng doanh nghiệp'],
  Sales_B2C: ['b2c', 'bán lẻ'],
  'Đàm phán': ['đàm phán', 'thương lượng', 'negotiation'],
  'Chốt Sales': ['chốt sales', 'chốt hợp đồng', 'closing sales'],
  CRM: ['crm', 'hubspot', 'salesforce', 'zoho'],
  Telesales: ['telesales', 'telemarketing', 'gọi điện'],

  // Kế toán & Tài chính
  MISA: ['misa', 'phần mềm misa'],
  FAST: ['fast', 'phần mềm fast'],
  'Báo cáo tài chính': ['báo cáo tài chính', 'bctc', 'financial statement'],
  'Kê khai thuế': ['kê khai thuế', 'quyết toán thuế', 'thuế gtgt', 'thuế tndn', 'thuế tncn'],
  Excel_Nang_Cao: ['excel nâng cao', 'vlookup', 'pivot table', 'hàm excel', 'ms excel', 'excel'],
  VAS_IFRS: ['vas', 'ifrs', 'chuẩn mực kế toán'],

  // Kỹ năng mềm & Nhân sự
  'Giao tiếp tốt': ['giao tiếp', 'communication'],
  'Làm việc nhóm': ['teamwork', 'làm việc nhóm'],
  'Tiếng Anh': ['tiếng anh', 'english', 'toeic', 'ielts'],
  'Quản lý thời gian': ['quản lý thời gian', 'time management'],
  'Giải quyết vấn đề': ['giải quyết vấn đề', 'problem solving'],
  'Tuyển dụng': ['tuyển dụng', 'recruitment', 'headhunt', 'sourcing'],
  'Luật Lao động': ['luật lao động', 'bảo hiểm xã hội', 'bhxh', 'c&b'],
};

// Mẫu tin tuyển dụng (JD) thực tế phổ biến để thử nghiệm nhanh 1-click
export const CAC_MAU_TIN_TUYEN_DUNG: Record<
  string,
  {
    tenViTri: string;
    congTy: string;
    nganhNghe: string;
    noiDungJD: string;
  }
> = {
  frontend_dev: {
    tenViTri: 'Lập Trình Viên Frontend (ReactJS / TypeScript)',
    congTy: 'Tập đoàn Công nghệ FPT Software',
    nganhNghe: 'Công Nghệ Thông Tin / IT Software',
    noiDungJD: `VỊ TRÍ: FRONTEND DEVELOPER (REACTJS & TYPESCRIPT)
Địa điểm làm việc: TP. Hồ Chí Minh / Hà Nội (Hybrid)
Mức lương: 15,000,000 - 25,000,000 VNĐ

MÔ TẢ CÔNG VIỆC:
- Tham gia phát triển và tối ưu giao diện các ứng dụng Web quy mô lớn bằng ReactJS và TypeScript.
- Phối hợp với đội ngũ Backend để tích hợp RESTful API và xử lý dữ liệu bất đồng bộ.
- Xây dựng giao diện Responsive chuẩn UI/UX, hỗ trợ đa trình duyệt với Tailwind CSS.
- Tối ưu hóa tốc độ tải trang (Page Load Performance) và SEO cơ bản.
- Tham gia các buổi họp Agile/Scrum, review code và đề xuất giải pháp kỹ thuật.

YÊU CẦU CÔNG VIỆC:
- Có từ 1 - 3 năm kinh nghiệm lập trình Web Frontend với ReactJS, TypeScript và JavaScript (ES6+).
- Nắm vững HTML5, CSS3, Tailwind CSS hoặc các UI Framework hiện đại.
- Thành thạo sử dụng Git (GitHub/GitLab) và quy trình làm việc nhánh Git Flow.
- Có kinh nghiệm làm việc với State Management (Redux Toolkit hoặc Zustand).
- Khả năng đọc hiểu tài liệu kỹ thuật bằng Tiếng Anh (TOEIC 550+ hoặc tương đương là lợi thế).
- Tinh thần làm việc nhóm tốt, chủ động giải quyết vấn đề và có tư duy học hỏi nhanh.

QUYỀN LỢI ĐƯỢC HƯỞNG:
- Lương tháng 13 + thưởng hiệu quả dự án hàng quý.
- Được cấp Macbook Pro hoặc máy tính cấu hình cao.
- Bảo hiểm sức khỏe FPT Care toàn diện cho cá nhân và người thân.`,
  },

  fullstack_dev: {
    tenViTri: 'Kỹ Sư Fullstack Developer (Node.js & ReactJS)',
    congTy: 'KMS Technology Vietnam',
    nganhNghe: 'Công Nghệ Thông Tin / Web Fullstack',
    noiDungJD: `VỊ TRÍ TUYỂN DỤNG: SENIOR FULLSTACK DEVELOPER (NODE.JS & REACT)
Mức lương: 22,000,000 - 35,000,000 VNĐ
Hình thức: Toàn thời gian

MÔ TẢ CÔNG VIỆC:
- Thiết kế kiến trúc và phát triển hệ thống Web Platform từ Frontend đến Backend.
- Xây dựng Microservices và RESTful API bảo mật, hiệu năng cao bằng Node.js (ExpressJS hoặc NestJS).
- Thiết kế và tối ưu cơ sở dữ liệu quan hệ (MySQL, PostgreSQL) và NoSQL (MongoDB, Redis).
- Triển khai và vận hành hệ thống trên nền tảng đám mây AWS hoặc Docker Container.

YÊU CẦU ỨNG VIÊN:
- Tốt nghiệp Đại học chuyên ngành Công nghệ thông tin, Khoa học máy tính hoặc tương đương.
- Tối thiểu 2 - 4 năm kinh nghiệm thực chiến với Node.js và ReactJS/TypeScript.
- Thành thạo CSDL MySQL / PostgreSQL, có khả năng viết và tối ưu câu lệnh truy vấn phức tạp.
- Hiểu biết về CI/CD, Docker và triển khai ứng dụng trên đám mây (AWS / GCP).
- Có kỹ năng giải quyết vấn đề tốt, khả năng làm việc độc lập và phối hợp nhóm hiệu quả.
- Tiếng Anh giao tiếp và làm việc tốt với khách hàng quốc tế.`,
  },

  ke_toan: {
    tenViTri: 'Chuyên Viên Kế Toán Tổng Hợp',
    congTy: 'Công ty Cổ phần Thương mại & Dịch vụ Tân Phong',
    nganhNghe: 'Kế Toán / Kiểm Toán / Tài Chính',
    noiDungJD: `VỊ TRÍ: KẾ TOÁN TỔNG HỢP (FULLTIME)
Địa điểm: Quận 1, TP. Hồ Chí Minh
Mức lương: 12,000,000 - 18,000,000 VNĐ

MÔ TẢ CÔNG VIỆC:
- Kiểm tra, đối chiếu số liệu các phòng ban, kiểm soát tính hợp lệ của chứng từ kế toán.
- Thực hiện lập Báo cáo tài chính (BCTC) quý, năm theo chuẩn mực kế toán VAS.
- Kê khai thuế định kỳ (Thuế GTGT, Thuế TNCN, Thuế TNDN) và làm việc với cơ quan thuế khi quyết toán.
- Theo dõi công nợ khách hàng và nhà cung cấp, kiểm soát dòng tiền nội bộ.

YÊU CẦU ỨNG VIÊN:
- Tốt nghiệp Đại học / Cao đẳng chuyên ngành Kế toán, Kiểm toán hoặc Tài chính doanh nghiệp.
- Từ 2 năm kinh nghiệm làm việc ở vị trí Kế toán tổng hợp hoặc kế toán nội bộ.
- Sử dụng thành thạo phần mềm kế toán MISA hoặc FAST.
- Kỹ năng Excel nâng cao (Vlookup, Pivot Table, hàm xử lý dữ liệu lớn).
- Cẩn thận, tỉ mỉ, trung thực, có tinh thần trách nhiệm cao và chịu được áp lực công việc.`,
  },

  digital_marketing: {
    tenViTri: 'Chuyên Viên Digital Marketing & Growth',
    congTy: 'VNG Corporation - Khối ZaloPay',
    nganhNghe: 'Marketing / Truyền Thông / Quảng Cáo',
    noiDungJD: `VỊ TRÍ TUYỂN DỤNG: DIGITAL MARKETING SPECIALIST
Mức lương: 14,000,000 - 22,000,000 VNĐ

MÔ TẢ CÔNG VIỆC:
- Lên kế hoạch và trực tiếp vận hành các chiến dịch quảng cáo trả phí (Facebook Ads, Google Ads, TikTok Ads).
- Tối ưu hóa chi phí quảng cáo (CPA, CPL, ROI) và đo lường chuyển đổi qua Google Analytics 4 (GA4).
- Phối hợp với đội ngũ Content Marketing và Designer để sản xuất bài viết, hình ảnh, video thu hút.
- Triển khai chiến dịch SEO Onpage/Offpage và Email Marketing nuôi dưỡng khách hàng tiềm năng.

YÊU CẦU ỨNG VIÊN:
- Có từ 1 - 3 năm kinh nghiệm trong lĩnh vực Digital Marketing, Performance Marketing.
- Nắm vững cơ chế vận hành của Facebook Ads, Google Ads và các công cụ đo lường (GA4, Data Studio).
- Có tư duy phân tích số liệu, nhạy bén với xu hướng thị trường và người dùng.
- Kỹ năng viết Content và sử dụng công cụ thiết kế cơ bản (Canva / Photoshop).
- Kỹ năng giao tiếp và làm việc nhóm tốt, năng động, sáng tạo.`,
  },

  nhan_vien_sales: {
    tenViTri: 'Chuyên Viên Tư Vấn Kinh Doanh B2B (Sales Executive)',
    congTy: 'Tập đoàn Giải pháp Doanh nghiệp NextTech',
    nganhNghe: 'Kinh Doanh / Bán Hàng / Khách Hàng Doanh Nghiệp',
    noiDungJD: `VỊ TRÍ: CHUYÊN VIÊN KINH DOANH B2B (SALES EXECUTIVE)
Thu nhập: Lương cứng 9,000,000 - 15,000,000 + Hoa hồng doanh số (Thu nhập 20M - 40M+)

MÔ TẢ CÔNG VIỆC:
- Tìm kiếm, tiếp cận và xây dựng mối quan hệ với các khách hàng doanh nghiệp (B2B).
- Tư vấn giải pháp phần mềm quản trị doanh nghiệp và chuyển đổi số.
- Đàm phán, thương lượng các điều khoản hợp đồng và xúc tiến chốt sales thành công.
- Quản lý và cập nhật tiến độ chăm sóc khách hàng trên hệ thống phần mềm CRM.
- Phối hợp chăm sóc khách hàng sau bán để thúc đẩy gia hạn và mua thêm dịch vụ.

YÊU CẦU ỨNG VIÊN:
- Tốt nghiệp Cao đẳng/Đại học khối ngành Kinh tế, Quản trị kinh doanh, Thương mại hoặc CNTT.
- Có từ 1 năm kinh nghiệm làm Sales B2B, Telesales hoặc tư vấn dịch vụ doanh nghiệp.
- Kỹ năng giao tiếp, thuyết phục và đàm phán tốt; phong thái tự tin, chuyên nghiệp.
- Đam mê kinh doanh, hướng tới kết quả và mục tiêu doanh số (KPI).
- Có kinh nghiệm sử dụng các công cụ CRM hoặc LinkedIn Sales là lợi thế lớn.`,
  },
};

/**
 * Trình phân tích & So khớp CV với Tin tuyển dụng thông minh
 */
export function phanTichSoKhopCVVoiJD(
  cv: ThongTinCV,
  noiDungJD: string
): KetQuaSoKhopJD {
  const jdText = noiDungJD || '';
  const jdLower = jdText.toLowerCase();

  // 1. Trích xuất toàn bộ văn bản của ứng viên từ CV
  const viTriCV = (cv.thongTinCaNhan.viTriUngTuyen || '').trim();
  const dsKyNangCV = (cv.kyNang || []).map((k) => k.ten.trim());
  const dsKyNangCVLower = dsKyNangCV.map((k) => k.toLowerCase());

  const kinhNghiemText = (cv.kinhNghiem || [])
    .map((kn) => `${kn.viTri} ${kn.congTy} ${kn.moTa}`)
    .join(' ')
    .toLowerCase();

  const hocVanText = (cv.hocVan || [])
    .map((hv) => `${hv.truong} ${hv.chuyenNganh} ${hv.diemSo}`)
    .join(' ')
    .toLowerCase();

  const duAnText = (cv.duAn || [])
    .map((da) => `${da.ten} ${da.vaiTro} ${da.congNghe} ${da.moTa}`)
    .join(' ')
    .toLowerCase();

  const chungChiText = (cv.chungChi || [])
    .map((cc) => `${cc.ten} ${cc.toChuc}`)
    .join(' ')
    .toLowerCase();

  const toanBoCVText = `${viTriCV} ${cv.gioiThieu || ''} ${kinhNghiemText} ${hocVanText} ${duAnText} ${chungChiText}`.toLowerCase();

  // =========================================================================
  // TIÊU CHÍ 1: SO KHỚP CHỨC DANH / VỊ TRÍ ỨNG TUYỂN (Tối đa 20 điểm)
  // =========================================================================
  let viTriJD = '';
  const matchViTri = jdText.match(
    /(?:VỊ TRÍ|VỊ TRÍ TUYỂN DỤNG|TUYỂN DỤNG|JOB TITLE|POSITION)[\s:]*([^\r\n]+)/i
  );
  if (matchViTri) {
    viTriJD = matchViTri[1].replace(/\([^)]*\)/g, '').trim();
  } else {
    // Lấy dòng đầu tiên có vẻ là chức danh
    const firstLine = jdText.split(/\r?\n/).find((l) => l.trim().length > 3) || '';
    viTriJD = firstLine.slice(0, 60).trim();
  }

  const viTriCVWords = viTriCV
    .toLowerCase()
    .split(/[\s/,-]+/)
    .filter((w) => w.length > 2);
  const viTriJDWords = viTriJD
    .toLowerCase()
    .split(/[\s/,-]+/)
    .filter((w) => w.length > 2);

  let soTuKhop = 0;
  for (const w of viTriCVWords) {
    if (viTriJDWords.some((jw) => jw.includes(w) || w.includes(jw))) {
      soTuKhop++;
    }
  }

  const tiLeKhopViTri =
    viTriJDWords.length > 0 ? soTuKhop / Math.min(viTriJDWords.length, 4) : 0.5;
  const diemViTri = Math.min(20, Math.round(tiLeKhopViTri * 20));
  const khopViTri = diemViTri >= 12;

  // =========================================================================
  // TIÊU CHÍ 2: TỪ KHÓA & KỸ NĂNG CHUYÊN MÔN (Tối đa 45 điểm)
  // =========================================================================
  const kyNangJDYeuCau: string[] = [];

  for (const [tenChuan, aliases] of Object.entries(TU_KHOA_KY_NANG_PHO_BIEN)) {
    const coTrongJD = aliases.some((a) => {
      const regex = new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i');
      return regex.test(jdLower);
    });

    if (coTrongJD) {
      kyNangJDYeuCau.push(tenChuan);
    }
  }

  // Nếu không nhận diện được qua từ điển, quét các từ khóa sau gạch đầu dòng trong phần Yêu Cầu
  if (kyNangJDYeuCau.length < 3) {
    const lines = jdText.split(/\r?\n/);
    let inReqSection = false;
    for (const l of lines) {
      if (/(?:YÊU CẦU|REQUIREMENTS|SKILLS)/i.test(l)) {
        inReqSection = true;
        continue;
      }
      if (inReqSection && /(?:QUYỀN LỢI|BENEFITS|ĐỊA ĐIỂM)/i.test(l)) {
        break;
      }
      if (inReqSection && /^[-*•+]\s*/.test(l)) {
        const item = l.replace(/^[-*•+]\s*/, '').slice(0, 30).trim();
        if (item.length > 3 && !kyNangJDYeuCau.includes(item)) {
          kyNangJDYeuCau.push(item);
        }
      }
    }
  }

  const kyNangKhop: string[] = [];
  const kyNangThieu: string[] = [];

  for (const kn of kyNangJDYeuCau) {
    const aliases = TU_KHOA_KY_NANG_PHO_BIEN[kn] || [kn.toLowerCase()];

    // Kiểm tra xem ứng viên có kỹ năng này trong danh sách kỹ năng hoặc trong toàn bộ CV không
    const daCoTrongCV = aliases.some((a) => {
      const regex = new RegExp(`\\b${escapeRegExp(a)}\\b`, 'i');
      const coTrongDanhSach = dsKyNangCVLower.some((c) => c.includes(a) || a.includes(c));
      const coTrongNoiDung = regex.test(toanBoCVText);
      return coTrongDanhSach || coTrongNoiDung;
    });

    if (daCoTrongCV) {
      kyNangKhop.push(kn);
    } else {
      kyNangThieu.push(kn);
    }
  }

  const tongSoYeuCau = Math.max(1, kyNangJDYeuCau.length);
  const tiLeKhopKN = kyNangKhop.length / tongSoYeuCau;
  const diemKyNang = Math.min(45, Math.round(tiLeKhopKN * 45));

  // =========================================================================
  // TIÊU CHÍ 3: KINH NGHIỆM LÀM VIỆC & DỰ ÁN (Tối đa 20 điểm)
  // =========================================================================
  let soNamYeuCau = '1-2 năm';
  const matchExp = jdText.match(
    /(?:có\s*từ|tối\s*thiểu|từ)?\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:năm|\+|years)\s*kinh\s*nghiệm/i
  );
  if (matchExp) {
    soNamYeuCau = matchExp[2]
      ? `${matchExp[1]} - ${matchExp[2]} năm`
      : `${matchExp[1]}+ năm`;
  } else if (/fresher|mới tốt nghiệp|không yêu cầu kinh nghiệm/i.test(jdLower)) {
    soNamYeuCau = 'Không yêu cầu (Fresher/Intern)';
  }

  const soCongViecCV = cv.kinhNghiem?.length || 0;
  const soDuAnCV = cv.duAn?.length || 0;
  const soNamCV =
    soCongViecCV >= 3
      ? 'Hơn 3 năm'
      : soCongViecCV === 2
      ? 'Khoảng 1 - 2 năm'
      : soCongViecCV === 1
      ? 'Dưới 1 năm / Mới tốt nghiệp'
      : 'Chưa có mục Kinh nghiệm';

  let diemKN = 12;
  if (soCongViecCV >= 2) diemKN += 5;
  if (soDuAnCV >= 1) diemKN += 3;
  const diemKinhNghiem = Math.min(20, diemKN);
  const datKinhNghiem = soCongViecCV >= 1 || soDuAnCV >= 1;

  // =========================================================================
  // TIÊU CHÍ 4: HỌC VẤN & BẰNG CẤP / CHỨNG CHỈ (Tối đa 15 điểm)
  // =========================================================================
  const yeuCauDaiHoc = /(?:đại học|cao đẳng|cử nhân|kỹ sư|university|college|bằng cấp)/i.test(
    jdLower
  );
  const hocVanKhop = (cv.hocVan?.length || 0) > 0 || !yeuCauDaiHoc;

  let diemHV = 0;
  if ((cv.hocVan?.length || 0) > 0) diemHV += 9;
  if ((cv.chungChi?.length || 0) > 0) diemHV += 6;
  const diemHocVan = Math.min(15, diemHV);

  // Chứng chỉ liên quan trong JD
  const chungChiKhop: string[] = [];
  const chungChiThieu: string[] = [];

  const LIST_CERT = ['TOEIC', 'IELTS', 'AWS', 'PMP', 'Scrum Master', 'CPA', 'ACCA'];
  for (const cert of LIST_CERT) {
    if (new RegExp(`\\b${cert}\\b`, 'i').test(jdLower)) {
      if (new RegExp(`\\b${cert}\\b`, 'i').test(toanBoCVText)) {
        chungChiKhop.push(cert);
      } else {
        chungChiThieu.push(cert);
      }
    }
  }

  // =========================================================================
  // TÍNH TỔNG ĐIỂM & XẾP HẠNG
  // =========================================================================
  const tongDiem = Math.min(
    100,
    Math.max(25, diemViTri + diemKyNang + diemKinhNghiem + diemHocVan)
  );

  let xepLoai = {
    nhan: 'Phù Hợp Rất Cao (Xuất Sắc)',
    mauSac: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    moTa: 'Hồ sơ của bạn đáp ứng xuất sắc các tiêu chí tuyển dụng. Cơ hội nhận được lời mời phỏng vấn là rất cao!',
  };

  if (tongDiem < 55) {
    xepLoai = {
      nhan: 'Độ Phù Hợp Thấp - Cần Tối Ưu',
      mauSac: 'text-rose-600 bg-rose-50 border-rose-200',
      moTa: 'Hồ sơ còn thiếu nhiều từ khóa cốt lõi của tin tuyển dụng này. Nên bổ sung thêm kỹ năng để vượt qua bộ lọc ATS.',
    };
  } else if (tongDiem < 75) {
    xepLoai = {
      nhan: 'Phù Hợp Khá - Cần Bổ Sung Thêm',
      mauSac: 'text-amber-600 bg-amber-50 border-amber-200',
      moTa: 'CV đã có nền tảng tốt nhưng vẫn còn thiếu một vài kỹ năng quan trọng mà JD yêu cầu.',
    };
  }

  // =========================================================================
  // XÂY DỰNG DANH SÁCH LỜI KHUYÊN & HÀNH ĐỘNG 1-CLICK TỐI ƯU
  // =========================================================================
  const loiKhuyenToiUu: KetQuaSoKhopJD['loiKhuyenToiUu'] = [];

  // 1. Lời khuyên về Tiêu đề Vị trí
  if (!khopViTri && viTriJD) {
    loiKhuyenToiUu.push({
      loai: 'can-thiet',
      noiDung: `Tiêu đề vị trí trong CV của bạn hiện là "${viTriCV || 'Chưa đặt'}", trong khi tin tuyển dụng đang tìm "${viTriJD}". Việc điều chỉnh tiêu đề sẽ giúp hệ thống ATS xếp hạng bạn ở nhóm đầu danh sách.`,
      hanhDong: {
        kieu: 'doi-vi-tri',
        duLieu: viTriJD,
        nhanNut: `Đổi tiêu đề thành "${viTriJD.slice(0, 24)}..."`,
      },
    });
  }

  // 2. Lời khuyên về Kỹ năng còn thiếu
  if (kyNangThieu.length > 0) {
    loiKhuyenToiUu.push({
      loai: 'khan-cap',
      noiDung: `CV của bạn đang thiếu ${kyNangThieu.length} từ khóa kỹ năng quan trọng được đề cập trong JD: ${kyNangThieu.join(', ')}. Hãy nhấn nút bên dưới để tự động bổ sung vào CV.`,
      hanhDong: {
        kieu: 'them-ky-nang',
        duLieu: kyNangThieu,
        nhanNut: `+ Thêm ${kyNangThieu.length} kỹ năng còn thiếu vào CV`,
      },
    });
  }

  // 3. Lời khuyên về Chứng chỉ
  if (chungChiThieu.length > 0) {
    loiKhuyenToiUu.push({
      loai: 'can-thiet',
      noiDung: `Tin tuyển dụng có nhắc đến chứng chỉ ${chungChiThieu.join(', ')}. Nếu bạn đã sở hữu chứng chỉ này, hãy thêm ngay vào mục "Chứng chỉ & Giải thưởng".`,
    });
  }

  // 4. Lời khuyên về Số liệu định lượng trong Kinh nghiệm
  const coSoLieuDinhLuong = /\d+[%kKmM+]|\b\d+\s*(?:người|dự án|khách hàng|giao dịch)\b/.test(
    kinhNghiemText
  );
  if (!coSoLieuDinhLuong && soCongViecCV > 0) {
    loiKhuyenToiUu.push({
      loai: 'nen-co',
      noiDung:
        'Nên bổ sung các số liệu định lượng (ví dụ: tăng 30% doanh thu, giảm 40% thời gian xử lý, quản lý nhóm 5 người) trong mô hình STAR để chứng minh năng lực thực tế.',
    });
  }

  const cauHoiPhongVan = sinhCauHoiPhongVanTheoJD({
    jdText,
    jdLower,
    viTriJD: viTriJD || 'vị trí ứng tuyển',
    kyNangKhop,
    kyNangThieu,
    soNamYeuCau,
  });

  return {
    tongDiem,
    xepLoai,
    chiTiet: {
      viTri: {
        diem: diemViTri,
        toiDa: 20,
        viTriCV: viTriCV || 'Chưa thiết lập',
        viTriJD: viTriJD || 'Không xác định được',
        khopNhau: khopViTri,
        nhanXet: khopViTri
          ? 'Tiêu đề vị trí ứng tuyển khớp chuẩn với tin tuyển dụng.'
          : 'Tiêu đề vị trí ứng tuyển chưa hoàn toàn trùng khớp với tin tuyển dụng.',
      },
      kyNang: {
        diem: diemKyNang,
        toiDa: 45,
        kyNangKhop,
        kyNangThieu,
        tiLe: Math.round(tiLeKhopKN * 100),
      },
      kinhNghiem: {
        diem: diemKinhNghiem,
        toiDa: 20,
        soNamYeuCau,
        soNamCV,
        datYeuCau: datKinhNghiem,
        nhanXet: datKinhNghiem
          ? 'Kinh nghiệm và các dự án thực tế của bạn phù hợp với yêu cầu.'
          : 'Nên bổ sung thêm các dự án hoặc kinh nghiệm thực chiến.',
      },
      hocVanVaChungChi: {
        diem: diemHocVan,
        toiDa: 15,
        hocVanKhop,
        chungChiKhop,
        chungChiThieu,
        nhanXet: hocVanKhop
          ? 'Học vấn & bằng cấp đã được trình bày đầy đủ, đáp ứng tiêu chí.'
          : 'Tin tuyển dụng có yêu cầu về bằng cấp, bạn nên kiểm tra lại mục Học vấn.',
      },
    },
    loiKhuyenToiUu,
    cauHoiPhongVan,
  };
}

interface ThamSoSinhCauHoi {
  jdText: string;
  jdLower: string;
  viTriJD: string;
  kyNangKhop: string[];
  kyNangThieu: string[];
  soNamYeuCau: string;
}

const MAU_CAU_HOI_THEO_NGANH: Array<{
  regex: RegExp;
  nganh: string;
  cauHoiChinh: string;
  goiY: string;
}> = [
  {
    regex: /telesales|sales|kinh doanh|bán hàng|tư vấn|chốt đơn|khách hàng tiềm năng|doanh số|kpi/i,
    nganh: 'Kinh doanh / Tư vấn',
    cauHoiChinh:
      'Khi tiếp cận khách hàng tiềm năng hoặc gọi điện tư vấn (Telesales), nếu khách hàng từ chối ngay từ đầu hoặc chê giá cao, bạn sẽ xử lý tình huống đó như thế nào?',
    goiY:
      'Áp dụng quy trình: Lắng nghe & đồng cảm -> Đặt câu hỏi khai thác nhu cầu thật sự -> Chuyển trọng tâm sang giá trị/lợi ích mang lại -> Đề xuất bước hẹn tiếp theo nhẹ nhàng. Nêu thêm tỷ lệ chốt đơn hoặc số liệu thực tế bạn từng đạt.',
  },
  {
    regex: /react|frontend|typescript|javascript|backend|node|fullstack|api|database|sql|lập trình|developer/i,
    nganh: 'Công nghệ thông tin',
    cauHoiChinh:
      'Trong các dự án đã làm, bạn từng gặp vấn đề hiệu năng (tải chậm, re-render thừa, truy vấn DB chậm) hay bug khó nào chưa? Bạn đã debug và tối ưu nó ra sao?',
    goiY:
      'Trình bày theo cấu trúc STAR: Mô tả triệu chứng lỗi/chậm -> Công cụ đo lường (DevTools, Network, Explain SQL) -> Giải pháp kỹ thuật áp dụng (memoization, index, caching...) -> Kết quả cải thiện cụ thể (giảm X% thời gian phản hồi).',
  },
  {
    regex: /marketing|seo|facebook ads|google ads|tiktok|content|ga4|cpa|roi/i,
    nganh: 'Marketing / Truyền thông',
    cauHoiChinh:
      'Nếu được giao ngân sách chạy chiến dịch mới cho công ty, bạn sẽ lập kế hoạch đo lường hiệu quả và tối ưu chi phí chuyển đổi (CPA/ROI) qua những chỉ số nào?',
    goiY:
      'Nhấn mạnh tư duy dựa trên số liệu (Data-driven): Xác định mục tiêu phễu (Awareness -> Lead -> Conversion), theo dõi CTR, CPC, CPL, ROAS và cách A/B Testing mẫu quảng cáo/landing page để cắt giảm lãng phí.',
  },
  {
    regex: /kế toán|kiểm toán|báo cáo tài chính|bctc|thuế|misa|fast|công nợ/i,
    nganh: 'Kế toán / Tài chính',
    cauHoiChinh:
      'Bạn thường kiểm soát tính chính xác của chứng từ và xử lý ra sao khi phát hiện chênh lệch số liệu công nợ hoặc hóa đơn trước kỳ kê khai thuế?',
    goiY:
      'Thể hiện sự cẩn trọng và tuân thủ quy định: Quy trình đối chiếu chéo sổ phụ ngân hàng/hợp đồng -> Khoanh vùng nguyên nhân sai lệch -> Phối hợp các bộ phận xử lý điều chỉnh kịp thời trước hạn nộp BCTC/tờ khai.',
  },
  {
    regex: /tuyển dụng|nhân sự|hr|headhunt|c&b|luật lao động|bhxh/i,
    nganh: 'Nhân sự / Tuyển dụng',
    cauHoiChinh:
      'Với những vị trí khó tuyển hoặc ứng viên cân nhắc từ chối offer vào phút chót, bạn có chiến lược gì để tìm nguồn ứng viên và thuyết phục họ đồng hành?',
    goiY:
      'Chia sẻ cách đa dạng hóa kênh sourcing (LinkedIn, networking, data nội bộ), nghệ thuật đánh giá động lực thật của ứng viên ngoài lương và cách bán giá trị văn hóa/lộ trình phát triển của doanh nghiệp.',
  },
];

const GOI_Y_THEO_KY_NANG: Record<string, { cauHoi: string; goiY: string }> = {
  Telesales: {
    cauHoi:
      'Bạn thường chuẩn bị kịch bản gọi điện (Telesales script) như thế nào để giữ chân người nghe trong 30 giây đầu tiên?',
    goiY:
      'Nhấn mạnh vào mở đầu ngắn gọn, nêu rõ lợi ích thiết thực cho người nghe thay vì đọc kịch bản máy móc, kết hợp giọng điệu tự tin và câu hỏi mở.',
  },
  'Tiếng Anh': {
    cauHoi:
      'Tin tuyển dụng có yêu cầu sử dụng Tiếng Anh. Bạn có thể giới thiệu ngắn gọn bản thân hoặc mô tả một tình huống giao tiếp/đọc tài liệu bằng Tiếng Anh không?',
    goiY:
      'Chuẩn bị sẵn một đoạn giới thiệu bản thân 60 giây bằng Tiếng Anh (kinh nghiệm nổi bật + lý do ứng tuyển) và các từ vựng chuyên ngành cốt lõi trong JD.',
  },
  'Giao tiếp tốt': {
    cauHoi:
      'Hãy kể về một lần bạn phải truyền đạt thông tin phức tạp hoặc thuyết phục một khách hàng/đồng nghiệp khó tính thay đổi quan điểm.',
    goiY:
      'Nêu rõ cách bạn lắng nghe, tóm tắt lại vấn đề của đối phương trước khi đưa ra lập luận dẫn chứng thuyết phục.',
  },
  'Luật Lao động': {
    cauHoi:
      'Bạn nắm các quy định cơ bản nào của Luật Lao động liên quan đến hợp đồng thử việc, thời giờ làm việc và quyền lợi người lao động?',
    goiY:
      'Ôn nhanh các mốc cơ bản trong Bộ luật Lao động 2019 (thời gian thử việc theo trình độ, lương tối thiểu thử việc >= 85%, quy định báo trước khi chấm dứt hợp đồng).',
  },
  CRM: {
    cauHoi:
      'Bạn đã từng quản lý phễu khách hàng (pipeline) trên phần mềm CRM hoặc bảng tính theo dõi tiến độ chăm sóc khách hàng như thế nào?',
    goiY:
      'Mô tả cách phân loại khách hàng (Mới, Đang tư vấn, Tiềm năng cao, Chốt đơn), đặt lịch nhắc follow-up để không bỏ sót cơ hội.',
  },
};

/**
 * Sinh bộ câu hỏi phỏng vấn dự kiến bám sát nội dung mô tả tuyển dụng và lỗ hổng CV
 */
export function sinhCauHoiPhongVanTheoJD({
  jdText,
  jdLower,
  viTriJD,
  kyNangKhop,
  kyNangThieu,
  soNamYeuCau,
}: ThamSoSinhCauHoi): CauHoiPhongVan[] {
  const ketQua: CauHoiPhongVan[] = [];

  // 1. Câu hỏi về vị trí ứng tuyển & động lực
  ketQua.push({
    id: 'pv-vi-tri',
    nhom: 'vi-tri',
    nhanNhom: 'Vị trí & Định hướng',
    cauHoi: `Điều gì ở vị trí "${viTriJD}" khiến bạn quan tâm ứng tuyển, và điểm mạnh nào trong kinh nghiệm của bạn phù hợp nhất với vai trò này?`,
    goiYTraLoi: `Kết nối trực tiếp 2-3 gạch đầu dòng quan trọng nhất trong JD với thành tựu có số liệu trong CV của bạn, đồng thời thể hiện định hướng gắn bó lâu dài.`,
    tuKhoaLienQuan: viTriJD,
  });

  // 2. Câu hỏi chuyên môn theo ngành nghề phát hiện trong JD
  const nganhMatch = MAU_CAU_HOI_THEO_NGANH.find((m) => m.regex.test(jdLower));
  if (nganhMatch) {
    ketQua.push({
      id: 'pv-chuyen-mon-nganh',
      nhom: 'chuyen-mon',
      nhanNhom: `Chuyên môn ${nganhMatch.nganh}`,
      cauHoi: nganhMatch.cauHoiChinh,
      goiYTraLoi: nganhMatch.goiY,
    });
  }

  // 3. Trích xuất đầu việc thực tế từ phần Mô tả công việc của JD để đặt câu hỏi sát sườn
  const dauViecTrongJD = trichXuatDauViecMoTaJD(jdText);
  if (dauViecTrongJD.length > 0) {
    const dauViecTieuBieu = dauViecTrongJD.slice(0, 2).join('; ');
    ketQua.push({
      id: 'pv-mo-ta-cong-viec',
      nhom: 'chuyen-mon',
      nhanNhom: 'Bám sát Mô tả JD',
      cauHoi: `Trong tin tuyển dụng có nhắc đến nhiệm vụ: "${dauViecTieuBieu}". Bạn có thể mô tả quy trình hoặc cách bạn sẽ thực hiện công việc này khi bắt đầu nhận việc?`,
      goiYTraLoi:
        'Chia nhỏ đầu việc thành các bước thực thi cụ thể (Chuẩn bị -> Triển khai -> Báo cáo/Đo lường) và liên hệ với công việc tương tự bạn từng làm.',
    });
  }

  // 4. Câu hỏi kiểm chứng kỹ năng đã có trong CV
  if (kyNangKhop.length > 0) {
    const knChinh = kyNangKhop[0];
    const knHienThi = dinhDangTenKyNang(knChinh);
    const mauKN = GOI_Y_THEO_KY_NANG[knChinh];
    ketQua.push({
      id: 'pv-ky-nang-khop',
      nhom: 'chuyen-mon',
      nhanNhom: `Kiểm chứng: ${knHienThi}`,
      cauHoi:
        mauKN?.cauHoi ||
        `Hồ sơ của bạn thể hiện thế mạnh về "${knHienThi}". Hãy chia sẻ một kết quả nổi bật nhất mà bạn đạt được nhờ áp dụng kỹ năng này?`,
      goiYTraLoi:
        mauKN?.goiY ||
        `Trình bày ngắn gọn bối cảnh áp dụng ${knHienThi}, thao tác cụ thể của bạn và con số kết quả đạt được để nhà tuyển dụng thấy năng lực thực chiến.`,
      tuKhoaLienQuan: knHienThi,
    });
  }

  // 5. Câu hỏi cảnh báo cho kỹ năng JD yêu cầu nhưng CV còn thiếu
  if (kyNangThieu.length > 0) {
    const knThieuChinh = kyNangThieu[0];
    const knThieuHienThi = dinhDangTenKyNang(knThieuChinh);
    const mauThieu = GOI_Y_THEO_KY_NANG[knThieuChinh];
    const danhSachThieuNgan = kyNangThieu
      .slice(0, 3)
      .map(dinhDangTenKyNang)
      .join(', ');
    ketQua.push({
      id: 'pv-ky-nang-thieu',
      nhom: 'ky-nang-thieu',
      nhanNhom: `Cảnh báo thiếu: ${knThieuHienThi}`,
      cauHoi:
        mauThieu?.cauHoi ||
        `Tin tuyển dụng yêu cầu về ${danhSachThieuNgan}, nhưng CV của bạn chưa nêu rõ kinh nghiệm phần này. Bạn đã từng tiếp xúc hoặc có kế hoạch bổ sung kỹ năng này ra sao?`,
      goiYTraLoi:
        mauThieu?.goiY ||
        `Thành thật thừa nhận mức độ hiện tại, liên hệ ngay với kỹ năng/công cụ tương đồng bạn đã thành thạo và cam kết thời gian cụ thể có thể nắm bắt công việc (ví dụ: nắm quy trình trong 1-2 tuần đầu).`,
      tuKhoaLienQuan: knThieuHienThi,
    });
  }

  // 6. Câu hỏi tình huống hành vi dựa theo bối cảnh yêu cầu (áp lực, xoay ca, kinh nghiệm)
  const coXoayCa = /xoay ca|linh động|cuối tuần|chủ nhật/i.test(jdLower);
  const coApLuc = /áp lực|kpi|mục tiêu doanh số|deadline/i.test(jdLower);

  ketQua.push({
    id: 'pv-tinh-huong',
    nhom: 'tinh-huong',
    nhanNhom: 'Tình huống thực tế (STAR)',
    cauHoi: coXoayCa
      ? 'Công việc có yêu cầu làm việc theo ca linh động hoặc làm cuối tuần. Bạn sắp xếp thời gian cá nhân ra sao để đảm bảo hiệu suất ổn định?'
      : coApLuc
      ? 'Khi bị áp lực chỉ tiêu (KPI) hoặc nhiều đầu việc gấp cùng lúc, bạn thường ưu tiên và giải quyết như thế nào để vẫn đảm bảo chất lượng?'
      : `Với yêu cầu kinh nghiệm (${soNamYeuCau}) của vị trí này, đâu là bài học lớn nhất giúp bạn trưởng thành trong công việc trước đây?`,
    goiYTraLoi: coXoayCa
      ? 'Khẳng định sự chủ động, sẵn sàng thích nghi lịch làm việc của đội ngũ và nêu cách quản lý năng lượng cá nhân hiệu quả.'
      : 'Áp dụng mô hình STAR: Nêu tình huống cụ thể, cách phân loại mức độ ưu tiên (khẩn cấp/quan trọng) và kết quả hoàn thành đúng hạn.',
  });

  return ketQua;
}

function trichXuatDauViecMoTaJD(jdText: string): string[] {
  const lines = jdText.split(/\r?\n/);
  const ketQua: string[] = [];
  let dangOMoTa = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/(?:MÔ TẢ CÔNG VIỆC|NHIỆM VỤ|TRÁCH NHIỆM|JOB DESCRIPTION|RESPONSIBILITIES)/i.test(line)) {
      dangOMoTa = true;
      continue;
    }
    if (dangOMoTa && /(?:YÊU CẦU|QUYỀN LỢI|ĐỊA ĐIỂM|THỜI GIAN|REQUIREMENTS|BENEFITS)/i.test(line)) {
      break;
    }

    if (dangOMoTa && /^[-*•+]\s*/.test(line)) {
      const clean = line.replace(/^[-*•+]\s*/, '').replace(/\.$/, '').trim();
      if (clean.length >= 12 && clean.length <= 95) {
        ketQua.push(clean);
      }
    }
  }

  return ketQua;
}

const TEN_KY_NANG_HIEN_THI: Record<string, string> = {
  Sales_B2B: 'Sales B2B',
  Sales_B2C: 'Sales B2C',
  CI_CD: 'CI/CD',
  Agile_Scrum: 'Agile/Scrum',
  Excel_Nang_Cao: 'Excel nâng cao',
  VAS_IFRS: 'VAS/IFRS',
};

function dinhDangTenKyNang(ten: string): string {
  return TEN_KY_NANG_HIEN_THI[ten] || ten.replace(/_/g, ' ');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
