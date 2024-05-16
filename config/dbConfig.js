import mysql from 'mysql2';

const dbConfig = {
  host: '192.168.1.213',
  user: 'amir',
  password: '@mirc@nteetu!',
  database: 'sourcepro'
};


const pool = mysql.createPool(dbConfig);

export default pool;