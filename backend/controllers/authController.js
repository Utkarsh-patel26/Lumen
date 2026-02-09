import { createUser, loginUser } from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";

const signup = async (req, res, next) => {
  try {
    const { name, email, password, age, role } = req.body;
    const user = await createUser({ name, email, password, age, role });
    return sendSuccess(res, { id: user._id, role: user.role }, "Signup successful", 201);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return sendSuccess(res, {
      token: result.token,
      role: result.role,
      user: { id: result.user._id, name: result.user.name, email: result.user.email }
    }, "Login successful");
  } catch (err) {
    return next(err);
  }
};

export { signup, login };
