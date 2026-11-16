import bcrypt from "bcryptjs";
import pg_simple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { body, matchedData } from "express-validator";
import passport from "passport";
import { SALT_LENGTH } from "./config.js";
import { authenticate_user } from "./controllers/auth_controller.js";
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
  next();
});

app.get("/", async (req, res) => {
  const posts = await db.select_all_posts();
  res.locals.posts = posts;
  res.render("home");
  if (req.user?.is_new_member) delete req.user.is_new_member;
});
app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(check_signup, correct_values_for("signup"), async (req, res, next) => {
    try {
      const newUser = matchedData(req);
      newUser.password = await bcrypt.hash(newUser.password, SALT_LENGTH);
      const [user] = await db.insert_user(newUser);
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
    res.render("login");
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
  .get((req, res) => res.render("join_club"))
  .post(check_join_club, correct_values_for("join_club"), async (req, res) => {
    await db.update_user_to_member(req.user);
    req.user.is_member = true;
    req.user.is_new_member = true;
    res.redirect("/");
  });
app
  .route("/new_post")
  .get((req, res) => {
    res.render("new_post");
  })
  .post(check_new_post, correct_values_for("new_post"), async (req, res) => {
    const new_post = {
      username: req.user.username,
      ...matchedData(req),
    };
    await db.insert_post(new_post);
    res.redirect("/");
  });

app.post("/delete_post", body("post_id"), async (req, res) => {
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
