const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        console.error('Connection details - Host:', process.env.DB_HOST, 'User:', process.env.DB_USER, 'DB:', process.env.DB_NAME);
        return;
    }
    console.log('MySQL connected successfully');
    console.log('Host:', process.env.DB_HOST, 'Database:', process.env.DB_NAME);
});

module.exports = db;
