const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, staffId, email, password, role, department, shift } = req.body;

    if (!name || !staffId || !email || !password || !role || !department || !shift) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Staff.findOne({ $or: [{ email }, { staffId }] });
    if (existing) {
      return res.status(400).json({ message: 'Staff with this email or staffId already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await Staff.create({
      name,
      staffId,
      email,
      password: hashedPassword,
      role,
      department,
      shift,
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      staffId: staff.staffId,
      email: staff.email,
      role: staff.role,
      token: generateToken(staff._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: staff._id,
      name: staff.name,
      staffId: staff.staffId,
      email: staff.email,
      role: staff.role,
      token: generateToken(staff._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staffId).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
