const Staff = require('../models/Staff');

// @desc    Admin assigns/changes a staff member's shift
// @route   PATCH /api/staff/:id/shift
// @access  Protected (any authenticated staff, for now)
exports.updateStaffShift = async (req, res) => {
  const { shift } = req.body;
  const validShifts = ['Morning', 'Evening', 'Night'];

  if (!shift || !validShifts.includes(shift)) {
    return res.status(400).json({
      message: `shift must be one of: ${validShifts.join(', ')}`,
    });
  }

  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.shift = shift;
    await staff.save();

    const { password, ...staffData } = staff.toObject();
    res.json(staffData);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating shift' });
  }
};

// @desc    Staff updates their own on-duty/off-duty status
// @route   PATCH /api/staff/me/status
// @access  Protected (self only, derived from JWT)
exports.updateOwnStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['on-duty', 'off-duty', 'on-break'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const staff = await Staff.findById(req.staffId);

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staff.status = status;
    await staff.save();

    const { password, ...staffData } = staff.toObject();
    res.json(staffData);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating status' });
  }
};