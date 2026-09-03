import React, { useState, useMemo } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import FaqHeader from "../components/faq/FaqHeader";
import FaqCategories from "../components/faq/FaqCategories";
import FaqList from "../components/faq/FaqList";
import FaqSupportCard from "../components/faq/FaqSupportCard";
import { FAQ_DATA, FaqCategory } from "../components/faq/faqData";

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Calculate category counts
  const categories: FaqCategory[] = useMemo(() => {
    const counts = FAQ_DATA.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: "all", label: "All Questions", iconName: "grid", count: FAQ_DATA.length },
      { id: "ats", label: "ATS System", iconName: "target", count: counts["ats"] || 0 },
      { id: "files", label: "Formats & Files", iconName: "file", count: counts["files"] || 0 },
      { id: "security", label: "Security & Data", iconName: "shield", count: counts["security"] || 0 },
      { id: "pricing", label: "Pro & Billing", iconName: "card", count: counts["pricing"] || 0 },
      { id: "ai", label: "AI Features", iconName: "cpu", count: counts["ai"] || 0 },
    ];
  }, []);

  // Filter FAQ items by active category & search query
  const filteredItems = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      // Category filter
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      // Search filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.categoryName.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Hero & Search Header */}
        <FaqHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalQuestions={filteredItems.length}
        />

        {/* Category Pills Filter */}
        <FaqCategories
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Accordion FAQ List */}
        <FaqList
          items={filteredItems}
          searchQuery={searchQuery}
          onResetSearch={() => {
            setSearchQuery("");
            setActiveCategory("all");
          }}
        />

        {/* Support & Contact Banner */}
        <FaqSupportCard />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FaqPage;
