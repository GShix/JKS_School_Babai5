const { fetchBlogs, createBlog, fetchSingleBlog, updateBlog, deleteBlog, uploadImage } = require('../controllers/blogController');
const { protectAdmin, requireAdmin } = require('../middlewares/authMiddleware');
const { uploadBlogContentImage } = require('../middlewares/blogUploadMiddleware');

const router = require('express').Router();

router.route("/blogs").get(fetchBlogs)
router.route("/blogs").post(protectAdmin, requireAdmin, createBlog);
router.route("/blogs/:id").get(fetchSingleBlog);
router.route("/blogs/:id").put(protectAdmin, requireAdmin, updateBlog);
router.route("/blogs/:id").delete(protectAdmin, requireAdmin, deleteBlog);
router.route("/blogs/upload-image").post(protectAdmin, requireAdmin, uploadBlogContentImage, uploadImage);

module.exports = router;