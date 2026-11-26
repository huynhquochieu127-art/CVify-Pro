import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Mail, Phone, MapPin, Globe, User } from 'lucide-react';
import {
  useKhoLuuTruCV,
  BAN_DICH_NGON_NGU,
  DANH_SACH_HINH_NEN,
} from '../../store/khoLuuTruCV';

interface ModalXemTruocCVProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalXemTruocCV: React.FC<ModalXemTruocCVProps> = ({
  isOpen,
  onClose,
}) => {
  const { cv } = useKhoLuuTruCV();

  if (!isOpen) return null;

  const {
    dinhDang,
    thongTinCaNhan,
    gioiThieu,
    kinhNghiem,
    hocVan,
    kyNang,
    duAn,
    chungChi,
    khoiTuyChinh,
    anHienKhoi,
    thuTuKhoi,
    boCuc,
  } = cv;

  const ngonNgu = dinhDang.ngonNgu || 'vi';
  const banDich = BAN_DICH_NGON_NGU[ngonNgu] || BAN_DICH_NGON_NGU['vi'];
  const mau = dinhDang.mauChuDao || '#1a91f0';
  const hinhNenConfig =
    DANH_SACH_HINH_NEN.find((bg) => bg.id === (dinhDang.hinhNen || 'trang-tron')) ||
    DANH_SACH_HINH_NEN[0];

  const layTieuDe = (id: string, macDinh: string) =>
    dinhDang.tieuDeKhoi?.[id] || banDich.tieuDeKhoi[id] || macDinh;

  const danhSachCot =
    boCuc?.danhSachCot && boCuc.danhSachCot.length > 0
      ? boCuc.danhSachCot
      : boCuc?.cheDo === '1-cot'
      ? [{ id: 'cot-1', ten: 'Cột chính', doRong: 100, khoiIds: thuTuKhoi || [] }]
      : [
          { id: 'cot-trai', ten: 'Cột 1', doRong: 35, khoiIds: boCuc?.cotTrai || ['hoc-van', 'ky-nang'] },
          { id: 'cot-phai', ten: 'Cột 2', doRong: 65, khoiIds: boCuc?.cotPhai || ['gioi-thieu', 'kinh-nghiem'] },
        ];

  const laNhieuCot = boCuc?.cheDo !== '1-cot' && danhSachCot.length > 1;

  const renderTieuDeMuc = (title: string) => (
    <h3
      className="text-xs font-extrabold uppercase tracking-wider pb-1.5 mb-2.5 border-b"
      style={{ color: mau, borderColor: `${mau}40` }}
    >
      {title}
    </h3>
  );

  // Render nội dung hỗ trợ cả Rich Text HTML (từ trình soạn thảo / nhập PDF) lẫn văn bản thuần
  const renderRichText = (raw?: string, extraClass = '') => {
    if (!raw || !raw.trim()) return null;
    const hasHtml = /<[a-z][\s\S]*>/i.test(raw);
    if (!hasHtml) {
      return (
        <p className={`text-slate-700 whitespace-pre-line ${extraClass}`}>
          {raw}
        </p>
      );
    }

    let safeHtml = raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    // Nếu dữ liệu chứa các thẻ <li> trần (không nằm trong <ul>/<ol>), tự bọc vào <ul> để hiện dấu chấm tròn chuẩn
    if (/<li[\s>]/i.test(safeHtml) && !/<(ul|ol)[\s>]/i.test(safeHtml)) {
      safeHtml = `<ul>${safeHtml}</ul>`;
    }

    return (
      <div
        className={`text-slate-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1 [&_li]:my-0.5 [&_p]:my-1 ${extraClass}`}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  };

  const renderKhoiReadOnly = (khoiId: string) => {
    if (anHienKhoi[khoiId] === false) return null;

    switch (khoiId) {
      case 'gioi-thieu':
        if (!gioiThieu?.trim()) return null;
        return (
          <section key="gioi-thieu" className="mb-5">
            {renderTieuDeMuc(layTieuDe('gioi-thieu', 'Mục tiêu nghề nghiệp'))}
            {renderRichText(gioiThieu)}
          </section>
        );

      case 'hoc-van':
        if (!hocVan || hocVan.length === 0) return null;
        return (
          <section key="hoc-van" className="mb-5">
            {renderTieuDeMuc(layTieuDe('hoc-van', 'Học vấn & Bằng cấp'))}
            <div className="space-y-3">
              {hocVan.map((hv) => (
                <div key={hv.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{hv.chuyenNganh || hv.truong}</h4>
                    {hv.thoiGian && (
                      <span className="text-[11px] text-slate-500 shrink-0">{hv.thoiGian}</span>
                    )}
                  </div>
                  {hv.truong && hv.chuyenNganh && (
                    <p className="font-medium" style={{ color: mau }}>
                      {hv.truong}
                    </p>
                  )}
                  {(hv.diemSo || hv.gpa) && (
                    <p className="text-xs text-slate-600 mt-0.5">{hv.diemSo || hv.gpa}</p>
                  )}
                  {hv.thanhTich && renderRichText(hv.thanhTich, 'text-slate-600 mt-1')}
                </div>
              ))}
            </div>
          </section>
        );

      case 'kinh-nghiem':
        if (!kinhNghiem || kinhNghiem.length === 0) return null;
        return (
          <section key="kinh-nghiem" className="mb-5">
            {renderTieuDeMuc(layTieuDe('kinh-nghiem', 'Kinh nghiệm làm việc'))}
            <div className="space-y-3.5">
              {kinhNghiem.map((kn) => (
                <div key={kn.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{kn.viTri}</h4>
                    {kn.thoiGian && (
                      <span className="text-[11px] text-slate-500 shrink-0">{kn.thoiGian}</span>
                    )}
                  </div>
                  {kn.congTy && (
                    <p className="font-semibold text-xs mb-1" style={{ color: mau }}>
                      {kn.congTy}
                    </p>
                  )}
                  {kn.moTa && renderRichText(kn.moTa)}
                </div>
              ))}
            </div>
          </section>
        );

      case 'ky-nang':
        if (!kyNang || kyNang.length === 0) return null;
        return (
          <section key="ky-nang" className="mb-5">
            {renderTieuDeMuc(layTieuDe('ky-nang', 'Kỹ năng chuyên môn'))}
            <div className="flex flex-wrap gap-1.5">
              {kyNang.map((kn) => (
                <span
                  key={kn.id}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/80"
                >
                  {kn.ten}
                </span>
              ))}
            </div>
          </section>
        );

      case 'du-an':
        if (!duAn || duAn.length === 0) return null;
        return (
          <section key="du-an" className="mb-5">
            {renderTieuDeMuc(layTieuDe('du-an', 'Dự án nổi bật'))}
            <div className="space-y-3">
              {duAn.map((da) => (
                <div key={da.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-slate-900">{da.ten}</h4>
                    {da.thoiGian && (
                      <span className="text-[11px] text-slate-500 shrink-0">{da.thoiGian}</span>
                    )}
                  </div>
                  {(da.vaiTro || (da.congNghe && da.congNghe.length > 0)) && (
                    <p className="text-xs font-medium mb-1" style={{ color: mau }}>
                      {[da.vaiTro, da.congNghe?.join(', ')].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {da.moTa && renderRichText(da.moTa)}
                </div>
              ))}
            </div>
          </section>
        );

      case 'chung-chi':
        if (!chungChi || chungChi.length === 0) return null;
        return (
          <section key="chung-chi" className="mb-5">
            {renderTieuDeMuc(layTieuDe('chung-chi', 'Chứng chỉ & Giải thưởng'))}
            <div className="space-y-2">
              {chungChi.map((cc) => (
                <div key={cc.id} className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">{cc.ten}</span>
                    {cc.toChuc && <span className="text-slate-600"> — {cc.toChuc}</span>}
                  </div>
                  {cc.nam && (
                    <span className="text-[11px] text-slate-500 shrink-0">{cc.nam}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      default: {
        const custom = (khoiTuyChinh || []).find((k) => k.id === khoiId);
        if (!custom) return null;
        return (
          <section key={custom.id} className="mb-5">
            {renderTieuDeMuc(custom.tieuDe || 'Mục tùy chỉnh')}
            {custom.noiDung && renderRichText(custom.noiDung)}
            {custom.danhSachCotCon && custom.danhSachCotCon.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {custom.danhSachCotCon.map((cotCon) => (
                  <div key={cotCon.id}>
                    {cotCon.tieuDeCot && (
                      <h4 className="font-bold text-slate-900">{cotCon.tieuDeCot}</h4>
                    )}
                    {cotCon.noiDung && renderRichText(cotCon.noiDung)}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-slate-100 rounded-2xl max-w-4xl w-full max-h-[94vh] shadow-2xl border border-slate-300/60 flex flex-col overflow-hidden">
        {/* Header Modal Xem Trước */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Xem trước CV</h2>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Chế độ xem chuẩn in ấn A4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                setTimeout(() => window.print(), 150);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1a91f0] hover:bg-[#016fd0] text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
            >
              <Printer size={14} strokeWidth={1.75} />
              <span>Tải PDF / In</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Đóng xem trước"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Thân Modal: Tờ giấy CV thuần túy không viền sửa */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div
            style={{
              fontFamily: dinhDang.fontChu || 'Inter, sans-serif',
              fontSize: dinhDang.coChu
                ? String(dinhDang.coChu).endsWith('px')
                  ? dinhDang.coChu
                  : `${dinhDang.coChu}px`
                : '14px',
              lineHeight: dinhDang.khoangCachDong || 1.45,
            }}
            className={`mx-auto w-full max-w-[794px] min-h-[1060px] h-auto p-8 sm:p-12 ${hinhNenConfig.canvasClass} shadow-lg border border-slate-200/90 rounded-sm text-[#1e2532] flex flex-col justify-between`}
          >
            <div>
              {/* Header Thông tin cá nhân Read-Only */}
              <div
                className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 mb-6 border-b-2"
                style={{ borderColor: mau }}
              >
                {thongTinCaNhan.avatarUrl ? (
                  <img
                    src={thongTinCaNhan.avatarUrl}
                    alt={thongTinCaNhan.hoTen}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-200/80 text-slate-400 flex items-center justify-center shrink-0">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h1
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase"
                    style={{ color: mau }}
                  >
                    {thongTinCaNhan.hoTen || 'HỌ VÀ TÊN'}
                  </h1>
                  {thongTinCaNhan.viTriUngTuyen && (
                    <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1">
                      {thongTinCaNhan.viTriUngTuyen}
                    </p>
                  )}

                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600">
                    {thongTinCaNhan.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={12} style={{ color: mau }} />
                        {thongTinCaNhan.email}
                      </span>
                    )}
                    {thongTinCaNhan.soDienThoai && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={12} style={{ color: mau }} />
                        {thongTinCaNhan.soDienThoai}
                      </span>
                    )}
                    {thongTinCaNhan.diaChi && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} style={{ color: mau }} />
                        {thongTinCaNhan.diaChi}
                      </span>
                    )}
                    {thongTinCaNhan.website && (
                      <span className="inline-flex items-center gap-1.5">
                        <Globe size={12} style={{ color: mau }} />
                        {thongTinCaNhan.website}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nội dung CV theo đúng cấu trúc cột */}
              {laNhieuCot ? (
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {danhSachCot.map((cot) => (
                    <div
                      key={cot.id}
                      style={{ width: `${cot.doRong}%` }}
                      className="w-full sm:w-auto min-w-0"
                    >
                      {(cot.khoiIds || []).map((kId) => renderKhoiReadOnly(kId))}
                    </div>
                  ))}
                </div>
              ) : (
                <div>{(thuTuKhoi || []).map((kId) => renderKhoiReadOnly(kId))}</div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-4 mt-8 border-t border-slate-200/80">
              <span>{banDich.nhanFooter.banQuyen}</span>
              <span>{banDich.nhanFooter.trang(1, 1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalXemTruocCV;
