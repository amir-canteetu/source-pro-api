const express = require("express");
const {
  login,
  logout,
  refreshToken,
  register,
} = require("../controllers/authController.js");
const {
  createUserValidation,
  loginValidation,
} = require("../validations/userValidation.js");

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/register", createUserValidation, register);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
