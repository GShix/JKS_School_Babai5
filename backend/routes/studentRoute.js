const router = require('express').Router();
const {
  createStudent,
  fetchStudents,
  fetchSingleStudent,
  updateStudent,
  deleteStudent,
  fetchStudentsByClass,
  fetchStudentsByStatus,
} = require('../controllers/studentController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes (anyone can view students)
router.route('/students').get(fetchStudents);
router.route('/students/class/:className').get(fetchStudentsByClass);
router.route('/students/status/:status').get(fetchStudentsByStatus);
router.route('/students/:id').get(fetchSingleStudent);

// Protected routes - RESTful endpoints (only admin can create, update, delete)
router.route('/students').post(protectAdmin, requireAdmin, createStudent);
router.route('/students/:id').put(protectAdmin, requireAdmin, updateStudent);
router.route('/students/:id').delete(protectAdmin, requireAdmin, deleteStudent);

module.exports = router;
