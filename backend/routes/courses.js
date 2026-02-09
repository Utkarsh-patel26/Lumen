import express from "express";
import { z } from "zod";
import { requireAuth, requireRole, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { create, update, remove, list, listByCreator, getById } from "../controllers/courseController.js";

const coursesApiRouter = express.Router();

const listSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional()
  })
});

const courseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(2000),
    price: z.number().min(0),
    thumbnailUrl: z.string().url(),
    imageUrl: z.string().url().optional()
  })
});

const updateSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().min(10).max(2000).optional(),
    price: z.number().min(0).optional(),
    thumbnailUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional()
  })
});

coursesApiRouter.get("/courses", optionalAuth, validate(listSchema), list);
coursesApiRouter.get("/courses/:id", optionalAuth, getById);
coursesApiRouter.get("/admin/courses", requireAuth, requireRole("admin"), listByCreator);
coursesApiRouter.post("/admin/courses", requireAuth, requireRole("admin"), validate(courseSchema), create);
coursesApiRouter.put("/admin/courses/:id", requireAuth, requireRole("admin"), validate(updateSchema), update);
coursesApiRouter.delete("/admin/courses/:id", requireAuth, requireRole("admin"), remove);

export { coursesApiRouter };
