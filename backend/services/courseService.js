import { CourseModel } from "../../db.js";

const createCourse = async ({
  creatorId,
  title,
  description,
  price,
  thumbnailUrl,
  heroImageUrl,
  tags,
  level,
  duration,
  status
}) => {
  const course = await CourseModel.create({
    creatorId,
    title,
    description,
    price,
    thumbnailUrl,
    heroImageUrl,
    tags,
    level,
    duration,
    status,
    publishedAt: status === "published" ? new Date() : null
  });
  return course;
};

const updateCourse = async ({ courseId, creatorId, updates }) => {
  if (updates?.status === "published" && !updates.publishedAt) {
    updates.publishedAt = new Date();
  }
  if (updates?.status === "draft") {
    updates.publishedAt = null;
  }
  const course = await CourseModel.findOneAndUpdate(
    { _id: courseId, creatorId },
    { $set: updates },
    { new: true }
  );
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }
  return course;
};

const deleteCourse = async ({ courseId, creatorId }) => {
  const course = await CourseModel.findOneAndDelete({ _id: courseId, creatorId });
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }
  return course;
};

const listCourses = async ({ page, limit, search }) => {
  const query = {
    ...(search ? { $text: { $search: search } } : {}),
    status: "published"
  };
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    CourseModel.find(query).skip(skip).limit(limit),
    CourseModel.countDocuments(query)
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

const listCoursesByCreator = async (creatorId) => {
  return CourseModel.find({ creatorId });
};

const getCourseById = async (courseId) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }
  return course;
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  listCourses,
  listCoursesByCreator,
  getCourseById
};
