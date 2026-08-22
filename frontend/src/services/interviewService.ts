import axiosInstance from "./axiosInstance";

export const interviewService = {
  getInterviewSessions: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get("/api/interview", {
      params: { page, limit },
    });
    return response.data;
  },

  getInterviewStats: async () => {
    const response = await axiosInstance.get("/api/interview/stats");
    return response.data;
  },
};

export default interviewService;
