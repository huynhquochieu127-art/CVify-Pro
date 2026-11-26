// client/src/utils/boPhanTichCVTho.ts

export interface DuLieuCVTrinhXuat {
  thongTinCaNhan: {
    hoTen: string;
    viTriUngTuyen: string;
    email: string;
    soDienThoai: string;
    diaChi: string;
    website: string;
  };
  gioiThieu: string;
  kinhNghiem: Array<{
    id: string;
    congTy: string;
    viTri: string;
    thoiGian: string;
    moTa: string;
  }>;
  hocVan: Array<{
    id: string;
    truong: string;
    chuyenNganh: string;
    thoiGian: string;
    diemSo: string;
  }>;
  kyNang: Array<{
    id: string;
    ten: string;
    mucDo?: string;
  }>;
  duAn: Array<{
    id: string;
    ten: string;
    vaiTro: string;
    thoiGian: string;
    congNghe: string;
    moTa: string;
  }>;
  chungChi: Array<{
    id: string;
    ten: string;
    toChuc: string;
    nam: string;
  }>;
}

// Các mẫu CV thực tế tải từ mạng (TopCV, LinkedIn, VietnamWorks) để thử nghiệm 1-click
export const CAC_MAU_CV_NGOAI_THUC_TE: Record<string, { ten: string; rawText: string }> = {
  it_frontend: {
    ten: 'CV Lập Trình Viên Frontend (Từ TopCV)',
    rawText: `LÊ HOÀNG NAM
Senior Fullstack Developer (Node.js & ReactJS)
Email: lehoangnam.dev@gmail.com | Phone: 0918 765 432
Địa chỉ: Quận Bình Thạnh, TP. Hồ Chí Minh
Website: github.com/lehoangnam-dev

GIỚI THIỆU BẢN THÂN
Hơn 4 năm kinh nghiệm phát triển các hệ thống Web và API quy mô lớn với React, TypeScript, Node.js và MongoDB. Đam mê tối ưu hiệu năng và kiến trúc Clean Architecture.

KINH NGHIỆM LÀM VIỆC
Công ty Cổ phần Công nghệ KMS Technology (03/2023 - Hiện tại)
Vị trí: Senior Software Engineer
- Thiết kế hệ thống thanh toán tự động xử lý hơn 100,000 giao dịch/ngày.
- Tối ưu database query giúp giảm 60% thời gian phản hồi API.
- Hướng dẫn và review code cho 4 lập trình viên junior.

Công ty Giải pháp Phần mềm VTI (08/2021 - 02/2023)
Vị trí: Fullstack Developer
- Xây dựng dashboard báo cáo thời gian thực bằng React và Socket.io.
- Triển khai ứng dụng lên AWS EC2 và Docker container.

HỌC VẤN
Trường Đại học Bách Khoa TP.HCM (2017 - 2021)
Chuyên ngành: Khoa học Máy tính
GPA: 3.55 / 4.0 - Tốt nghiệp loại Giỏi

KỸ NĂNG CHUYÊN MÔN
ReactJS, TypeScript, Node.js, Express, Next.js, MySQL, PostgreSQL, Docker, AWS, Git, RESTful API

DỰ ÁN TIÊU BIỂU
Hệ thống Đặt Tour Du Lịch Thông Minh (Smart Travel Platform)
Vai trò: Tech Lead
Công nghệ: ReactJS, NestJS, PostgreSQL, Redis
- Tích hợp cổng thanh toán VNPay và PayPal.

CHỨNG CHỈ & GIẢI THƯỞNG
- Chứng chỉ AWS Certified Solutions Architect Associate (2024)
- Chứng chỉ TOEIC 800 (IIG Việt Nam - 2023)`,
  },
  ke_toan: {
    ten: 'CV Kế Toán / Tài Chính (Từ VietnamWorks)',
    rawText: `TRẦN THU TRANG
Kế toán trưởng / Chuyên viên Phân tích Tài chính
Email: thutrang.tran@gmail.com | SĐT: 0903 123 456
Địa chỉ: Quận 1, TP. Hồ Chí Minh
Website: linkedin.com/in/thutrang-finance

MỤC TIÊU NGHỀ NGHIỆP
Cử nhân Tài chính - Kế toán với hơn 5 năm kinh nghiệm quản lý sổ sách, kiểm toán nội bộ và lập báo cáo tài chính tuân thủ chuẩn mực VAS và IFRS. Mục tiêu trở thành Giám đốc Tài chính (CFO).

KINH NGHIỆM LÀM VIỆC
Công ty TNHH Sản Xuất & Thương Mại Đại Nam (01/2022 - Hiện tại)
Vị trí: Kế toán trưởng
- Chịu trách nhiệm toàn bộ hệ thống kế toán doanh nghiệp doanh thu 120 tỷ/năm.
- Trực tiếp làm việc với cơ quan Thuế và Kiểm toán độc lập Big 4.
- Tối ưu chi phí vận hành doanh nghiệp tiết kiệm 8.5% ngân sách hàng năm.

Công ty Cổ phần Thực phẩm Á Châu (06/2019 - 12/2021)
Vị trí: Kế toán Tổng hợp
- Kiểm soát công nợ, quản lý dòng tiền và đối soát ngân hàng hàng tuần.
- Lập tờ khai thuế GTGT, TNCN, TNDN định kỳ đúng hạn.

HỌC VẤN
Trường Đại học Kinh tế TP.HCM - UEH (2015 - 2019)
Chuyên ngành: Kế toán Doanh nghiệp
GPA: 3.62 / 4.0 - Tốt nghiệp loại Giỏi

KỸ NĂNG CHUYÊN MÔN
Phần mềm MISA, SAP ERP, FAST, Excel VBA nâng cao, Báo cáo tài chính IFRS, Quyết toán thuế

CHỨNG CHỈ & GIẢI THƯỞNG
- Chứng chỉ Kế toán trưởng Doanh nghiệp (Bộ Tài Chính - 2023)
- Chứng chỉ ACCA F1-F4 (2022)`,
  },
  marketing: {
    ten: 'CV Marketing / Truyền Thông (Từ LinkedIn)',
    rawText: `VÕ MINH HOÀNG
Digital Marketing Lead & Brand Strategist
Email: minhhoang.marketing@gmail.com | Điện thoại: 0978 999 888
Địa chỉ: Quận Cầu Giấy, Hà Nội
Website: linkedin.com/in/minhhoang-mkt

GIỚI THIỆU BẢN THÂN
Chuyên gia Digital Marketing với hơn 4 năm kinh nghiệm dẫn dắt các chiến dịch truyền thông đa kênh (Performance Ads, SEO/Content, TikTok/KOL). Từng quản lý ngân sách quảng cáo hơn 2 tỷ/tháng với ROAS trung bình 4.2x.

KINH NGHIỆM LÀM VIỆC
Tập đoàn Truyền thông & Bán lẻ Sun Group (05/2023 - Hiện tại)
Vị trí: Digital Marketing Lead
- Lập kế hoạch và thực thi chiến dịch ra mắt sản phẩm mới đạt hơn 2.5 triệu lượt tiếp cận.
- Quản lý đội ngũ 6 nhân sự gồm Media Buyer, Content Creator và Graphic Designer.

Công ty Cổ phần Công nghệ E-commerce VNP (10/2020 - 04/2023)
Vị trí: Senior Performance Marketer
- Trực tiếp tối ưu chiến dịch Meta Ads và Google Search/Shopping với ngân sách 500 triệu/tháng.
- Giảm chi phí trên mỗi đơn hàng (CPA) 28%.

HỌC VẤN
Trường Đại học Ngoại Thương Hà Nội (2016 - 2020)
Chuyên ngành: Marketing Quốc tế
GPA: 3.45 / 4.0

KỸ NĂNG CHUYÊN MÔN
Facebook Ads, Google Ads, SEO Audit, TikTok Ads, Google Analytics 4, Canva, Data Studio, Copywriting

CHỨNG CHỈ & GIẢI THƯỞNG
- Google Ads Search & Measurement Certification (2024)
- Meta Certified Digital Marketing Associate (2023)`,
  },
};

/**
 * Trình phân tích CV văn bản thô từ bất kỳ nguồn bên ngoài nào
 */
export function parseExternalCVText(rawText: string): DuLieuCVTrinhXuat | null {
  if (!rawText || typeof rawText !== 'string') return null;

  const WATERMARK_REGEX = /(?:©|copyright|topcv\.vn|vietnamworks|careerviet|mywork|\bpage\s+\d+\s+of\s+\d+\b|\btrang\s+\d+\s*\/\s*\d+\b|\b\d+\s+of\s+\d+\b)/i;

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[-=_*#]{3,}$/.test(l) && !WATERMARK_REGEX.test(l));

  if (lines.length === 0) return null;

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(?:(?:\+84|0)[1-9](?:[\s.-]?\d){8,9})/i;
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/)[^\s,]+/i;

  let email = '';
  let soDienThoai = '';
  let website = '';
  let diaChi = '';
  let hoTen = '';
  let viTriUngTuyen = '';

  for (const line of lines) {
    if (!email) {
      const m = line.match(emailRegex);
      if (m) email = m[1];
    }
    if (!soDienThoai) {
      const m = line.match(phoneRegex);
      if (m) soDienThoai = m[0].replace(/[\s.-]/g, '');
    }
    if (!website) {
      const m = line.match(websiteRegex);
      if (m) website = m[0];
    }
    if (
      !diaChi &&
      /(?:Địa chỉ|Address|Quận|Huyện|TP\.|Thành phố|Hà Nội|Hồ Chí Minh|Đà Nẵng|Cần Thơ|Việt Nam)/i.test(line)
    ) {
      diaChi = line.replace(/^(?:Địa chỉ|Address|Location)[\s:]*/i, '').trim();
    }
  }

  const HEADER_PATTERNS = {
    gioiThieu: /^(?:I\.\s*)?(?:GIỚI THIỆU|MỤC TIÊU NGHỀ NGHIỆP|MỤC TIÊU|TÓM TẮT|ABOUT ME|SUMMARY|PROFILE|CAREER OBJECTIVE)/i,
    kinhNghiem: /^(?:II\.\s*|III\.\s*)?(?:KINH NGHIỆM LÀM VIỆC|KINH NGHIỆM|QUÁ TRÌNH LÀM VIỆC|LỊCH SỬ LÀM VIỆC|WORK EXPERIENCE|EXPERIENCE)/i,
    hocVan: /^(?:II\.\s*|III\.\s*|IV\.\s*)?(?:HỌC VẤN|TRÌNH ĐỘ HỌC VẤN|BẰNG CẤP|ĐÀO TẠO|EDUCATION|ACADEMIC)/i,
    kyNang: /^(?:IV\.\s*|V\.\s*)?(?:KỸ NĂNG|KỸ NĂNG CHUYÊN MÔN|KỸ NĂNG NỔI BẬT|SKILLS|TECHNICAL SKILLS)/i,
    duAn: /^(?:V\.\s*|VI\.\s*)?(?:DỰ ÁN|DỰ ÁN TIÊU BIỂU|DỰ ÁN NỔI BẬT|PROJECTS|KEY PROJECTS)/i,
    chungChi: /^(?:VI\.\s*|VII\.\s*)?(?:CHỨNG CHỈ|GIẢI THƯỞNG|CHỨNG CHỈ & GIẢI THƯỞNG|CERTIFICATIONS|CERTIFICATES|AWARDS)/i,
  };

  const isSectionHeader = (str: string) => {
    return Object.values(HEADER_PATTERNS).some((regex) => regex.test(str));
  };

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const l = lines[i];
    if (isSectionHeader(l)) break;
    if (emailRegex.test(l) || phoneRegex.test(l) || l.includes('http') || l.length < 2) continue;

    if (!hoTen && l.length < 50 && !l.includes(':')) {
      hoTen = l;
      continue;
    }
    if (hoTen && !viTriUngTuyen && l.length < 60 && !l.includes(':')) {
      viTriUngTuyen = l;
    }
  }

  const sections: Record<string, string[]> = {
    gioiThieu: [],
    kinhNghiem: [],
    hocVan: [],
    kyNang: [],
    duAn: [],
    chungChi: [],
  };

  let currentSec: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (HEADER_PATTERNS.gioiThieu.test(line)) {
      currentSec = 'gioiThieu';
      continue;
    }
    if (HEADER_PATTERNS.kinhNghiem.test(line)) {
      currentSec = 'kinhNghiem';
      continue;
    }
    if (HEADER_PATTERNS.hocVan.test(line)) {
      currentSec = 'hocVan';
      continue;
    }
    if (HEADER_PATTERNS.kyNang.test(line)) {
      currentSec = 'kyNang';
      continue;
    }
    if (HEADER_PATTERNS.duAn.test(line)) {
      currentSec = 'duAn';
      continue;
    }
    if (HEADER_PATTERNS.chungChi.test(line)) {
      currentSec = 'chungChi';
      continue;
    }

    if (currentSec && sections[currentSec]) {
      sections[currentSec].push(line);
    }
  }

  const gioiThieu = sections.gioiThieu
    .map((l) => `<p>${l}</p>`)
    .join('');

  const rawSkillsText = sections.kyNang.join(' ');
  const skillTokens = rawSkillsText
    .split(/[,;•\n\t|]/)
    .map((s) => s.replace(/^[-*+]\s*/, '').trim())
    .filter(
      (s) =>
        s.length > 1 &&
        s.length < 40 &&
        !/^(kỹ năng|skills|thành thạo)/i.test(s) &&
        !WATERMARK_REGEX.test(s)
    );

  const kyNang = Array.from(new Set(skillTokens)).map((ten, idx) => ({
    id: `kn-ext-${Date.now()}-${idx}`,
    ten,
    mucDo: 'Thành thạo',
  }));

  const hocVan: DuLieuCVTrinhXuat['hocVan'] = [];
  let currentHV: DuLieuCVTrinhXuat['hocVan'][0] | null = null;
  const timeRegex = /(?:\b(?:20\d\d|19\d\d)\b(?:\s*[-–]\s*(?:20\d\d|Hiện tại|Present|\d\d\/\d\d\d\d))?)/i;

  for (const line of sections.hocVan) {
    if (/(?:Đại học|Cao đẳng|Học viện|University|College|Trường)/i.test(line) || !currentHV) {
      if (currentHV && (currentHV.truong || currentHV.chuyenNganh)) {
        hocVan.push(currentHV);
      }
      currentHV = {
        id: `hv-ext-${Date.now()}-${hocVan.length}`,
        truong: line.replace(/\s*\([^)]*\d{4}[^)]*\)/, '').trim(),
        chuyenNganh: '',
        thoiGian: '',
        diemSo: '',
      };
      const mTime = line.match(timeRegex);
      if (mTime) currentHV.thoiGian = mTime[0];
      continue;
    }

    if (currentHV) {
      if (/(?:Chuyên ngành|Ngành|Major)[\s:]*(.*)/i.test(line)) {
        currentHV.chuyenNganh = line.replace(/^(?:Chuyên ngành|Ngành|Major)[\s:]*/i, '');
      } else if (timeRegex.test(line) && !currentHV.thoiGian) {
        const m = line.match(timeRegex);
        if (m) currentHV.thoiGian = m[0];
      } else if (/(?:GPA|Điểm|Học bổng|Tốt nghiệp loại)/i.test(line)) {
        currentHV.diemSo = line;
      } else if (!currentHV.chuyenNganh) {
        currentHV.chuyenNganh = line;
      }
    }
  }
  if (currentHV && (currentHV.truong || currentHV.chuyenNganh)) {
    hocVan.push(currentHV);
  }

  const kinhNghiem: DuLieuCVTrinhXuat['kinhNghiem'] = [];
  let currentKN: DuLieuCVTrinhXuat['kinhNghiem'][0] | null = null;

  for (const line of sections.kinhNghiem) {
    const isBullet = /^[-•*+]\s*/.test(line);
    const hasTime = timeRegex.test(line);
    const isCompany = /(?:Công ty|Tập đoàn|Company|Corp|Ltd|Enterprise|Startup)/i.test(line);

    if ((isCompany || (hasTime && !isBullet)) && (!currentKN || currentKN.moTa)) {
      if (currentKN && (currentKN.congTy || currentKN.viTri)) {
        kinhNghiem.push(currentKN);
      }
      currentKN = {
        id: `kn-ext-${Date.now()}-${kinhNghiem.length}`,
        congTy: isCompany ? line.replace(/\s*\([^)]*\d{4}[^)]*\)/, '').trim() : line,
        viTri: '',
        thoiGian: '',
        moTa: '',
      };
      if (hasTime) {
        const m = line.match(timeRegex);
        if (m) currentKN.thoiGian = m[0];
      }
      continue;
    }

    if (currentKN) {
      if (!currentKN.thoiGian && hasTime) {
        const m = line.match(timeRegex);
        if (m) currentKN.thoiGian = m[0];
      } else if (
        !currentKN.viTri &&
        !isBullet &&
        /(?:Vị trí|Chức vụ|Role|Position|Developer|Engineer|Intern|Lead|Manager|Nhân viên|Chuyên viên|Trưởng nhóm)/i.test(
          line
        )
      ) {
        currentKN.viTri = line.replace(/^(?:Vị trí|Chức vụ|Role|Position)[\s:]*/i, '');
      } else if (isBullet) {
        const cleanedBullet = line.replace(/^[-•*+]\s*/, '');
        currentKN.moTa = (currentKN.moTa || '') + `<li>${cleanedBullet}</li>`;
      } else {
        if (!currentKN.viTri) {
          currentKN.viTri = line;
        } else {
          currentKN.moTa = (currentKN.moTa || '') + `<li>${line}</li>`;
        }
      }
    }
  }
  if (currentKN && (currentKN.congTy || currentKN.viTri)) {
    if (currentKN.moTa && !currentKN.moTa.startsWith('<ul>')) {
      currentKN.moTa = `<ul>${currentKN.moTa}</ul>`;
    }
    kinhNghiem.push(currentKN);
  }

  const duAn: DuLieuCVTrinhXuat['duAn'] = [];
  let currentDA: DuLieuCVTrinhXuat['duAn'][0] | null = null;

  for (const line of sections.duAn) {
    const isBullet = /^[-•*+]\s*/.test(line);
    if (!currentDA || (!isBullet && /(?:Dự án|Project|Hệ thống|Ứng dụng|Website|App|Nền tảng)/i.test(line))) {
      if (currentDA && currentDA.ten) {
        duAn.push(currentDA);
      }
      currentDA = {
        id: `da-ext-${Date.now()}-${duAn.length}`,
        ten: line.replace(/^(?:Dự án|Project)[\s:]*/i, ''),
        vaiTro: 'Thành viên phát triển',
        thoiGian: '2024 - 2025',
        congNghe: '',
        moTa: '',
      };
      continue;
    }

    if (currentDA) {
      if (/(?:Vai trò|Role)[\s:]*(.*)/i.test(line)) {
        currentDA.vaiTro = line.replace(/^(?:Vai trò|Role)[\s:]*/i, '');
      } else if (/(?:Công nghệ|Tech stack|Technologies)[\s:]*(.*)/i.test(line)) {
        currentDA.congNghe = line.replace(/^(?:Công nghệ|Tech stack|Technologies)[\s:]*/i, '');
      } else if (isBullet) {
        const b = line.replace(/^[-•*+]\s*/, '');
        currentDA.moTa = (currentDA.moTa || '') + `<li>${b}</li>`;
      } else {
        currentDA.moTa = (currentDA.moTa || '') + `<p>${line}</p>`;
      }
    }
  }
  if (currentDA && currentDA.ten) {
    if (currentDA.moTa && currentDA.moTa.includes('<li>') && !currentDA.moTa.startsWith('<ul>')) {
      currentDA.moTa = `<ul>${currentDA.moTa}</ul>`;
    }
    duAn.push(currentDA);
  }

  const chungChi: DuLieuCVTrinhXuat['chungChi'] = sections.chungChi
    .filter((l) => l.length > 2)
    .map((l, idx) => {
      const cleaned = l.replace(/^[-•*+]\s*/, '');
      const yearMatch = cleaned.match(/\b(20\d\d)\b/);
      return {
        id: `cc-ext-${Date.now()}-${idx}`,
        ten: cleaned.replace(/\s*\([^)]*\d{4}[^)]*\)/, '').trim(),
        toChuc: cleaned.includes('IIG')
          ? 'IIG Việt Nam'
          : cleaned.includes('AWS')
          ? 'Amazon Web Services'
          : 'Tổ chức cấp chứng chỉ',
        nam: yearMatch ? yearMatch[1] : '2024',
      };
    });

  return {
    thongTinCaNhan: {
      hoTen: hoTen || 'ỨNG VIÊN TIỀM NĂNG',
      viTriUngTuyen: viTriUngTuyen || 'Chuyên viên',
      email,
      soDienThoai,
      diaChi,
      website,
    },
    gioiThieu,
    kinhNghiem,
    hocVan,
    kyNang,
    duAn,
    chungChi,
  };
}
