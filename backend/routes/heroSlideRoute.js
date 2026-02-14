const router = require('express').Router();
const {
  createHeroSlide,
  getHeroSlides,
  getActiveHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} = require('../controllers/heroSlideController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/heroSlideUploadMiddleware');

// Public routes
router.get('/hero-slides/active', getActiveHeroSlides);

// Admin routes
router.get('/hero-slides', protectAdmin, requireAdmin, getHeroSlides);
router.get('/hero-slides/:id', protectAdmin, requireAdmin, getHeroSlideById);
router.post('/hero-slides/create', protectAdmin, requireAdmin, uploadSingle('image'), createHeroSlide);
router.put('/hero-slides/:id', protectAdmin, requireAdmin, uploadSingle('image'), updateHeroSlide);
router.delete('/hero-slides/:id', protectAdmin, requireAdmin, deleteHeroSlide);
router.patch('/hero-slides/reorder', protectAdmin, requireAdmin, reorderHeroSlides);

module.exports = router;
