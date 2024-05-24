import pool from '../config/dbConfig.js';

class Company {

  static getAllCompanies() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM companies';
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getCompanyById(companyId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM companies WHERE id = ?';
      pool.query(query, [companyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static createCompany(newCompany) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO companies SET ?';
      pool.query(query, [newCompany], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static updateCompany(companyId, updatedCompany) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE companies SET ? WHERE id = ?';
      pool.query(query, [updatedCompany, companyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.changedRows);
        }
      });
    });
  }

  static deleteCompany(companyId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM companies WHERE id = ?';
      pool.query(query, [companyId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }
}

export default Company;
