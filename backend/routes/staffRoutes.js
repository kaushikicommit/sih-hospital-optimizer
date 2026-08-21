const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { updateStaffShift, updateOwnStatus } = require('../controllers/staffController');

router.patch('/:id/shift', protect, updateStaffShift);
router.patch('/me/status', protect, updateOwnStatus);

module.exports = router;