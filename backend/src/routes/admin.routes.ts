import { Router } from "express";
import {
  getAdminDashboard,
  manageUsers,
  getAdminLogs,
  updateSystemSettings,
  getSystemStats,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/dashboard", getAdminDashboard);
router.post("/users/manage", manageUsers);
router.get("/logs", getAdminLogs);
router.put("/settings", updateSystemSettings);
router.get("/stats", getSystemStats);

export default router;
