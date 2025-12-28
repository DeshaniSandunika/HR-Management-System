const db = require('../config/db');

exports.createLeave = (userId, data, callback) => {
    console.log('Service - Creating leave for user:', userId, 'Data:', data);
    const sql = `
        INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [userId, data.leaveType, data.startDate, data.endDate, data.reason],
        (err, result) => {
            if (err) {
                console.error('Database error in createLeave:', err);
                return callback(err);
            }
            console.log('Leave created successfully:', result);
            callback(null, result);
        }
    );
};

exports.getMyLeaves = (userId, callback) => {
    console.log('Service - Getting leaves for user:', userId);
    const sql = `SELECT * FROM leaves WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error in getMyLeaves:', err);
            return callback(err);
        }
        console.log('Leaves found:', results.length);
        callback(null, results);
    });
};

exports.getAllLeaves = (callback) => {
    console.log('Service - Getting all leaves');
    const sql = `
        SELECT leaves.*, users.name as employeeName 
        FROM leaves 
        JOIN users ON leaves.user_id = users.id
        ORDER BY leaves.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error in getAllLeaves:', err);
            return callback(err);
        }
        console.log('Total leaves found:', results.length);
        callback(null, results);
    });
};

exports.updateLeaveStatus = (id, status, callback) => {
    console.log('Service - Updating leave status, ID:', id, 'Status:', status);
    const sql = `UPDATE leaves SET status = ? WHERE id = ?`;
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Database error in updateLeaveStatus:', err);
            return callback(err);
        }
        console.log('Leave status updated:', result);
        callback(null, result);
    });
};

exports.deleteLeave = (id, callback) => {
    console.log('Service - Deleting leave, ID:', id);
    const sql = `DELETE FROM leaves WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error in deleteLeave:', err);
            return callback(err);
        }
        console.log('Leave deleted:', result);
        callback(null, result);
    });
};
