import axiosInstance from "./axiosInstance";

export interface GenerateCoverLetterPayload {
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

export interface CoverLetterItem {
  _id: string;
  userId: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  content: string;
  tone?: string;
  generatedByAI?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const coverLetterService = {
  getCoverLetters: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/api/cover-letter", {
      params: { page, limit },
    });
    return response.data;
  },

  getCoverLetterById: async (id: string) => {
    const response = await axiosInstance.get(`/api/cover-letter/${id}`);
    return response.data;
  },

  generateCoverLetter: async (payload: GenerateCoverLetterPayload) => {
    const response = await axiosInstance.post("/api/cover-letter", payload);
    return response.data;
  },

  updateCoverLetter: async (
    id: string,
    payload: { content: string; jobTitle?: string; companyName?: string }
  ) => {
    const response = await axiosInstance.put(`/api/cover-letter/${id}`, payload);
    return response.data;
  },

  deleteCoverLetter: async (id: string) => {
    const response = await axiosInstance.delete(`/api/cover-letter/${id}`);
    return response.data;
  },

  exportCoverLetter: async (id: string, format: "pdf" | "docx" | "json" = "pdf") => {
    const response = await axiosInstance.get(`/api/cover-letter/${id}/export`, {
      params: { format },
      responseType: format === "json" ? "json" : "blob",
    });
    return response.data;
  },
};

export default coverLetterService;
