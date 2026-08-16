const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['Doctor', 'Nurse', 'Technician', 'Support'],
      required: true,
    },
    department: { type: String, required: true },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night'],
      required: true,
    },
    status: {
      type: String,
      enum: ['on-duty', 'off-duty', 'on-break'],
      default: 'off-duty',
    },
    currentLoad: { type: Number, default: 0 }, // abhi kitne patients handle kar raha hai
    maxLoad: { type: Number, default: 5 },     // max kitne patients ek saath sambhal sakta hai
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);