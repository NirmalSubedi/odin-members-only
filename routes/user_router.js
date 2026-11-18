import express from "express";
import { correct_values_for } from "../controllers/error_controller.js";
import {
  get__login,
  get__logout,
  get__signup,
  post__login,
  post__signup,
} from "../controllers/user_controller.js";
import {
  check_login,
  check_signup,
} from "../controllers/validate_controller.js";

export const user_router = express.Router();

user_router
  .route("/signup")
  .get(get__signup)
  .post(check_signup, correct_values_for("signup"), post__signup);

user_router
  .route("/login")
  .get(get__login)
  .post(check_login, correct_values_for("login"), post__login);

user_router.route("/logout").get(get__logout);
