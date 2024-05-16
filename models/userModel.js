// models/userModel.js

import pool from '../config/dbConfig.js';

class User {
  static getAllUsers(callback) {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) throw error;
      callback(results);
    });
  }

  static getUserById(userId, callback) {
    pool.query('SELECT * FROM users WHERE user_id = ?', userId, (error, results) => {
      if (error) throw error;
      callback(results[0]);
    });
  }

  static createUser(newUser, callback) {
    pool.query('INSERT INTO users SET ?', newUser, (error, results) => {
      if (error) throw error;
      callback(results.insertId);
    });
  }

  static updateUser(userId, updatedUser, callback) {
    pool.query('UPDATE users SET ? WHERE user_id = ?', [updatedUser, userId], (error, results) => {
      if (error) throw error;
      callback(results.changedRows);
    });
  }

  static deleteUser(userId, callback) {
    pool.query('DELETE FROM users WHERE user_id = ?', userId, (error, results) => {
      if (error) throw error;
      callback(results.affectedRows);
    });
  }
}

export default User;
