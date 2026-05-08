import { InterviewSession } from "../models/InterviewSession";
import { asyncHandler } from "../utils/asyncHandler";
import { formatResponse } from "../utils/formatResponse";

export const createInterviewSession = asyncHandler(
  async (req: any, res: any) => {
    const { resumeId, jobTitle, companyName, sessionType } = req.body;
    const userId = req.user._id;

    const session = await InterviewSession.create({
      userId,
      resumeId,
      jobTitle,
      companyName,
      sessionType,
      score: 0,
    });

    return res
      .status(201)
      .json(formatResponse(session, "Interview session created"));
  },
);

export const getSessions = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const sessions = await InterviewSession.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await InterviewSession.countDocuments({ userId });

  return res
    .status(200)
    .json(
      formatResponse(
        { sessions, total, pages: Math.ceil(total / limit) },
        "Sessions retrieved",
      ),
    );
});

export const getSessionById = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  return res.status(200).json(formatResponse(session, "Session retrieved"));
});

export const addQuestion = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;
  const { question } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  session.questions.push(question);
  await session.save();

  return res
    .status(200)
    .json(formatResponse(session, "Question added to session"));
});

export const addAnswer = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;
  const { answer } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  session.answers.push(answer);
  await session.save();

  return res
    .status(200)
    .json(formatResponse(session, "Answer added to session"));
});

export const addFeedback = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;
  const { feedback, score } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  session.feedback.push(feedback);
  session.score = score;

  await session.save();

  return res
    .status(200)
    .json(formatResponse(session, "Feedback added to session"));
});

export const endSession = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  return res
    .status(200)
    .json(formatResponse(session, "Interview session ended"));
});

export const getSessionFeedback = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findById(sessionId);
  if (!session) {
    return res.status(404).json(formatResponse(null, "Session not found"));
  }

  return res
    .status(200)
    .json(formatResponse(session.feedback, "Feedback retrieved"));
});

export const deleteSession = asyncHandler(async (req: any, res: any) => {
  const { sessionId } = req.params;
  const userId = req.user._id;

  const session = await InterviewSession.findById(sessionId);
  if (!session || session.userId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json(formatResponse(null, "Unauthorized to delete this session"));
  }

  await InterviewSession.findByIdAndDelete(sessionId);

  return res.status(200).json(formatResponse(null, "Session deleted"));
});

export const getSessionStatistics = asyncHandler(async (req: any, res: any) => {
  const userId = req.user._id;

  const sessions = await InterviewSession.find({ userId });

  const stats = {
    totalSessions: sessions.length,
    completedSessions: sessions.length,
    averageScore:
      sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length ||
      0,
    byType: {
      technical: sessions.filter((s) => s.sessionType === "technical").length,
      hr: sessions.filter((s) => s.sessionType === "hr").length,
    },
  };

  return res
    .status(200)
    .json(formatResponse(stats, "Session statistics retrieved"));
});
