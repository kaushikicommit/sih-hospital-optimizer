const Appointment = require('../models/Appointment');

// GET saare appointments dikhao
exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patientId', 'name priority')
    .populate('doctorId', 'name department');
  res.json(appointments);
};

// POST naya appointment banao (doctor double-booked toh nahi hai, check karega)
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, department, scheduledTime } = req.body;

    const conflict = await Appointment.findOne({
      doctorId,
      scheduledTime,
      status: 'scheduled',
    });
    if (conflict) {
      return res.status(409).json({ message: 'Doctor already booked at this time' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      department,
      scheduledTime,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH appointment ka status update karo
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};