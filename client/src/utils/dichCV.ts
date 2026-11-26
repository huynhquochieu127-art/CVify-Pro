// client/src/utils/dichCV.ts
import axios from 'axios';
import type { ThongTinCV } from '../types/cv';

const MA_NGON_NGU_GOOGLE: Record<string, string> = {
  vi: 'vi',
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
};

async function dichTrucTiepClient(text: string, targetCode: string): Promise<string> {
  if (!text || !text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
    targetCode
  )}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) return text;
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) return text;
  return data[0].map((p: unknown) => (Array.isArray(p) ? String(p[0] ?? '') : '')).join('');
}

async function dichDanhSachVanBan(texts: string[], targetLang: string): Promise<string[]> {
  if (texts.length === 0) return [];

  // 1. Ưu tiên gọi qua API Backend (tránh CORS, ổn định)
  try {
    const res = await axios.post(
      'http://localhost:5000/api/cv/dich-noi-dung',
      { texts, targetLang },
      { timeout: 15000 }
    );
    if (res.data?.thanh_cong && Array.isArray(res.data.translations)) {
      return res.data.translations;
    }
  } catch {
    // Fallback gọi trực tiếp nếu backend chưa khởi động
  }

  const targetCode = MA_NGON_NGU_GOOGLE[targetLang] || 'en';
  const ketQua = new Array<string>(texts.length);
  const BATCH = 5;
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const translated = await Promise.all(
      batch.map((t) => dichTrucTiepClient(t, targetCode).catch(() => t))
    );
    translated.forEach((val, idx) => {
      ketQua[i + idx] = val;
    });
  }
  return ketQua;
}

/**
 * Dịch toàn bộ nội dung văn bản trong CV (vị trí, giới thiệu, kinh nghiệm, học vấn, kỹ năng, dự án, chứng chỉ, mục tùy chỉnh)
 * Giữ nguyên họ tên, email, số điện thoại, website để bảo toàn thông tin liên hệ.
 */
export async function dichToanBoNoiDungCV(
  cv: ThongTinCV,
  targetLang: string
): Promise<Partial<ThongTinCV>> {
  const texts: string[] = [];
  const setters: Array<(val: string) => void> = [];

  const cloned: ThongTinCV = JSON.parse(JSON.stringify(cv));

  const dangKy = (raw: string | undefined, setter: (val: string) => void) => {
    if (typeof raw === 'string' && raw.trim().length > 0) {
      texts.push(raw);
      setters.push(setter);
    }
  };

  // Thông tin cá nhân (chỉ dịch vị trí & địa chỉ, giữ nguyên tên/email/sđt/web)
  dangKy(cloned.thongTinCaNhan.viTriUngTuyen, (v) => {
    cloned.thongTinCaNhan.viTriUngTuyen = v;
  });
  dangKy(cloned.thongTinCaNhan.diaChi, (v) => {
    cloned.thongTinCaNhan.diaChi = v;
  });

  // Giới thiệu bản thân
  dangKy(cloned.gioiThieu, (v) => {
    cloned.gioiThieu = v;
  });

  // Kinh nghiệm làm việc
  (cloned.kinhNghiem || []).forEach((item) => {
    dangKy(item.viTri, (v) => {
      item.viTri = v;
    });
    dangKy(item.congTy, (v) => {
      item.congTy = v;
    });
    dangKy(item.thoiGian, (v) => {
      item.thoiGian = v;
    });
    dangKy(item.moTa, (v) => {
      item.moTa = v;
    });
  });

  // Học vấn
  (cloned.hocVan || []).forEach((item) => {
    dangKy(item.truong, (v) => {
      item.truong = v;
    });
    dangKy(item.chuyenNganh, (v) => {
      item.chuyenNganh = v;
    });
    dangKy(item.thoiGian, (v) => {
      item.thoiGian = v;
    });
    dangKy(item.diemSo, (v) => {
      item.diemSo = v;
    });
    dangKy(item.thanhTich, (v) => {
      item.thanhTich = v;
    });
  });

  // Kỹ năng
  (cloned.kyNang || []).forEach((item) => {
    dangKy(item.ten, (v) => {
      item.ten = v;
    });
    dangKy(item.mucDo, (v) => {
      item.mucDo = v;
    });
  });

  // Dự án
  (cloned.duAn || []).forEach((item) => {
    dangKy(item.ten, (v) => {
      item.ten = v;
    });
    dangKy(item.vaiTro, (v) => {
      item.vaiTro = v;
    });
    dangKy(item.thoiGian, (v) => {
      item.thoiGian = v;
    });
    dangKy(item.moTa, (v) => {
      item.moTa = v;
    });
  });

  // Chứng chỉ
  (cloned.chungChi || []).forEach((item) => {
    dangKy(item.ten, (v) => {
      item.ten = v;
    });
    dangKy(item.toChuc, (v) => {
      item.toChuc = v;
    });
    dangKy(item.nam, (v) => {
      item.nam = v;
    });
  });

  // Mục tùy chỉnh
  (cloned.khoiTuyChinh || []).forEach((khoi) => {
    dangKy(khoi.tieuDe, (v) => {
      khoi.tieuDe = v;
    });
    dangKy(khoi.noiDung, (v) => {
      khoi.noiDung = v;
    });
    (khoi.danhSachCotCon || []).forEach((cotCon) => {
      dangKy(cotCon.tieuDeCot, (v) => {
        cotCon.tieuDeCot = v;
      });
      dangKy(cotCon.noiDung, (v) => {
        cotCon.noiDung = v;
      });
    });
  });

  if (texts.length === 0) return cloned;

  const translated = await dichDanhSachVanBan(texts, targetLang);
  translated.forEach((val, idx) => {
    if (val && typeof val === 'string') {
      setters[idx](val);
    }
  });

  return {
    thongTinCaNhan: cloned.thongTinCaNhan,
    gioiThieu: cloned.gioiThieu,
    kinhNghiem: cloned.kinhNghiem,
    hocVan: cloned.hocVan,
    kyNang: cloned.kyNang,
    duAn: cloned.duAn,
    chungChi: cloned.chungChi,
    khoiTuyChinh: cloned.khoiTuyChinh,
  };
}
