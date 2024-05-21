import pool from '../config/dbConfig.js';

class User {

  static getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users';
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getUserById(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      pool.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static createUser(newUser) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users SET ?';
      pool.query(query, [newUser], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static updateUser(userId, updatedUser) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE users SET ? WHERE id = ?';
      pool.query(query, [updatedUser, userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.changedRows);
        }
      });
    });
  }

  static deleteUser(userId) {
    return new Promise((resolve, reject) => {
      // Implement deletion logic for the user
      const deleteQuery = 'DELETE FROM users WHERE id = ?';
      pool.query(deleteQuery, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  static findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      pool.query(query, [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

}

export default User;
