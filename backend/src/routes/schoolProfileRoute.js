const express = require('express');
const router = express.Router();
const schoolProfileController = require('../controllers/schoolProfileController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public route - Get school profile
router.get('/', schoolProfileController.getSchoolProfile);

// Protected routes - Admin only
router.put('/', protectAdmin, schoolProfileController.updateSchoolProfile);

module.exports = router;
