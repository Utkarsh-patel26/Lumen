import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createEnrollment,
  getMyEnrollments,
  getAdminEnrollments,
  markLessonComplete
} from "../controllers/enrollmentController.js";

const enrollmentRouter = express.Router();

const enrollSchema = z.object({
  body: z.object({
    courseId: z.string().min(1)
  })
});

enrollmentRouter.post("/enrollments", requireAuth, requireRole("student"), validate(enrollSchema), createEnrollment);
enrollmentRouter.get("/enrollments/me", requireAuth, requireRole("student"), getMyEnrollments);
enrollmentRouter.get("/enrollments/admin", requireAuth, requireRole("admin"), getAdminEnrollments);

enrollmentRouter.post(
  "/enroll/:courseId",
  requireAuth,
  requireRole("student"),
  (req, res, next) => {
    req.body = req.body || {};
    req.body.courseId = req.params.courseId;
    return createEnrollment(req, res, next);
  }
);

enrollmentRouter.get("/my-courses", requireAuth, requireRole("student"), getMyEnrollments);

enrollmentRouter.post(
  "/enroll/:courseId/lessons/:lessonId/complete",
  requireAuth,
  requireRole("student"),
  markLessonComplete
);

export { enrollmentRouter };
