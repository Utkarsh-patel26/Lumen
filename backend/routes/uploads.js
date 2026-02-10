import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadBuffer } from "../utils/upload.js";
import { sendSuccess } from "../utils/response.js";

const uploadsRouter = express.Router();

uploadsRouter.post(
  "/uploads",
  requireAuth,
  requireRole("admin"),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, data: null, message: "Missing file" });
      }

      const type = req.body.type === "video" ? "video" : "raw";
      const folder = req.body.folder || "lumen/uploads";
      const url = await uploadBuffer({
        buffer: req.file.buffer,
        folder,
        resourceType: type,
        fileName: req.body.fileName
      });

      return sendSuccess(res, { url }, "File uploaded");
    } catch (err) {
      return next(err);
    }
  }
);

export { uploadsRouter };
