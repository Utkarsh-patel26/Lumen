import {
  createCourse,
  updateCourse,
  deleteCourse,
  listCourses,
  listCoursesByCreator,
  getCourseById
} from "../services/courseService.js";
import { sendSuccess } from "../utils/response.js";

const create = async (req, res, next) => {
  try {
    const course = await createCourse({
      creatorId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnailUrl: req.body.thumbnailUrl,
      heroImageUrl: req.body.heroImageUrl,
      tags: req.body.tags,
      level: req.body.level,
      duration: req.body.duration,
      status: req.body.status
    });
    return sendSuccess(res, course, "Course created", 201);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const course = await updateCourse({
      courseId: req.params.id,
      creatorId: req.user.id,
      updates: req.body
    });
    return sendSuccess(res, course, "Course updated");
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const course = await deleteCourse({ courseId: req.params.id, creatorId: req.user.id });
    return sendSuccess(res, course, "Course deleted");
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = req.query.search || "";
    const data = await listCourses({ page, limit, search });
    return sendSuccess(res, data, "Courses fetched");
  } catch (err) {
    return next(err);
  }
};

const listByCreator = async (req, res, next) => {
  try {
    const courses = await listCoursesByCreator(req.user.id);
    return sendSuccess(res, courses, "Courses fetched");
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    return sendSuccess(res, course, "Course fetched");
  } catch (err) {
    return next(err);
  }
};

export { create, update, remove, list, listByCreator, getById };
