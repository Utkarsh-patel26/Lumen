import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLesson, editLesson, removeLesson } from "../controllers/lessonController.js";

const lessonsRouter = express.Router();

const lessonBodySchema = z
  .object({
    title: z.string().min(2).max(200),
    type: z.enum(["video", "file"]),
    videoUrl: z.string().url().optional(),
    fileUrl: z.string().url().optional(),
    duration: z.number().optional(),
    order: z.number().optional()
  })
  .superRefine((data, ctx) => {
    if (data.type === "video" && !data.videoUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "videoUrl is required" });
    }
    if (data.type === "file" && !data.fileUrl) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "fileUrl is required" });
    }
  });

const createSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: lessonBodySchema
});

const updateSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      title: z.string().min(2).max(200).optional(),
      type: z.enum(["video", "file"]).optional(),
      videoUrl: z.string().url().optional(),
      fileUrl: z.string().url().optional(),
      duration: z.number().optional(),
      order: z.number().optional()
    })
    .superRefine((data, ctx) => {
      if (data.type === "video" && !data.videoUrl) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "videoUrl is required" });
      }
      if (data.type === "file" && !data.fileUrl) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "fileUrl is required" });
      }
    })
});

lessonsRouter.post(
  "/sections/:id/lessons",
  requireAuth,
  requireRole("admin"),
  validate(createSchema),
  createLesson
);

lessonsRouter.put(
  "/lessons/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateSchema),
  editLesson
);

lessonsRouter.delete(
  "/lessons/:id",
  requireAuth,
  requireRole("admin"),
  removeLesson
);

export { lessonsRouter };
