import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createEnrollment, getMyEnrollments, getAdminEnrollments } from "../controllers/enrollmentController.js";

const enrollmentRouter = express.Router();

const enrollSchema = z.object({
  body: z.object({
    courseId: z.string().min(1)
  })
});

enrollmentRouter.post("/enrollments", requireAuth, requireRole("student"), validate(enrollSchema), createEnrollment);
enrollmentRouter.get("/enrollments/me", requireAuth, requireRole("student"), getMyEnrollments);
enrollmentRouter.get("/enrollments/admin", requireAuth, requireRole("admin"), getAdminEnrollments);

export { enrollmentRouter };
