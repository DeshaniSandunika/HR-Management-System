const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth.middleware');
const { isHR } = require('../middleware/role.middleware');
const leaveController = require('../controllers/leave.controller');

// Employee - Apply leave
router.post('/', auth, leaveController.applyLeave);

// Employee - Get my leaves (MUST be before GET /)
router.get('/my', auth, leaveController.myLeaves);

// Employee - Delete leave
router.delete('/:id', auth, leaveController.deleteLeave);

// HR - Get all leaves
router.get('/', auth, isHR, leaveController.allLeaves);

// HR - Update leave status
router.put('/:id', auth, isHR, leaveController.changeStatus);

module.exports = router;
