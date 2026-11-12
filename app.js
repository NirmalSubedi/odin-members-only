import express from "express";
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

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("home"));
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
app
  .route("/join_club")
  .get((req, res) => res.render("join_club"))
  .post(check_join_club, correct_values_for("join_club"), (req, res) => {
    res.send("post_join_club");
  });
app
  .route("/new_post")
  .get((req, res) => {
    res.render("new_post");
  })
  .post(check_new_post, correct_values_for("new_post"), (req, res) => {
    res.send("post new post");
  });

app.use(missing_resource_response);
app.use(bad_request_handler);
app.use(not_found_handler);
app.use(server_error_handler);

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
