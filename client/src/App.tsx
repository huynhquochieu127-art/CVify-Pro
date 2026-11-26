import { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2 } from 'lucide-react';
import { TrangChu } from './components/home';
import { QuanLyCV, HoSoCaNhan } from './components/dashboard';
import { KhoCVMau, TrangTaoCV, type LoaiPhongCachCV } from './components/kho-mau';
import { ThanhCongCu, TrinhThietKeCV } from './components/builder';
import { ModalDanhGiaCV } from './components/builder/ModalDanhGiaCV';
import { HopThoaiXacThuc, type NguoiDungAuth } from './components/auth';
import {
  ThanhTaskbar,
  ThanhDauTrang,
  NhacNhoCVChuaLuu,
  type ManHinhType,
  type NguoiDung,
} from './components/layout';
import { useKhoLuuTruCV } from './store';
import { useKhoThongBao, type ThongBaoItem } from './store/khoThongBao';

function App() {
  // 1. Quản lý trạng thái người dùng
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

  // 2. Quản lý 5 màn hình chính (giữ nguyên trang đang mở khi bấm F5 / Tải lại trang)
  const [manHinh, setManHinh] = useState<ManHinhType>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shareId')) {
      return 'trinh-thiet-ke';
    }
    const daLuuManHinh = sessionStorage.getItem('cvify_man_hinh_hien_tai') as ManHinhType | null;
    const hopLe: ManHinhType[] = [
      'trang-chu',
      'tao-cv',
      'quan-ly-cv',
      'kho-mau',
      'ho-so-goc',
      'trinh-thiet-ke',
    ];
    if (daLuuManHinh && hopLe.includes(daLuuManHinh)) {
      const coToken = Boolean(sessionStorage.getItem('token'));
      if (!coToken && (daLuuManHinh === 'quan-ly-cv' || daLuuManHinh === 'ho-so-goc')) {
        return 'trang-chu';
      }
      return daLuuManHinh;
    }
    return 'trang-chu';
  });

  // Lưu màn hình hiện tại vào sessionStorage mỗi khi chuyển trang
  useEffect(() => {
    sessionStorage.setItem('cvify_man_hinh_hien_tai', manHinh);
    // Khi thoát khỏi trình thiết kế sang trang khác, nếu đang có CV chưa lưu thì bật lại popup nhắc
    if (manHinh !== 'trinh-thiet-ke') {
      useKhoThongBao.getState().hienLaiPopupNeuCo();
    }
  }, [manHinh]);

  // Tự động theo dõi các thay đổi CV trong Trình thiết kế để ghi nhận bản nháp chưa lưu
  useEffect(() => {
    if (manHinh !== 'trinh-thiet-ke') return;
    const unsub = useKhoLuuTruCV.subscribe((state, prevState) => {
      if (
        state.cv !== prevState.cv ||
        state.tieuDeCVHienTai !== prevState.tieuDeCVHienTai
      ) {
        useKhoThongBao.getState().capNhatCVChuaLuu(state.cv, state.tieuDeCVHienTai);
      }
    });
    return () => unsub();
  }, [manHinh]);

  // Trạng thái khi có người mở Link Chia Sẻ CV (?shareId=...)
  const [thongTinShareCV, setThongTinShareCV] = useState<{
    id: number;
    tieuDe: string;
    tacGia: string;
  } | null>(null);
  const [moModalDanhGiaShare, setMoModalDanhGiaShare] = useState(false);

  // Tự động tải CV thật từ MySQL khi người khác bấm vào link ?shareId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('shareId');
    if (!shareId || shareId === 'demo') return;

    axios
      .get(`http://localhost:5000/api/cv/public/${shareId}`)
      .then((res) => {
        if (res.data?.thanh_cong && res.data.cv) {
          const sharedCV = res.data.cv;
          useKhoLuuTruCV.getState().napDuLieuCVTuServer(sharedCV);
          setThongTinShareCV({
            id: sharedCV.id,
            tieuDe: sharedCV.tieu_de_cv || `CV #${sharedCV.id}`,
            tacGia:
              sharedCV.nguoi_dung?.ho_ten ||
              sharedCV.noi_dung_cv?.thongTinCaNhan?.hoTen ||
              'Ứng viên',
          });
          setManHinh('trinh-thiet-ke');
          setMoModalDanhGiaShare(true);
        }
      })
      .catch((err) => {
        console.error('Lỗi tải CV chia sẻ:', err);
      });
  }, []);

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
    useKhoThongBao.getState().hienLaiPopupNeuCo();
    setManHinh('quan-ly-cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi ĐĂNG XUẤT
  const handleDangXuat = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nguoiDung');
    localStorage.removeItem('token');
    localStorage.removeItem('nguoiDung');
    setNguoiDung(null);
    setManHinh('trang-chu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bộ lọc loại mẫu mặc định khi chuyển từ màn hình Tạo CV sang Kho Mẫu
  const [loaiMauMacDinh, setLoaiMauMacDinh] = useState<LoaiPhongCachCV | 'tat-ca'>('tat-ca');

  // Chuyển màn hình và cuộn lên đầu trang
  const chuyenManHinh = (manHinhMoi: ManHinhType) => {
    if (manHinhMoi === 'kho-mau') {
      setLoaiMauMacDinh('tat-ca');
    }
    setManHinh(manHinhMoi);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Khi bấm "Tạo CV Mới": mở màn hình chọn 2 Option (Tự viết / Chọn mẫu CV) thay vì tạo ngay
  const handleTaoCVMoi = () => {
    setManHinh('tao-cv');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option 1: Tạo CV mới trong MySQL (hoặc local) và chuyển thẳng vào Trình thiết kế để tự viết
  const handleTaoCVTuViet = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      useKhoLuuTruCV.getState().khoiTaoCVMoi(null, 'CV Mới Chưa Đặt Tên');
      setManHinh('trinh-thiet-ke');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      useKhoLuuTruCV.getState().khoiTaoCVMoi(null, 'CV Mới Chưa Đặt Tên');
      setManHinh('trinh-thiet-ke');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Khôi phục bản nháp CV chưa lưu và mở lại Trình thiết kế
  const handleTiepTucCVChuaLuu = () => {
    const draft = useKhoThongBao.getState().cvChuaLuu;
    if (draft?.banNhapCV) {
      useKhoLuuTruCV.setState({
        cv: draft.banNhapCV,
        tieuDeCVHienTai: draft.tieuDe,
      });
    }
    setManHinh('trinh-thiet-ke');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý điều hướng khi người dùng bấm vào một mục trong Chuông Thông Báo
  const handleChonHanhDongThongBao = (hanhDong?: ThongBaoItem['hanhDong']) => {
    if (hanhDong === 'mo-trinh-thiet-ke') {
      handleTiepTucCVChuaLuu();
    } else if (hanhDong === 'mo-cong-dong') {
      setManHinh('trang-chu');
      setTimeout(() => {
        document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else if (hanhDong === 'mo-kho-mau') {
      chuyenManHinh('kho-mau');
    }
  };

  const daDangNhap = Boolean(nguoiDung);

  return (
    <div className="min-h-screen bg-[#f4f2ee] font-sans flex flex-col text-slate-800">
      {/* ========================================================= */}
      {/* 1. THANH TASKBAR ĐỨNG BÊN TRÁI (CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP) */}
      {/* ========================================================= */}
      {daDangNhap && (
        <div className="print:hidden">
          <ThanhTaskbar
            manHinhHienTai={manHinh}
            onChuyenManHinh={chuyenManHinh}
            onTaoCVMoi={handleTaoCVMoi}
            nguoiDung={nguoiDung}
            onDangXuat={handleDangXuat}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. THANH HEADER NGANG TRÊN CÙNG                           */}
      {/* ========================================================= */}
      <div className="print:hidden">
        <ThanhDauTrang
          nguoiDung={nguoiDung}
          onMoDangNhap={handleMoDangNhap}
          onMoDangKy={handleMoDangKy}
          onDangXuat={handleDangXuat}
          onVeTrangChu={() => chuyenManHinh('trang-chu')}
          onChonHanhDongThongBao={handleChonHanhDongThongBao}
          coTaskbar={daDangNhap}
        />
      </div>

      {/* ========================================================= */}
      {/* 3. VÙNG NỘI DUNG CHÍNH                                     */}
      {/* ========================================================= */}
      <div className={`flex-1 flex flex-col pt-[53px] transition-all ${daDangNhap ? 'pl-18 print:pl-0' : ''} print:p-0 print:m-0`}>
        {/* BANNER KHI NGƯỜI KHÁC BẤM VÀO LINK CHIA SẺ CV (?shareId=...) */}
        {thongTinShareCV && manHinh === 'trinh-thiet-ke' && (
          <div className="bg-gradient-to-r from-blue-900 to-[#1a91f0] text-white px-4 py-2 flex items-center justify-center gap-2 shadow-sm print:hidden">
            <Share2 size={15} className="text-amber-300 shrink-0" />
            <span className="text-xs">
              Bạn đang xem bản CV <strong>"{thongTinShareCV.tieuDe}"</strong> được chia sẻ bởi{' '}
              <strong>{thongTinShareCV.tacGia}</strong>. Hãy bấm nút <strong>"Chấm điểm CV này"</strong> bên dưới để góp ý nhé!
            </span>
          </div>
        )}

        {/* Màn hình 1: Trang Chủ (Landing Page) */}
        {manHinh === 'trang-chu' && (
          <TrangChu
            anHeader={true}
            daDangNhap={daDangNhap}
            tenNguoiDung={nguoiDung?.ten}
            avatarNguoiDung={nguoiDung?.avatar}
            onChuyenTrinhThietKe={handleTaoCVMoi}
            onChonMauTrucTiep={(mau) => {
              const store = useKhoLuuTruCV.getState();
              store.apDungMauCV(mau.mauHeThongId, true);
              if ((store.cv.dinhDang.ngonNgu || 'vi') !== mau.ngonNgu) {
                store.doiNgonNguCV(mau.ngonNgu);
              }
              chuyenManHinh('trinh-thiet-ke');
            }}
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

        {/* Màn hình Chọn cách Tạo CV (2 Option: Tự viết hoặc Chọn từ Kho Mẫu) */}
        {manHinh === 'tao-cv' && (
          <TrangTaoCV
            onTaoCVTuViet={handleTaoCVTuViet}
            onChonKhoMau={(loai) => {
              setLoaiMauMacDinh(loai || 'tat-ca');
              setManHinh('kho-mau');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            loaiMacDinh={loaiMauMacDinh}
            onTaoCVTuViet={handleTaoCVTuViet}
            onChuyenTrinhThietKe={(mauId) => {
              if (mauId) {
                chuyenManHinh('trinh-thiet-ke');
              } else {
                handleTaoCVTuViet();
              }
            }}
          />
        )}

        {/* Màn hình 4: Hồ Sơ Cá Nhân (Master Profile) */}
        {manHinh === 'ho-so-goc' && (
          <HoSoCaNhan
            nguoiDung={nguoiDung}
            onChuyenTrinhThietKe={() => chuyenManHinh('trinh-thiet-ke')}
          />
        )}

        {/* Màn hình 5: Trình Thiết Kế CV */}
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

      {/* Popup nhắc bản nháp CV chưa lưu (chỉ hiện khi ở ngoài Trình thiết kế) */}
      {manHinh !== 'trinh-thiet-ke' && (
        <NhacNhoCVChuaLuu onTiepTucChinhSua={handleTiepTucCVChuaLuu} />
      )}

      {/* Modal Đánh Giá tự động bật khi người khác mở Link Chia Sẻ (?shareId=...) */}
      <ModalDanhGiaCV
        isOpen={moModalDanhGiaShare}
        onClose={() => setMoModalDanhGiaShare(false)}
        moSanTabVietDanhGia={true}
      />

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
