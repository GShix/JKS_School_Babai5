const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const toSafeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role = 'user' } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role must be either user or admin' });
    }

    const existing = await users.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await users.create({ fullName, email, password: hashedPassword, role });
    const token = signToken(newUser);

    return res.status(201).json({
      message: 'User registered successfully',
      data: toSafeUser(newUser),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.json({
      message: 'Login successful',
      data: toSafeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ data: toSafeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
};
