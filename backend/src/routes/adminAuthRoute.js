const router = require('express').Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin,
} = require('../controllers/adminAuthController');
const { protectAdmin, requireSuperAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/admin/login', loginAdmin);

// Protected admin routes
router.get('/admin/profile', protectAdmin, getAdminProfile);
router.put('/admin/profile', protectAdmin, updateAdminProfile);
router.put('/admin/change-password', protectAdmin, changeAdminPassword);

// SuperAdmin only routes
router.post('/admin/register', protectAdmin, requireSuperAdmin, registerAdmin);
router.get('/admin/all', protectAdmin, requireSuperAdmin, getAllAdmins);
router.put('/admin/:id/status', protectAdmin, requireSuperAdmin, updateAdminStatus);
router.delete('/admin/:id', protectAdmin, requireSuperAdmin, deleteAdmin);

module.exports = router;
