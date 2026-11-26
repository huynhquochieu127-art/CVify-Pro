import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  FileWarning,
  MessageSquare,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Hourglass,
  AlertCircle,
  CalendarDays,
  RotateCcw,
} from 'lucide-react';
import {
  useKhoThongBao,
  dinhDangThoiGianTuongDoi,
  type LoaiThongBao,
  type ThongBaoItem,
} from '../../store/khoThongBao';

type BoLocThoiGian = 'tat-ca' | '7-ngay' | '30-ngay' | '60-ngay' | 'tuy-chinh';

interface ChuongThongBaoProps {
  onChonHanhDong?: (hanhDong?: ThongBaoItem['hanhDong']) => void;
}

export const ChuongThongBao: React.FC<ChuongThongBaoProps> = ({
  onChonHanhDong,
}) => {
  const [moPopover, setMoPopover] = useState(false);
  const [tabLoc, setTabLoc] = useState<'tat-ca' | LoaiThongBao>('tat-ca');
  const [moLocThoiGian, setMoLocThoiGian] = useState(false);
  const [locThoiGian, setLocThoiGian] = useState<BoLocThoiGian>('tat-ca');
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    danhSachThongBao,
    cvChuaLuu,
    danhDauDaDoc,
    danhDauDocTatCa,
  } = useKhoThongBao();

  const soChuaDoc = useMemo(
    () => danhSachThongBao.filter((item) => !item.daDoc).length,
    [danhSachThongBao]
  );

  const dangLocThoiGian = locThoiGian !== 'tat-ca';

  const danhSachLoc = useMemo(() => {
    const now = Date.now();
    return danhSachThongBao.filter((item) => {
      // 1. Lọc theo loại tab
      if (tabLoc !== 'tat-ca' && item.loai !== tabLoc) return false;

      // 2. Lọc theo khoảng thời gian
      if (locThoiGian === 'tat-ca') return true;
      const itemMs = new Date(item.thoiGian).getTime();
      if (Number.isNaN(itemMs)) return true;

      if (locThoiGian === '7-ngay') return now - itemMs <= 7 * 86400000;
      if (locThoiGian === '30-ngay') return now - itemMs <= 30 * 86400000;
      if (locThoiGian === '60-ngay') return now - itemMs <= 60 * 86400000;

      if (locThoiGian === 'tuy-chinh') {
        if (tuNgay) {
          const startMs = new Date(`${tuNgay}T00:00:00`).getTime();
          if (itemMs < startMs) return false;
        }
        if (denNgay) {
          const endMs = new Date(`${denNgay}T23:59:59.999`).getTime();
          if (itemMs > endMs) return false;
        }
      }
      return true;
    });
  }, [danhSachThongBao, tabLoc, locThoiGian, tuNgay, denNgay]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMoPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBamThongBao = (tb: ThongBaoItem) => {
    danhDauDaDoc(tb.id);
    setMoPopover(false);
    if (onChonHanhDong) {
      onChonHanhDong(tb.hanhDong);
    }
  };

  const renderIconLoai = (tb: ThongBaoItem) => {
    if (tb.loai === 'trang-thai-cv') {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0">
          <FileWarning size={16} strokeWidth={1.9} />
        </div>
      );
    }
    if (tb.loai === 'cong-dong') {
      return (
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a91f0] border border-blue-200/80 flex items-center justify-center shrink-0">
          <MessageSquare size={16} strokeWidth={1.9} />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0">
        <ShieldCheck size={16} strokeWidth={1.9} />
      </div>
    );
  };

  const renderBadgeDuyet = (tb: ThongBaoItem) => {
    if (!tb.trangThaiDuyet) return null;
    if (tb.trangThaiDuyet === 'cho-duyet') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-bold">
          <Hourglass size={10} />
          Chờ Admin duyệt
        </span>
      );
    }
    if (tb.trangThaiDuyet === 'da-duyet') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold">
          <CheckCircle2 size={10} />
          Đã duyệt
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-bold">
        <AlertCircle size={10} />
        Từ chối
      </span>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Nút Chuông Thông Báo */}
      <button
        type="button"
        onClick={() => setMoPopover(!moPopover)}
        className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer ${
          moPopover
            ? 'bg-blue-50 text-[#1a91f0] border-[#1a91f0]/40 shadow-2xs'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200/90'
        }`}
        title="Trung tâm thông báo"
      >
        <Bell size={17} strokeWidth={1.85} />
        {soChuaDoc > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white shadow-2xs">
            {soChuaDoc > 9 ? '9+' : soChuaDoc}
          </span>
        )}
      </button>

      {/* Popover Trung tâm Thông báo đồng bộ tông trắng sáng CVify Pro */}
      {moPopover && (
        <div className="absolute right-0 mt-2.5 w-[355px] sm:w-[390px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-fade-in">
          {/* Header sáng đồng bộ với layout bên ngoài */}
          <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1a91f0] flex items-center justify-center">
                <Bell size={14} strokeWidth={2} />
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Thông báo
              </h3>
              {soChuaDoc > 0 && (
                <span className="text-[10px] font-bold bg-blue-50 text-[#1a91f0] border border-blue-200/70 px-2 py-0.5 rounded-full">
                  {soChuaDoc} mới
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMoLocThoiGian(!moLocThoiGian)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                  moLocThoiGian || dangLocThoiGian
                    ? 'bg-[#1a91f0] text-white border-[#1a91f0]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200/80'
                }`}
                title="Lọc thông báo theo thời gian"
              >
                <CalendarDays size={13} />
                <span>
                  {locThoiGian === '7-ngay'
                    ? '7 ngày'
                    : locThoiGian === '30-ngay'
                    ? '30 ngày'
                    : locThoiGian === '60-ngay'
                    ? '60 ngày'
                    : locThoiGian === 'tuy-chinh'
                    ? 'Tùy chỉnh'
                    : 'Lọc ngày'}
                </span>
              </button>

              {soChuaDoc > 0 && (
                <button
                  type="button"
                  onClick={danhDauDocTatCa}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a91f0] hover:text-[#016fd0] transition cursor-pointer"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck size={14} />
                  <span>Đọc hết</span>
                </button>
              )}
            </div>
          </div>

          {/* Thanh phân loại 4 tab sắc nét kèm chấm xanh báo tin chưa đọc */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200/80 space-y-2">
            <div className="grid grid-cols-4 gap-1 bg-slate-200/60 p-1 rounded-xl">
              {[
                {
                  id: 'tat-ca' as const,
                  nhan: 'Tất cả',
                  coChuaDoc: danhSachThongBao.some((i) => !i.daDoc),
                },
                {
                  id: 'trang-thai-cv' as const,
                  nhan: 'CV',
                  coChuaDoc: danhSachThongBao.some(
                    (i) => i.loai === 'trang-thai-cv' && !i.daDoc
                  ),
                },
                {
                  id: 'cong-dong' as const,
                  nhan: 'Cộng đồng',
                  coChuaDoc: danhSachThongBao.some(
                    (i) => i.loai === 'cong-dong' && !i.daDoc
                  ),
                },
                {
                  id: 'admin-duyet' as const,
                  nhan: 'Admin',
                  coChuaDoc: danhSachThongBao.some(
                    (i) => i.loai === 'admin-duyet' && !i.daDoc
                  ),
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTabLoc(tab.id)}
                  className={`relative py-1.5 px-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    tabLoc === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="truncate">{tab.nhan}</span>
                  {tab.coChuaDoc && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a91f0] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Bộ lọc thời gian mở rộng (7 ngày / 30 ngày / 60 ngày / Tùy chỉnh ngày) */}
            {moLocThoiGian && (
              <div className="bg-white rounded-xl border border-slate-200/90 p-2.5 space-y-2 animate-fade-in">
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: 'tat-ca' as const, nhan: 'Tất cả' },
                    { id: '7-ngay' as const, nhan: '7 ngày' },
                    { id: '30-ngay' as const, nhan: '30 ngày' },
                    { id: '60-ngay' as const, nhan: '60 ngày' },
                    { id: 'tuy-chinh' as const, nhan: 'Tùy chỉnh' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLocThoiGian(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition cursor-pointer ${
                        locThoiGian === opt.id
                          ? 'bg-[#1a91f0] text-white border-[#1a91f0]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80'
                      }`}
                    >
                      {opt.nhan}
                    </button>
                  ))}
                </div>

                {locThoiGian === 'tuy-chinh' && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Từ ngày
                      </label>
                      <input
                        type="date"
                        value={tuNgay}
                        onChange={(e) => setTuNgay(e.target.value)}
                        className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Đến ngày
                      </label>
                      <input
                        type="date"
                        value={denNgay}
                        onChange={(e) => setDenNgay(e.target.value)}
                        className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-[#1a91f0]"
                      />
                    </div>
                  </div>
                )}

                {dangLocThoiGian && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[10.5px] text-slate-500">
                      Tìm thấy <strong className="text-slate-800">{danhSachLoc.length}</strong> thông báo
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocThoiGian('tat-ca');
                        setTuNgay('');
                        setDenNgay('');
                      }}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#1a91f0] hover:underline cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      <span>Đặt lại</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Danh sách thông báo chia 2 nhóm: Mới & Trước đó */}
          <div className="max-h-[380px] overflow-y-auto">
            {danhSachLoc.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-1.5">
                <Bell size={24} className="mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">
                  Chưa có thông báo nào ở mục này
                </p>
                <p className="text-[11px] text-slate-400">
                  Thông báo về CV chưa lưu, bài đăng cộng đồng và kết quả duyệt từ Admin sẽ hiện tại đây.
                </p>
              </div>
            ) : (
              (() => {
                const nowMs = Date.now();
                const nhomMoi = danhSachLoc.filter((tb) => {
                  const ms = new Date(tb.thoiGian).getTime();
                  const trong24h = Number.isNaN(ms) || nowMs - ms < 24 * 3600 * 1000;
                  return !tb.daDoc && trong24h;
                });
                const nhomTruocDo = danhSachLoc.filter(
                  (tb) => !nhomMoi.some((m) => m.id === tb.id)
                );

                const renderItem = (tb: ThongBaoItem) => {
                  const laCVChuaLuu = tb.id === 'tb-cv-chua-luu' && cvChuaLuu;
                  return (
                    <button
                      key={tb.id}
                      type="button"
                      onClick={() => handleBamThongBao(tb)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition cursor-pointer relative ${
                        tb.daDoc
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-blue-50/45 hover:bg-blue-50/80'
                      }`}
                    >
                      {!tb.daDoc && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#1a91f0]" />
                      )}

                      {renderIconLoai(tb)}

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 leading-snug">
                            {tb.tieuDe}
                          </p>
                          {!tb.daDoc && (
                            <span className="w-2 h-2 rounded-full bg-[#1a91f0] shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-[11.5px] text-slate-600 leading-relaxed line-clamp-2">
                          {tb.noiDung}
                        </p>

                        {laCVChuaLuu && (
                          <div className="pt-1">
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#1a91f0] to-indigo-500"
                                style={{ width: `${cvChuaLuu.tienDo}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10.5px] font-semibold ${
                              tb.daDoc ? 'text-slate-400' : 'text-[#1a91f0]'
                            }`}
                          >
                            <Clock size={10} />
                            {dinhDangThoiGianTuongDoi(tb.thoiGian)}
                          </span>
                          {renderBadgeDuyet(tb)}
                        </div>
                      </div>
                    </button>
                  );
                };

                return (
                  <div className="pb-2">
                    {nhomMoi.length > 0 && (
                      <div>
                        <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-900">
                            Mới
                          </span>
                          <span className="text-[10.5px] font-semibold text-[#1a91f0]">
                            {nhomMoi.length} chưa đọc
                          </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {nhomMoi.map(renderItem)}
                        </div>
                      </div>
                    )}

                    {nhomTruocDo.length > 0 && (
                      <div>
                        <div className="px-4 pt-3 pb-1.5 flex items-center justify-between border-t border-slate-100">
                          <span className="text-xs font-extrabold text-slate-700">
                            Trước đó
                          </span>
                          <span className="text-[10.5px] font-medium text-slate-400">
                            {nhomTruocDo.length} thông báo
                          </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {nhomTruocDo.map(renderItem)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChuongThongBao;
