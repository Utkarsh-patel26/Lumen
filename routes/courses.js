import express from "express";
import jwt from "jsonwebtoken";
import { CourseModel } from "../db.js";


const coursesRouter = express.Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  try {
    jwt.verify(token, process.env.JWT_SECRET || "");
  } catch (err) {
    // Ignore invalid tokens for public listing.
  }

  return next();
};

coursesRouter.get("/courses",optionalAuth,async(req,res) => {

  try{

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = req.query.search || "";
    const skip = (page - 1) * limit;
    const query = search ? { $text: { $search: search } } : {};

    const [courses, total] = await Promise.all([
      CourseModel.find(query).skip(skip).limit(limit),
      CourseModel.countDocuments(query)
    ]);

    if (courses) {
      const pages = Math.max(1, Math.ceil(total / limit));
      res.status(200).json({
        success: true,
        data: { items: courses, total, page, limit, pages },
        message: "Courses fetched",
        courses,
        page,
        limit,
        total
      });
    } else {
      res.status(400).json({ success: false, data: null, message: "No courses found, Backend error" });
    }

  } catch (e) {
    res.status(400).json({ success: false, data: null, message: "Backend error" });
  }



  
 
})

export {coursesRouter}





