import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import TemplateHeader from "../components/templates/TemplateHeader";
import TemplateFilterBar from "../components/templates/TemplateFilterBar";
import TemplateGrid from "../components/templates/TemplateGrid";
import TemplatePreviewModal from "../components/templates/TemplatePreviewModal";
import { ResumeTemplate, TemplateFilterState } from "../types/template";
import templateService from "../services/templateService";

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const [filters, setFilters] = useState<TemplateFilterState>({
    category: "all",
    search: "",
    sortBy: "popular",
    atsOnly: false,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const data = await templateService.getTemplates({
          category: filters.category,
          query: filters.search,
        });

        if (isMounted) {
          setTemplates(data);
        }
      } catch (err: any) {
        console.error("Failed to load templates from backend:", err);
        if (isMounted) {
          toast.error("Failed to connect to backend templates API");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchTemplates, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [filters.category, filters.search]);

  const handleFilterChange = (newFilters: Partial<TemplateFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      search: "",
      sortBy: "popular",
      atsOnly: false,
    });
  };

 
  const processedTemplates = useMemo(() => {
    let list = [...templates];

    if (filters.sortBy === "ats") {
      list.sort((a, b) => b.atsScore - a.atsScore);
    } else if (filters.sortBy === "popular") {
      list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (filters.sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [templates, filters.sortBy]);

  const handleSelectTemplate = (template: ResumeTemplate) => {
    toast.success(`Selected template "${template.title}". Redirecting to CV Manager...`);
   
    navigate("/resumes", { state: { selectedTemplateId: template.id, templateTitle: template.title } });
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        
        <TemplateHeader />

        
        <TemplateFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={processedTemplates.length}
        />

        <TemplateGrid
          templates={processedTemplates}
          loading={loading}
          onPreview={(template) => setPreviewTemplate(template)}
          onSelect={handleSelectTemplate}
          onResetFilters={handleResetFilters}
        />

    
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleSelectTemplate}
        />
      </div>
    </MainLayout>
  );
};

export default TemplatesPage;
