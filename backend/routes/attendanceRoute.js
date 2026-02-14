const router = require('express').Router();
const {
  markAttendance,
  bulkMarkAttendance,
  getStudentAttendance,
  getClassAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protectAdmin, protectStudent, requireAdmin } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/attendance/mark', protectAdmin, requireAdmin, markAttendance);
router.post('/attendance/bulk', protectAdmin, requireAdmin, bulkMarkAttendance);
router.get('/attendance/class', protectAdmin, getClassAttendance);
router.delete('/attendance/:id', protectAdmin, requireAdmin, deleteAttendance);

// Student can view their own attendance
router.get('/attendance/student/:studentId', getStudentAttendance);

module.exports = router;
