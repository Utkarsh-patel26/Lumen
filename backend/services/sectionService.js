import { CourseModel } from "../../db.js";

const addSection = async ({ courseId, title, order = 0 }) => {
  const course = await CourseModel.findById(courseId);
  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    throw error;
  }

  const section = { title, order, lessons: [] };
  course.sections.push(section);
  await course.save();

  return course.sections[course.sections.length - 1];
};

const updateSection = async ({ sectionId, updates }) => {
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

  Object.assign(section, updates);
  await course.save();

  return section;
};

const deleteSection = async ({ sectionId }) => {
  const course = await CourseModel.findOne({ "sections._id": sectionId });
  if (!course) {
    const error = new Error("Section not found");
    error.status = 404;
    throw error;
  }

  course.sections.id(sectionId)?.deleteOne();
  await course.save();

  return { removed: true };
};

export { addSection, updateSection, deleteSection };
