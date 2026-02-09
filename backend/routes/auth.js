import express from "express";
import { z } from "zod";
import { signup, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const authRouter = express.Router();

const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(3).max(80),
    password: z.string().min(6).max(80),
    age: z.number().min(1).max(120),
    role: z.enum(["student", "admin"]).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(80)
  })
});

authRouter.post("/auth/signup", validate(signupSchema), signup);
authRouter.post("/auth/login", validate(loginSchema), login);

export { authRouter };
