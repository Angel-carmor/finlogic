const pool = require('./api/src/config/db');

async function run() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS monthly_summary_snapshots (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        income DECIMAL(10, 2) NOT NULL,
        total_debt DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_summary (user_id, year, month),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('SUCCESS: Table monthly_summary_snapshots created or already exists.');
  } catch (err) {
    console.error('FAILURE:', err);
  } finally {
    process.exit();
  }
}

run();
