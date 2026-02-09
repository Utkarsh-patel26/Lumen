import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { student, admin } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard/student", requireAuth, requireRole("student"), student);
dashboardRouter.get("/dashboard/admin", requireAuth, requireRole("admin"), admin);

export { dashboardRouter };
