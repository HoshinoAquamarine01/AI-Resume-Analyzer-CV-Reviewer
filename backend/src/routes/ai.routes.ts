import { Router } from "express";
import {
  analyzeResume,
  optimizeForATS,
  suggestImprovements,
  generateJobMatches,
} from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimit } from "../middlewares/rateLimit.middleware";

const router = Router();

router.use(authMiddleware);
router.use(rateLimit);

router.post("/analyze", analyzeResume);
router.post("/ats-optimize", optimizeForATS);
router.post("/suggestions", suggestImprovements);
router.post("/job-matches", generateJobMatches);

export default router;
