const router = require('express').Router();

const {
    createSubject, fetchSubjects, fetchSubjectById, updateSubject, deleteSubject, toggleSubjectStatus,
} = require('../controllers/subjectController');

const { protectAdmin, requireAdmin, } = require('../middlewares/authMiddleware');


// Public routes
router.route('/subjects').get(fetchSubjects);
router.route('/subjects/:id').get(fetchSubjectById);


// Protected routes (admin only)
router.route('/subjects').post(protectAdmin, requireAdmin, createSubject);

router.route('/subjects/:id').put(protectAdmin, requireAdmin, updateSubject);

router.route('/subjects/:id').delete(protectAdmin, requireAdmin, deleteSubject);

router.route('/subjects/:id/toggle-status').patch(protectAdmin, requireAdmin, toggleSubjectStatus);


module.exports = router;