const router = require('express').Router();

const { getAllClassSubjects, getSubjectsByClass, assignSubject, assignMultipleSubjects, updateClassSubject, removeSubjectFromClass,
} = require('../controllers/classSubjectController');

const { protectAdmin, requireAdmin, } = require('../middlewares/authMiddleware');

// Public routes
router.route('/class-subjects').get(getAllClassSubjects);

router.route('/class-subjects/class/:classId').get(getSubjectsByClass);

// Protected routes (admin only)
router.route('/class-subjects').post(protectAdmin, requireAdmin, assignSubject);

router.route('/class-subjects/bulk').post(protectAdmin, requireAdmin, assignMultipleSubjects);

router.route('/class-subjects/:id').put(protectAdmin, requireAdmin, updateClassSubject);

router.route('/class-subjects/class/:classId/subject/:subjectId').delete(protectAdmin, requireAdmin, removeSubjectFromClass);

module.exports = router;