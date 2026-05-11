import { Router } from "express";
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  generateResumeAnalysis,
  getResumeAnalysis,
} from "../controllers/resume.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", uploadMiddleware.single("file"), createResume);
router.get("/", getResumes);
router.get("/:resumeId", getResumeById);
router.put("/:resumeId", uploadMiddleware.single("file"), updateResume);
router.delete("/:resumeId", deleteResume);
router.post("/:resumeId/analyze", generateResumeAnalysis);
router.get("/:resumeId/analysis", getResumeAnalysis);

export default router;
