import React from "react";
import { ResumeBuilderData, ColorTheme } from "../../../types/builder.types";
import ModernTemplate from "./ModernTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import MinimalistTemplate from "./MinimalistTemplate";
import CreativeTemplate from "./CreativeTemplate";

interface ResumePreviewCanvasProps {
  data: ResumeBuilderData;
  zoomLevel: number;
}

const THEME_MAP: Record<
  ColorTheme,
  { bg: string; text: string; border: string }
> = {
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-200" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-200" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-200" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", border: "border-purple-200" },
  rose: { bg: "bg-rose-600", text: "text-rose-600", border: "border-rose-200" },
  slate: { bg: "bg-slate-800", text: "text-slate-800", border: "border-slate-300" },
};

export const ResumePreviewCanvas: React.FC<ResumePreviewCanvasProps> = ({ data, zoomLevel }) => {
  const theme = THEME_MAP[data.colorTheme] || THEME_MAP.indigo;

  const renderTemplate = () => {
    switch (data.templateId) {
      case "professional":
        return (
          <ProfessionalTemplate
            data={data}
            accentBg={theme.bg}
            accentText={theme.text}
            accentBorder={theme.border}
          />
        );
      case "minimalist":
        return (
          <MinimalistTemplate
            data={data}
            accentBg={theme.bg}
            accentText={theme.text}
            accentBorder={theme.border}
          />
        );
      case "creative":
        return (
          <CreativeTemplate
            data={data}
            accentBg={theme.bg}
            accentText={theme.text}
            accentBorder={theme.border}
          />
        );
      case "modern":
      default:
        return (
          <ModernTemplate
            data={data}
            accentBg={theme.bg}
            accentText={theme.text}
            accentBorder={theme.border}
          />
        );
    }
  };

  return (
    <div className="w-full h-full overflow-auto flex justify-center p-6 bg-[#0b0f19] custom-scrollbar">
      <div
        className="transition-transform duration-200 ease-out origin-top max-w-[800px] w-full"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumePreviewCanvas;
