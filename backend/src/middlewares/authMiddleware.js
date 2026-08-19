const jwt = require('jsonwebtoken');
const { admins, students } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

// General authentication middleware (works for both admin and student)
exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type === 'admin') {
      const admin = await admins.findByPk(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: 'Admin not found for token' });
      }
      if (admin.status !== 'active') {
        return res.status(403).json({ message: 'Admin account is not active' });
      }
      req.user = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
        type: 'admin',
      };
    } else if (decoded.type === 'student') {
      const student = await students.findByPk(decoded.id);
      if (!student) {
        return res.status(401).json({ message: 'Student not found for token' });
      }
      if (student.status !== 'active') {
        return res.status(403).json({ message: 'Student account is not active' });
      }
      req.user = {
        id: student.id,
        email: student.email,
        fullName: student.fullName,
        currentClass: student.currentClass,
        type: 'student',
      };
    } else {
      return res.status(403).json({ message: 'Invalid user type' });
    }

    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== 'admin' || (req.user.role !== 'admin' && req.user.role !== 'superAdmin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
};

// Protect Admin Routes
exports.protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const admin = await admins.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found for token' });
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Admin account is not active' });
    }

    req.user = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
      type: 'admin',
    };

    // Also set req.admin for backward compatibility
    req.admin = req.user;

    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message });
  }
};

// Protect Student Routes
exports.protectStudent = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== 'student') {
      return res.status(403).json({ message: 'Student access required' });
    }

    const student = await students.findByPk(decoded.id);

    if (!student) {
      return res.status(401).json({ message: 'Student not found for token' });
    }

    if (student.status !== 'active') {
      return res.status(403).json({ message: 'Student account is not active' });
    }

    req.user = {
      id: student.id,
      email: student.email,
      fullName: student.fullName,
      currentClass: student.currentClass,
      type: 'student',
    };

    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ message });
  }
};

// Require Admin Role
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== 'admin' || (req.user.role !== 'admin' && req.user.role !== 'superAdmin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  // Set req.admin for backward compatibility
  req.admin = req.user;
  return next();
};

// Require Super Admin Role
exports.requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== 'admin' || req.user.role !== 'superAdmin') {
    return res.status(403).json({ message: 'Super Admin access required' });
  }
  return next();
};
