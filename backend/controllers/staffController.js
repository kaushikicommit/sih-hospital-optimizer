const Staff = require('../models/Staff');

// GET saare staff dikhao
exports.getStaff = async (req, res) => {
  const staff = await Staff.find();
  res.json(staff);
};

// GET staff workload summary, department-wise
exports.getStaffSummary = async (req, res) => {
  const summary = await Staff.aggregate([
    { $match: { status: 'on-duty' } },
    {
      $group: {
        _id: '$department',
        avgLoad: { $avg: '$currentLoad' },
        staffCount: { $sum: 1 },
      },
    },
  ]);
  res.json(summary);
};

// POST patient ko sabse kam-loaded available staff ko assign karo
exports.assignStaff = async (req, res) => {
  try {
    const { department, role } = req.body;
    const staff = await Staff.findOne({
      department,
      role,
      status: 'on-duty',
      $expr: { $lt: ['$currentLoad', '$maxLoad'] },
    }).sort({ currentLoad: 1 });

    if (!staff) {
      return res.status(409).json({ message: 'No available staff with capacity in this department' });
    }

    staff.currentLoad += 1;
    await staff.save();

    res.json({ message: 'Staff assigned', staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST naya staff member create karo
exports.createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
