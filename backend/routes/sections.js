import express from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSection, editSection, removeSection } from "../controllers/sectionController.js";

const sectionsRouter = express.Router();

const createSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(2).max(200),
    order: z.number().optional()
  })
});

const updateSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    order: z.number().optional()
  })
});

sectionsRouter.post(
  "/courses/:id/sections",
  requireAuth,
  requireRole("admin"),
  validate(createSchema),
  createSection
);

sectionsRouter.put(
  "/sections/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateSchema),
  editSection
);

sectionsRouter.delete(
  "/sections/:id",
  requireAuth,
  requireRole("admin"),
  removeSection
);

export { sectionsRouter };
