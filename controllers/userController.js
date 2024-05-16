import User from '../models/userModel.js';
import { body, validationResult } from 'express-validator';

// Validation and sanitization middleware functions for user endpoints
const validateUser = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('email').isEmail().withMessage('Invalid email format').trim().escape(),
  body('password').notEmpty().withMessage('Password is required').trim().escape(),
];

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.getUserById(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = req.body;
    try {
      const userId = await User.createUser(newUser);
      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      next(error);
    }
  },
];

const updateUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.userId;
    const updatedUser = req.body;
    try {
      const rowsAffected = await User.updateUser(userId, updatedUser);
      res.json({ message: 'User updated successfully', rowsAffected });
    } catch (error) {
      next(error);
    }
  },
];

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const rowsAffected = await User.deleteUser(userId);
    res.json({ message: 'User deleted successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
