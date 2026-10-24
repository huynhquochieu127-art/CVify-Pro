import { useState } from "react";
import {
  Sparkles,
  Download,
  CheckCircle2,
  Check,
  ShieldCheck,
  Plus,
} from "lucide-react";

interface FigmaHeroWorkspaceProps {
  onChuyenTrinhThietKe?: () => void;
}

export const FigmaHeroWorkspace = ({ onChuyenTrinhThietKe }: FigmaHeroWorkspaceProps) => {
  const [boCuc, setBoCuc] = useState<"1-col" | "2-col">("2-col");
  const [mucDangSua, setMucDangSua] = useState<string>("experience");
  const [daXuatFile, setDaXuatFile] = useState(false);

  const xuatFilePDF = () => {
    setDaXuatFile(true);
    setTimeout(() => {
      setDaXuatFile(false);
      if (onChuyenTrinhThietKe) onChuyenTrinhThietKe();
    }, 1000);
  };

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none p-4">
      {/* 4-point sparkle stars floating in the cosmic background */}
      <div className="absolute -top-3 right-10 text-cyan-300/80 text-xl animate-pulse pointer-events-none">
        ✦
      </div>
      <div className="absolute top-1/4 -right-2 text-indigo-300/60 text-sm animate-ping pointer-events-none">
        ✦
      </div>
      <div className="absolute -bottom-2 right-12 text-blue-300/70 text-2xl animate-pulse pointer-events-none">
        ✦
      </div>
      <div className="absolute top-1/2 -left-3 text-cyan-200/50 text-xs pointer-events-none">
        ✦
      </div>

      {/* ========================================================================= */}
      {/* FIGMA SELECTION BOUNDING BOX (KHUNG CHỌN VECTOR FIGMA THEO ẢNH)           */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl border border-[#3b82f6]/90 p-1.5 shadow-[0_0_25px_rgba(59,130,246,0.25)]">
        {/* 4 Handle góc vuông (Figma selection handles) */}
        <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />

        {/* 4 Handle trung điểm */}
        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-[#3b82f6] rounded-[1px] shadow-sm z-30" />

        {/* Badge đo kích thước Figma ở đáy: 2080 - 84% theo đúng ảnh */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-40 bg-[#0284c7] text-white text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded shadow-md tracking-tight flex items-center gap-1">
          <span>2080 · 84%</span>
        </div>

        {/* ========================================================================= */}
        {/* CỬA SỔ STUDIO WORKSPACE KÍNH MỜ (FROSTED GLASS EFFECT)                     */}
        {/* ========================================================================= */}
        <div className="relative rounded-xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-3 sm:p-4 text-left flex flex-col gap-3 shadow-2xl overflow-visible">
          {/* Header Cửa sổ: 3 nút tròn macOS, toggle 1-Col / 2-Col, nút Export PDF */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
            {/* 3 chấm macOS */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/90 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/90 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/90 inline-block" />
            </div>

            {/* Toggle 1 Column / 2 Columns */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center p-0.5 rounded-full bg-white/90 border border-white/40 shadow-xs text-[11px] font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => setBoCuc("1-col")}
                  className={`px-3 py-1 rounded-full transition cursor-pointer ${
                    boCuc === "1-col"
                      ? "bg-[#0f172a] text-white shadow-xs"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  1 Column
                </button>
                <button
                  type="button"
                  onClick={() => setBoCuc("2-col")}
                  className={`px-3 py-1 rounded-full transition cursor-pointer ${
                    boCuc === "2-col"
                      ? "bg-[#0f172a] text-white shadow-xs"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  2 Columns
                </button>
              </div>

              {/* Nút Export PDF 300 DPI */}
              <button
                type="button"
                onClick={xuatFilePDF}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              >
                {daXuatFile ? <Check size={12} /> : <Download size={12} />}
                <span>{daXuatFile ? "Exporting..." : "Export PDF"}</span>
                <span className="text-[9.5px] opacity-80 font-normal">300 DPI</span>
              </button>
            </div>
          </div>

          {/* Vùng nội dung 2 cột: Sidebar RESUME SECTIONS (Trái) & Tờ A4 Maya Chen (Phải) */}
          <div className="grid grid-cols-12 gap-3 items-start relative">
            {/* CỘT TRÁI (5 cols): RESUME SECTIONS + ATS SCORE */}
            <div className="col-span-5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-wider text-slate-300 px-1">
                <span>RESUME SECTIONS</span>
                <Plus size={11} className="text-slate-400 cursor-pointer hover:text-white" />
              </div>

              {/* Danh sách mục hồ sơ */}
              <div className="space-y-1.5 text-xs">
                {/* Contact */}
                <div
                  onClick={() => setMucDangSua("contact")}
                  className={`p-2 rounded-xl bg-white/95 border flex items-center justify-between transition cursor-pointer ${
                    mucDangSua === "contact"
                      ? "border-[#2563eb] ring-1 ring-[#2563eb]/40"
                      : "border-black/[0.08] hover:border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-400 text-[10px]">⠿</span>
                    <div className="w-4 h-4 rounded bg-blue-50 text-[#2563eb] font-bold text-[9px] flex items-center justify-center shrink-0">
                      C
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate">
                      Contact
                    </span>
                  </div>
                </div>

                {/* Experience (Editing theo đúng ảnh Figma) */}
                <div
                  onClick={() => setMucDangSua("experience")}
                  className={`p-2 rounded-xl bg-white border-2 flex items-center justify-between transition cursor-pointer shadow-sm ${
                    mucDangSua === "experience"
                      ? "border-[#2563eb] ring-2 ring-[#2563eb]/30"
                      : "border-black/[0.08] hover:border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[#2563eb] text-[10px]">⠿</span>
                    <div className="w-4 h-4 rounded bg-blue-100 text-[#2563eb] font-bold text-[9px] flex items-center justify-center shrink-0">
                      E
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 truncate">
                      Experience
                    </span>
                  </div>
                  <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-[#2563eb] shrink-0 border border-blue-200">
                    Editing
                  </span>
                </div>

                {/* Education */}
                <div
                  onClick={() => setMucDangSua("education")}
                  className={`p-2 rounded-xl bg-white/95 border flex items-center justify-between transition cursor-pointer ${
                    mucDangSua === "education"
                      ? "border-[#2563eb] ring-1 ring-[#2563eb]/40"
                      : "border-black/[0.08] hover:border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-400 text-[10px]">⠿</span>
                    <div className="w-4 h-4 rounded bg-blue-50 text-[#2563eb] font-bold text-[9px] flex items-center justify-center shrink-0">
                      E
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate">
                      Education
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div
                  onClick={() => setMucDangSua("skills")}
                  className={`p-2 rounded-xl bg-white/95 border flex items-center justify-between transition cursor-pointer ${
                    mucDangSua === "skills"
                      ? "border-[#2563eb] ring-1 ring-[#2563eb]/40"
                      : "border-black/[0.08] hover:border-black/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-slate-400 text-[10px]">⠿</span>
                    <div className="w-4 h-4 rounded bg-blue-50 text-[#2563eb] font-bold text-[9px] flex items-center justify-center shrink-0">
                      S
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate">
                      Skills
                    </span>
                  </div>
                </div>
              </div>

              {/* Khối ATS Score 96 màu xanh lá theo đúng Figma */}
              <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300/80 shadow-xs mt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-900">
                    <ShieldCheck size={13} className="text-emerald-600" />
                    <span>ATS Score</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">96</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-emerald-600 rounded-full" />
                </div>
                <div className="text-[8.5px] font-semibold text-emerald-700 mt-1">
                  Excellent match
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (7 cols): BẢN XEM TRƯỚC A4 CỦA MAYA CHEN */}
            <div className="col-span-7 relative">
              {/* Floating Tooltip Pill: Strong impact / Action verbs detected với đường cong chỉ vào tiêu đề */}
              <div className="absolute -top-3 -right-2 z-30 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-1.5 text-[9.5px] font-semibold text-white animate-pulse">
                <Sparkles size={11} className="text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white leading-tight">Strong impact</div>
                  <div className="text-[7.5px] text-slate-300">Action verbs detected</div>
                </div>
              </div>

              {/* Tờ giấy CV A4 của Maya Chen */}
              <div className="w-full aspect-[21/29.7] bg-white rounded-lg shadow-2xl border border-slate-200 p-3.5 flex flex-col justify-between text-left overflow-hidden">
                <div>
                  {/* Header Maya Chen */}
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Maya Chen"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        Maya Chen
                      </div>
                      <div className="text-[9px] font-semibold text-[#2563eb]">
                        Senior Product Designer
                      </div>
                      <div className="text-[7px] text-slate-400 mt-0.5">
                        mayachen@gmail.com · San Francisco, CA
                      </div>
                    </div>
                  </div>

                  {/* Bố cục CV phản ứng theo toggle 1 Column / 2 Columns */}
                  <div
                    className={`gap-2.5 transition-all duration-300 text-[7.5px] ${
                      boCuc === "2-col" ? "grid grid-cols-12" : "flex flex-col"
                    }`}
                  >
                    {/* Cột trái (hoặc phần 1) */}
                    <div className={boCuc === "2-col" ? "col-span-5 space-y-2" : "space-y-1.5"}>
                      <div>
                        <div className="font-bold text-slate-800 uppercase text-[7px] tracking-wider mb-1">
                          SKILLS
                        </div>
                        <div className="space-y-0.5 text-slate-600 text-[7px]">
                          <div>• Product Strategy</div>
                          <div>• Design Systems</div>
                          <div>• Prototyping</div>
                          <div>• User Research</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <div className="font-bold text-slate-800 uppercase text-[7px] tracking-wider mb-0.5">
                          EDUCATION
                        </div>
                        <div className="font-semibold text-slate-900">BFA, Interaction Design</div>
                        <div className="text-slate-400 text-[6.5px]">CCA · 2019</div>
                      </div>
                    </div>

                    {/* Cột phải (hoặc phần 2) */}
                    <div
                      className={
                        boCuc === "2-col"
                          ? "col-span-7 border-l border-slate-100 pl-2 space-y-2"
                          : "border-t border-slate-100 pt-1.5 space-y-1.5"
                      }
                    >
                      <div>
                        <div className="font-bold text-slate-800 uppercase text-[7px] tracking-wider mb-0.5">
                          PROFILE
                        </div>
                        <p className="text-slate-600 leading-tight text-[6.5px]">
                          Product designer focused on building clear, useful experiences for high-growth technology teams.
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <div className="font-bold text-slate-800 uppercase text-[7px] tracking-wider mb-1">
                          EXPERIENCE
                        </div>
                        <div className="border-l border-[#2563eb] pl-1.5 mb-1.5">
                          <div className="font-bold text-slate-900">Senior Product Designer</div>
                          <div className="text-slate-400 text-[6.5px]">Synthesis Labs · 2022–Present</div>
                          <p className="text-slate-600 text-[6px] mt-0.5 leading-tight">
                            Led a cross-functional redesign that increased activation by 23% and reduced setup time.
                          </p>
                        </div>
                        <div className="border-l border-slate-200 pl-1.5">
                          <div className="font-bold text-slate-900">Product Designer</div>
                          <div className="text-slate-400 text-[6.5px]">Nova Systems · 2019–2022</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer tờ giấy CV */}
                <div className="border-t border-slate-100 pt-1 flex items-center justify-between text-[6.5px] text-slate-400">
                  <span>Standard A4 (210 × 297mm)</span>
                  <span className="font-medium text-slate-500">Page 1/1</span>
                </div>
              </div>

              {/* Tag kích thước A4 ở góc phải dưới tờ giấy */}
              <div className="absolute -bottom-2 -right-1 z-20 px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 border border-white/20 text-[8px] font-mono shadow-sm">
                A4 · 84%
              </div>

              {/* Con trỏ chuột Figma & Vòng chỉ hướng */}
              <div className="absolute -bottom-4 right-1/4 z-30 pointer-events-none flex items-center gap-1">
                <svg
                  className="w-5 h-5 text-cyan-400 drop-shadow-md"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.428v-20.549z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Floating badge góc trái dưới: Ready to export / All checks passed theo đúng ảnh */}
        <div className="absolute -bottom-3 -left-3 z-30 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xl flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 size={13} className="text-emerald-600" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold text-slate-900 leading-tight">
              Ready to export
            </div>
            <div className="text-[9px] text-slate-500">All checks passed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
