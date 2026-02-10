import { CourseModel } from "../../db.js";

const addLesson = async ({ sectionId, title, type, videoUrl, fileUrl, duration = 0, order = 0 }) => {
  const course = await CourseModel.findOne({ "sections._id": sectionId });
  if (!course) {
    const error = new Error("Section not found");
    error.status = 404;
    throw error;
  }

  const section = course.sections.id(sectionId);
  if (!section) {
    const error = new Error("Section not found");
    error.status = 404;
    throw error;
  }

  const lesson = { title, type, videoUrl, fileUrl, duration, order };
  section.lessons.push(lesson);
  await course.save();

  return section.lessons[section.lessons.length - 1];
};

const updateLesson = async ({ lessonId, updates }) => {
  const course = await CourseModel.findOne({ "sections.lessons._id": lessonId });
  if (!course) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }

  const section = course.sections.find((entry) => entry.lessons.id(lessonId));
  const lesson = section?.lessons.id(lessonId);
  if (!lesson) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }

  Object.assign(lesson, updates);
  await course.save();

  return lesson;
};

const deleteLesson = async ({ lessonId }) => {
  const course = await CourseModel.findOne({ "sections.lessons._id": lessonId });
  if (!course) {
    const error = new Error("Lesson not found");
    error.status = 404;
    throw error;
  }

  const section = course.sections.find((entry) => entry.lessons.id(lessonId));
  section?.lessons.id(lessonId)?.deleteOne();
  await course.save();

  return { removed: true };
};

export { addLesson, updateLesson, deleteLesson };
