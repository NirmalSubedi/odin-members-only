import express from "express";
import { check_auth } from "../controllers/auth_controller.js";
import {
  get__join_club,
  post__join_club,
} from "../controllers/club_controller.js";
import { correct_values_for } from "../controllers/error_controller.js";
import { check_join_club } from "../controllers/validate_controller.js";

export const club_router = express.Router();

club_router
  .route("/join_club")
  .get(
    check_auth({
      on_fail: (req, res) => {
        req.session.is_auth_fail = true;
        res.redirect("/login");
      },
    }),
    get__join_club,
  )
  .post(
    check_auth(),
    check_join_club,
    correct_values_for("join_club"),
    post__join_club,
  );
