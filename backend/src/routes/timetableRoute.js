const router = require('express').Router();
const {
  createTimetable,
  getClassTimetable,
  getTeacherTimetable,
  updateTimetable,
  deleteTimetable,
} = require('../controllers/timetableController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/timetable/class', getClassTimetable);
router.get('/timetable/teacher/:teacherId', getTeacherTimetable);

// Admin routes
router.post('/timetable/create', protectAdmin, requireAdmin, createTimetable);
router.put('/timetable/:id', protectAdmin, requireAdmin, updateTimetable);
router.delete('/timetable/:id', protectAdmin, requireAdmin, deleteTimetable);

module.exports = router;
