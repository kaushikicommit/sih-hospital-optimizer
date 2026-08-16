const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema(
  {
    bedNumber: { type: String, required: true, unique: true },
    ward: {
      type: String,
      enum: ['General', 'ICU', 'Emergency', 'Pediatric', 'Maternity'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'cleaning', 'reserved'],
      default: 'available',
    },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bed', bedSchema);