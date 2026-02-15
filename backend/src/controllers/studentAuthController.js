const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { students } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const signToken = (student) =>
  jwt.sign({ id: student.id, type: 'student' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const toSafeStudent = (student) => ({
  id: student.id,
  fullName: student.fullName,
  email: student.email,
  phone: student.phone,
  class: student.class,
  section: student.section,
  rollNumber: student.rollNumber,
  profileImage: student.profileImage,
  status: student.status,
});

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password, rollNumber } = req.body;

    // Allow login with either email or roll number
    if ((!email && !rollNumber) || !password) {
      return res.status(400).json({ message: 'Email/Roll Number and password are required' });
    }

    let student;
    if (email) {
      student = await students.findOne({ where: { email } });
    } else if (rollNumber) {
      student = await students.findOne({ where: { rollNumber } });
    }

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if student has a password set
    if (!student.password) {
      return res.status(401).json({ message: 'Account not activated. Please contact administration.' });
    }

    // Check if student is active
    if (student.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Please contact administration.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(student);

    return res.json({
      message: 'Login successful',
      data: toSafeStudent(student),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get Student Profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await students.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.json({ data: student });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
};

// Update Student Profile (limited fields)
exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await students.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { phone, email, profileImage, guardianPhone, guardianEmail } = req.body;

    // Students can only update specific fields
    await student.update({
      phone: phone !== undefined ? phone : student.phone,
      email: email !== undefined ? email : student.email,
      profileImage: profileImage !== undefined ? profileImage : student.profileImage,
      guardianPhone: guardianPhone !== undefined ? guardianPhone : student.guardianPhone,
      guardianEmail: guardianEmail !== undefined ? guardianEmail : student.guardianEmail,
    });

    return res.json({
      message: 'Profile updated successfully',
      data: student,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update profile', error: error.message });
  }
};

// Change Student Password
exports.changeStudentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const student = await students.findByPk(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.password) {
      return res.status(400).json({ message: 'Password not set. Please contact administration.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await student.update({ password: hashedPassword });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not change password', error: error.message });
  }
};

// Set Initial Password (first time login setup)
exports.setStudentPassword = async (req, res) => {
  try {
    const { email, rollNumber, dateOfBirth, newPassword } = req.body;

    if ((!email && !rollNumber) || !dateOfBirth || !newPassword) {
      return res.status(400).json({ 
        message: 'Email/Roll Number, date of birth, and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let student;
    if (email) {
      student = await students.findOne({ where: { email } });
    } else if (rollNumber) {
      student = await students.findOne({ where: { rollNumber } });
    }

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify date of birth for security
    if (student.dateOfBirth !== dateOfBirth) {
      return res.status(401).json({ message: 'Invalid verification details' });
    }

    // Check if password already set
    if (student.password) {
      return res.status(400).json({ message: 'Password already set. Please use login.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await student.update({ password: hashedPassword });

    const token = signToken(student);

    return res.json({
      message: 'Password set successfully. You can now login.',
      data: toSafeStudent(student),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not set password', error: error.message });
  }
};

// Reset Student Password (admin function, moved from studentController)
exports.resetStudentPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const student = await students.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await student.update({ password: hashedPassword });

    return res.json({ 
      message: 'Password reset successfully',
      tempPassword: newPassword 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not reset password', error: error.message });
  }
};
