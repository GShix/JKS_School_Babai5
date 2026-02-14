const router = require('express').Router();
const {
  createDownload,
  getDownloads,
  getDownloadById,
  updateDownload,
  deleteDownload,
  incrementDownloadCount,
  getDownloadsByCategory
} = require('../controllers/downloadController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/downloadUploadMiddleware');

// Public routes
router.get('/downloads', getDownloads);
router.get('/downloads/:id', getDownloadById);
router.get('/downloads/category/:category', getDownloadsByCategory);
router.patch('/downloads/:id/count', incrementDownloadCount);

// Admin routes
router.post('/downloads/create', protectAdmin, requireAdmin, uploadSingle('file'), createDownload);
router.put('/downloads/:id', protectAdmin, requireAdmin, uploadSingle('file'), updateDownload);
router.delete('/downloads/:id', protectAdmin, requireAdmin, deleteDownload);

module.exports = router;
