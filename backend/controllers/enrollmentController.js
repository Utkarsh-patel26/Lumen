import { enroll, listStudentEnrollments, listAdminEnrollments } from "../services/enrollmentService.js";
import { sendSuccess } from "../utils/response.js";

const createEnrollment = async (req, res, next) => {
  try {
    const enrollment = await enroll({ userId: req.user.id, courseId: req.body.courseId });
    return sendSuccess(res, enrollment, "Enrollment created", 201);
  } catch (err) {
    return next(err);
  }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await listStudentEnrollments(req.user.id);
    return sendSuccess(res, enrollments, "Enrollments fetched");
  } catch (err) {
    return next(err);
  }
};

const getAdminEnrollments = async (req, res, next) => {
  try {
    const enrollments = await listAdminEnrollments(req.user.id);
    return sendSuccess(res, enrollments, "Enrollments fetched");
  } catch (err) {
    return next(err);
  }
};

export { createEnrollment, getMyEnrollments, getAdminEnrollments };
