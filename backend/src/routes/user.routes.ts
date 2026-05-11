import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  changePassword,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/avatar", uploadMiddleware.single("avatar"), uploadAvatar);
router.post("/change-password", changePassword);
router.delete("/account", deleteAccount);

export default router;
