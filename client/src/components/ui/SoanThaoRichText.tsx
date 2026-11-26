import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  RotateCcw,
  CaseUpper,
  Palette,
  Type,
  Sparkles,
} from 'lucide-react';

export interface SoanThaoRichTextProps {
  value: string;
  onChange: (valueHtml: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const BANG_MAU_CHU_NHANH = [
  { ten: 'Đen Chuẩn', ma: '#0f172a' },
  { ten: 'Xanh Dương', ma: '#1a91f0' },
  { ten: 'Xanh Đậm', ma: '#1e40af' },
  { ten: 'Xanh Ngọc', ma: '#059669' },
  { ten: 'Tím Hiện Đại', ma: '#7c3aed' },
  { ten: 'Đỏ Đô', ma: '#e11d48' },
  { ten: 'Cam Hổ Phách', ma: '#d97706' },
  { ten: 'Xám Thanh Lịch', ma: '#475569' },
];

const DANH_SACH_CO_CHU = ['10px', '11px', '12px', '13px', '14px', '16px', '18px', '20px', '24px'];

const DANH_SACH_ICON_CHEN_NHANH = [
  '🎓', '🏫', '💼', '🏢', '📍', '📅', '⭐', '🏆',
  '🔥', '🚀', '💻', '✅', '🎯', '📌', '💡', '📊',
  '🔗', '📧', '📞', '🌐', '🏅', '📚', '⚡', '🛠️',
];

export const SoanThaoRichText: React.FC<SoanThaoRichTextProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung (bôi đen chữ hoặc nhấn vào để chỉnh IN HOA, Đậm, Nghiêng, Màu sắc, Cỡ chữ, Chèn Icon)...',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [moChonMau, setMoChonMau] = useState(false);
  const [moChonCoChu, setMoChonCoChu] = useState(false);
  const [moChonIcon, setMoChonIcon] = useState(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: false,
  });

  // Đồng bộ nội dung từ bên ngoài vào editor khi khởi tạo hoặc thay đổi giá trị
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const luuSelectionHienTai = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(selection.anchorNode)
    ) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const khoiPhucSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
      }
    }
  };

  // Hiển thị thanh công cụ khi focus hoặc bôi đen chữ
  const capNhatViTriToolbar = () => {
    if (!editorRef.current) return;
    luuSelectionHienTai();

    const selection = window.getSelection();
    let rect = editorRef.current.getBoundingClientRect();

    if (
      selection &&
      !selection.isCollapsed &&
      editorRef.current.contains(selection.anchorNode)
    ) {
      const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
      if (rangeRect.width > 0) {
        rect = rangeRect;
      }
    }

    setToolbarPos({
      top: Math.max(12, rect.top - 46),
      left: Math.max(12, Math.min(window.innerWidth - 380, rect.left)),
    });

    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      list: document.queryCommandState('insertUnorderedList'),
    });

    setToolbarVisible(true);
  };

  const handleInput = () => {
    luuSelectionHienTai();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (e: React.MouseEvent, command: string, arg?: string) => {
    e.preventDefault();
    e.stopPropagation();
    khoiPhucSelection();
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setTimeout(capNhatViTriToolbar, 10);
  };

  // Chuyển đổi chữ IN HOA ⇄ chữ thường ⇄ Viết Hoa Đầu Từ
  const handleToggleInHoa = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    khoiPhucSelection();

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString();
      if (selectedText) {
        const isAllUpper = selectedText === selectedText.toUpperCase() && selectedText !== selectedText.toLowerCase();
        const transformed = isAllUpper ? selectedText.toLowerCase() : selectedText.toUpperCase();
        document.execCommand('insertText', false, transformed);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
        return;
      }
    }

    // Nếu không bôi đen chữ nào -> chuyển toàn bộ nội dung của ô hiện tại
    if (editorRef.current) {
      const currentText = editorRef.current.innerText || '';
      const isAllUpper = currentText === currentText.toUpperCase() && currentText !== currentText.toLowerCase();
      editorRef.current.style.textTransform = isAllUpper ? 'none' : 'uppercase';
      const htmlContent = isAllUpper
        ? editorRef.current.innerHTML.toLowerCase()
        : editorRef.current.innerHTML.toUpperCase();
      editorRef.current.innerHTML = htmlContent;
      onChange(editorRef.current.innerHTML);
    }
  };

  // Đổi cỡ chữ (Font Size)
  const handleChonCoChu = (coChuPx: string) => {
    khoiPhucSelection();
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString();
      if (selectedText) {
        document.execCommand(
          'insertHTML',
          false,
          `<span style="font-size: ${coChuPx}; line-height: 1.4;">${selectedText}</span>`
        );
      }
    } else if (editorRef.current) {
      editorRef.current.innerHTML = `<span style="font-size: ${coChuPx}; line-height: 1.4;">${editorRef.current.innerHTML}</span>`;
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setMoChonCoChu(false);
  };

  // Đổi màu sắc chữ
  const handleChonMauChu = (maMau: string) => {
    khoiPhucSelection();
    const selection = window.getSelection();

    if (selection && !selection.isCollapsed) {
      document.execCommand('foreColor', false, maMau);
    } else if (editorRef.current) {
      editorRef.current.innerHTML = `<span style="color: ${maMau};">${editorRef.current.innerHTML}</span>`;
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setMoChonMau(false);
  };

  // Chèn icon trực tiếp vào vị trí con trỏ khi đang nhập
  const handleChenIcon = (iconChar: string) => {
    khoiPhucSelection();
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, `${iconChar} `);
      onChange(editorRef.current.innerHTML);
    }
    setMoChonIcon(false);
  };

  // Ẩn toolbar khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node) &&
        editorRef.current &&
        !editorRef.current.contains(e.target as Node)
      ) {
        setToolbarVisible(false);
        setMoChonMau(false);
        setMoChonCoChu(false);
        setMoChonIcon(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group/rich-editor w-full">
      {/* ========================================================================= */}
      {/* FLOATING RICH FORMATTING TOOLBAR (IN HOA, ĐẬM, NGHIÊNG, MÀU, CỠ CHỮ, ICON) */}
      {/* ========================================================================= */}
      {toolbarVisible && (
        <div
          ref={toolbarRef}
          style={{
            position: 'fixed',
            top: `${toolbarPos.top}px`,
            left: `${toolbarPos.left}px`,
            zIndex: 9999,
          }}
          className="flex items-center gap-0.5 bg-slate-900/95 text-white backdrop-blur-md px-2 py-1 rounded-xl shadow-2xl border border-slate-700/80 animate-in fade-in zoom-in-95 duration-100 select-none print:hidden"
        >
          {/* 1. Nút In Đậm (Bold) */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'bold')}
            className={`p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer ${
              activeFormats.bold ? 'bg-[#1a91f0] text-white' : 'text-slate-200'
            }`}
            title="In đậm (Ctrl + B)"
          >
            <Bold size={13} strokeWidth={2.5} />
          </button>

          {/* 2. Nút In Nghiêng (Italic) */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'italic')}
            className={`p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer ${
              activeFormats.italic ? 'bg-[#1a91f0] text-white' : 'text-slate-200'
            }`}
            title="In nghiêng (Ctrl + I)"
          >
            <Italic size={13} strokeWidth={2.5} />
          </button>

          {/* 3. Nút Gạch Chân (Underline) */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'underline')}
            className={`p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer ${
              activeFormats.underline ? 'bg-[#1a91f0] text-white' : 'text-slate-200'
            }`}
            title="Gạch chân (Ctrl + U)"
          >
            <Underline size={13} strokeWidth={2.5} />
          </button>

          {/* 4. Nút IN HOA / chữ thường (Uppercase Toggle) */}
          <button
            type="button"
            onMouseDown={handleToggleInHoa}
            className="px-1.5 py-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-200 hover:text-white flex items-center gap-0.5 text-[11px] font-extrabold"
            title="Chuyển đổi Chữ IN HOA ⇄ chữ thường"
          >
            <CaseUpper size={14} />
          </button>

          <span className="w-[1px] h-4 bg-slate-700 mx-0.5" />

          {/* 5. Chọn Cỡ Chữ (Font Size) */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoChonCoChu((p) => !p);
                setMoChonMau(false);
                setMoChonIcon(false);
              }}
              className="px-1.5 py-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-200 hover:text-white flex items-center gap-1 text-[10px] font-bold"
              title="Chỉnh cỡ chữ (Font Size)"
            >
              <Type size={13} />
              <span>Cỡ chữ</span>
            </button>

            {moChonCoChu && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl grid grid-cols-3 gap-1 w-36 z-50"
              >
                {DANH_SACH_CO_CHU.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleChonCoChu(sz);
                    }}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-[#1a91f0] hover:text-white rounded-lg transition cursor-pointer text-center"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 6. Chọn Màu Sắc Chữ (Text Color) */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoChonMau((p) => !p);
                setMoChonCoChu(false);
                setMoChonIcon(false);
              }}
              className="px-1.5 py-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-200 hover:text-white flex items-center gap-1 text-[10px] font-bold"
              title="Đổi màu sắc chữ"
            >
              <Palette size={13} className="text-amber-400" />
              <span>Màu</span>
            </button>

            {moChonMau && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl w-44 z-50 space-y-2"
              >
                <div className="grid grid-cols-4 gap-1.5">
                  {BANG_MAU_CHU_NHANH.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleChonMauChu(m.ma);
                      }}
                      title={m.ten}
                      className="w-6 h-6 rounded-full border border-white/30 hover:scale-110 transition cursor-pointer mx-auto"
                      style={{ backgroundColor: m.ma }}
                    />
                  ))}
                </div>
                <label className="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800 cursor-pointer">
                  <span>Màu tùy chọn:</span>
                  <input
                    type="color"
                    onChange={(e) => handleChonMauChu(e.target.value)}
                    className="w-6 h-5 rounded cursor-pointer bg-transparent border-0"
                  />
                </label>
              </div>
            )}
          </div>

          {/* 7. Nút Chèn Icon khi đang nhập */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMoChonIcon((p) => !p);
                setMoChonMau(false);
                setMoChonCoChu(false);
              }}
              className="px-1.5 py-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-emerald-300 hover:text-emerald-200 flex items-center gap-1 text-[10px] font-bold"
              title="Chèn Icon / Biểu tượng vào văn bản"
            >
              <Sparkles size={12} />
              <span>Icon</span>
            </button>

            {moChonIcon && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-full right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl grid grid-cols-6 gap-1 w-52 z-50"
              >
                {DANH_SACH_ICON_CHEN_NHANH.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleChenIcon(ic);
                    }}
                    className="p-1.5 text-sm hover:bg-white/20 rounded-lg transition cursor-pointer flex items-center justify-center"
                  >
                    {ic}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-[1px] h-4 bg-slate-700 mx-0.5" />

          {/* 8. Nút Gạch Đầu Dòng Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'insertUnorderedList')}
            className={`p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer ${
              activeFormats.list ? 'bg-[#1a91f0] text-white' : 'text-slate-200'
            }`}
            title="Danh sách gạch đầu dòng"
          >
            <List size={13} strokeWidth={2.5} />
          </button>

          {/* 9. Nút Xóa Định Dạng */}
          <button
            type="button"
            onMouseDown={(e) => executeCommand(e, 'removeFormat')}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white"
            title="Xóa định dạng về mặc định"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VÙNG SOẠN THẢO CONTENTEDITABLE CHÍNH                                      */}
      {/* ========================================================================= */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={capNhatViTriToolbar}
        onInput={handleInput}
        onMouseUp={capNhatViTriToolbar}
        onKeyUp={capNhatViTriToolbar}
        data-placeholder={placeholder}
        className={`empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:italic outline-none transition-colors leading-relaxed min-h-[1.5rem] [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline ${className}`}
      />
    </div>
  );
};

export default SoanThaoRichText;
