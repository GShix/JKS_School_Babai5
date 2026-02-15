const router = require('express').Router();
const {
  createTeacher,
  fetchTeachers,
  fetchSingleTeacher,
  updateTeacher,
  deleteTeacher,
  fetchTeachersByDepartment,
  fetchTeachersByStatus,
} = require('../controllers/teacherController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Public routes (anyone can view teachers)
router.route('/teachers').get(fetchTeachers);
router.route('/teachers/department/:department').get(fetchTeachersByDepartment);
router.route('/teachers/status/:status').get(fetchTeachersByStatus);
router.route('/teachers/:id').get(fetchSingleTeacher);

// Protected routes (only admin can create, update, delete)
router.route('/teachers/create').post(
  protectAdmin, 
  requireAdmin, 
  uploadSingle('profileImage'), 
  createTeacher
);
router.route('/teachers/:id/update').put(
  protectAdmin, 
  requireAdmin, 
  uploadSingle('profileImage'), 
  updateTeacher
);
router.route('/teachers/:id/delete').delete(protectAdmin, requireAdmin, deleteTeacher);

module.exports = router;
