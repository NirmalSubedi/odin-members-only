import { body } from "express-validator";

const emptyError = "must not be empty.";

export const check_signup = [
  body("first_name").trim().notEmpty().withMessage(`First name ${emptyError}`),
  body("last_name").trim().notEmpty().withMessage(`Last name ${emptyError}`),
  body("username").trim().notEmpty().withMessage(`Email ${emptyError}`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyError}`),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${emptyError}`),
];
