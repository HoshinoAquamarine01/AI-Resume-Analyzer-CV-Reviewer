import axiosInstance from "./axiosInstance";
import { CreateInterviewPayload, SubmitAnswersPayload, InterviewSession } from "../types/interview.types";

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

  createInterviewSession: async (payload: CreateInterviewPayload): Promise<InterviewSession> => {
    const response = await axiosInstance.post("/api/interview/generate", payload);
    return response.data;
  },

  submitAnswers: async (payload: SubmitAnswersPayload): Promise<InterviewSession> => {
    const response = await axiosInstance.post(`/api/interview/${payload.sessionId}/submit`, {
      answers: payload.answers,
    });
    return response.data;
  },
};

export default interviewService;
