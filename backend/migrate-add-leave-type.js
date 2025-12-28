const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const checkAndAddColumn = (table, column, definition) => {
  return new Promise((resolve) => {
    const checkSql = `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`;
    connection.query(checkSql, [process.env.DB_NAME, table, column], (err, results) => {
      if (err) {
        console.error('Error checking column', column, err.message);
        return resolve();
      }
      const exists = results[0].cnt > 0;
      if (exists) {
        console.log(`Column ${column} already exists on ${table}`);
        return resolve();
      }
      const alterSql = `ALTER TABLE ${table} ADD COLUMN ${definition}`;
      connection.query(alterSql, (err) => {
        if (err) console.error(`Failed to add column ${column}:`, err.message);
        else console.log(`Added column ${column} to ${table}`);
        resolve();
      });
    });
  });
};

connection.connect((err) => {
  if (err) {
    console.error('DB connect error:', err.message);
    process.exit(1);
  }
  console.log('Connected to DB for migration');

  (async () => {
    await checkAndAddColumn('leaves', 'leave_type', "leave_type VARCHAR(50) DEFAULT 'CASUAL'");
    await checkAndAddColumn('leaves', 'created_at', 'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    await checkAndAddColumn('leaves', 'updated_at', 'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    console.log('Migration finished');
    connection.end();
    process.exit(0);
  })();
});
