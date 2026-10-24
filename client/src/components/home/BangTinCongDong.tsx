// client/src/components/home/BangTinCongDong.tsx
import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Send,
  Sparkles,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Flame,
  Award,
  Briefcase,
} from 'lucide-react';

export interface BaiDangType {
  id: string;
  tacGia: {
    ten: string;
    chucDanh: string;
    avatar?: string;
    isVip?: boolean;
  };
  thoiGian: string;
  noiDung: string;
  hashtags: string[];
  luotThich: number;
  daThich: boolean;
  binhLuan: Array<{
    id: string;
    ten: string;
    avatar?: string;
    noiDung: string;
    thoiGian: string;
  }>;
}

export interface TinTucType {
  id: string;
  tieuDe: string;
  danhMuc: string;
  thoiGianDoc: string;
  luotXem: string;
  ngayDang: string;
  moTaNgan: string;
  noiDungChiTiet: string[];
  diemNhan: string;
}

export interface BangTinCongDongProps {
  tenNguoiDung?: string;
  avatarNguoiDung?: string;
  daDangNhap?: boolean;
  onYeuCauDangNhap?: () => void;
}

// 3 bài viết mẫu thực tế
const BAI_DANG_MAU: BaiDangType[] = [
  {
    id: 'post-1',
    tacGia: {
      ten: 'Trần Minh Quang',
      chucDanh: 'Senior Tech Recruiter @ VinAI • Cựu HR Shopee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isVip: true,
    },
    thoiGian: '2 giờ trước',
    noiDung:
      '🚀 Chia sẻ thật lòng: 70% CV ngành Tech bị hệ thống ATS tự động loại trước khi HR kịp mở file!\n\n3 nguyên tắc vàng để CV của bạn đạt trên 95% điểm ATS:\n1. Định dạng 1 cột hoặc 2 cột tiêu chuẩn (CVify Pro xuất PDF vector cực chuẩn).\n2. Tuyệt đối không nhét bảng biểu ma trận phức tạp hay icon đồ họa thay cho chữ.\n3. Đưa đúng từ khóa kỹ thuật (ví dụ: React, TypeScript, Docker) khớp với mô tả JD ở phần Kỹ năng & Dự án.\n\nAnh em nào cần review CV cứ comment bên dưới nhé, mình sẽ hỗ trợ góp ý!',
    hashtags: ['#KinhNghiem', '#ReviewCV', '#TuyenDungIT', '#ChuanATS'],
    luotThich: 48,
    daThich: false,
    binhLuan: [
      {
        id: 'c-1',
        ten: 'Nguyễn Tiến Đạt',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        noiDung: 'Bài viết rất hữu ích ạ! Em vừa tối ưu lại CV trên web đạt điểm cao hẳn.',
        thoiGian: '1 giờ trước',
      },
      {
        id: 'c-2',
        ten: 'Vũ Hải Yến',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        noiDung: 'Anh Quang cho em xin phép gửi CV qua inbox nhờ anh xem giúp với ạ.',
        thoiGian: '30 phút trước',
      },
    ],
  },
  {
    id: 'post-2',
    tacGia: {
      ten: 'Lê Thuỳ Linh',
      chucDanh: 'Frontend Developer @ FPT Software • Top 5 Hackathon 2025',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isVip: false,
    },
    thoiGian: '5 giờ trước',
    noiDung:
      '🎉 Em vừa nhận được Offer Frontend Fresher với mức lương khởi điểm 14M sau 3 vòng phỏng vấn gắt gao!\n\nKinh nghiệm rút ra: Người phỏng vấn dành hơn 15 phút chỉ để hỏi xoay quanh 2 dự án thực tế em liệt kê trong CV. Hãy dùng phương pháp STAR (Situation - Task - Action - Result) để lượng hóa kết quả. Đừng chỉ ghi "Làm website", hãy ghi "Tối ưu tốc độ tải trang tăng 35% bằng Vite & Lazy Loading".\n\nChúc mọi người sớm có công việc ưng ý nhé!',
    hashtags: ['#PhongVan', '#FresherIT', '#Frontend', '#ChiaSeKinhNghiem'],
    luotThich: 82,
    daThich: true,
    binhLuan: [
      {
        id: 'c-3',
        ten: 'Hoàng Anh Tuấn',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        noiDung: 'Chúc mừng bạn nha! Tips mô tả dự án bằng STAR quá chuẩn luôn.',
        thoiGian: '3 giờ trước',
      },
    ],
  },
  {
    id: 'post-3',
    tacGia: {
      ten: 'Nguyễn Hoàng Nam',
      chucDanh: 'HR Business Partner @ Techcombank',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      isVip: true,
    },
    thoiGian: '1 ngày trước',
    noiDung:
      '⚠️ 3 lỗi ngớ ngẩn khiến CV của bạn bị loại chỉ sau 6 giây lướt qua:\n\n• Email thiếu chuyên nghiệp: Tránh dùng nickname tuổi teen, hãy dùng họ_ten@gmail.com.\n• Quá dài dòng lan man: Đối với dưới 3 năm kinh nghiệm, CV 1 trang A4 là hoàn hảo nhất.\n• Lỗi chính tả & thụt lề lộn xộn: Thể hiện sự thiếu cẩn thận trước khi phỏng vấn.\n\nHãy dành 10 phút kiểm tra lại CV của bạn trước khi bấm nút Ứng tuyển nhé!',
    hashtags: ['#LoiThuongGap', '#CVMoiNhat', '#TuVanNgheNghiep'],
    luotThich: 64,
    daThich: false,
    binhLuan: [],
  },
];

// Danh sách tin tức tuyển dụng
const DANH_SACH_TIN_TUC: TinTucType[] = [
  {
    id: 'news-1',
    tieuDe: 'Top 5 kỹ năng công nghệ được săn đón nhiều nhất quý 4/2026',
    danhMuc: 'Xu hướng công nghệ',
    thoiGianDoc: '3 phút đọc',
    luotXem: '1.2k',
    ngayDang: 'Hôm nay',
    moTaNgan:
      'Báo cáo từ hơn 500 doanh nghiệp công nghệ cho thấy nhu cầu tuyển dụng các vị trí AI Engineer, Fullstack và Cloud đang dẫn đầu.',
    noiDungChiTiet: [
      '1. Trí tuệ nhân tạo (AI/LLM Integration): Kỹ năng tích hợp mô hình ngôn ngữ lớn vào sản phẩm web/app.',
      '2. TypeScript & Next.js/Vite: Tiêu chuẩn bắt buộc cho mọi vị trí Frontend hiện đại.',
      '3. Cloud & DevOps cơ bản (Docker, AWS): Lập trình viên biết tự deploy luôn có lợi thế mức lương cao hơn 25%.',
      '4. Kỹ năng giao tiếp và làm việc nhóm Agile trong môi trường hybrid/remote.',
      '5. Tư duy giải quyết vấn đề thực tế (Problem Solving) thay vì chỉ học vẹt cú pháp.',
    ],
    diemNhan: 'Lời khuyên: Hãy bổ sung ít nhất 1 dự án có tích hợp AI/Cloud vào CV để gây ấn tượng mạnh với nhà tuyển dụng.',
  },
  {
    id: 'news-2',
    tieuDe: 'Báo cáo mức lương ngành IT & Marketing mới nhất năm 2026',
    danhMuc: 'Báo cáo lương thưởng',
    thoiGianDoc: '5 phút đọc',
    luotXem: '2.5k',
    ngayDang: 'Hôm qua',
    moTaNgan:
      'Khảo sát chi tiết dải lương từ Fresher, Junior đến Senior tại thị trường Việt Nam năm 2026.',
    noiDungChiTiet: [
      '• Fresher IT (0 - 1 năm): Dao động từ 9.000.000 - 15.000.000 VNĐ tùy theo trình độ tiếng Anh và dự án thực tế.',
      '• Junior (1 - 3 năm): Mức lương trung bình từ 16.000.000 - 28.000.000 VNĐ.',
      '• Senior (> 4 năm): Từ 35.000.000 - 65.000.000 VNĐ, đặc biệt khối FinTech và AI có thể chạm mốc 80.000.000 VNĐ.',
      '• Ngành Digital Marketing & Performance: Fresher từ 8M - 12M, Specialist từ 18M - 30M.',
    ],
    diemNhan: 'Biết rõ mức giá thị trường sẽ giúp bạn tự tin đàm phán mức lương xứng đáng trong buổi phỏng vấn.',
  },
  {
    id: 'news-3',
    tieuDe: 'Bí quyết đàm phán lương hiệu quả cho sinh viên mới ra trường',
    danhMuc: 'Cẩm nang phỏng vấn',
    thoiGianDoc: '4 phút đọc',
    luotXem: '980',
    ngayDang: '3 ngày trước',
    moTaNgan:
      'Cách trả lời câu hỏi "Mức lương mong muốn của bạn là bao nhiêu?" một cách khéo léo và không bị ép giá.',
    noiDungChiTiet: [
      '1. Nghiên cứu trước dải lương thị trường của vị trí ứng tuyển.',
      '2. Đưa ra khoảng lương (Range) thay vì một con số cố định, ví dụ: "Em kỳ vọng khoảng 10 - 13 triệu".',
      '3. Nhấn mạnh giá trị bạn có thể đóng góp ngay lập tức cho dự án của công ty.',
      '4. Hỏi thêm về phúc lợi đi kèm: tháng lương 13, phụ cấp ăn trưa, chứng chỉ công nghệ được tài trợ.',
    ],
    diemNhan: 'Tự tin nhưng khiêm tốn là chìa khóa để đạt mức offer cao nhất có thể.',
  },
  {
    id: 'news-4',
    tieuDe: 'Làn sóng tuyển dụng IT cuối năm: Cơ hội nào cho ứng viên mới?',
    danhMuc: 'Thị trường tuyển dụng',
    thoiGianDoc: '3 phút đọc',
    luotXem: '1.6k',
    ngayDang: '5 ngày trước',
    moTaNgan:
      'Các tập đoàn đang mở rộng đợt tuyển dụng lớn cho kế hoạch phát triển 2026. Chuẩn bị CV ngay từ bây giờ.',
    noiDungChiTiet: [
      'Nhiều doanh nghiệp bắt đầu tăng tốc tuyển dụng từ tháng 10 để đào tạo nguồn nhân lực sẵn sàng cho dự án năm mới.',
      'Các vị trí săn đón: Frontend, Backend NodeJS/Java, QA/Tester và Data Analyst.',
    ],
    diemNhan: 'Nộp CV sớm trong 48h đầu khi tin tuyển dụng xuất hiện giúp tăng 3 lần tỷ lệ được gọi phỏng vấn.',
  },
];

export const BangTinCongDong: React.FC<BangTinCongDongProps> = ({
  tenNguoiDung = 'Bạn',
  avatarNguoiDung = '',
  daDangNhap = false,
  onYeuCauDangNhap,
}) => {
  // Danh sách bài đăng trong state
  const [danhSachBaiDang, setDanhSachBaiDang] = useState<BaiDangType[]>(BAI_DANG_MAU);

  // Ô tạo bài viết
  const [noiDungBaiMoi, setNoiDungBaiMoi] = useState('');
  const [thongBaoDang, setThongBaoDang] = useState<string | null>(null);

  // Quản lý bình luận
  const [moBinhLuanId, setMoBinhLuanId] = useState<string | null>(null);
  const [noiDungBinhLuan, setNoiDungBinhLuan] = useState<{ [postId: string]: string }>({});

  // Toast sao chép link
  const [toastSaoChep, setToastSaoChep] = useState(false);

  // Modal xem chi tiết tin tức
  const [tinTucDangXem, setTinTucDangXem] = useState<TinTucType | null>(null);

  // Xử lý gắn hashtag nhanh vào ô nhập
  const handleGanHashtag = (tag: string) => {
    if (!noiDungBaiMoi.includes(tag)) {
      setNoiDungBaiMoi((prev) => (prev ? `${prev} ${tag}` : tag));
    }
  };

  // Xử lý đăng bài viết mới
  const handleDangBai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noiDungBaiMoi.trim()) return;

    if (!daDangNhap && onYeuCauDangNhap) {
      onYeuCauDangNhap();
      return;
    }

    // Tự động phân tích hashtags trong bài
    const hashtagsTrichXuat = noiDungBaiMoi.match(/#[a-zA-Z0-9_À-ỹ]+/g) || ['#KinhNghiem'];

    const baiMoi: BaiDangType = {
      id: `post-${Date.now()}`,
      tacGia: {
        ten: tenNguoiDung || 'Thành Viên CVify',
        chucDanh: 'Ứng viên tiềm năng • Thành viên CVify Pro',
        avatar: avatarNguoiDung || undefined,
        isVip: false,
      },
      thoiGian: 'Vừa xong',
      noiDung: noiDungBaiMoi.trim(),
      hashtags: hashtagsTrichXuat,
      luotThich: 1,
      daThich: true,
      binhLuan: [],
    };

    setDanhSachBaiDang([baiMoi, ...danhSachBaiDang]);
    setNoiDungBaiMoi('');
    setThongBaoDang('🎉 Bài viết của bạn đã được đăng lên cộng đồng!');
    setTimeout(() => setThongBaoDang(null), 3500);
  };

  // Xử lý Thích / Bỏ thích
  const handleBamThich = (postId: string) => {
    setDanhSachBaiDang((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          const trangThaiMoi = !item.daThich;
          return {
            ...item,
            daThich: trangThaiMoi,
            luotThich: trangThaiMoi ? item.luotThich + 1 : item.luotThich - 1,
          };
        }
        return item;
      })
    );
  };

  // Xử lý thêm bình luận
  const handleGuiBinhLuan = (postId: string) => {
    const text = (noiDungBinhLuan[postId] || '').trim();
    if (!text) return;

    setDanhSachBaiDang((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          return {
            ...item,
            binhLuan: [
              ...item.binhLuan,
              {
                id: `cmt-${Date.now()}`,
                ten: tenNguoiDung || 'Bạn',
                avatar: avatarNguoiDung || undefined,
                noiDung: text,
                thoiGian: 'Vừa xong',
              },
            ],
          };
        }
        return item;
      })
    );

    setNoiDungBinhLuan((prev) => ({ ...prev, [postId]: '' }));
  };

  // Xử lý Sao chép link bài viết
  const handleChiaSe = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastSaoChep(true);
    setTimeout(() => setToastSaoChep(false), 2500);
  };

  const chuCaiDau = tenNguoiDung ? tenNguoiDung.trim().charAt(0).toUpperCase() : 'U';

  return (
    <section className="py-14 px-4 sm:px-6 bg-[#f4f2ee] border-b border-[#e0dfdc]">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề phân hệ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0a66c2] text-xs font-bold mb-2 shadow-2xs">
              <Sparkles size={14} />
              <span>Cộng Đồng Nghề Nghiệp CVify</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bản Tin Nghề Nghiệp & Chia Sẻ Kinh Nghiệm
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Giao lưu, hỏi đáp mẹo làm CV chuẩn ATS và đón đầu xu hướng tuyển dụng mới nhất 2026.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hơn 12.4k ứng viên đang online</span>
          </div>
        </div>

        {/* Bố cục 2 cột: 65% Bảng tin | 35% Xu hướng tin tức */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================== */}
          {/* CỘT TRÁI (65% - lg:col-span-8): COMMUNITY FEED              */}
          {/* ========================================================== */}
          <div className="lg:col-span-8 space-y-5">
            {/* 1. KHUNG TẠO BÀI VIẾT NHANH (Create Post Box) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs transition hover:shadow-md">
              {thongBaoDang && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{thongBaoDang}</span>
                </div>
              )}

              <form onSubmit={handleDangBai} className="space-y-3.5">
                <div className="flex items-start gap-3">
                  {/* Avatar người đăng */}
                  <div className="relative shrink-0 mt-0.5">
                    {avatarNguoiDung ? (
                      <img
                        src={avatarNguoiDung}
                        alt={tenNguoiDung}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold text-sm border border-blue-200">
                        {chuCaiDau}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  {/* Ô nhập nội dung */}
                  <div className="flex-1">
                    <textarea
                      rows={3}
                      value={noiDungBaiMoi}
                      onChange={(e) => setNoiDungBaiMoi(e.target.value)}
                      placeholder={`${tenNguoiDung} ơi, bạn muốn chia sẻ kinh nghiệm làm CV hay mẹo phỏng vấn gì hôm nay?`}
                      className="w-full text-xs sm:text-sm p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition resize-none placeholder:text-slate-400 leading-relaxed text-slate-800"
                    />
                  </div>
                </div>

                {/* Hàng công cụ gắn tag & nút Đăng Bài */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                  {/* Gợi ý Hashtags nhanh */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">
                      Gắn thẻ nhanh:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGanHashtag('#KinhNghiem')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0a66c2] text-slate-600 font-semibold text-[11px] transition cursor-pointer"
                    >
                      #KinhNghiem
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGanHashtag('#ReviewCV')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0a66c2] text-slate-600 font-semibold text-[11px] transition cursor-pointer"
                    >
                      #ReviewCV
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGanHashtag('#PhongVan')}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0a66c2] text-slate-600 font-semibold text-[11px] transition cursor-pointer"
                    >
                      #PhongVan
                    </button>
                  </div>

                  {/* Nút bấm Đăng Bài màu xanh LinkedIn */}
                  <button
                    type="submit"
                    disabled={!noiDungBaiMoi.trim()}
                    className="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] disabled:bg-blue-300 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition active:scale-95 cursor-pointer ml-auto"
                  >
                    <Send size={13} />
                    <span>Đăng Bài</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 2. DANH SÁCH CÁC BÀI VIẾT (Feed Posts List) */}
            <div className="space-y-4">
              {danhSachBaiDang.map((bai) => {
                const moBinhLuan = moBinhLuanId === bai.id;
                const chuCaiTacGia = bai.tacGia.ten.trim().charAt(0).toUpperCase();

                return (
                  <article
                    key={bai.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition duration-200"
                  >
                    {/* Phần đầu: Tác giả & Thời gian */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {bai.tacGia.avatar ? (
                            <img
                              src={bai.tacGia.avatar}
                              alt={bai.tacGia.ten}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0a66c2] flex items-center justify-center font-bold text-sm border border-blue-200">
                              {chuCaiTacGia}
                            </div>
                          )}
                          {bai.tacGia.isVip && (
                            <span
                              className="absolute -bottom-1 -right-1 bg-amber-400 text-white p-0.5 rounded-full border-2 border-white shadow-2xs"
                              title="Tài khoản chuyên gia uy tín"
                            >
                              <Award size={10} />
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-[#0a66c2] cursor-pointer transition">
                              {bai.tacGia.ten}
                            </h4>
                            {bai.tacGia.isVip && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {bai.tacGia.chucDanh}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Clock size={11} />
                            <span>{bai.thoiGian}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Nội dung bài viết */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3.5">
                      {bai.noiDung}
                    </div>

                    {/* Hashtags nổi bật */}
                    {bai.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {bai.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-semibold text-[#0a66c2] bg-blue-50/70 hover:bg-blue-100/70 px-2.5 py-0.5 rounded-md transition cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Thanh thông số & Tương tác */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                        <span className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px]">
                            ❤️
                          </span>
                          <strong className="text-slate-600 font-semibold">{bai.luotThich}</strong>{' '}
                          lượt thích
                        </span>

                        <span>{bai.binhLuan.length} bình luận</span>
                      </div>

                      {/* Hàng nút bấm: Thích - Bình luận - Chia sẻ */}
                      <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-100 text-xs">
                        {/* Nút Thích */}
                        <button
                          type="button"
                          onClick={() => handleBamThich(bai.id)}
                          className={`flex items-center justify-center gap-2 py-2 rounded-xl font-bold transition active:scale-95 cursor-pointer ${
                            bai.daThich
                              ? 'text-rose-600 bg-rose-50/60'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <Heart
                            size={16}
                            className={bai.daThich ? 'fill-rose-600 text-rose-600' : ''}
                          />
                          <span>{bai.daThich ? 'Đã thích' : 'Thích'}</span>
                        </button>

                        {/* Nút Bình luận */}
                        <button
                          type="button"
                          onClick={() =>
                            setMoBinhLuanId(moBinhLuanId === bai.id ? null : bai.id)
                          }
                          className={`flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition active:scale-95 cursor-pointer ${
                            moBinhLuan
                              ? 'text-[#0a66c2] bg-blue-50'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <MessageSquare size={16} />
                          <span>Bình luận</span>
                        </button>

                        {/* Nút Chia sẻ */}
                        <button
                          type="button"
                          onClick={handleChiaSe}
                          className="flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95 cursor-pointer"
                        >
                          <Share2 size={16} />
                          <span>Chia sẻ</span>
                        </button>
                      </div>
                    </div>

                    {/* Vùng bình luận mở rộng */}
                    {moBinhLuan && (
                      <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3 animate-fade-in">
                        {/* Ô nhập bình luận */}
                        <div className="flex items-center gap-2.5">
                          <input
                            type="text"
                            value={noiDungBinhLuan[bai.id] || ''}
                            onChange={(e) =>
                              setNoiDungBinhLuan({
                                ...noiDungBinhLuan,
                                [bai.id]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleGuiBinhLuan(bai.id);
                              }
                            }}
                            placeholder="Viết bình luận của bạn..."
                            className="flex-1 text-xs py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] transition"
                          />
                          <button
                            type="button"
                            onClick={() => handleGuiBinhLuan(bai.id)}
                            className="p-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white transition active:scale-90 cursor-pointer shadow-xs"
                          >
                            <Send size={13} />
                          </button>
                        </div>

                        {/* Danh sách bình luận */}
                        {bai.binhLuan.length > 0 && (
                          <div className="space-y-2.5 pt-1">
                            {bai.binhLuan.map((cmt) => (
                              <div
                                key={cmt.id}
                                className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs"
                              >
                                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0a66c2] flex items-center justify-center font-bold text-[11px] shrink-0">
                                  {cmt.ten.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-[11px]">
                                      {cmt.ten}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {cmt.thoiGian}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">
                                    {cmt.noiDung}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* ========================================================== */}
          {/* CỘT PHẢI (35% - lg:col-span-4): CAREER NEWS & TRENDS        */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 space-y-5">
            {/* Box Tin tức tuyển dụng */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs sticky top-20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                    <Flame size={16} />
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    Xu Hướng Nghề Nghiệp 2026
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Mới nhất
                </span>
              </div>

              {/* Danh sách các bài tin tức */}
              <div className="space-y-3.5">
                {DANH_SACH_TIN_TUC.map((tin, index) => (
                  <div
                    key={tin.id}
                    onClick={() => setTinTucDangXem(tin)}
                    className="group/item p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xs font-black text-slate-400 group-hover/item:text-[#0a66c2] transition mt-0.5">
                        0{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] font-bold text-[#0a66c2] bg-blue-50/90 px-2 py-0.5 rounded mb-1">
                          {tin.danhMuc}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover/item:text-[#0a66c2] transition line-clamp-2 leading-snug">
                          {tin.tieuDe}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            <span>{tin.thoiGianDoc}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye size={10} />
                            <span>{tin.luotXem}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box Mẹo viết CV nhanh */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#0a66c2] mb-1">
                  <Briefcase size={14} />
                  <span>Mẹo Đặt Tên CV Chuẩn HR</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Đặt tên file dạng: <strong className="text-slate-800">CV_ViTri_HoTen.pdf</strong> để HR dễ tìm kiếm hồ sơ của bạn nhất.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TOAST THÔNG BÁO SAO CHÉP LINK                                  */}
      {/* ============================================================== */}
      {toastSaoChep && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>Đã sao chép link bài viết vào bộ nhớ tạm!</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL XEM CHI TIẾT TIN TỨC XU HƯỚNG                            */}
      {/* ============================================================== */}
      {tinTucDangXem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setTinTucDangXem(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="inline-block text-xs font-bold text-[#0a66c2] bg-blue-50 px-2.5 py-1 rounded-full mb-2">
              {tinTucDangXem.danhMuc}
            </span>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mb-2">
              {tinTucDangXem.tieuDe}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-100">
              <span>{tinTucDangXem.ngayDang}</span>
              <span>•</span>
              <span>{tinTucDangXem.thoiGianDoc}</span>
              <span>•</span>
              <span>{tinTucDangXem.luotXem} lượt xem</span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {tinTucDangXem.moTaNgan}
            </p>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              {tinTucDangXem.noiDungChiTiet.map((doan, i) => (
                <p key={i}>{doan}</p>
              ))}
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 leading-relaxed">
              💡 <strong>{tinTucDangXem.diemNhan}</strong>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setTinTucDangXem(null)}
                className="px-4 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BangTinCongDong;
