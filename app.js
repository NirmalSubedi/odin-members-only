import express from "express";
import { matchedData, validationResult } from "express-validator";
import { BAD_REQUEST } from "./config.js";
import {
  check_join_club,
  check_login,
  check_signup,
} from "./controllers/validate.controller.js";
import { BadRequestError } from "./errors/BadRequestError.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("home"));

const correct_values_for = (page) => (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    next(new BadRequestError("Client validation error(s).", page));
  }
};

app
  .route("/join_club")
  .get((req, res) => res.render("join_club"))
  .post(check_join_club, correct_values_for("join_club"), (req, res) => {
    res.send("post_join_club");
  });

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(check_signup, correct_values_for("signup"), (req, res) => {
    res.send("post signup");
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(check_login, correct_values_for("login"), (req, res) => {
    res.send("post login");
  });

app.use((err, req, res, next) => {
  if (err.statusCode !== BAD_REQUEST) return next(err);
  res.locals.errors = validationResult(req);
  res.locals.values = matchedData(req, { onlyValidData: false });
  res.status(BAD_REQUEST).render(err.page);
});

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
