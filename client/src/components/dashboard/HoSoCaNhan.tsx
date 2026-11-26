import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserCheck,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';

export interface HoSoCaNhanProps {
  nguoiDung?: {
    id?: string | number;
    ten: string;
    email: string;
    avatar?: string;
  } | null;
  onChuyenTrinhThietKe?: () => void;
}

interface KinhNghiemHoSo {
  id: string;
  congTy: string;
  viTri: string;
  thoiGian: string;
  moTa: string;
}

interface HocVanHoSo {
  id: string;
  truong: string;
  nganh: string;
  thoiGian: string;
  gpa: string;
}

export const HoSoCaNhan: React.FC<HoSoCaNhanProps> = ({
  nguoiDung,
  onChuyenTrinhThietKe,
}) => {
  const tenMacDinh = nguoiDung?.ten || '';
  const emailMacDinh = nguoiDung?.email || '';
  const storageKey = `cvify_ho_so_goc_${emailMacDinh || 'default'}`;

  const docHoSoLocal = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  };

  const duLieuBanDau = docHoSoLocal();
  const ttBanDau = duLieuBanDau?.thong_tin_ca_nhan || duLieuBanDau || {};

  const [hoTen, setHoTen] = useState<string>(ttBanDau.hoTen || tenMacDinh);
  const [chucVu, setChucVu] = useState<string>(ttBanDau.chucVu || '');
  const [email, setEmail] = useState<string>(ttBanDau.email || emailMacDinh);
  const [soDienThoai, setSoDienThoai] = useState<string>(ttBanDau.soDienThoai || '');
  const [diaChi, setDiaChi] = useState<string>(ttBanDau.diaChi || '');
  const [website, setWebsite] = useState<string>(ttBanDau.website || '');
  const [bio, setBio] = useState<string>(ttBanDau.bio || '');

  const [kyNang, setKyNang] = useState<string[]>(
    Array.isArray(duLieuBanDau?.ky_nang)
      ? duLieuBanDau.ky_nang
      : Array.isArray(duLieuBanDau?.kyNang)
      ? duLieuBanDau.kyNang
      : []
  );
  const [kyNangMoi, setKyNangMoi] = useState('');

  const [kinhNghiem, setKinhNghiem] = useState<KinhNghiemHoSo[]>(
    Array.isArray(duLieuBanDau?.kinh_nghiem)
      ? duLieuBanDau.kinh_nghiem
      : Array.isArray(duLieuBanDau?.kinhNghiem)
      ? duLieuBanDau.kinhNghiem
      : []
  );
  const [hocVan, setHocVan] = useState<HocVanHoSo[]>(
    Array.isArray(duLieuBanDau?.hoc_van)
      ? duLieuBanDau.hoc_van
      : Array.isArray(duLieuBanDau?.hocVan)
      ? duLieuBanDau.hocVan
      : []
  );

  const [dangLuu, setDangLuu] = useState(false);
  const [dangTaoCV, setDangTaoCV] = useState(false);
  const [thongBaoLuu, setThongBaoLuu] = useState<string | null>(null);

  // Tự động lưu nháp vào localStorage ngay khi người dùng nhập để F5 không bao giờ mất chữ
  useEffect(() => {
    const banNhap = {
      thong_tin_ca_nhan: {
        hoTen,
        chucVu,
        email,
        soDienThoai,
        diaChi,
        website,
        bio,
      },
      kinh_nghiem: kinhNghiem,
      hoc_van: hocVan,
      ky_nang: kyNang,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(banNhap));
    } catch {
      // ignore
    }
  }, [storageKey, hoTen, chucVu, email, soDienThoai, diaChi, website, bio, kinhNghiem, hocVan, kyNang]);

  // Nạp dữ liệu Hồ Sơ Gốc đã lưu từ MySQL khi mở trang (nếu trên máy chưa có dữ liệu)
  useEffect(() => {
    const apDungDuLieuHoSo = (data: any) => {
      if (!data) return;
      const tt = data.thong_tin_ca_nhan || data;
      if (tt.hoTen) setHoTen(tt.hoTen);
      if (tt.chucVu) setChucVu(tt.chucVu);
      if (tt.email) setEmail(tt.email);
      if (tt.soDienThoai) setSoDienThoai(tt.soDienThoai);
      if (tt.diaChi) setDiaChi(tt.diaChi);
      if (tt.website) setWebsite(tt.website);
      if (tt.bio) setBio(tt.bio);

      if (Array.isArray(data.kinh_nghiem) && data.kinh_nghiem.length > 0) {
        setKinhNghiem(data.kinh_nghiem);
      }
      if (Array.isArray(data.hoc_van) && data.hoc_van.length > 0) {
        setHocVan(data.hoc_van);
      }
      if (Array.isArray(data.ky_nang) && data.ky_nang.length > 0) {
        setKyNang(data.ky_nang);
      }
    };

    const token = sessionStorage.getItem('token');
    const coDuLieuLocal = Boolean(docHoSoLocal()?.thong_tin_ca_nhan?.chucVu || docHoSoLocal()?.hoc_van?.length);
    if (token && !coDuLieuLocal) {
      axios
        .get('http://localhost:5000/api/cv/ho-so-goc', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.thanh_cong && res.data.ho_so) {
            apDungDuLieuHoSo(res.data.ho_so);
          }
        })
        .catch(() => {
          // Sử dụng dữ liệu localStorage nếu server chưa phản hồi
        });
    }
  }, [storageKey]);

  const tinhDoHoanThien = () => {
    let diem = 0;
    if (hoTen.trim()) diem += 15;
    if (email.trim()) diem += 15;
    if (chucVu.trim()) diem += 15;
    if (soDienThoai.trim()) diem += 15;
    if (diaChi.trim()) diem += 10;
    if (website.trim()) diem += 5;
    if (bio.trim()) diem += 10;
    if (kyNang.length > 0) diem += 10;
    if (kinhNghiem.length > 0 || hocVan.length > 0) diem += 5;
    return Math.min(100, diem);
  };

  const doHoanThien = tinhDoHoanThien();

  const handleThemKyNang = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = kyNangMoi.trim();
    if (!val) return;
    if (!kyNang.includes(val)) {
      setKyNang([...kyNang, val]);
    }
    setKyNangMoi('');
  };

  const handleXoaKyNang = (ten: string) => {
    setKyNang(kyNang.filter((k) => k !== ten));
  };

  const handleThemKinhNghiem = () => {
    setKinhNghiem([
      ...kinhNghiem,
      {
        id: `kn-${Date.now()}`,
        congTy: '',
        viTri: '',
        thoiGian: '',
        moTa: '',
      },
    ]);
  };

  const handleXoaKinhNghiem = (id: string) => {
    setKinhNghiem(kinhNghiem.filter((k) => k.id !== id));
  };

  const handleThemHocVan = () => {
    setHocVan([
      ...hocVan,
      {
        id: `hv-${Date.now()}`,
        truong: '',
        nganh: '',
        thoiGian: '',
        gpa: '',
      },
    ]);
  };

  const handleXoaHocVan = (id: string) => {
    setHocVan(hocVan.filter((h) => h.id !== id));
  };

  // Lưu Hồ Sơ Cá Nhân vào MySQL (bảng ho_so_goc) + LocalStorage
  const luuDuLieuHoSo = async () => {
    const duLieuHoSo = {
      thong_tin_ca_nhan: {
        hoTen: hoTen.trim(),
        chucVu: chucVu.trim(),
        email: email.trim(),
        soDienThoai: soDienThoai.trim(),
        diaChi: diaChi.trim(),
        website: website.trim(),
        bio: bio.trim(),
      },
      kinh_nghiem: kinhNghiem,
      hoc_van: hocVan,
      ky_nang: kyNang,
    };

    localStorage.setItem(storageKey, JSON.stringify(duLieuHoSo));

    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        await axios.put('http://localhost:5000/api/cv/ho-so-goc', duLieuHoSo, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Đã lưu an toàn vào localStorage
      }
    }
    return duLieuHoSo;
  };

  const handleLuuHoSo = async () => {
    setDangLuu(true);
    try {
      await luuDuLieuHoSo();
      setThongBaoLuu('Đã lưu Hồ Sơ Cá Nhân thành công!');
      setTimeout(() => setThongBaoLuu(null), 3000);
    } finally {
      setDangLuu(false);
    }
  };

  // Tạo CV Mới từ dữ liệu Hồ Sơ Cá Nhân và mở ngay trong Trình Thiết Kế
  const handleTaoCVTuHoSo = async () => {
    setDangTaoCV(true);
    try {
      await luuDuLieuHoSo();

      const kinhNghiemCV = kinhNghiem
        .filter((k) => k.congTy.trim() || k.viTri.trim() || k.moTa.trim())
        .map((k, idx) => ({
          id: k.id || `kn-hs-${idx}-${Date.now()}`,
          congTy: k.congTy.trim() || 'Công ty',
          viTri: k.viTri.trim() || chucVu.trim() || 'Vị trí công việc',
          thoiGian: k.thoiGian.trim() || '2023 - Hiện tại',
          moTa: k.moTa.trim(),
          iconCongTy: 'Building2',
        }));

      const hocVanCV = hocVan
        .filter((h) => h.truong.trim() || h.nganh.trim())
        .map((h, idx) => ({
          id: h.id || `hv-hs-${idx}-${Date.now()}`,
          truong: h.truong.trim() || 'Trường Đại học',
          chuyenNganh: h.nganh.trim() || 'Chuyên ngành',
          thoiGian: h.thoiGian.trim() || '2020 - 2024',
          gpa: h.gpa.trim(),
          thanhTich: h.gpa.trim() ? `GPA: ${h.gpa.trim()}` : '',
          iconTruong: 'GraduationCap',
        }));

      const kyNangCV = kyNang.map((tenKN, idx) => ({
        id: `kn-skill-${idx}-${Date.now()}`,
        ten: tenKN,
        mucDo: 'Tốt',
        iconName: 'CheckCircle2',
      }));

      const noiDungCVMoi = {
        thongTinCaNhan: {
          hoTen: hoTen.trim() || tenMacDinh || 'Họ và Tên',
          viTriUngTuyen: chucVu.trim() || 'Vị trí ứng tuyển',
          email: email.trim() || emailMacDinh,
          soDienThoai: soDienThoai.trim(),
          diaChi: diaChi.trim(),
          website: website.trim(),
          avatarUrl: nguoiDung?.avatar || '',
          coverColor: '#1a91f0',
          iconLienHe: {
            email: 'Mail',
            soDienThoai: 'Phone',
            diaChi: 'MapPin',
            website: 'Globe',
          },
          lienHeTuyChinh: [],
        },
        gioiThieu: bio.trim(),
        kinhNghiem: kinhNghiemCV,
        hocVan: hocVanCV,
        kyNang: kyNangCV,
        duAn: [],
        chungChi: [],
        khoiTuyChinh: [],
        anHienKhoi: {
          'gioi-thieu': true,
          'kinh-nghiem': true,
          'hoc-van': true,
          'ky-nang': true,
          'du-an': false,
          'chung-chi': false,
        },
      };

      const tieuDeMoi = hoTen.trim()
        ? `CV - ${hoTen.trim()}`
        : 'CV Tạo Từ Hồ Sơ';

      // Đổ dữ liệu vào Zustand Store trước
      const store = useKhoLuuTruCV.getState();
      store.khoiTaoCVMoi(null, tieuDeMoi);
      store.nhapNoiDungTuCVCụ(noiDungCVMoi, '2-cot');

      // Nếu đã đăng nhập thì tạo luôn bản CV trong MySQL
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const stateMoiNhat = useKhoLuuTruCV.getState().cv;
          const res = await axios.post(
            'http://localhost:5000/api/cv',
            {
              tieu_de_cv: tieuDeMoi,
              cong_khai: false,
              cho_phep_danh_gia: false,
              noi_dung_cv: {
                thongTinCaNhan: stateMoiNhat.thongTinCaNhan,
                gioiThieu: stateMoiNhat.gioiThieu,
                kinhNghiem: stateMoiNhat.kinhNghiem,
                hocVan: stateMoiNhat.hocVan,
                kyNang: stateMoiNhat.kyNang,
                duAn: stateMoiNhat.duAn,
                chungChi: stateMoiNhat.chungChi,
                khoiTuyChinh: stateMoiNhat.khoiTuyChinh || [],
                anHienKhoi: stateMoiNhat.anHienKhoi,
                boCuc: stateMoiNhat.boCuc,
              },
              thu_tu_khoi: stateMoiNhat.thuTuKhoi,
              dinh_dang_cv: stateMoiNhat.dinhDang,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data?.thanh_cong && res.data.cv) {
            useKhoLuuTruCV.getState().napDuLieuCVTuServer(res.data.cv);
          }
        } catch (err) {
          console.error('Lỗi lưu CV mới từ hồ sơ lên MySQL:', err);
        }
      }

      if (onChuyenTrinhThietKe) {
        onChuyenTrinhThietKe();
      }
    } finally {
      setDangTaoCV(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Toast thông báo lưu thành công */}
      {thongBaoLuu && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold animate-fade-in">
          <CheckCircle2 size={16} />
          <span>{thongBaoLuu}</span>
        </div>
      )}

      {/* Header Hồ Sơ Cá Nhân */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs mb-6">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-50 text-[#1a91f0]">
            <UserCheck size={22} />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Hồ Sơ Cá Nhân (Master Profile)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLuuHoSo}
            disabled={dangLuu}
            className="flex items-center gap-2 bg-[#1a91f0] hover:bg-[#004182] disabled:opacity-60 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            {dangLuu ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{dangLuu ? 'Đang lưu...' : 'Lưu Hồ Sơ'}</span>
          </button>

          <button
            type="button"
            onClick={handleTaoCVTuHoSo}
            disabled={dangTaoCV}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1a91f0] bg-blue-50 hover:bg-blue-100 disabled:opacity-60 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            {dangTaoCV ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            <span>{dangTaoCV ? 'Đang tạo CV...' : 'Tạo CV Từ Hồ Sơ'}</span>
          </button>
        </div>
      </div>

      {/* Hộp Tiến trình Hoàn thiện Hồ sơ (Đã bỏ ghi chú thừa) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600" />
            Độ hoàn thiện hồ sơ gốc
          </span>
          <span className="text-xs font-extrabold text-emerald-600">
            {doHoanThien}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${doHoanThien}%` }}
          />
        </div>
      </div>

      {/* FORM CHI TIẾT HỒ SƠ GỐC */}
      <div className="space-y-6">
        {/* Khối 1: Thông tin cơ bản */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <User size={16} className="text-[#1a91f0]" />
            <span>Thông Tin Liên Hệ Cơ Bản</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chức danh / Vị trí chuyên môn
              </label>
              <input
                type="text"
                value={chucVu}
                onChange={(e) => setChucVu(e.target.value)}
                placeholder="VD: Nhân viên Kinh doanh, Lập trình viên..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="VD: 0912 345 678"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ cư trú
              </label>
              <input
                type="text"
                value={diaChi}
                onChange={(e) => setDiaChi(e.target.value)}
                placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website / LinkedIn
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="VD: linkedin.com/in/ten-ban hoặc github.com/..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tóm tắt bản thân & Mục tiêu nghề nghiệp
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn gọn về bản thân, mục tiêu nghề nghiệp..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a91f0]/20 focus:border-[#1a91f0] transition resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Khối 2: Học vấn & Bằng cấp */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={16} className="text-[#1a91f0]" />
              <span>Học Vấn & Bằng Cấp</span>
            </h2>

            <button
              type="button"
              onClick={handleThemHocVan}
              className="flex items-center gap-1 text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Học Vấn</span>
            </button>
          </div>

          <div className="space-y-4">
            {hocVan.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <button
                  type="button"
                  onClick={handleThemHocVan}
                  className="text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  + Thêm trường học đầu tiên
                </button>
              </div>
            ) : (
              hocVan.map((hv) => (
                <div
                  key={hv.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleXoaHocVan(hv.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition cursor-pointer"
                    title="Xóa học vấn này"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Trường học
                      </label>
                      <input
                        type="text"
                        value={hv.truong}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHocVan(
                            hocVan.map((h) =>
                              h.id === hv.id ? { ...h, truong: val } : h
                            )
                          );
                        }}
                        placeholder="VD: Đại học Hutech"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Chuyên ngành
                      </label>
                      <input
                        type="text"
                        value={hv.nganh}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHocVan(
                            hocVan.map((h) =>
                              h.id === hv.id ? { ...h, nganh: val } : h
                            )
                          );
                        }}
                        placeholder="VD: Công nghệ phần mềm"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Niên khóa
                      </label>
                      <input
                        type="text"
                        value={hv.thoiGian}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHocVan(
                            hocVan.map((h) =>
                              h.id === hv.id ? { ...h, thoiGian: val } : h
                            )
                          );
                        }}
                        placeholder="VD: 2022 - 2026"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        GPA / Thành tích
                      </label>
                      <input
                        type="text"
                        value={hv.gpa}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHocVan(
                            hocVan.map((h) =>
                              h.id === hv.id ? { ...h, gpa: val } : h
                            )
                          );
                        }}
                        placeholder="VD: 3.4/4.0"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khối 3: Kinh nghiệm làm việc */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={16} className="text-[#1a91f0]" />
              <span>Kinh Nghiệm Làm Việc</span>
            </h2>

            <button
              type="button"
              onClick={handleThemKinhNghiem}
              className="flex items-center gap-1 text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm Kinh Nghiệm</span>
            </button>
          </div>

          <div className="space-y-4">
            {kinhNghiem.length === 0 ? (
              <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <button
                  type="button"
                  onClick={handleThemKinhNghiem}
                  className="text-xs font-bold text-[#1a91f0] hover:text-[#004182] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  + Thêm kinh nghiệm đầu tiên
                </button>
              </div>
            ) : (
              kinhNghiem.map((kn) => (
                <div
                  key={kn.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleXoaKinhNghiem(kn.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-white transition cursor-pointer"
                    title="Xóa kinh nghiệm này"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Chức danh / Vị trí
                      </label>
                      <input
                        type="text"
                        value={kn.viTri}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKinhNghiem(
                            kinhNghiem.map((k) =>
                              k.id === kn.id ? { ...k, viTri: val } : k
                            )
                          );
                        }}
                        placeholder="VD: Frontend Developer"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tên công ty
                      </label>
                      <input
                        type="text"
                        value={kn.congTy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKinhNghiem(
                            kinhNghiem.map((k) =>
                              k.id === kn.id ? { ...k, congTy: val } : k
                            )
                          );
                        }}
                        placeholder="VD: FPT Software"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Thời gian làm việc
                      </label>
                      <input
                        type="text"
                        value={kn.thoiGian}
                        onChange={(e) => {
                          const val = e.target.value;
                          setKinhNghiem(
                            kinhNghiem.map((k) =>
                              k.id === kn.id ? { ...k, thoiGian: val } : k
                            )
                          );
                        }}
                        placeholder="VD: 2023 - Hiện tại"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mô tả công việc & Thành tích
                    </label>
                    <textarea
                      value={kn.moTa}
                      onChange={(e) => {
                        const val = e.target.value;
                        setKinhNghiem(
                          kinhNghiem.map((k) =>
                            k.id === kn.id ? { ...k, moTa: val } : k
                          )
                        );
                      }}
                      placeholder="Mô tả tóm tắt nhiệm vụ và thành tựu nổi bật..."
                      rows={2}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-[#1a91f0]"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khối 4: Kỹ năng chuyên môn */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Award size={16} className="text-[#1a91f0]" />
            <span>Kỹ Năng Nổi Bật</span>
          </h2>

          {kyNang.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {kyNang.map((k) => (
                <span
                  key={k}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-[#1a91f0] rounded-full text-xs font-semibold border border-blue-200"
                >
                  <span>{k}</span>
                  <button
                    type="button"
                    onClick={() => handleXoaKyNang(k)}
                    className="hover:text-rose-600 cursor-pointer font-bold text-sm"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handleThemKyNang} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={kyNangMoi}
              onChange={(e) => setKyNangMoi(e.target.value)}
              placeholder="VD: Giao tiếp, Tiếng Anh, React, Photoshop..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#1a91f0]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#1a91f0] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Thêm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HoSoCaNhan;
