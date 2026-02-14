const router = require('express').Router();
const {
  getActivePositions,
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/careerController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { noticeUpload, resumeUpload } = require('../middlewares/careerUploadMiddleware');

// ==================== PUBLIC ROUTES ====================

// Get all active career positions (Public)
router.get('/positions', getActivePositions);

// Get single position by ID (Public)
router.get('/positions/:id', getPositionById);

// Submit job application (Public)
router.post('/applications', resumeUpload.single('resume'), submitApplication);

// ==================== ADMIN ROUTES ====================

// Career Positions Management
router.get('/admin/positions', protectAdmin, requireAdmin, getAllPositions);
router.post('/admin/positions', protectAdmin, requireAdmin, noticeUpload.single('noticeFile'), createPosition);
router.put('/admin/positions/:id', protectAdmin, requireAdmin, noticeUpload.single('noticeFile'), updatePosition);
router.delete('/admin/positions/:id', protectAdmin, requireAdmin, deletePosition);

// Applications Management
router.get('/admin/applications', protectAdmin, requireAdmin, getAllApplications);
router.get('/admin/applications/:id', protectAdmin, requireAdmin, getApplicationById);
router.patch('/admin/applications/:id', protectAdmin, requireAdmin, updateApplicationStatus);
router.delete('/admin/applications/:id', protectAdmin, requireAdmin, deleteApplication);

module.exports = router;
