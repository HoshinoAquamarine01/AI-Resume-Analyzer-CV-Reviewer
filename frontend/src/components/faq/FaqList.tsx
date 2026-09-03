import React, { useState } from "react";
import { SearchX } from "lucide-react";
import { FaqItem } from "./faqData";
import FaqAccordionItem from "./FaqAccordionItem";

interface FaqListProps {
  items: FaqItem[];
  searchQuery: string;
  onResetSearch: () => void;
}

export const FaqList: React.FC<FaqListProps> = ({
  items,
  searchQuery,
  onResetSearch,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(["ats-calculation"]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-2xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          No matching questions found
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          We couldn't find any articles matching{" "}
          <strong className="text-emerald-400">"{searchQuery}"</strong>. 
          Try searching with different keywords or contact our support team.
        </p>
        <button
          onClick={onResetSearch}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-sm rounded-xl border border-slate-700 transition-colors"
        >
          Clear search filter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
};

export default FaqList;
