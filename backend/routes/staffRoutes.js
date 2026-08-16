const express = require('express');
const router = express.Router();
const { getStaff, getStaffSummary, assignStaff } = require('../controllers/staffController');

router.get('/', getStaff);
router.get('/summary', getStaffSummary);
router.post('/assign', assignStaff);

module.exports = router;