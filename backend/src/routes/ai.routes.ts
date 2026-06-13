import { Router } from "express";
import {
  analyzeResume,
  generateAtsOptimization as optimizeForATS,
  improveResume as suggestImprovements,
  matchJobDescriptions as generateJobMatches,
} from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { apiRateLimit as rateLimit } from "../middlewares/rateLimit.middleware";

const router = Router();

router.use(authMiddleware);
router.use(rateLimit);

router.post("/analyze", analyzeResume);
router.post("/ats-optimize", optimizeForATS);
router.post("/suggestions", suggestImprovements);
router.post("/job-matches", generateJobMatches);

export default router;
