import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const parseToken = (authHeader) => {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.replace("Bearer ", "");
  return authHeader;
};

const resolveUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    return { id: decoded.id, role: decoded.role };
  } catch (err) {
    return null;
  }
};

const requireAuth = (req, res, next) => {
  const token = parseToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ success: false, data: null, message: "Missing token" });
  }

  const user = resolveUserFromToken(token);
  if (!user) {
    return res.status(401).json({ success: false, data: null, message: "Invalid token" });
  }
  req.user = user;
  return next();
};

const optionalAuth = (req, res, next) => {
  const token = parseToken(req.headers.authorization);
  if (!token) {
    return next();
  }

  const user = resolveUserFromToken(token);
  if (user) {
    req.user = user;
  }

  return next();
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, data: null, message: "Unauthorized" });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ success: false, data: null, message: "Forbidden" });
  }
  return next();
};

export { requireAuth, requireRole, optionalAuth };
