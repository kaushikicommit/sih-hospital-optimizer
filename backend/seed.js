require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Bed = require('./models/Bed');
const Staff = require('./models/Staff');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

const wards = ['General', 'ICU', 'Emergency', 'Pediatric', 'Maternity'];

const seed = async () => {
  await connectDB();
  await Promise.all([
    Bed.deleteMany(),
    Staff.deleteMany(),
    Patient.deleteMany(),
    Appointment.deleteMany(),
  ]);

  // 30 beds, alag-alag wards mein
  const beds = [];
  for (let i = 1; i <= 30; i++) {
    beds.push({
      bedNumber: `B${i.toString().padStart(3, '0')}`,
      ward: wards[i % wards.length],
      status: i % 4 === 0 ? 'occupied' : i % 7 === 0 ? 'cleaning' : 'available',
    });
  }
  await Bed.insertMany(beds);

  // 10 doctors + 10 nurses
  const staff = [];
  const names = ['Riya', 'Aman', 'Kabir', 'Sneha', 'Arjun', 'Meera', 'Vivek', 'Priya', 'Rohan', 'Isha'];
  for (let i = 0; i < 10; i++) {
    staff.push({
      name: `Dr. ${names[i]}`,
      role: 'Doctor',
      department: wards[i % wards.length],
      shift: ['Morning', 'Evening', 'Night'][i % 3],
      status: 'on-duty',
      currentLoad: i % 5,
      maxLoad: 5,
    });
    staff.push({
      name: `Nurse ${names[i]}`,
      role: 'Nurse',
      department: wards[i % wards.length],
      shift: ['Morning', 'Evening', 'Night'][i % 3],
      status: 'on-duty',
      currentLoad: i % 6,
      maxLoad: 8,
    });
  }
  const insertedStaff = await Staff.insertMany(staff);

  // 3 patients
  const patients = await Patient.insertMany([
    { name: 'Patient A', age: 45, condition: 'Cardiac', priority: 'critical' },
    { name: 'Patient B', age: 30, condition: 'Fracture', priority: 'medium' },
    { name: 'Patient C', age: 60, condition: 'Respiratory', priority: 'high' },
  ]);

  // 2 appointments, aaj ke liye
  await Appointment.insertMany([
    {
      patientId: patients[0]._id,
      doctorId: insertedStaff[0]._id,
      department: 'General',
      scheduledTime: new Date(),
      status: 'scheduled',
    },
    {
      patientId: patients[1]._id,
      doctorId: insertedStaff[2]._id,
      department: 'ICU',
      scheduledTime: new Date(),
      status: 'scheduled',
    },
  ]);

  console.log('Seed data inserted successfully');
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});