import { Router } from "express";
import {
  getAdminDashboard,
  manageUsers,
  viewReports as getAdminLogs,
  manageSettings as updateSystemSettings,
  viewAnalytics as getSystemStats,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(authorize("admin"));

router.get("/dashboard", getAdminDashboard);
router.post("/users/manage", manageUsers);
router.get("/logs", getAdminLogs);
router.put("/settings", updateSystemSettings);
router.get("/stats", getSystemStats);

export default router;
