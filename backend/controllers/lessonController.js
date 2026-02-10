import { addLesson, updateLesson, deleteLesson } from "../services/lessonService.js";
import { sendSuccess } from "../utils/response.js";

const createLesson = async (req, res, next) => {
  try {
    const lesson = await addLesson({
      sectionId: req.params.id,
      title: req.body.title,
      type: req.body.type,
      videoUrl: req.body.videoUrl,
      fileUrl: req.body.fileUrl,
      duration: req.body.duration,
      order: req.body.order
    });
    return sendSuccess(res, lesson, "Lesson created", 201);
  } catch (err) {
    return next(err);
  }
};

const editLesson = async (req, res, next) => {
  try {
    const lesson = await updateLesson({
      lessonId: req.params.id,
      updates: req.body
    });
    return sendSuccess(res, lesson, "Lesson updated");
  } catch (err) {
    return next(err);
  }
};

const removeLesson = async (req, res, next) => {
  try {
    const result = await deleteLesson({ lessonId: req.params.id });
    return sendSuccess(res, result, "Lesson deleted");
  } catch (err) {
    return next(err);
  }
};

export { createLesson, editLesson, removeLesson };
