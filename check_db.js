const db = require('./api/src/config/db');

async function test() {
  try {
    const [rows] = await db.execute('SELECT * FROM monthly_budget_snapshots');
    console.log('Snapshots in DB:', rows);
    
    const [count] = await db.execute('SELECT COUNT(*) as count FROM monthly_budget_snapshots');
    console.log('Total count:', count[0].count);
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    process.exit();
  }
}

test();
