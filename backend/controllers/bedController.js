const Bed = require('../models/Bed');
const Patient = require('../models/Patient');

// GET saare beds dikhao
exports.getBeds = async (req, res) => {
  const beds = await Bed.find().populate('patientId', 'name condition priority');
  res.json(beds);
};

// GET bed summary — kitne beds available/occupied hain, ward-wise
exports.getBedSummary = async (req, res) => {
  const summary = await Bed.aggregate([
    {
      $group: {
        _id: { ward: '$ward', status: '$status' },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(summary);
};

// POST patient ko best-fit bed allocate karo (priority ke hisaab se)
exports.allocateBed = async (req, res) => {
  try {
    const { patientId, ward } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Pehle requested ward mein available bed dhoondo
    let bed = await Bed.findOne({ ward, status: 'available' }).sort({ createdAt: 1 });

    // Agar ward full hai aur patient critical/high priority hai, toh ICU/Emergency mein dhoondo
    if (!bed && (patient.priority === 'critical' || patient.priority === 'high')) {
      bed = await Bed.findOne({
        ward: { $in: ['ICU', 'Emergency'] },
        status: 'available',
      });
    }

    if (!bed) return res.status(409).json({ message: 'No beds currently available' });

    bed.status = 'occupied';
    bed.patientId = patient._id;
    await bed.save();

    patient.assignedBed = bed._id;
    await patient.save();

    res.status(200).json({ message: 'Bed allocated', bed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST bed release karo (patient discharge/transfer hone par)
exports.releaseBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id);
    if (!bed) return res.status(404).json({ message: 'Bed not found' });

    bed.status = 'cleaning'; // discharge ke baad cleaning status mein jaata hai
    bed.patientId = null;
    await bed.save();

    res.json({ message: 'Bed released, marked for cleaning', bed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};