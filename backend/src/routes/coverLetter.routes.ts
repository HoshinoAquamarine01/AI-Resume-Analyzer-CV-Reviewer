import { Router } from "express";
import {
  generateCoverLetter,
  getCoverLetters,
  getCoverLetterById,
  updateCoverLetter,
  deleteCoverLetter,
  downloadCoverLetter,
} from "../controllers/coverLetter.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", generateCoverLetter);
router.get("/", getCoverLetters);
router.get("/:coverLetterId", getCoverLetterById);
router.put("/:coverLetterId", updateCoverLetter);
router.delete("/:coverLetterId", deleteCoverLetter);
router.get("/:coverLetterId/download", downloadCoverLetter);

export default router;
