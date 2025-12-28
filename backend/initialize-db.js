const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const queries = [
    // Create users table
    `CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('HR', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    
    // Create leaves table
    `CREATE TABLE IF NOT EXISTS leaves (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        leave_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT NOT NULL,
        status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        KEY idx_user_id (user_id),
        KEY idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to database');
    
    let completed = 0;
    
    queries.forEach((query, index) => {
        connection.query(query, (err) => {
            if (err) {
                console.error(`Query ${index + 1} failed:`, err.message);
            } else {
                console.log(`Query ${index + 1} executed successfully`);
            }
            
            completed++;
            if (completed === queries.length) {
                console.log('Database initialization complete!');
                connection.end();
                process.exit(0);
            }
        });
    });
});
