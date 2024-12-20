const { body } = require("express-validator");

const createUserValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required"),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("The password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("The password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("The password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("The password must contain at least one digit")
    .matches(/[\W_]/)
    .withMessage(
      "The password must contain at least one special character (e.g., @, #, $, etc.)",
    ),
  body("role")
    .isIn(["supplier", "buyer"])
    .withMessage("Please specify a valid role: supplier or buyer"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { createUserValidation, loginValidation };
