import { EnrollmentModel, CourseModel } from "../../db.js";

const enroll = async ({ userId, courseId }) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }

  const existing = await EnrollmentModel.findOne({ userId, courseId });
  if (existing) {
    const error = new Error("Already enrolled");
    error.status = 409;
    throw error;
  }

  const enrollment = await EnrollmentModel.create({ userId, courseId });
  return enrollment;
};

const listStudentEnrollments = async (userId) => {
  return EnrollmentModel.find({ userId }).populate("courseId");
};

const listAdminEnrollments = async (creatorId) => {
  const courses = await CourseModel.find({ creatorId }, { _id: 1 });
  const courseIds = courses.map((course) => course._id);
  return EnrollmentModel.find({ courseId: { $in: courseIds } }).populate("courseId");
};

export { enroll, listStudentEnrollments, listAdminEnrollments };
