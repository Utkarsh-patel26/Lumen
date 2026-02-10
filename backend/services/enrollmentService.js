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

const completeLesson = async ({ userId, courseId, lessonId }) => {
  const enrollment = await EnrollmentModel.findOne({ userId, courseId });
  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.status = 404;
    throw error;
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }

  const lessonExists = course.sections.some((section) =>
    section.lessons.some((lesson) => String(lesson._id) === String(lessonId))
  );
  if (!lessonExists) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }

  const completedSet = new Set(enrollment.completedLessons.map((id) => String(id)));
  completedSet.add(String(lessonId));
  enrollment.completedLessons = Array.from(completedSet);

  const totalLessons = course.sections.reduce(
    (count, section) => count + section.lessons.length,
    0
  );
  const completedCount = completedSet.size;

  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  enrollment.progress = Math.min(100, progress);
  enrollment.completed = totalLessons > 0 && completedCount >= totalLessons;

  await enrollment.save();
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

export { enroll, listStudentEnrollments, listAdminEnrollments, completeLesson };
