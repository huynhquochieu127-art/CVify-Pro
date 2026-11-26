// server/src/utils/cvParser.js

/**
 * Trình phân tích cú pháp CV văn bản thô thông minh (Smart Raw CV Parser)
 * Có thể bóc tách bất kỳ CV nào tải từ mạng (TopCV, VietnamWorks, LinkedIn, Word, PDF...)
 * thành cấu trúc JSON chuẩn để đổ vào đúng Layout vừa thiết kế trên CVify Pro.
 */
export function parseExternalCVText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const WATERMARK_REGEX = /(?:©|copyright|topcv\.vn|vietnamworks|careerviet|mywork|\bpage\s+\d+\s+of\s+\d+\b|\btrang\s+\d+\s*\/\s*\d+\b|\b\d+\s+of\s+\d+\b)/i;

  // Tách dòng và loại bỏ dòng rỗng, đường kẻ phân cách vô nghĩa, watermark footer
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !/^[-=_*#]{3,}$/.test(l) && !WATERMARK_REGEX.test(l));

  if (lines.length === 0) return null;

  // 1. Regex nhận diện Thông tin Liên hệ
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(?:(?:\+84|0)[1-9](?:[\s.-]?\d){8,9})/i;
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/)[^\s,]+/i;
  const generalUrlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s,]*)?/i;

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
    if (!diaChi && /(?:Địa chỉ|Address|Quận|Huyện|TP\.|Thành phố|Hà Nội|Hồ Chí Minh|Đà Nẵng|Cần Thơ|Việt Nam)/i.test(line)) {
      diaChi = line.replace(/^(?:Địa chỉ|Address|Location)[\s:]*/i, '').trim();
    }
  }

  // 2. Nhận diện các Tiêu đề Mục (Section Headers)
  const HEADER_PATTERNS = {
    gioiThieu: /^(?:I\.\s*)?(?:GIỚI THIỆU|MỤC TIÊU NGHỀ NGHIỆP|MỤC TIÊU|TÓM TẮT|ABOUT ME|SUMMARY|PROFILE|CAREER OBJECTIVE)/i,
    kinhNghiem: /^(?:II\.\s*|III\.\s*)?(?:KINH NGHIỆM LÀM VIỆC|KINH NGHIỆM|QUÁ TRÌNH LÀM VIỆC|LỊCH SỬ LÀM VIỆC|WORK EXPERIENCE|EXPERIENCE)/i,
    hocVan: /^(?:II\.\s*|III\.\s*|IV\.\s*)?(?:HỌC VẤN|TRÌNH ĐỘ HỌC VẤN|BẰNG CẤP|ĐÀO TẠO|EDUCATION|ACADEMIC)/i,
    kyNang: /^(?:IV\.\s*|V\.\s*)?(?:KỸ NĂNG|KỸ NĂNG CHUYÊN MÔN|KỸ NĂNG NỔI BẬT|SKILLS|TECHNICAL SKILLS)/i,
    duAn: /^(?:V\.\s*|VI\.\s*)?(?:DỰ ÁN|DỰ ÁN TIÊU BIỂU|DỰ ÁN NỔI BẬT|PROJECTS|KEY PROJECTS)/i,
    chungChi: /^(?:VI\.\s*|VII\.\s*)?(?:CHỨNG CHỈ|GIẢI THƯỞNG|CHỨNG CHỈ & GIẢI THƯỞNG|CERTIFICATIONS|CERTIFICATES|AWARDS)/i,
  };

  const isSectionHeader = (str) => {
    return Object.values(HEADER_PATTERNS).some((regex) => regex.test(str));
  };

  // Quét 6 dòng đầu để tìm Họ tên & Vị trí ứng tuyển
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

  // 3. Phân chia nội dung theo Section
  const sections = {
    gioiThieu: [],
    kinhNghiem: [],
    hocVan: [],
    kyNang: [],
    duAn: [],
    chungChi: [],
  };

  let currentSec = null;

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

  // 4. Bóc tách Giới thiệu
  const gioiThieu = sections.gioiThieu
    .map((l) => `<p>${l}</p>`)
    .join('');

  // 5. Bóc tách Kỹ năng
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

  // 6. Bóc tách Học vấn
  const hocVan = [];
  let currentHV = null;
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

  // 7. Bóc tách Kinh nghiệm làm việc
  const kinhNghiem = [];
  let currentKN = null;

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
      } else if (!currentKN.viTri && !isBullet && /(?:Vị trí|Chức vụ|Role|Position|Developer|Engineer|Intern|Lead|Manager|Nhân viên|Chuyên viên|Trưởng nhóm)/i.test(line)) {
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

  // 8. Bóc tách Dự án
  const duAn = [];
  let currentDA = null;

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

  // 9. Bóc tách Chứng chỉ & Giải thưởng
  const chungChi = sections.chungChi
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
