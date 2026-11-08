import { body } from "express-validator";

const emptyError = "must not be empty.";

export const check_signup = [
  body("first_name").trim().notEmpty().withMessage(`First name ${emptyError}`),
  body("last_name").trim().notEmpty().withMessage(`Last name ${emptyError}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyError}`)
    .isEmail()
    .withMessage("Email must be formatted like: john@doe.com"),
  body("password").trim().notEmpty().withMessage(`Password ${emptyError}`),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${emptyError}`)
    .if((value, { req }) => req.body.password === value)
    .withMessage("Confirm password must match password."),
];
