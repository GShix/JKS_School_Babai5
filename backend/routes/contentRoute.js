const express = require('express');
const router = express.Router();
const {
  getContentBySection,
  getSchoolProfile,
  updateSchoolProfile,
  getAllContent,
  createContent,
  updateContent,
  deleteContent,
  bulkUpdateContent,
  initializeDefaultContent
} = require('../controllers/contentController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Debug: Check if all functions are defined
console.log('getAllContent:', typeof getAllContent);
console.log('isAuthenticated:', typeof isAuthenticated);
console.log('isAdmin:', typeof isAdmin);

// Public routes - content fetching
router.get('/content/section/:section', getContentBySection);
router.get('/content/school-profile', getSchoolProfile);

// Admin routes - content management
router.get('/content', isAuthenticated, isAdmin, getAllContent);
router.post('/content', isAuthenticated, isAdmin, createContent);
router.put('/content/:id', isAuthenticated, isAdmin, updateContent);
router.delete('/content/:id', isAuthenticated, isAdmin, deleteContent);

// School profile management
router.put('/content/school-profile', isAuthenticated, isAdmin, updateSchoolProfile);

// Bulk operations
router.post('/content/bulk-update', isAuthenticated, isAdmin, bulkUpdateContent);

// Initialize default content (run once)
router.post('/content/initialize', isAuthenticated, isAdmin, initializeDefaultContent);

module.exports = router;
