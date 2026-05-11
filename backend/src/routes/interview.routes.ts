import { Router } from "express";
import {
  startInterviewSession,
  getInterviewSessions,
  getInterviewSessionById,
  submitInterviewAnswer,
  endInterviewSession,
  getInterviewFeedback,
} from "../controllers/interview.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/start", startInterviewSession);
router.get("/", getInterviewSessions);
router.get("/:sessionId", getInterviewSessionById);
router.post("/:sessionId/submit", submitInterviewAnswer);
router.post("/:sessionId/end", endInterviewSession);
router.get("/:sessionId/feedback", getInterviewFeedback);

export default router;
