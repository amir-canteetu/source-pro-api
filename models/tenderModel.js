const pool = require('../config/dbConfig');

class Tender {
  static getAllTenders() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tenders';
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getTenderById(tenderId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM tenders WHERE id = ?';
      pool.query(query, [tenderId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static createTender(newTender) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO tenders SET ?';
      pool.query(query, [newTender], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static updateTender(tenderId, updatedTender) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE tenders SET ? WHERE id = ?';
      pool.query(query, [updatedTender, tenderId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.changedRows);
        }
      });
    });
  }

  static deleteTender(tenderId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM tenders WHERE id = ?';
      pool.query(query, [tenderId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }
}

module.exports = Tender;
