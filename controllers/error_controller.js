import { matchedData, validationResult } from "express-validator";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../config.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

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

export const missing_resource_response = (req, res, next) => {
  next(new NotFoundError("Page not found"));
};

export const not_found_handler = (error, req, res, next) => {
  if (error.statusCode !== NOT_FOUND) return next(error);
  res.status(NOT_FOUND).send(error.message);
};

export const server_error_handler = (error, req, res, next) => {
  console.error(error);
  res
    .status(error.statusCode || INTERNAL_SERVER_ERROR)
    .send("Something is wrong with the server. Try again later.");
};
