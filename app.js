import express from "express";
import { matchedData, validationResult } from "express-validator";
import { check_signup } from "./validators/check_signup.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("hello world"));
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", check_signup, (req, res) => {
  const errors = validationResult(req);
  const values = matchedData(req, { onlyValidData: false });

  if (!errors.isEmpty()) {
    res.locals.errors = errors;
    res.locals.values = values;
    return res.status(400).render("signup");
  }

  res.send("post signup");
});

app.listen(3000, (error) => {
  if (error) throw error;
  console.log("App running on port 3000");
});
