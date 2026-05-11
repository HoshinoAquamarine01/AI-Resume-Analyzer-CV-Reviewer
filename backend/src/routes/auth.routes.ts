import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";

const router = Router();

router.post("/register", validationMiddleware, register);
router.post("/login", validationMiddleware, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshToken);

export default router;
