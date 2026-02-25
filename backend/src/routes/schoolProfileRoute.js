const express = require('express');
const router = express.Router();
const schoolProfileController = require('../controllers/schoolProfileController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Public route - Get school profile
router.get('/', schoolProfileController.getSchoolProfile);

// Protected routes - Admin only
router.put('/', protectAdmin, uploadSingle('logo'), schoolProfileController.updateSchoolProfile);

module.exports = router;
