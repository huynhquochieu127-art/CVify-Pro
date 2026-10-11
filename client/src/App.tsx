import { useState } from 'react';
import axios from 'axios';
import { TrangChu } from './components/home';
import { QuanLyCV, HoSoCaNhan } from './components/dashboard';
import { KhoCVMau } from './components/kho-mau';
import { ThanhCongCu, TrinhThietKeCV } from './components/builder';
import { HopThoaiXacThuc, type NguoiDungAuth } from './components/auth';
import {
  ThanhTaskbar,
  ThanhDauTrang,
  type ManHinhType,
  type NguoiDung,
} from './components/layout';
import { useKhoLuuTruCV } from './store';

function App() {
  // 1. Quản lý trạng thái người dùng (Khởi tạo từ sessionStorage nếu trong phiên hiện tại, khi tắt tab mở lại mặc định là null)
  const [nguoiDung, setNguoiDung] = useState<NguoiDung | null>(() => {
    try {
      const userLuu = sessionStorage.getItem('nguoiDung');
      const token = sessionStorage.getItem('token');
      if (userLuu && token) {
        const parsed = JSON.parse(userLuu);
        return {
          id: parsed.id,
          ten: parsed.ho_ten || parsed.ten || 'Người Dùng',
          email: parsed.email || '',
          vai_tro: parsed.vai_tro,
          avatar: parsed.avatar || '',
        };
      }
    } catch {
      // Bỏ qua nếu dữ liệu lưu bị lỗi
    }
    return null;
  });

  // 2. Quản lý 5 màn hình chính: 'trang-chu' | 'quan-ly-cv' | 'kho-mau' | 'trinh-thiet-ke' | 'ho-so-goc'
  const [manHinh, setManHinh] = useState<ManHinhType>('trang-chu');

  // 3. Trạng thái Hộp thoại xác thực (Đăng Nhập / Đăng Ký) kết nối Backend
  const [moXacThuc, setMoXacThuc] = useState(false);
  const [cheDoXacThuc, setCheDoXacThuc] = useState<'dang-nhap' | 'dang-ky'>('dang-nhap');

  // Mở modal Đăng Nhập
  const handleMoDangNhap = () => {
    setCheDoXacThuc('dang-nhap');
    setMoXacThuc(true);
  };

  // Mở modal Đăng Ký
  const handleMoDangKy = () => {
    setCheDoXacThuc('dang-ky');
    setMoXacThuc(true);
  };

  // Xử lý khi đăng ký hoặc đăng nhập THÀNH CÔNG từ API Backend
  const handleXacThucThanhCong = (userBackend: NguoiDungAuth) => {
    const userMoi: NguoiDung = {
      id: userBackend.id,
      ten: userBackend.ho_ten,
      email: userBackend.email,
      vai_tro: userBackend.vai_tro,
      avatar: userBackend.avatar || '',
    };
    setNguoiDung(userMoi);
    setMoXacThuc(false);
    setManHinh('quan-ly-cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi ĐĂNG XUẤT: Xóa sạch sessionStorage & localStorage, đưa trạng thái về chưa đăng nhập
  const handleDangXuat = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nguoiDung');
    localStorage.removeItem('token');
    localStorage.removeItem('nguoiDung');
    setNguoiDung(null);
    setManHinh('trang-chu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chuyển màn hình và cuộn lên đầu trang
  const chuyenManHinh = (manHinhMoi: ManHinhType) => {
    setManHinh(manHinhMoi);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tự động tạo CV mới trong MySQL và chuyển thẳng vào Trình thiết kế
  const handleTaoCVMoi = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleMoDangNhap();
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cv',
        { tieu_de_cv: 'CV Mới Chưa Đặt Tên' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.thanh_cong && res.data.cv) {
        useKhoLuuTruCV.getState().napDuLieuCVTuServer(res.data.cv);
        setManHinh('trinh-thiet-ke');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Lỗi khi tạo CV mới:', err);
      // Fallback nếu có lỗi nhẹ: Tạo trên giao diện
      useKhoLuuTruCV.getState().khoiTaoCVMoi(null, 'CV Mới Chưa Đặt Tên');
      setManHinh('trinh-thiet-ke');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const daDangNhap = Boolean(nguoiDung);

  return (
    <div className="min-h-screen bg-[#f4f2ee] font-sans flex flex-col text-slate-800">
      {/* ========================================================= */}
      {/* 1. THANH TASKBAR ĐỨNG BÊN TRÁI (CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP) */}
      {/* ========================================================= */}
      {daDangNhap && (
        <ThanhTaskbar
          manHinhHienTai={manHinh}
          onChuyenManHinh={chuyenManHinh}
          onTaoCVMoi={handleTaoCVMoi}
          nguoiDung={nguoiDung}
          onDangXuat={handleDangXuat}
        />
      )}

      {/* ========================================================= */}
      {/* 2. THANH HEADER NGANG TRÊN CÙNG                           */}
      {/* ========================================================= */}
      <ThanhDauTrang
        nguoiDung={nguoiDung}
        onMoDangNhap={handleMoDangNhap}
        onMoDangKy={handleMoDangKy}
        onDangXuat={handleDangXuat}
        onVeTrangChu={() => chuyenManHinh('trang-chu')}
        coTaskbar={daDangNhap}
      />

      {/* ========================================================= */}
      {/* 3. VÙNG NỘI DUNG CHÍNH (Cố định lề trái pl-18 chống giật khung) */}
      {/* ========================================================= */}
      <div className={`flex-1 flex flex-col transition-all ${daDangNhap ? 'pl-18' : ''}`}>
        {/* Màn hình 1: Trang Chủ (Landing Page) */}
        {manHinh === 'trang-chu' && (
          <TrangChu
            anHeader={true}
            daDangNhap={daDangNhap}
            tenNguoiDung={nguoiDung?.ten}
            avatarNguoiDung={nguoiDung?.avatar}
            onChuyenTrinhThietKe={handleTaoCVMoi}
            onChuyenBangDieuKhien={() => {
              if (daDangNhap) {
                chuyenManHinh('quan-ly-cv');
              } else {
                handleMoDangNhap();
              }
            }}
            onMoDangNhap={handleMoDangNhap}
            onMoDangKy={handleMoDangKy}
            onDangXuat={handleDangXuat}
          />
        )}

        {/* Màn hình 2: Quản Lý CV (Kết nối MySQL API) */}
        {manHinh === 'quan-ly-cv' && (
          <QuanLyCV
            onChuyenTrinhThietKe={(_cvId) => chuyenManHinh('trinh-thiet-ke')}
            onTaoCVMoi={handleTaoCVMoi}
          />
        )}

        {/* Màn hình 3: Kho Mẫu CV */}
        {manHinh === 'kho-mau' && (
          <KhoCVMau
            onChuyenTrinhThietKe={(_mauId) => handleTaoCVMoi()}
          />
        )}

        {/* Màn hình 4: Hồ Sơ Cá Nhân (Master Profile) */}
        {manHinh === 'ho-so-goc' && (
          <HoSoCaNhan
            nguoiDung={nguoiDung}
            onChuyenTrinhThietKe={handleTaoCVMoi}
          />
        )}

        {/* Màn hình 5: Trình Thiết Kế CV (Bố cục 2 cột Split-view) */}
        {manHinh === 'trinh-thiet-ke' && (
          <div className="flex-1 flex flex-col min-h-screen">
            <ThanhCongCu
              onVeTrangChu={() => chuyenManHinh('trang-chu')}
              onQuayLai={() => chuyenManHinh(daDangNhap ? 'quan-ly-cv' : 'trang-chu')}
              tieuDeQuayLai={daDangNhap ? '← Về Quản Lý CV' : '← Về Trang Chủ'}
              onMoDangNhap={handleMoDangNhap}
              onMoDangKy={handleMoDangKy}
            />
            <TrinhThietKeCV />
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL XÁC THỰC KẾT NỐI BACKEND (Đăng Nhập / Đăng Ký)   */}
      {/* ========================================================= */}
      <HopThoaiXacThuc
        dangMo={moXacThuc}
        cheDoMacDinh={cheDoXacThuc}
        onDong={() => setMoXacThuc(false)}
        onXacThucThanhCong={handleXacThucThanhCong}
      />
    </div>
  );
}

export default App;
