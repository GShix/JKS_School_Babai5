const router = require('express').Router();
const {
  createAnnouncement,
  getAnnouncements,
  getSingleAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePin
} = require('../controllers/announcementController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/announcementUploadMiddleware');

// Public routes
router.get('/announcements', getAnnouncements);
router.get('/announcements/:id', getSingleAnnouncement);

// Admin routes
router.post('/announcements/create', protectAdmin, requireAdmin, uploadMultiple, createAnnouncement);
router.put('/announcements/:id', protectAdmin, requireAdmin, uploadMultiple, updateAnnouncement);
router.patch('/announcements/:id/pin', protectAdmin, requireAdmin, togglePin);
router.delete('/announcements/:id', protectAdmin, requireAdmin, deleteAnnouncement);

module.exports = router;
