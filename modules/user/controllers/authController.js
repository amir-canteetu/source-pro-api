const jwt = require("jsonwebtoken");
const _ = require("lodash");
const User = require("@userModule/models/userModel.js");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const {
  publicKey,
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/authMiddleware.js");
const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await userService.createUser(userData); // Handles user creation logic.

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token as HTTP-only cookie
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(201).json({
      message: "User created successfully",
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Send refresh token as an HTTP-only, secure cookie
    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send access token in response body
    const userWithoutPsswd = _.pick(user, ["id", "role", "email"]);
    res.json({
      message: "Login successful",
      accessToken,
      user: userWithoutPsswd,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("refresh-token");
  res.json({ message: "Logged out successfully" });
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies["refresh-token"];

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  jwt.verify(
    refreshToken,
    publicKey,
    { algorithms: ["ES256"] },
    (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      const newAccessToken = generateAccessToken(user);

      res.json({
        accessToken: newAccessToken,
        user: user,
      });
    },
  );
};

module.exports = { login, logout, register, refreshToken };
