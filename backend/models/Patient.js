const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    condition: { type: String, required: true },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    assignedBed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', default: null },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);