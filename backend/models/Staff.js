const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    staffId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
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
    currentLoad: { type: Number, default: 0 },
    maxLoad: { type: Number, default: 5 },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Staff', staffSchema);
