import { CourseModel, EnrollmentModel } from "../../db.js";

const studentDashboard = async (userId) => {
  const [enrollments, totalCourses] = await Promise.all([
    EnrollmentModel.find({ userId }),
    CourseModel.countDocuments({})
  ]);

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.completed).length;
  const avgProgress = enrolledCount
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolledCount)
    : 0;

  return {
    enrolledCount,
    completedCount,
    avgProgress,
    totalCourses
  };
};

const adminDashboard = async (creatorId) => {
  const courses = await CourseModel.find({ creatorId }, { _id: 1, price: 1 });
  const courseIds = courses.map((course) => course._id);
  const enrollments = await EnrollmentModel.find({ courseId: { $in: courseIds } });

  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  const estimatedRevenue = enrollments.reduce((sum, enrollment) => {
    const course = courses.find((c) => String(c._id) === String(enrollment.courseId));
    return sum + (course?.price || 0);
  }, 0);

  return {
    totalCourses,
    totalEnrollments,
    estimatedRevenue
  };
};

export { studentDashboard, adminDashboard };
