const leaveService = require('../services/leave.service');

exports.applyLeave = (req, res) => {
    console.log('Apply Leave - User ID:', req.user.id, 'Body:', req.body);
    leaveService.createLeave(req.user.id, req.body, (err) => {
        if (err) {
            console.error('Apply Leave Error:', err);
            return res.status(500).json({ message: 'Failed to apply leave', error: err.message });
        }
        res.status(201).json({ message: 'Leave applied successfully' });
    });
};

exports.myLeaves = (req, res) => {
    console.log('Get My Leaves - User ID:', req.user.id);
    leaveService.getMyLeaves(req.user.id, (err, results) => {
        if (err) {
            console.error('Get My Leaves Error:', err);
            return res.status(500).json({ message: 'Failed to fetch leaves', error: err.message });
        }
        res.json(results);
    });
};

exports.allLeaves = (req, res) => {
    console.log('Get All Leaves - User:', req.user);
    leaveService.getAllLeaves((err, results) => {
        if (err) {
            console.error('Get All Leaves Error:', err);
            return res.status(500).json({ message: 'Failed to fetch leaves', error: err.message });
        }
        res.json(results);
    });
};

exports.changeStatus = (req, res) => {
    console.log('Change Status - ID:', req.params.id, 'Status:', req.body.status, 'User:', req.user);
    leaveService.updateLeaveStatus(
        req.params.id,
        req.body.status,
        (err) => {
            if (err) {
                console.error('Change Status Error:', err);
                return res.status(500).json({ message: 'Failed to update leave', error: err.message });
            }
            res.json({ message: 'Leave status updated' });
        }
    );
};

exports.deleteLeave = (req, res) => {
    console.log('Delete Leave - ID:', req.params.id, 'User:', req.user);
    leaveService.deleteLeave(req.params.id, (err) => {
        if (err) {
            console.error('Delete Leave Error:', err);
            return res.status(500).json({ message: 'Failed to delete leave', error: err.message });
        }
        res.json({ message: 'Leave deleted' });
    });
};
