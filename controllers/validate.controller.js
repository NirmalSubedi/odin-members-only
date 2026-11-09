import { body } from "express-validator";
import {
  FIRST_NAME_COLUMN_MAX_LENGTH,
  LAST_NAME_COLUMN_MAX_LENGTH,
  PASSWORD_COLUMN_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../config.js";

const emptyError = "must not be empty.";

export const check_signup = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First name ${emptyError}`)
    .isLength({ max: FIRST_NAME_COLUMN_MAX_LENGTH })
    .withMessage(
      `First name must be less than ${FIRST_NAME_COLUMN_MAX_LENGTH + 1} characters.`,
    ),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${emptyError}`)
    .isLength({ max: LAST_NAME_COLUMN_MAX_LENGTH })
    .withMessage(
      `Last name must be less than ${LAST_NAME_COLUMN_MAX_LENGTH + 1} characters.`,
    ),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyError}`)
    .isEmail()
    .withMessage("Email must be formatted like: john@doe.com"),
  body("password")
    .trim()
    .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_COLUMN_MAX_LENGTH })
    .withMessage(
      `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_COLUMN_MAX_LENGTH} characters.`,
    ),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${emptyError}`)
    .custom((value, { req }) => req.body.password === value)
    .withMessage("Confirm password must match password."),
];
