const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register new user (HR / EMPLOYEE)
 */
exports.registerUser = (data, callback) => {
    const { name, email, password, role } = data;

    // Role validation
    if (!['HR', 'EMPLOYEE'].includes(role)) {
        return callback({ message: 'Invalid role' });
    }

    // Check existing user
    const checkSql = 'SELECT id FROM users WHERE email = ?';
    db.query(checkSql, [email], (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
            return callback({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert user
        const insertSql = `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            insertSql,
            [name, email, hashedPassword, role],
            (err, result) => {
                if (err) return callback(err);

                callback(null, {
                    id: result.insertId,
                    name,
                    email,
                    role
                });
            }
        );
    });
};

/**
 * Login user
 */
exports.loginUser = (data, callback) => {
    const { email, password } = data;
    console.log('Service - Login attempt for email:', email);

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Database error in loginUser:', err);
            return callback(err);
        }

        if (results.length === 0) {
            console.log('User not found for email:', email);
            return callback({ message: 'User not found' });
        }

        const user = results[0];
        console.log('User found:', user.id, user.role);

        // Compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return callback({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        console.log('Token generated for user:', user.id, 'Role:', user.role);

        callback(null, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};
