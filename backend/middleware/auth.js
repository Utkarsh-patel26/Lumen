import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JWT_SECRET_ADMIN } from "../../middlewares/adminMiddleware.js";
import { JWT_SECRET_USER } from "../../middlewares/userMiddleware.js";
import { JWT_SECRET } from "../../middlewares/middleware.js";

const parseToken = (authHeader) => {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.replace("Bearer ", "");
  return authHeader;
};

const tryVerify = (token, secret, role) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { id: decoded.id, role };
  } catch (err) {
    return null;
  }
};

const resolveUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    return { id: decoded.id, role: decoded.role };
  } catch (err) {
    return (
      tryVerify(token, JWT_SECRET_ADMIN, "admin") ||
      tryVerify(token, JWT_SECRET_USER, "student") ||
      tryVerify(token, JWT_SECRET, "student")
    );
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
  if (!user) {
    return res.status(401).json({ success: false, data: null, message: "Invalid token" });
  }
  req.user = user;

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
