import jwt from "jsonwebtoken";
import _ from "lodash";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import {
  publicKey,
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/authMiddleware.js";

const register = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required"),
  body("password")
    .isString()
    .trim()
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
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please enter a username"),
  body("role")
    .isIn(["supplier", "buyer"])
    .withMessage("Please specify a valid role: supplier or buyer"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;
    try {
      const existingUser = await User.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already taken" });
      }

      const role_id = await User.findRoleIdByRoleName(role);
      if (!role_id) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.createUser({
        username,
        email,
        role_id,
        password_hash: hashedPassword,
      });

      // Create JWT token with user info
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Send refresh token as an HTTP-only, secure cookie
      res.cookie("refresh-token", refreshToken, {
        httpOnly: true, // Cookie cannot be accessed through the client-side JavaScript
        secure: process.env.NODE_ENV === "production", // Only set secure to true in production (HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  },
];

const login = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
        httpOnly: true, // Cookie cannot be accessed through the client-side JavaScript
        secure: process.env.NODE_ENV === "production", // Only set secure to true in production (HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send access token in response body
      const userWithoutPsswd = _.pick(user, [
        "id",
        "username",
        "role",
        "email",
      ]);
      res.json({
        message: "Login successful",
        accessToken,
        user: userWithoutPsswd,
      });
    } catch (error) {
      next(error);
    }
  },
];

const logout = (req, res) => {
  res.clearCookie("refresh-token"); // Clear refresh token cookie on logout
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

export { login, logout, register, refreshToken };
