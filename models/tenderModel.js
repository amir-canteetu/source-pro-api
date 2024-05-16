// models/tenderModel.js

const pool = require('../config/dbConfig');

class Tender {
  static getAllTenders(callback) {
    pool.query('SELECT * FROM tenders', (error, results) => {
      if (error) throw error;
      callback(results);
    });
  }

  static getTenderById(tenderId, callback) {
    pool.query('SELECT * FROM tenders WHERE tender_id = ?', tenderId, (error, results) => {
      if (error) throw error;
      callback(results[0]);
    });
  }

  static createTender(newTender, callback) {
    pool.query('INSERT INTO tenders SET ?', newTender, (error, results) => {
      if (error) throw error;
      callback(results.insertId);
    });
  }

  static updateTender(tenderId, updatedTender, callback) {
    pool.query('UPDATE tenders SET ? WHERE tender_id = ?', [updatedTender, tenderId], (error, results) => {
      if (error) throw error;
      callback(results.changedRows);
    });
  }

  static deleteTender(tenderId, callback) {
    pool.query('DELETE FROM tenders WHERE tender_id = ?', tenderId, (error, results) => {
      if (error) throw error;
      callback(results.affectedRows);
    });
  }
}

module.exports = Tender;
