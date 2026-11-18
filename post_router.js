import express from "express";
import { body } from "express-validator";
import { check_auth, is_admin } from "./controllers/auth_controller.js";
import { correct_values_for } from "./controllers/error_controller.js";
import {
  get__new_post,
  post__delete_post,
  post__new_post,
} from "./controllers/post_controller.js";
import { check_new_post } from "./controllers/validate_controller.js";

export const post_router = express.Router();

post_router
  .route("/new_post")
  .get(
    check_auth({
      on_fail: (req, res) => {
        req.session.is_auth_fail = true;
        res.redirect("/login");
      },
    }),
    get__new_post,
  )
  .post(
    check_auth(),
    check_new_post,
    correct_values_for("new_post"),
    post__new_post,
  );

post_router.post("/delete_post", is_admin, body("post_id"), post__delete_post);
