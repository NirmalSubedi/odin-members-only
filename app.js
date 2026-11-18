import bcrypt from "bcrypt";
import pg_simple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { body, matchedData } from "express-validator";
import path from "node:path";
import passport from "passport";
import {
  ADMIN_SECRET,
  NODE_ENV,
  SALT_LENGTH,
  SERVER_PORT,
  SESSION_COOKIE_MAX_AGE,
  SESSION_SECRET,
} from "./config.js";
import { check_auth, is_admin } from "./controllers/auth_controller.js";
import {
  bad_request_handler,
  correct_values_for,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
import { view_value_assignments } from "./controllers/global_controller.js";
import {
  get__new_post,
  post__delete_post,
  post__new_post,
} from "./controllers/post_controller.js";
import {
  check_join_club,
  check_login,
  check_new_post,
  check_signup,
} from "./controllers/validate_controller.js";
import { pool } from "./db/pool.js";
import * as db from "./db/queries.js";

const app = express();
const session_store = pg_simple(session);
const app_session = session({
  store: new session_store({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: SESSION_COOKIE_MAX_AGE,
  },
});

if (NODE_ENV === "production") {
  app_session.cookie.secure = true;
}

app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(app_session);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(view_value_assignments);

app.get("/", async (req, res) => {
  const posts = await db.select_all_posts();
  res.locals.posts = posts;
  res.locals.page.name = "home";
  res.render("home");
  if (req.user?.is_new_member) delete req.user.is_new_member;
});

app
  .route("/signup")
  .get((req, res) => {
    res.locals.page.name = "signup";
    res.render("signup");
  })
  .post(check_signup, correct_values_for("signup"), async (req, res, next) => {
    try {
      const new_user = matchedData(req);
      new_user.password = await bcrypt.hash(new_user.password, SALT_LENGTH);
      new_user.is_admin = new_user.admin_secret === ADMIN_SECRET;
      new_user.is_member = new_user.is_admin;
      const [user] = await db.insert_user(new_user);
      req.login(user, (error) => {
        if (error) return next(error);
        res.redirect("/");
      });
    } catch (error) {
      next(error);
    }
  });

app
  .route("/login")
  .get((req, res) => {
    if (req.session?.locals_values) {
      res.locals.values = req.session.locals_values;
      delete req.session.locals_values;
    }
    res.locals.page.name = "login";
    res.render("login");
    if (req.session?.is_auth_fail) delete req.session.is_auth_fail;
    if (req.session?.messages) req.session.messages.length = 0;
  })
  .post(check_login, correct_values_for("login"), (req, res, next) =>
    passport.authenticate("local", (error, user, info) => {
      if (error) return next(error);
      if (!user) {
        req.session.locals_values = matchedData(req, { onlyValidData: false });
        return res.redirect("/login");
      }
      req.login(user, (error) => {
        if (error) return next(error);
        res.redirect("/");
      });
    })(req, res, next),
  );

app.route("/logout").get((req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.redirect("/");
  });
});

app
  .route("/join_club")
  .get(
    check_auth({
      on_fail: (req, res) => {
        req.session.is_auth_fail = true;
        res.redirect("/login");
      },
    }),
    (req, res) => {
      res.locals.page.name = "join_club";
      res.render("join_club");
    },
  )
  .post(
    check_auth(),
    check_join_club,
    correct_values_for("join_club"),
    async (req, res) => {
      await db.update_user_to_member(req.user);
      req.user.is_member = true;
      req.user.is_new_member = true;
      res.redirect("/");
    },
  );

app
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

app.post("/delete_post", is_admin, body("post_id"), post__delete_post);

app.use(missing_resource_response);
app.use(bad_request_handler);
app.use(not_found_handler);
app.use(server_error_handler);

app.listen(SERVER_PORT, (error) => {
  if (error) throw error;
  console.log(`App running on port ${SERVER_PORT}`);
});
