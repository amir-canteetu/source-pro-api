const pool = require("../../../config/dbConfig.js");

class Tender {
  static getAllTenders() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tenders";
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
      const query = "SELECT * FROM tenders WHERE id = ?";
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
      const query = "INSERT INTO tenders SET ?";
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
      const query = "UPDATE tenders SET ? WHERE id = ?";
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
      // Update status of related bids to "pending"
      const updateBidsQuery = "UPDATE bids SET status = ? WHERE tender_id = ?";
      pool.query(updateBidsQuery, ["pending", tenderId], (error) => {
        if (error) {
          reject(error);
        } else {
          // After updating bid statuses, update tender status to "closed"
          const updateTenderQuery =
            "UPDATE tenders SET tender_status = ? WHERE tender_id = ?";
          pool.query(
            updateTenderQuery,
            ["closed", tenderId],
            (error, updateTenderResults) => {
              if (error) {
                reject(error);
              } else {
                resolve(updateTenderResults.affectedRows);
              }
            },
          );
        }
      });
    });
  }
}

module.exports = Tender;
