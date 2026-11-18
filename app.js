import pg_simple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { body } from "express-validator";
import path from "node:path";
import passport from "passport";
import {
  NODE_ENV,
  SERVER_PORT,
  SESSION_COOKIE_MAX_AGE,
  SESSION_SECRET,
} from "./config.js";
import { check_auth, is_admin } from "./controllers/auth_controller.js";
import {
  get__join_club,
  post__join_club,
} from "./controllers/club_controller.js";
import {
  bad_request_handler,
  correct_values_for,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
import {
  app_session,
  view_value_assignments,
} from "./controllers/global_controller.js";
import { get__index } from "./controllers/index_controller.js";
import {
  get__new_post,
  post__delete_post,
  post__new_post,
} from "./controllers/post_controller.js";
import {
  get__login,
  get__logout,
  get__signup,
  post__login,
  post__signup,
} from "./controllers/user_controller.js";
import {
  check_join_club,
  check_login,
  check_new_post,
  check_signup,
} from "./controllers/validate_controller.js";
import { pool } from "./db/pool.js";
import { post_router } from "./post_router.js";
import { club_router } from "./routes/club_router.js";
import { index_router } from "./routes/index_router.js";
import { user_router } from "./user_router.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(app_session);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(view_value_assignments);

app.use(index_router);
app.use(user_router);
app.use(post_router);
app.use(club_router);

app.use(missing_resource_response);
app.use(bad_request_handler);
app.use(not_found_handler);
app.use(server_error_handler);

app.listen(SERVER_PORT, (error) => {
  if (error) throw error;
  console.log(`App running on port ${SERVER_PORT}`);
});
