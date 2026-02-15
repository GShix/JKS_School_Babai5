const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { uploadGalleryFiles } = require('../middlewares/galleryUploadMiddleware');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', galleryController.getAllGallery);
router.get('/:id', galleryController.getSingleGalleryItem);

// Protected routes (Admin only)
router.post('/', protectAdmin, requireAdmin, uploadGalleryFiles, galleryController.createGalleryItem);
router.put('/:id', protectAdmin, requireAdmin, uploadGalleryFiles, galleryController.updateGalleryItem);
router.delete('/:id', protectAdmin, requireAdmin, galleryController.deleteGalleryItem);
router.patch('/:id/toggle-featured', protectAdmin, requireAdmin, galleryController.toggleFeatured);

module.exports = router;
