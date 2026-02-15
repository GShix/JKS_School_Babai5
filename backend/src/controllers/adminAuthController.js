const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { admins } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (admin) =>
  jwt.sign({ id: admin.id, role: admin.role, type: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const toSafeAdmin = (admin) => ({
  id: admin.id,
  fullName: admin.fullName,
  email: admin.email,
  role: admin.role,
  phone: admin.phone,
  profileImage: admin.profileImage,
  status: admin.status,
});

// Admin Registration (only superAdmin can create new admins)
exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, role = 'admin', phone, profileImage } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' });
    }

    if (!['admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either admin or superAdmin' });
    }

    // Check if requesting user is superAdmin
    if (req.user && req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only superAdmin can create new admins' });
    }

    const existing = await admins.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await admins.create({ 
      fullName, 
      email, 
      password: hashedPassword, 
      role,
      phone,
      profileImage,
      status: 'active'
    });
    
    const token = signToken(newAdmin);

    return res.status(201).json({
      message: 'Admin registered successfully',
      data: toSafeAdmin(newAdmin),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await admins.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Please contact super admin.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await admin.update({ lastLogin: new Date() });

    const token = signToken(admin);

    return res.json({
      message: 'Login successful',
      data: toSafeAdmin(admin),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get Current Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await admins.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.json({ data: toSafeAdmin(admin) });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
};

// Update Admin Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await admins.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { fullName, phone, profileImage } = req.body;

    await admin.update({
      fullName: fullName || admin.fullName,
      phone: phone !== undefined ? phone : admin.phone,
      profileImage: profileImage !== undefined ? profileImage : admin.profileImage,
    });

    return res.json({
      message: 'Profile updated successfully',
      data: toSafeAdmin(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update profile', error: error.message });
  }
};

// Change Admin Password
exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const admin = await admins.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await admin.update({ password: hashedPassword });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not change password', error: error.message });
  }
};

// Get All Admins (superAdmin only)
exports.getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only superAdmin can view all admins' });
    }

    const allAdmins = await admins.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.json({
      message: 'Admins fetched successfully',
      data: allAdmins.map(admin => toSafeAdmin(admin)),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch admins', error: error.message });
  }
};

// Update Admin Status (superAdmin only)
exports.updateAdminStatus = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only superAdmin can update admin status' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const admin = await admins.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent superAdmin from deactivating themselves
    if (admin.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }

    await admin.update({ status });

    return res.json({
      message: 'Admin status updated successfully',
      data: toSafeAdmin(admin),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update admin status', error: error.message });
  }
};

// Delete Admin (superAdmin only)
exports.deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only superAdmin can delete admins' });
    }

    const { id } = req.params;

    const admin = await admins.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent superAdmin from deleting themselves
    if (admin.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await admins.destroy({ where: { id } });

    return res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete admin', error: error.message });
  }
};
