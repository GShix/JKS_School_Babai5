const router = require('express').Router();
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadBlogImage, uploadBlogContentImage } = require('../middlewares/blogUploadMiddleware');
const {
    getAllBlogs,
    getAdminSingleBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadImage,
} = require('../controllers/adminBlogController');

// All routes below require a valid admin token
// GET  /api/admin/blogs              — list all blogs (all statuses, filter by ?status= ?category= ?audience=)
// POST /api/admin/blogs              — create a new blog (with optional cover image)
router.route('/admin/blogs')
    .get(protectAdmin, requireAdmin, getAllBlogs)
    .post(protectAdmin, requireAdmin, uploadBlogImage, createBlog);

// GET    /api/admin/blogs/upload-image  — rich-text editor image upload (must come before /:id)
router.post('/admin/blogs/upload-image', protectAdmin, requireAdmin, uploadBlogContentImage, uploadImage);

// GET    /api/admin/blogs/:id  — get single blog (any status)
// PUT    /api/admin/blogs/:id  — update blog
// DELETE /api/admin/blogs/:id  — archive or permanently delete (?permanent=true)
router.route('/admin/blogs/:id')
    .get(protectAdmin, requireAdmin, getAdminSingleBlog)
    .put(protectAdmin, requireAdmin, uploadBlogImage, updateBlog)
    .delete(protectAdmin, requireAdmin, deleteBlog);

module.exports = router;
