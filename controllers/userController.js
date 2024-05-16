// controllers/userController.js

const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
  User.getAllUsers(users => {
    res.json(users);
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  User.getUserById(userId, user => {
    res.json(user);
  });
};

exports.createUser = (req, res) => {
  const newUser = req.body;
  User.createUser(newUser, userId => {
    res.status(201).json({ message: 'User created successfully', userId });
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  User.updateUser(userId, updatedUser, rowsAffected => {
    res.json({ message: 'User updated successfully', rowsAffected });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.userId;
  User.deleteUser(userId, rowsAffected => {
    res.json({ message: 'User deleted successfully', rowsAffected });
  });
};
