const { validationResult } = require("express-validator");

/*Handles user input validation. This keeps controllers decoupled from the  validation logic.*/
// Middleware to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = validateRequest;
