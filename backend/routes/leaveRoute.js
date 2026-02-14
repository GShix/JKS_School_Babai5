const router = require('express').Router();
const {
  applyLeave,
  getLeaveApplications,
  getMyLeaves,
  reviewLeave,
  deleteLeave,
} = require('../controllers/leaveController');
const { protectAdmin, protectStudent, requireAdmin } = require('../middlewares/authMiddleware');

// Student routes
router.post('/leaves/apply', protectStudent, applyLeave);
router.get('/leaves/my/:applicantType/:applicantId', getMyLeaves);

// Admin routes
router.get('/leaves', protectAdmin, getLeaveApplications);
router.put('/leaves/:id/review', protectAdmin, requireAdmin, reviewLeave);
router.delete('/leaves/:id', protectAdmin, requireAdmin, deleteLeave);

module.exports = router;
