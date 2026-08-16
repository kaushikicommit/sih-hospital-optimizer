const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET saare patients dikhao
router.get('/', async (req, res) => {
  const patients = await Patient.find().populate('assignedBed').populate('assignedStaff');
  res.json(patients);
});

// POST naya patient register karo
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;