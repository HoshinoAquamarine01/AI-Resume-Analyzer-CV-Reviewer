import React from "react";
import { LayoutGrid, Target, FileText, Shield, CreditCard, Cpu } from "lucide-react";
import { FaqCategory } from "./faqData";

interface FaqCategoriesProps {
  categories: FaqCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const FaqCategories: React.FC<FaqCategoriesProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "ats":
        return <Target className="w-4 h-4" />;
      case "files":
        return <FileText className="w-4 h-4" />;
      case "security":
        return <Shield className="w-4 h-4" />;
      case "pricing":
        return <CreditCard className="w-4 h-4" />;
      case "ai":
        return <Cpu className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/30"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/50"
            }`}
          >
            <span className={isActive ? "text-emerald-400" : "text-slate-400"}>
              {getCategoryIcon(cat.id)}
            </span>
            <span>{cat.label}</span>
            <span
              className={`ml-1 text-[11px] px-2 py-0.5 rounded-full ${
                isActive
                  ? "bg-emerald-500/30 text-emerald-200 font-bold"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FaqCategories;
