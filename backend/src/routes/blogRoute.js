const { fetchBlogs, createBlog, fetchSingleBlog, updateBlog, deleteBlog, uploadImage } = require('../controllers/blogController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadBlogContentImage, uploadBlogImage } = require('../middlewares/blogUploadMiddleware');

const router = require('express').Router();

// Public routes
router.route("/blogs").get(fetchBlogs);
router.route("/blogs/:id").get(fetchSingleBlog);

// Protected routes - admin only
router.route("/blogs").post(protectAdmin, requireAdmin, uploadBlogImage, createBlog);
router.route("/blogs/:id").put(protectAdmin, requireAdmin, uploadBlogImage, updateBlog);
router.route("/blogs/:id").delete(protectAdmin, requireAdmin, deleteBlog);

// Image upload for rich text editor
router.route("/blogs/upload-image").post(protectAdmin, requireAdmin, uploadBlogContentImage, uploadImage);

module.exports = router;