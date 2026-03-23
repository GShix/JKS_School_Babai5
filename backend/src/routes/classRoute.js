const router = require('express').Router();
const {
    createClass,
    fetchClasses,
    fetchSingleClass,
    updateClass,
    deleteClass,
} = require('../controllers/classController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.route('/classes').get(fetchClasses);
router.route('/classes/:id').get(fetchSingleClass);

// Protected routes (admin only)
router.route('/classes').post(protectAdmin, requireAdmin, createClass);
router.route('/classes/:id').put(protectAdmin, requireAdmin, updateClass);
router.route('/classes/:id').delete(protectAdmin, requireAdmin, deleteClass);

module.exports = router;
