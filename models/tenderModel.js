const pool = require('../config/dbConfig');

class Tender {
  static getAllTenders() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM tenders', (error, results) => {
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
      pool.query('SELECT * FROM tenders WHERE tender_id = ?', tenderId, (error, results) => {
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
      pool.query('INSERT INTO tenders SET ?', newTender, (error, results) => {
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
      pool.query('UPDATE tenders SET ? WHERE tender_id = ?', [updatedTender, tenderId], (error, results) => {
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
      pool.query('DELETE FROM tenders WHERE tender_id = ?', tenderId, (error, results) => {
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
