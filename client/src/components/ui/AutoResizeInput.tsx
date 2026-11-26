import React, { useRef, useEffect, useLayoutEffect } from 'react';

export interface AutoResizeInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  dataStyleKey?: string;
  minRows?: number;
  choPhepXuongDong?: boolean;
}

export const AutoResizeInput: React.FC<AutoResizeInputProps> = ({
  dataStyleKey,
  minRows = 1,
  choPhepXuongDong = false,
  className = '',
  style,
  value,
  onChange,
  onKeyDown,
  placeholder,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    // Đảm bảo chiều cao vừa vặn hoàn hảo với dòng chữ, không bị cắt xén
    el.style.height = `${el.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value, style?.fontSize, style?.fontWeight, className]);

  useEffect(() => {
    adjustHeight();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Nếu không cho phép xuống dòng bằng phím Enter (như tên vị trí, tên trường, tên dự án):
    // Nhấn Enter sẽ hoàn tất nhập (blur) giống hệt input thông thường
    if (e.key === 'Enter' && !choPhepXuongDong && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
    onKeyDown?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      data-style-key={dataStyleKey}
      value={value ?? ''}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`resize-none overflow-hidden block w-full whitespace-pre-wrap break-words leading-snug py-0.5 transition-[height] duration-75 ${className}`}
      style={{
        boxSizing: 'border-box',
        height: 'auto',
        ...style,
      }}
      {...rest}
    />
  );
};

export default AutoResizeInput;
