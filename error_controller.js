import { BAD_REQUEST } from "./config.js";
import { BadRequestError } from "./errors/BadRequestError.js";

export const correct_values_for = (page) => (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (error) {
    next(new BadRequestError("Client validation error(s).", page));
  }
};

export const bad_request_handler = (err, req, res, next) => {
  if (err.statusCode !== BAD_REQUEST) return next(err);
  res.locals.errors = validationResult(req);
  res.locals.values = matchedData(req, { onlyValidData: false });
  res.status(BAD_REQUEST).render(err.page);
};
