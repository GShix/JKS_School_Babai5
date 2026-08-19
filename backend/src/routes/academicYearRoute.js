const router = require('express').Router();
const {
    createAcademicYear,
    fetchAcademicYears,
    fetchAcademicYearById,
    updateAcademicYear,
    setCurrentAcademicYear,
    deleteAcademicYear,
} = require('../controllers/academicYearController');

const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.route('/academic-years').get(fetchAcademicYears);
router.route('/academic-years/:id').get(fetchAcademicYearById);

// Protected routes (admin only)
router.route('/academic-years').post(protectAdmin, requireAdmin, createAcademicYear);
router.route('/academic-years/:id').put(protectAdmin, requireAdmin, updateAcademicYear);
router.route('/academic-years/:id/set-current').patch(protectAdmin, requireAdmin, setCurrentAcademicYear);
router.route('/academic-years/:id').delete(protectAdmin, requireAdmin, deleteAcademicYear);

module.exports = router;