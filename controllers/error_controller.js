import { matchedData, validationResult } from "express-validator";
import { BAD_REQUEST } from "../config.js";
import { BadRequestError } from "../errors/BadRequestError.js";

export const correct_values_for = (page) => (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    next(new BadRequestError("Client validation error(s).", page));
  }
};

export const bad_request_handler = (error, req, res, next) => {
  if (error.statusCode !== BAD_REQUEST) return next(error);
  res.locals.errors = validationResult(req);
  res.locals.values = matchedData(req, { onlyValidData: false });
  res.status(BAD_REQUEST).render(error.page);
};

export const server_error_handler = (error, req, res, next) => {
  console.error(error);
  res
    .status(error.statusCode || INTERNAL_SERVER_ERROR)
    .send("Something is wrong with the server. Try again later.");
};
