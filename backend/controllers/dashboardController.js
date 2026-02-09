import { studentDashboard, adminDashboard } from "../services/dashboardService.js";
import { sendSuccess } from "../utils/response.js";

const student = async (req, res, next) => {
  try {
    const data = await studentDashboard(req.user.id);
    return sendSuccess(res, data, "Student dashboard");
  } catch (err) {
    return next(err);
  }
};

const admin = async (req, res, next) => {
  try {
    const data = await adminDashboard(req.user.id);
    return sendSuccess(res, data, "Admin dashboard");
  } catch (err) {
    return next(err);
  }
};

export { student, admin };
