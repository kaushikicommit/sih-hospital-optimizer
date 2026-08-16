const express = require('express');
const router = express.Router();
const {
  getBeds,
  getBedSummary,
  allocateBed,
  releaseBed,
} = require('../controllers/bedController');

router.get('/', getBeds);
router.get('/summary', getBedSummary);
router.post('/allocate', allocateBed);
router.post('/:id/release', releaseBed);

module.exports = router;