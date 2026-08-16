const Bed = require('../models/Bed');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// GET /api/dashboard -> hospital ke resources ka ek hi snapshot
exports.getDashboard = async (req, res) => {
  try {
    const [totalBeds, availableBeds, occupiedBeds, cleaningBeds] = await Promise.all([
      Bed.countDocuments(),
      Bed.countDocuments({ status: 'available' }),
      Bed.countDocuments({ status: 'occupied' }),
      Bed.countDocuments({ status: 'cleaning' }),
    ]);

    const [onDutyStaff, totalStaff] = await Promise.all([
      Staff.countDocuments({ status: 'on-duty' }),
      Staff.countDocuments(),
    ]);

    const staffLoad = await Staff.aggregate([
      { $match: { status: 'on-duty' } },
      { $group: { _id: null, avgLoad: { $avg: '$currentLoad' } } },
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todaysAppointments, criticalPatientsWaiting] = await Promise.all([
      Appointment.countDocuments({
        scheduledTime: { $gte: todayStart, $lte: todayEnd },
        status: 'scheduled',
      }),
      Patient.countDocuments({ priority: 'critical', assignedBed: null }),
    ]);

    res.json({
      beds: {
        total: totalBeds,
        available: availableBeds,
        occupied: occupiedBeds,
        cleaning: cleaningBeds,
        occupancyRate: totalBeds ? ((occupiedBeds / totalBeds) * 100).toFixed(1) + '%' : '0%',
      },
      staff: {
        total: totalStaff,
        onDuty: onDutyStaff,
        avgLoad: staffLoad[0] ? staffLoad[0].avgLoad.toFixed(1) : 0,
      },
      appointments: {
        scheduledToday: todaysAppointments,
      },
      alerts: {
        criticalPatientsWaitingForBed: criticalPatientsWaiting,
      },
      generatedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};