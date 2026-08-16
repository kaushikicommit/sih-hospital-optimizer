const express = require('express');
const router = express.Router();
const { getStaff, getStaffSummary, assignStaff, createStaff } = require('../controllers/staffController');

router.get('/', getStaff);
router.get('/summary', getStaffSummary);
router.post('/', createStaff);
router.post('/assign', assignStaff);

module.exports = router;