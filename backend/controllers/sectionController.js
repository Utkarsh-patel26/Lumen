import { addSection, updateSection, deleteSection } from "../services/sectionService.js";
import { sendSuccess } from "../utils/response.js";

const createSection = async (req, res, next) => {
  try {
    const section = await addSection({
      courseId: req.params.id,
      title: req.body.title,
      order: req.body.order
    });
    return sendSuccess(res, section, "Section created", 201);
  } catch (err) {
    return next(err);
  }
};

const editSection = async (req, res, next) => {
  try {
    const section = await updateSection({
      sectionId: req.params.id,
      updates: req.body
    });
    return sendSuccess(res, section, "Section updated");
  } catch (err) {
    return next(err);
  }
};

const removeSection = async (req, res, next) => {
  try {
    const result = await deleteSection({ sectionId: req.params.id });
    return sendSuccess(res, result, "Section deleted");
  } catch (err) {
    return next(err);
  }
};

export { createSection, editSection, removeSection };
