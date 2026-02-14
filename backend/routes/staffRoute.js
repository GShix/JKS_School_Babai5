const router = require('express').Router();
const {
  createStaff,
  fetchStaff,
  fetchSingleStaff,
  updateStaff,
  deleteStaff,
  fetchStaffByDepartment,
  fetchStaffByStatus,
} = require('../controllers/staffController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Public routes (anyone can view staff)
router.route('/staff').get(fetchStaff);
router.route('/staff/department/:department').get(fetchStaffByDepartment);
router.route('/staff/status/:status').get(fetchStaffByStatus);
router.route('/staff/:id').get(fetchSingleStaff);

// Protected routes (only admin can create, update, delete)
router.route('/staff/create').post(
  protectAdmin, 
  requireAdmin, 
  uploadSingle('profileImage'), 
  createStaff
);
router.route('/staff/:id/update').put(
  protectAdmin, 
  requireAdmin, 
  uploadSingle('profileImage'), 
  updateStaff
);
router.route('/staff/:id/delete').delete(protectAdmin, requireAdmin, deleteStaff);

module.exports = router;
