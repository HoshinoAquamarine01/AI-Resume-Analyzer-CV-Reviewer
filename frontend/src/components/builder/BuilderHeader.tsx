import React from "react";
import { Link } from "react-router-dom";
import {
  TemplateId,
  ColorTheme,
} from "../../types/builder.types";
import {
  ArrowLeft,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Palette,
  Layout,
  Loader2,
  Check,
} from "lucide-react";

interface BuilderHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  templateId: TemplateId;
  onTemplateChange: (tId: TemplateId) => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onSave: () => void;
  isSaving: boolean;
  onExport: () => void;
  isExporting: boolean;
}

const COLOR_PALETTES: { id: ColorTheme; name: string; bg: string }[] = [
  { id: "indigo", name: "Indigo", bg: "bg-indigo-600" },
  { id: "emerald", name: "Emerald", bg: "bg-emerald-600" },
  { id: "blue", name: "Sapphire Blue", bg: "bg-blue-600" },
  { id: "purple", name: "Royal Purple", bg: "bg-purple-600" },
  { id: "rose", name: "Rose Crimson", bg: "bg-rose-600" },
  { id: "slate", name: "Classic Slate", bg: "bg-slate-700" },
];

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  title,
  onTitleChange,
  templateId,
  onTemplateChange,
  colorTheme,
  onColorThemeChange,
  zoomLevel,
  onZoomChange,
  onSave,
  isSaving,
  onExport,
  isExporting,
}) => {
  return (
    <header className="bg-[#0e1424] border-b border-slate-800/80 px-4 py-3 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
      
      <div className="flex items-center gap-3">
        <Link
          to="/templates"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Back to Templates"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Resume Title..."
            className="bg-transparent font-bold text-white text-base focus:outline-none focus:border-b border-blue-500 max-w-[220px] sm:max-w-xs transition-colors"
          />
          <p className="text-[11px] text-slate-400 font-medium">Visual Resume Builder • Live Preview</p>
        </div>
      </div>

    
      <div className="flex items-center gap-4">
       
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
          <Layout className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 font-medium hidden md:inline">Layout:</span>
          <select
            value={templateId}
            onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="modern" className="bg-slate-900 text-white">Modern Dual</option>
            <option value="professional" className="bg-slate-900 text-white">Professional Serif</option>
            <option value="minimalist" className="bg-slate-900 text-white">Minimalist Clean</option>
            <option value="creative" className="bg-slate-900 text-white">Creative Banner</option>
          </select>
        </div>

       
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <div className="flex items-center gap-1">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => onColorThemeChange(palette.id)}
                title={palette.name}
                className={`w-4 h-4 rounded-full ${palette.bg} flex items-center justify-center transition-transform ${
                  colorTheme === palette.id ? "ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-110" : "hover:scale-105"
                }`}
              >
                {colorTheme === palette.id && <Check className="w-2.5 h-2.5 text-white" />}
              </button>
            ))}
          </div>
        </div>

      
        <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-300">
          <button
            onClick={() => onZoomChange(Math.max(zoomLevel - 10, 50))}
            className="p-1 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-10 text-center">{zoomLevel}%</span>
          <button
            onClick={() => onZoomChange(Math.min(zoomLevel + 10, 130))}
            className="p-1 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-colors"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save CV</span>
        </button>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};

export default BuilderHeader;
