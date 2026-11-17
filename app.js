import bcrypt from "bcryptjs";
import pg_simple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { body, matchedData } from "express-validator";
import passport from "passport";
import { ADMIN_SECRET, SALT_LENGTH } from "./config.js";
import {
  authenticate_user,
  check_auth,
  is_admin,
} from "./controllers/auth_controller.js";
import {
  bad_request_handler,
  correct_values_for,
  missing_resource_response,
  not_found_handler,
  server_error_handler,
} from "./controllers/error_controller.js";
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

app.set("view engine", "ejs");

app.use(
  session({
    store: new session_store({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: "a",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.locals.page = {};
  next();
});

app.get("/", async (req, res) => {
  const posts = await db.select_all_posts();
  res.locals.posts = posts;
  res.locals.page = "home";
  res.render("home");
  if (req.user?.is_new_member) delete req.user.is_new_member;
});
app
  .route("/signup")
  .get((req, res) => {
    res.locals.page = "signup";
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
    res.locals.page = "login";
    res.render("login");
    if (req.session?.is_auth_fail) delete req.session.is_auth_fail;
  })
  .post(
    check_login,
    correct_values_for("login"),
    authenticate_user,
    (req, res) => {
      res.send("post login");
    },
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
      res.locals.page = "join_club";
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
    (req, res) => {
      res.locals.page = "new_post";
      res.render("new_post");
    },
  )
  .post(
    check_auth(),
    check_new_post,
    correct_values_for("new_post"),
    async (req, res) => {
      const new_post = {
        username: req.user.username,
        ...matchedData(req),
      };
      await db.insert_post(new_post);
      res.redirect("/");
    },
  );

app.post("/delete_post", is_admin, body("post_id"), async (req, res) => {
  await db.delete_post(matchedData(req));
  res.redirect("/");
});

app.use(missing_resource_response);
app.use(bad_request_handler);
app.use(not_found_handler);
app.use(server_error_handler);

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
