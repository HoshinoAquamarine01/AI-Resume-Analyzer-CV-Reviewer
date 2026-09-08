import axiosInstance from "./axiosInstance";
import { ResumeTemplate } from "../types/template";

export interface GetTemplatesParams {
  category?: string;
  query?: string;
}

export const templateService = {
  getTemplates: async (params?: GetTemplatesParams): Promise<ResumeTemplate[]> => {
    const response = await axiosInstance.get("/api/resume/templates", {
      params: {
        category: params?.category && params.category !== "all" ? params.category : undefined,
        query: params?.query || undefined,
      },
    });

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data && Array.isArray(data.templates)) {
      return data.templates;
    }
    return [];
  },
};

export default templateService;
