const router = require('express').Router();
const {
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  setStudentPassword,
  resetStudentPassword,
} = require('../controllers/studentAuthController');
const { protectStudent, protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/student/login', loginStudent);
router.post('/student/set-password', setStudentPassword);

// Protected student routes
router.get('/student/profile', protectStudent, getStudentProfile);
router.put('/student/profile', protectStudent, updateStudentProfile);
router.put('/student/change-password', protectStudent, changeStudentPassword);

// Admin only routes (for resetting student passwords)
router.put('/student/:id/reset-password', protectAdmin, requireAdmin, resetStudentPassword);

module.exports = router;
