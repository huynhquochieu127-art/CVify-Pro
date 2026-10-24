import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItemProps {
  id: string | number;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem = ({
  title,
  children,
  isOpen = false,
  onToggle,
}: AccordionItemProps) => {
  return (
    <div className="bg-[#faf9f6] rounded-2xl border border-black/[0.07] overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4.5 text-left font-semibold text-neutral-800 flex items-center justify-between gap-4 cursor-pointer text-sm hover:text-black select-none"
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-black font-bold" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-black/[0.05] pt-3.5">
          {children}
        </div>
      )}
    </div>
  );
};

export interface AccordionProps {
  items: Array<{ id: string | number; title: string; content: React.ReactNode }>;
  allowMultiple?: boolean;
  defaultOpenId?: string | number | null;
}

export const Accordion = ({
  items,
  defaultOpenId = null,
}: AccordionProps) => {
  const [openId, setOpenId] = useState<string | number | null>(defaultOpenId);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          isOpen={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};
