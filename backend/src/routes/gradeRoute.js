const router = require('express').Router();
const {
  addGrade,
  getStudentGrades,
  getClassGrades,
  updateGrade,
  deleteGrade,
} = require('../controllers/gradeController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Admin routes
router.post('/grades/add', protectAdmin, requireAdmin, addGrade);
router.get('/grades/class', protectAdmin, getClassGrades);
router.put('/grades/:id', protectAdmin, requireAdmin, updateGrade);
router.delete('/grades/:id', protectAdmin, requireAdmin, deleteGrade);

// Public or student route
router.get('/grades/student/:studentId', getStudentGrades);

module.exports = router;
