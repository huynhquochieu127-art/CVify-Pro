import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  X,
  Star,
  MessageSquare,
  Copy,
  Check,
  Share2,
  Loader2,
  ShieldCheck,
  Send,
  AlertTriangle,
  Award,
  Users,
  CheckCircle2,
  Globe,
  ExternalLink,
  Save,
  Target,
} from 'lucide-react';
import { useKhoLuuTruCV } from '../../store';

interface ModalDanhGiaCVProps {
  isOpen: boolean;
  onClose: () => void;
  moSanTabVietDanhGia?: boolean;
}

interface TieuChiDiem {
  boCuc: number;
  noiDung: number;
  kyNang: number;
}

interface DanhGiaItem {
  id: number | string;
  ten_nguoi_danh_gia: string;
  diem_so: number;
  diem_bo_cuc?: number;
  diem_noi_dung?: number;
  diem_ky_nang?: number;
  nhan_xet: string;
  ngay_tao: string;
  nguoi_danh_gia?: {
    id: number;
    ho_ten: string;
    email: string;
  } | null;
}

const TAGS_GOI_Y_NHANH = [
  '✨ Bố cục thoáng, phân cột rõ ràng',
  '🎯 Kỹ năng bám sát vị trí ứng tuyển',
  '🚀 Dự án thực tế có công nghệ nổi bật',
  '💎 Phông chữ & màu sắc chuẩn ATS',
  '📊 Cần thêm số liệu định lượng (%, KPI)',
  '🔗 Nên bổ sung link Github / Portfolio',
  '📝 Mô tả kinh nghiệm nên dùng mô hình STAR',
  '📏 Cân đối lại độ dài giữa các cột',
];

export const ModalDanhGiaCV: React.FC<ModalDanhGiaCVProps> = ({
  isOpen,
  onClose,
  moSanTabVietDanhGia = false,
}) => {
  const {
    cv,
    idCVHienTai,
    maNguoiSoHuuCV,
    tenNguoiSoHuuCV,
    tieuDeCVHienTai,
    napDuLieuCVTuServer,
  } = useKhoLuuTruCV();

  // Lấy thông tin tài khoản đang đăng nhập trong tab hiện tại
  const layUserDangNhap = () => {
    try {
      const raw = sessionStorage.getItem('nguoiDung');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return null;
  };

  const userHienTai = layUserDangNhap();
  const idUserDangNhap = userHienTai?.id ? Number(userHienTai.id) : null;
  const tenUserDangNhap = userHienTai?.ho_ten || userHienTai?.ten || '';

  // Kiểm tra xem có đang mở qua link chia sẻ ?shareId=... hay đang chấm điểm CV của người khác không
  const dangMoQuaShareLink = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('shareId'));
  }, []);

  const [dangChamCVCongDongKhac, setDangChamCVCongDongKhac] = useState(false);

  /**
   * PHÂN QUYỀN RÕ RÀNG:
   * - laCheDoNguoiDanhGia = true: Khi người dùng là NGƯỜI NGOÀI / NGƯỜI ĐÁNH GIÁ
   *   (mở qua link ?shareId=..., hoặc tài khoản đang đăng nhập KHÔNG phải chủ sở hữu CV này).
   *   -> Chỉ hiện duy nhất Form Chấm Điểm & Gửi Đánh Giá! Tuyệt đối KHÔNG hiện Link chia sẻ, KHÔNG hiện nút Gỡ Cộng Đồng, KHÔNG hiện 3 tab của Chủ CV.
   * - laCheDoNguoiDanhGia = false: Khi người dùng là CHỦ SỞ HỮU CV
   *   -> Hiện 3 tab quản lý của Chủ CV (Đánh giá nhận được + Link chia sẻ + Nút Push/Gỡ Cộng đồng, CV Cộng đồng, Điểm ATS).
   */
  const laCheDoNguoiDanhGia = useMemo(() => {
    if (moSanTabVietDanhGia || dangMoQuaShareLink || dangChamCVCongDongKhac) {
      return true;
    }
    if (
      maNguoiSoHuuCV !== null &&
      (idUserDangNhap === null || Number(idUserDangNhap) !== Number(maNguoiSoHuuCV))
    ) {
      return true;
    }
    return false;
  }, [
    moSanTabVietDanhGia,
    dangMoQuaShareLink,
    dangChamCVCongDongKhac,
    maNguoiSoHuuCV,
    idUserDangNhap,
  ]);

  // 3 Tab dành riêng cho Chủ CV
  const [tabChuCV, setTabChuCV] = useState<
    'nhan-xet' | 'cong-dong-cv' | 'cham-diem-ats'
  >('nhan-xet');

  const [danhGiaList, setDanhGiaList] = useState<DanhGiaItem[]>([]);
  const [danhSachCVCongDong, setDanhSachCVCongDong] = useState<any[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const [dangTaiCongDong, setDangTaiCongDong] = useState(false);
  const [dangLuuDeChiaSe, setDangLuuDeChiaSe] = useState(false);
  const [copied, setCopied] = useState(false);

  // State cho Form gửi đánh giá thật vào MySQL (Dành cho Người Đánh Giá)
  const [tenNguoiDG, setTenNguoiDG] = useState(tenUserDangNhap);
  const [vaiTroDG, setVaiTroDG] = useState('Nhà tuyển dụng (HR)');
  const [tieuChi, setTieuChi] = useState<TieuChiDiem>({
    boCuc: 5,
    noiDung: 5,
    kyNang: 5,
  });
  const [tagsChon, setTagsChon] = useState<string[]>([]);
  const [nhanXet, setNhanXet] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [guiThanhCong, setGuiThanhCong] = useState(false);
  const [loiGui, setLoiGui] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (tenUserDangNhap) setTenNguoiDG(tenUserDangNhap);
      setGuiThanhCong(false);
      setLoiGui(null);

      if (!laCheDoNguoiDanhGia) {
        if (idCVHienTai) {
          taiDanhGiaThatTuMySQL(idCVHienTai);
        } else {
          setDanhGiaList([]);
        }
        taiDanhSachCVCongDong();
      }
    } else {
      setDangChamCVCongDongKhac(false);
    }
  }, [isOpen, idCVHienTai, laCheDoNguoiDanhGia, tenUserDangNhap]);

  // 1. Tải danh sách đánh giá THẬT từ MySQL (Chỉ dành cho Chủ CV - Mỗi người đánh giá chỉ hiện 1 lần mới nhất)
  const taiDanhGiaThatTuMySQL = async (cvId: number) => {
    setDangTai(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cv/${cvId}/danh-gia`
      );
      if (res.data?.thanh_cong && Array.isArray(res.data.danh_sach)) {
        const daGap = new Set<string>();
        const dsKhongTrung: DanhGiaItem[] = [];
        for (const item of res.data.danh_sach) {
          const uid = item.nguoi_danh_gia?.id ?? (item as any).ma_nguoi_danh_gia;
          const tenGoc = (item.ten_nguoi_danh_gia || '')
            .split('(')[0]
            .trim()
            .toLowerCase();
          const key = uid ? `uid-${uid}` : `name-${tenGoc || item.id}`;
          if (!daGap.has(key)) {
            daGap.add(key);
            dsKhongTrung.push(item);
          }
        }
        setDanhGiaList(dsKhongTrung);
      } else {
        setDanhGiaList([]);
      }
    } catch (err) {
      console.error('Lỗi khi tải đánh giá từ MySQL:', err);
      setDanhGiaList([]);
    } finally {
      setDangTai(false);
    }
  };

  // 2. Tải danh sách CV Cộng Đồng (Chỉ những CV đã được chủ nhân chủ động Push)
  const taiDanhSachCVCongDong = async () => {
    setDangTaiCongDong(true);
    try {
      const res = await axios.get('http://localhost:5000/api/cv/cong-dong');
      if (res.data?.thanh_cong && Array.isArray(res.data.danh_sach)) {
        setDanhSachCVCongDong(res.data.danh_sach);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách CV cộng đồng:', err);
    } finally {
      setDangTaiCongDong(false);
    }
  };

  // Lưu CV của chủ sở hữu để tạo Link chia sẻ riêng
  const handleLuuCVDeLayLink = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert(
        'Vui lòng đăng nhập tài khoản trước để lưu CV lên hệ thống và lấy link chia sẻ!'
      );
      return;
    }

    setDangLuuDeChiaSe(true);
    try {
      const duLieuGui = {
        tieu_de_cv: tieuDeCVHienTai || 'CV Của Tôi',
        cong_khai: false,
        cho_phep_danh_gia: true,
        noi_dung_cv: {
          thongTinCaNhan: cv.thongTinCaNhan,
          gioiThieu: cv.gioiThieu,
          kinhNghiem: cv.kinhNghiem,
          hocVan: cv.hocVan,
          kyNang: cv.kyNang,
          duAn: cv.duAn,
          chungChi: cv.chungChi,
          khoiTuyChinh: cv.khoiTuyChinh || [],
          anHienKhoi: cv.anHienKhoi,
          boCuc: cv.boCuc,
        },
        thu_tu_khoi: cv.thuTuKhoi,
        dinh_dang_cv: cv.dinhDang,
      };

      const res = await axios.post('http://localhost:5000/api/cv', duLieuGui, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.cv?.id) {
        useKhoLuuTruCV.setState({
          idCVHienTai: res.data.cv.id,
          maNguoiSoHuuCV: res.data.cv.ma_nguoi_dung ?? idUserDangNhap,
          tieuDeCVHienTai: res.data.cv.tieu_de_cv,
        });
        taiDanhGiaThatTuMySQL(res.data.cv.id);
        taiDanhSachCVCongDong();
      }
    } catch (err) {
      console.error('Lỗi lưu CV:', err);
      alert('Không thể kết nối máy chủ Backend (cổng 5000)!');
    } finally {
      setDangLuuDeChiaSe(false);
    }
  };

  const daPushCongDong = useMemo(
    () =>
      Boolean(
        idCVHienTai &&
          danhSachCVCongDong.some((c) => Number(c.id) === Number(idCVHienTai))
      ),
    [idCVHienTai, danhSachCVCongDong]
  );

  // Chủ CV chủ động Push hoặc Gỡ CV trên Bản Tin Cộng Đồng Nghề Nghiệp
  const handleTogglePushCongDong = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập tài khoản để Push CV lên Cộng đồng!');
      return;
    }

    setDangLuuDeChiaSe(true);
    try {
      let targetId = idCVHienTai;
      if (!targetId) {
        const resTao = await axios.post(
          'http://localhost:5000/api/cv',
          {
            tieu_de_cv: tieuDeCVHienTai || 'CV Của Tôi',
            cong_khai: true,
            cho_phep_danh_gia: true,
            noi_dung_cv: {
              thongTinCaNhan: cv.thongTinCaNhan,
              gioiThieu: cv.gioiThieu,
              kinhNghiem: cv.kinhNghiem,
              hocVan: cv.hocVan,
              kyNang: cv.kyNang,
              duAn: cv.duAn,
              chungChi: cv.chungChi,
              khoiTuyChinh: cv.khoiTuyChinh || [],
              anHienKhoi: cv.anHienKhoi,
              boCuc: cv.boCuc,
            },
            thu_tu_khoi: cv.thuTuKhoi,
            dinh_dang_cv: cv.dinhDang,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resTao.data?.cv?.id) {
          targetId = resTao.data.cv.id;
          useKhoLuuTruCV.setState({
            idCVHienTai: targetId,
            maNguoiSoHuuCV: resTao.data.cv.ma_nguoi_dung ?? idUserDangNhap,
            tieuDeCVHienTai: resTao.data.cv.tieu_de_cv,
          });
        }
      } else {
        await axios.put(
          `http://localhost:5000/api/cv/${targetId}/push-cong-dong`,
          { cong_khai: !daPushCongDong },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await taiDanhSachCVCongDong();
    } catch (err) {
      console.error('Lỗi push cộng đồng:', err);
      alert('Không thể cập nhật trạng thái Cộng đồng!');
    } finally {
      setDangLuuDeChiaSe(false);
    }
  };

  // Mở một bản CV của tài khoản khác từ danh sách Cộng đồng để chấm điểm với tư cách Người Đánh Giá
  const handleChonCVCongDongDeDanhGia = async (cvId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cv/public/${cvId}`
      );
      if (res.data?.thanh_cong && res.data.cv) {
        napDuLieuCVTuServer(res.data.cv);
        const chuId =
          res.data.cv.ma_nguoi_dung ?? res.data.cv.nguoi_dung?.id ?? null;
        if (idUserDangNhap === null || Number(chuId) !== Number(idUserDangNhap)) {
          setDangChamCVCongDongKhac(true);
        } else {
          setDangChamCVCongDongKhac(false);
          await taiDanhGiaThatTuMySQL(cvId);
          setTabChuCV('nhan-xet');
        }
      }
    } catch (err) {
      console.error('Lỗi mở CV cộng đồng:', err);
      alert('Không thể tải bản CV này!');
    }
  };

  // Tính điểm trung bình THẬT từ danh sách đánh giá trong MySQL
  const thongKeDiem = useMemo(() => {
    if (danhGiaList.length === 0) {
      return {
        tbChung: 0,
        boCuc: 0,
        noiDung: 0,
        kyNang: 0,
      };
    }
    const n = danhGiaList.length;
    const tbChung =
      danhGiaList.reduce((s, i) => s + (Number(i.diem_so) || 5), 0) / n;
    const boCuc =
      danhGiaList.reduce(
        (s, i) => s + (Number(i.diem_bo_cuc) || Number(i.diem_so) || 5),
        0
      ) / n;
    const noiDung =
      danhGiaList.reduce(
        (s, i) => s + (Number(i.diem_noi_dung) || Number(i.diem_so) || 5),
        0
      ) / n;
    const kyNang =
      danhGiaList.reduce(
        (s, i) => s + (Number(i.diem_ky_nang) || Number(i.diem_so) || 5),
        0
      ) / n;

    return {
      tbChung: Number(tbChung.toFixed(1)),
      boCuc: Number(boCuc.toFixed(1)),
      noiDung: Number(noiDung.toFixed(1)),
      kyNang: Number(kyNang.toFixed(1)),
    };
  }, [danhGiaList]);

  // Tính điểm Chất Lượng & ATS (Thang 100 điểm): Tính trực tiếp từ điểm Đánh Giá Thật (nếu đã có đánh giá) kết hợp nội dung CV
  const ketQuaATS = useMemo(() => {
    const coDanhGia = danhGiaList.length > 0;
    const tiLeBoCuc = coDanhGia ? thongKeDiem.boCuc / 5 : 0;
    const tiLeNoiDung = coDanhGia ? thongKeDiem.noiDung / 5 : 0;
    const tiLeKyNang = coDanhGia ? thongKeDiem.kyNang / 5 : 0;

    const tt = cv.thongTinCaNhan;
    const duThongTin = Boolean(
      tt.hoTen?.trim() &&
        tt.viTriUngTuyen?.trim() &&
        tt.email?.trim() &&
        tt.soDienThoai?.trim()
    );
    const gtDai = (cv.gioiThieu || '').replace(/<[^>]*>/g, '').trim().length;
    const datGT = gtDai >= 20;
    const soKN = cv.kinhNghiem?.length || 0;
    const datHV = (cv.hocVan?.length || 0) > 0;
    const soKyNang = cv.kyNang?.length || 0;
    const datDuAn =
      (cv.duAn?.length || 0) > 0 || (cv.chungChi?.length || 0) > 0;

    const tieuChiATS: {
      ten: string;
      diemDat: number;
      diemToiDa: number;
      dat: boolean;
    }[] = [
      {
        ten: 'Thông tin cá nhân & Liên hệ chuẩn',
        diemDat: coDanhGia
          ? Math.round(tiLeBoCuc * 15)
          : duThongTin
          ? 15
          : 10,
        diemToiDa: 15,
        dat: coDanhGia ? thongKeDiem.boCuc >= 4 : duThongTin,
      },
      {
        ten: 'Mục tiêu nghề nghiệp / Giới thiệu bản thân',
        diemDat: coDanhGia
          ? Math.round(tiLeBoCuc * 15)
          : datGT
          ? 15
          : gtDai > 0
          ? 10
          : 0,
        diemToiDa: 15,
        dat: coDanhGia ? thongKeDiem.boCuc >= 4 : datGT,
      },
      {
        ten: 'Kinh nghiệm làm việc & Mô tả chi tiết',
        diemDat: coDanhGia
          ? Math.round(tiLeNoiDung * 25)
          : soKN > 0
          ? 25
          : 0,
        diemToiDa: 25,
        dat: coDanhGia ? thongKeDiem.noiDung >= 4 : soKN > 0,
      },
      {
        ten: 'Học vấn & Bằng cấp chuyên môn',
        diemDat: coDanhGia
          ? Math.round(tiLeNoiDung * 15)
          : datHV
          ? 15
          : 0,
        diemToiDa: 15,
        dat: coDanhGia ? thongKeDiem.noiDung >= 4 : datHV,
      },
      {
        ten: 'Kỹ năng chuyên môn',
        diemDat: coDanhGia
          ? Math.round(tiLeKyNang * 15)
          : soKyNang >= 3
          ? 15
          : soKyNang * 5,
        diemToiDa: 15,
        dat: coDanhGia ? thongKeDiem.kyNang >= 4 : soKyNang >= 3,
      },
      {
        ten: 'Dự án nổi bật & Chứng chỉ',
        diemDat: coDanhGia
          ? Math.round(tiLeKyNang * 15)
          : datDuAn
          ? 15
          : 5,
        diemToiDa: 15,
        dat: coDanhGia ? thongKeDiem.kyNang >= 4 : datDuAn,
      },
    ];

    const tongDiem = tieuChiATS.reduce((s, item) => s + item.diemDat, 0);
    return { tongDiem, tieuChiATS };
  }, [cv, danhGiaList, thongKeDiem]);

  const shareLink = idCVHienTai
    ? `${window.location.origin}/?shareId=${idCVHienTai}`
    : '';

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTag = (tag: string) => {
    setTagsChon((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Gửi đánh giá THẬT lên MySQL Backend (Dành cho Người Đánh Giá)
  const handleGuiDanhGia = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoiGui(null);

    if (!idCVHienTai) {
      setLoiGui('Không tìm thấy mã bản CV cần đánh giá!');
      return;
    }

    const diemTrungBinh = Math.round(
      (tieuChi.boCuc + tieuChi.noiDung + tieuChi.kyNang) / 3
    );
    const chuoiTags =
      tagsChon.length > 0 ? `[${tagsChon.join(' • ')}] ` : '';
    const noiDungNhanXet =
      nhanXet.trim() ||
      `Đánh giá chi tiết: Bố cục ${tieuChi.boCuc}★, Nội dung ${tieuChi.noiDung}★, Kỹ năng ${tieuChi.kyNang}★.`;

    const tenHienThi = tenNguoiDG.trim()
      ? `${tenNguoiDG.trim()} (${vaiTroDG})`
      : `Người đánh giá (${vaiTroDG})`;

    setDangGui(true);
    try {
      const token = sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await axios.post(
        `http://localhost:5000/api/cv/${idCVHienTai}/danh-gia`,
        {
          ten_nguoi_danh_gia: tenHienThi,
          diem_so: diemTrungBinh,
          diem_bo_cuc: tieuChi.boCuc,
          diem_noi_dung: tieuChi.noiDung,
          diem_ky_nang: tieuChi.kyNang,
          nhan_xet: `${chuoiTags}${noiDungNhanXet}`,
        },
        { headers }
      );

      if (res.data?.thanh_cong) {
        // Chỉ hiển thị thông báo gửi thành công cho Người Đánh Giá, KHÔNG chuyển sang tab của Chủ CV
        setGuiThanhCong(true);
        setNhanXet('');
        setTagsChon([]);
      }
    } catch (err: any) {
      console.error('Lỗi gửi đánh giá:', err);
      setLoiGui(
        err?.response?.data?.thong_bao ||
          'Không thể gửi đánh giá! Hãy kiểm tra xem server MySQL (cổng 5000) đã chạy chưa.'
      );
    } finally {
      setDangGui(false);
    }
  };

  if (!isOpen) return null;

  const tenTacGiaCV =
    tenNguoiSoHuuCV || cv.thongTinCaNhan.hoTen || 'Ứng viên';

  // =========================================================================
  // GIAO DIỆN 1: BÊN NGƯỜI ĐÁNH GIÁ / NGƯỜI NGOÀI (laCheDoNguoiDanhGia = true)
  // Chỉ hiện duy nhất Form Chấm Điểm & Gửi Đánh Giá.
  // Ẩn hoàn toàn Link chia sẻ, nút Push/Gỡ Cộng đồng và 3 tab của Chủ CV!
  // =========================================================================
  if (laCheDoNguoiDanhGia) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[88vh] my-auto flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header dành riêng cho Người Đánh Giá */}
          <div className="flex items-center gap-3 mb-5 pr-8 pb-4 border-b border-slate-100">
            <span className="p-2.5 bg-amber-50 text-amber-500 rounded-2xl border border-amber-200/70 shrink-0">
              <Star size={22} className="fill-amber-400" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Chấm Điểm & Góp Ý Bản CV: {tieuDeCVHienTai || 'CV Ứng Viên'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tác giả CV: <strong className="text-slate-800">{tenTacGiaCV}</strong>
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {guiThanhCong ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2
                  size={48}
                  className="text-emerald-500 mx-auto animate-bounce"
                />
                <h3 className="text-base font-extrabold text-slate-900">
                  Đã gửi đánh giá CV thành công!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Cảm ơn bạn đã dành thời gian chấm điểm và góp ý cho bản CV của{' '}
                  <strong>{tenTacGiaCV}</strong>. Chủ sở hữu CV sẽ nhận được đánh giá này ngay lập tức.
                </p>
                <div className="flex items-center justify-center pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-[#1a91f0] hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGuiDanhGia} className="space-y-4">
                {loiGui && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                    {loiGui}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên của bạn (Người đánh giá):
                    </label>
                    <input
                      type="text"
                      value={tenNguoiDG}
                      onChange={(e) => setTenNguoiDG(e.target.value)}
                      placeholder="Nhập tên của bạn..."
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a91f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vai trò của bạn:
                    </label>
                    <select
                      value={vaiTroDG}
                      onChange={(e) => setVaiTroDG(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a91f0] bg-white"
                    >
                      <option value="Nhà tuyển dụng (HR)">Nhà tuyển dụng (HR)</option>
                      <option value="Bạn bè / Đồng nghiệp">Bạn bè / Đồng nghiệp</option>
                      <option value="Tech Lead / Senior">Tech Lead / Senior</option>
                      <option value="Giảng viên / Mentor">Giảng viên / Mentor</option>
                    </select>
                  </div>
                </div>

                {/* Chấm điểm 3 tiêu chí */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
                  <label className="block text-xs font-extrabold text-slate-800">
                    1. Chấm điểm 3 tiêu chí cho bản CV ({tieuDeCVHienTai}):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        { key: 'boCuc', label: 'Bố cục & Trình bày' },
                        { key: 'noiDung', label: 'Nội dung & Kinh nghiệm' },
                        { key: 'kyNang', label: 'Kỹ năng & Dự án' },
                      ] as const
                    ).map((item) => (
                      <div
                        key={item.key}
                        className="flex flex-col gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200"
                      >
                        <span className="text-xs font-bold text-slate-700">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setTieuChi((prev) => ({
                                  ...prev,
                                  [item.key]: star,
                                }))
                              }
                              className="cursor-pointer transition transform hover:scale-110"
                            >
                              <Star
                                size={16}
                                className={
                                  star <= tieuChi[item.key]
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chọn thẻ gợi ý nhận xét 1-chạm */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-800">
                    2. Chọn nhanh thẻ góp ý (bấm để đính kèm vào nhận xét):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAGS_GOI_Y_NHANH.map((tag) => {
                      const active = tagsChon.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                            active
                              ? 'bg-[#1a91f0] text-white border-[#1a91f0]'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nhập lời khuyên chi tiết */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    3. Nhận xét & Góp ý chi tiết:
                  </label>
                  <textarea
                    rows={3}
                    value={nhanXet}
                    onChange={(e) => setNhanXet(e.target.value)}
                    placeholder="Nhập nhận xét của bạn về bản CV này..."
                    className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#1a91f0]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={dangGui}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a91f0] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm"
                  >
                    <Send size={13} />
                    <span>
                      {dangGui ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá'}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // =========================================================================
  // GIAO DIỆN 2: BÊN CHỦ SỞ HỮU CV (laCheDoNguoiDanhGia = false)
  // Chỉ Chủ CV mới nhìn thấy 3 Tab quản lý:
  //   1. Đánh Giá Nhận Được (Kèm Link chia sẻ + Nút Push/Gỡ Cộng đồng)
  //   2. CV Cộng Đồng
  //   3. Điểm ATS (100 điểm)
  // =========================================================================
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[88vh] my-auto flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header dành cho Chủ CV */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-8">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-500 rounded-2xl border border-amber-200/70">
              <Star size={20} className="fill-amber-400" />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              Quản Lý Đánh Giá & Chia Sẻ CV Của Bạn ({tieuDeCVHienTai || 'CV Hiện Tại'})
            </h2>
          </div>
        </div>

        {/* 3 Tabs Dành Riêng Cho Chủ CV */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setTabChuCV('nhan-xet')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tabChuCV === 'nhan-xet'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={13} className="text-[#1a91f0]" />
            <span>Đánh Giá ({danhGiaList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTabChuCV('cong-dong-cv')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tabChuCV === 'cong-dong-cv'
                ? 'bg-white text-purple-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe size={13} className="text-purple-600" />
            <span>CV Cộng Đồng ({danhSachCVCongDong.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTabChuCV('cham-diem-ats')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              tabChuCV === 'cham-diem-ats'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Điểm ATS ({ketQuaATS.tongDiem}/100)</span>
          </button>
        </div>

        {/* NỘI DUNG TỪNG TAB CỦA CHỦ CV */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* =============================================================== */}
          {/* TAB 1: LINK CHIA SẺ, PUSH CỘNG ĐỒNG & ĐÁNH GIÁ NHẬN ĐƯỢC         */}
          {/* =============================================================== */}
          {tabChuCV === 'nhan-xet' && (
            <>
              {/* Hộp Link Chia Sẻ (Chỉ Chủ CV mới thấy) */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <Share2 size={13} className="text-[#1a91f0]" />
                    <span>Link riêng tư để bạn gửi cho người khác vào chấm điểm CV này:</span>
                  </div>
                  {idCVHienTai ? (
                    <p className="text-xs text-[#1a91f0] font-mono font-bold truncate mt-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                      {shareLink}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-800 mt-1">
                      Bản CV này chưa lưu. Hãy bấm nút <strong>Lưu & Tạo Link</strong> bên phải!
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {idCVHienTai ? (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a91f0] hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                    >
                      {copied ? (
                        <Check size={13} className="text-white" />
                      ) : (
                        <Copy size={13} />
                      )}
                      <span>{copied ? 'Đã copy link!' : 'Copy Link CV'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLuuCVDeLayLink}
                      disabled={dangLuuDeChiaSe}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Save size={13} />
                      <span>
                        {dangLuuDeChiaSe ? 'Đang lưu...' : 'Lưu & Tạo Link Chia Sẻ'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hộp Chủ Động Push CV Lên Bản Tin Cộng Đồng Nghề Nghiệp (Chỉ Chủ CV mới thấy) */}
              <div
                className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  daPushCongDong
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-purple-50/60 border-purple-200/80'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                  <Globe
                    size={14}
                    className={
                      daPushCongDong ? 'text-emerald-600' : 'text-purple-600'
                    }
                  />
                  <span>
                    {daPushCongDong
                      ? '🌐 Đã Push lên Bản Tin Cộng Đồng Nghề Nghiệp CVify'
                      : '🔒 Chế độ Cộng Đồng: Đang ẩn (Riêng tư)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePushCongDong}
                  disabled={dangLuuDeChiaSe}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    daPushCongDong
                      ? 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-2xs'
                  }`}
                >
                  <Globe size={13} />
                  <span>
                    {daPushCongDong
                      ? 'Gỡ khỏi Cộng Đồng'
                      : '🚀 Push CV lên Cộng Đồng'}
                  </span>
                </button>
              </div>

              {/* Thống kê điểm thật */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90">
                <div className="flex flex-col items-center justify-center text-center p-2 bg-white rounded-xl border border-slate-200/80">
                  <div className="text-2xl font-black text-slate-900 flex items-center gap-1">
                    <span>{danhGiaList.length > 0 ? thongKeDiem.tbChung : '—'}</span>
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                    {danhGiaList.length} lượt đánh giá thật
                  </p>
                </div>

                {[
                  { label: 'Điểm Bố cục', diem: thongKeDiem.boCuc, color: 'bg-[#1a91f0]' },
                  { label: 'Điểm Nội dung', diem: thongKeDiem.noiDung, color: 'bg-emerald-500' },
                  { label: 'Điểm Kỹ năng', diem: thongKeDiem.kyNang, color: 'bg-purple-500' },
                ].map((tc) => (
                  <div
                    key={tc.label}
                    className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col justify-center"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {tc.label}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {danhGiaList.length > 0 ? `${tc.diem}/5 ★` : 'Chưa có'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tc.color}`}
                        style={{
                          width:
                            danhGiaList.length > 0
                              ? `${(tc.diem / 5) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Danh sách nhận xét thật từ MySQL */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-[#1a91f0]" />
                    <span>Nhận xét từ người đánh giá ({danhGiaList.length})</span>
                  </h3>
                </div>

                {dangTai ? (
                  <div className="py-10 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#1a91f0]" />
                    <span>Đang tải đánh giá...</span>
                  </div>
                ) : danhGiaList.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-700">
                      Chưa có ai đánh giá bản CV này của bạn.
                    </p>
                  </div>
                ) : (
                  danhGiaList.map((dg) => (
                    <div
                      key={dg.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#1a91f0] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {(dg.ten_nguoi_danh_gia || 'U')[0].toUpperCase()}
                          </span>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900">
                              {dg.ten_nguoi_danh_gia || 'Người dùng ẩn danh'}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>
                                {new Date(dg.ngay_tao).toLocaleString('vi-VN')}
                              </span>
                              {dg.diem_bo_cuc && (
                                <span className="text-slate-500 font-medium">
                                  • Bố cục: {dg.diem_bo_cuc}★ | Nội dung:{' '}
                                  {dg.diem_noi_dung}★ | Kỹ năng: {dg.diem_ky_nang}★
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < (dg.diem_so || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed pl-10">
                        {dg.nhan_xet}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* =============================================================== */}
          {/* TAB 2: DANH SÁCH CV CỘNG ĐỒNG                                   */}
          {/* =============================================================== */}
          {tabChuCV === 'cong-dong-cv' && (
            <div className="space-y-3">
              {dangTaiCongDong ? (
                <div className="py-10 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span>Đang tải danh sách CV...</span>
                </div>
              ) : danhSachCVCongDong.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                  Chưa có bản CV nào được Push lên Cộng Đồng.
                </div>
              ) : (
                <div className="space-y-2">
                  {danhSachCVCongDong.map((item) => {
                    const laCVCuaMinh =
                      idUserDangNhap !== null &&
                      Number(item.ma_nguoi_dung ?? item.nguoi_dung?.id) ===
                        Number(idUserDangNhap);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 truncate">
                              {item.tieu_de_cv || `CV #${item.id}`}
                            </span>
                            {laCVCuaMinh && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                CV của bạn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Tác giả:{' '}
                            <strong className="text-slate-700">
                              {item.nguoi_dung?.ho_ten || 'Ứng viên'}
                            </strong>{' '}
                            • Điểm TB:{' '}
                            <strong className="text-amber-600">
                              {item.diem_trung_binh || 5.0} ★
                            </strong>{' '}
                            ({item._count?.danh_gia ?? item.so_luot_danh_gia ?? 0}{' '}
                            đánh giá)
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!laCVCuaMinh && (
                            <button
                              type="button"
                              onClick={() => handleChonCVCongDongDeDanhGia(item.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1a91f0] hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                            >
                              <ExternalLink size={12} />
                              <span>Chấm Điểm CV Này</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* TAB 3: CHẤM ĐIỂM CHUẨN ATS & ĐÁNH GIÁ (THANG 100 ĐIỂM)          */}
          {/* =============================================================== */}
          {tabChuCV === 'cham-diem-ats' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full">
                    <Award size={12} />
                    Phân tích CV Thời Gian Thực
                  </span>
                  <h3 className="text-base font-extrabold">
                    Điểm Chất Lượng & Độ Chuẩn ATS Của Bản CV Này
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/15 shrink-0">
                  <span className="text-3xl font-black text-amber-400">
                    {ketQuaATS.tongDiem}
                    <span className="text-sm font-bold text-slate-300">/100</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mt-0.5">
                    {ketQuaATS.tongDiem >= 85
                      ? 'Hồ Sơ Xuất Sắc'
                      : ketQuaATS.tongDiem >= 65
                      ? 'Khá Tốt - Sẵn Sàng Ứng Tuyển'
                      : 'Cần Bổ Sung Thêm'}
                  </span>
                </div>
              </div>

              {/* BANNER GỢI Ý SO KHỚP VỚI TIN TUYỂN DỤNG CỤ THỂ */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                    <Target size={18} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      So Khớp CV Với Tin Tuyển Dụng Cụ Thể (JD Matcher)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Dán tin tuyển dụng bạn muốn nộp để đối chiếu từ khóa và nhận gợi ý bổ sung 1-click.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('cvify_open_so_khop_jd'));
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs"
                >
                  <Target size={13} />
                  <span>So Khớp JD Ngay</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {ketQuaATS.tieuChiATS.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      item.dat
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : 'bg-amber-50/50 border-amber-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.dat ? (
                        <CheckCircle2
                          size={17}
                          className="text-emerald-600 shrink-0"
                        />
                      ) : (
                        <AlertTriangle
                          size={17}
                          className="text-amber-600 shrink-0"
                        />
                      )}
                      <h4 className="text-xs font-extrabold text-slate-900">
                        {item.ten}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0 ${
                        item.dat
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      +{item.diemDat}/{item.diemToiDa}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
export default ModalDanhGiaCV;
