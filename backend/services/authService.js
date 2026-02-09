import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, AdminModel } from "../../db.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

const createUser = async ({ name, email, password, age, role }) => {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserModel.create({ name, email, password: hashPassword, age, role });
  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id, role: user.role || "student" }, env.jwtSecret, {
      expiresIn: "7d"
    });

    return { token, role: user.role || "student", user };
  }

  const admin = await AdminModel.findOne({ email });
  if (!admin) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: admin._id, role: "admin" }, env.jwtSecret, {
    expiresIn: "7d"
  });

  return {
    token,
    role: "admin",
    user: { _id: admin._id, name: admin.name, email: admin.email }
  };
};

export { createUser, loginUser };
