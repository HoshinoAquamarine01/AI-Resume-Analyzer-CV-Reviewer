import axiosInstance from "./axiosInstance";

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
};

export default coverLetterService;
