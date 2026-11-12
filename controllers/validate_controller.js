import { body } from "express-validator";
import {
  CLUB_SECRET,
  FIRST_NAME_COLUMN_MAX_LENGTH,
  LAST_NAME_COLUMN_MAX_LENGTH,
  PASSWORD_COLUMN_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LOWER_CASE,
  PASSWORD_MIN_NUMBERS,
  PASSWORD_MIN_SYMBOLS,
  PASSWORD_MIN_UPPER_CASE,
} from "../config.js";

const empty_error = "must be filled.";

const get_username_field_chain = () =>
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${empty_error}`)
    .isEmail()
    .withMessage(
      "Email must be formatted correctly (e.g., johndoe@example.com).",
    );

const get_password_field_chain = () =>
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${empty_error}`)
    .isLength({ max: PASSWORD_COLUMN_MAX_LENGTH })
    .withMessage(
      `Password must be less than ${PASSWORD_COLUMN_MAX_LENGTH + 1} characters.`,
    )
    .isStrongPassword({
      minLength: PASSWORD_MIN_LENGTH,
      minLowerCase: PASSWORD_MIN_LOWER_CASE,
      minUppercase: PASSWORD_MIN_UPPER_CASE,
      minNumbers: PASSWORD_MIN_NUMBERS,
      minSymbols: PASSWORD_MIN_SYMBOLS,
    })
    .withMessage(
      `Password must at least be ${PASSWORD_MIN_LENGTH} characters long with ${PASSWORD_MIN_UPPER_CASE} uppercase character, ${PASSWORD_MIN_LOWER_CASE} lowercase character, ${PASSWORD_MIN_NUMBERS} number, and ${PASSWORD_MIN_SYMBOLS} symbol.`,
    );

export const check_signup = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First name ${empty_error}`)
    .isLength({ max: FIRST_NAME_COLUMN_MAX_LENGTH })
    .withMessage(
      `First name must be less than ${FIRST_NAME_COLUMN_MAX_LENGTH + 1} characters.`,
    ),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${empty_error}`)
    .isLength({ max: LAST_NAME_COLUMN_MAX_LENGTH })
    .withMessage(
      `Last name must be less than ${LAST_NAME_COLUMN_MAX_LENGTH + 1} characters.`,
    ),
  get_username_field_chain(),
  get_password_field_chain(),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${empty_error}`)
    .custom((value, { req }) => req.body.password === value)
    .withMessage("Confirm password must match password."),
];

export const check_join_club = [
  body("club_secret")
    .trim()
    .notEmpty()
    .withMessage("Try to guess.")
    .toLowerCase()
    .custom((club_secret) => club_secret === CLUB_SECRET)
    .withMessage("Nice try, but no silly :p"),
];

export const check_login = [
  get_username_field_chain(),
  get_password_field_chain(),
];

export const check_new_post = [
  body("title").trim().notEmpty().withMessage(`Post title ${empty_error}`),
  body("body").trim().notEmpty().withMessage(`Post body ${empty_error}`),
];
