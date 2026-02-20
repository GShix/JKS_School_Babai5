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
const studentUpload = require('../middlewares/studentUploadMiddleware');

// Public routes (anyone can view students)
router.route('/students').get(fetchStudents);
router.route('/students/class/:className').get(fetchStudentsByClass);
router.route('/students/status/:status').get(fetchStudentsByStatus);
router.route('/students/:id').get(fetchSingleStudent);

// Protected routes - RESTful endpoints (only admin can create, update, delete)
// With file upload support for student photos
router.route('/students/create').post(protectAdmin, requireAdmin, studentUpload, createStudent);
router.route('/students/:id/update').put(protectAdmin, requireAdmin, studentUpload, updateStudent);
router.route('/students/:id/delete').delete(protectAdmin, requireAdmin, deleteStudent);

module.exports = router;
