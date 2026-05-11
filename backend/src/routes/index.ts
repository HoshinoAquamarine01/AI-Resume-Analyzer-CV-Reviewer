import { Router } from "express";
import authRoutes from "./auth.routes";
import resumeRoutes from "./resume.routes";
import aiRoutes from "./ai.routes";
import userRoutes from "./user.routes";
import coverLetterRoutes from "./coverLetter.routes";
import interviewRoutes from "./interview.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/ai", aiRoutes);
router.use("/user", userRoutes);
router.use("/cover-letter", coverLetterRoutes);
router.use("/interview", interviewRoutes);
router.use("/admin", adminRoutes);

export default router;
