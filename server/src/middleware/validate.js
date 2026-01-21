import { validationResult } from "express-validator";
import { ApiError } from "../utils/index.js";

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw ApiError.badRequest("Validation failed", errorMessages);
  }

  next();
};

export default validate;
