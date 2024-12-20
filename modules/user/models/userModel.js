const pool = require("../../../config/dbConfig.js");
const _ = require("lodash");
const logger = require("@root/services/logger.js");

class User {
  static async getAllUsers() {
    const query = "SELECT * FROM users";
    try {
      const [results] = await pool.query(query);
      return results;
    } catch (error) {
      throw error;
    }
  }

  static getUserById(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      pool.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async createUser(newUser) {
    const query = "INSERT INTO users SET ?";
    try {
      if (!newUser || !newUser.email || !newUser.attributes) {
        throw new Error("Invalid input: attributes and email are required.");
      }

      // Ensure newUser includes a valid attributes JSON object
      const { attributes, ...userData } = newUser;

      // Convert `attributes` to JSON string if needed
      const attributesJSON =
        typeof attributes === "object"
          ? JSON.stringify(attributes)
          : attributes;

      const [result] = await pool.query(query, {
        ...userData,
        attributes: attributesJSON,
      });

      // Exclude password_hash field
      const { password_hash, ...userWithoutPassword } = newUser;

      return { ...userWithoutPassword, id: result.insertId };
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error.message}. Data: ${JSON.stringify(newUser)}`,
      );
    }
  }

  static updateUser(userId, updatedUser) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET ? WHERE id = ?";
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
      const deleteQuery = "DELETE FROM users WHERE id = ?";
      pool.query(deleteQuery, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  static async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    try {
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = User;
