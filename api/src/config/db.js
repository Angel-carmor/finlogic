const mysql = require('mysql2/promise');

const isRailway = process.env.MYSQL_PUBLIC_URL || process.env.RAILWAY;

const pool = mysql.createPool({
  host: process.env.MYSQL_PUBLIC_URL?.replace('mysql://', '').split(':')[0] 
        || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PUBLIC_URL?.split(':')[2]) 
        || parseInt(process.env.DB_PORT) || 3306,
  user: process.env.MYSQL_USER || process.env.DB_USER || 'user',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'TU_PASSWORD_DB',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'finlogic',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
