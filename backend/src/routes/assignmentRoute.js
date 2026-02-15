const router = require('express').Router();
const {
  createAssignment,
  getAssignments,
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentSubmissions,
  getMySubmissions,
} = require('../controllers/assignmentController');
const { protectAdmin, protectStudent, requireAdmin } = require('../middlewares/authMiddleware');

// Public/Student routes
router.get('/assignments', getAssignments);
router.get('/assignments/:id', getSingleAssignment);

// Student routes
router.post('/assignments/:assignmentId/submit', protectStudent, submitAssignment);
router.get('/submissions/my', protectStudent, getMySubmissions);

// Admin/Teacher routes
router.post('/assignments/create', protectAdmin, requireAdmin, createAssignment);
router.put('/assignments/:id', protectAdmin, requireAdmin, updateAssignment);
router.delete('/assignments/:id', protectAdmin, requireAdmin, deleteAssignment);
router.get('/assignments/:assignmentId/submissions', protectAdmin, getAssignmentSubmissions);
router.put('/submissions/:id/grade', protectAdmin, requireAdmin, gradeSubmission);

module.exports = router;
