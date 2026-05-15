const mysql = require('mysql2/promise');

const isRailway = process.env.MYSQL_PUBLIC_URL || process.env.RAILWAY;

const pool = mysql.createPool({
      // Prioriza las variables estándar que definiste en Railway, si no, usa localhost
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'TU_PASSWORD_DB',
      database: process.env.DB_NAME || 'finlogic',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
});

module.exports = pool;
