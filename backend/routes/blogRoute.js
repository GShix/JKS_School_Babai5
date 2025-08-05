const { fetchBlogs, createBlog, fetchSingleBlog, updateBlog, deleteBlog } = require('../controllers/blogController');

const router = require('express').Router();

router.route("/blogs").get(fetchBlogs)
router.route("/blogs/create").post(createBlog);
router.route("/blogs/:id").get(fetchSingleBlog);
router.route("/blogs/:id/update").put(updateBlog);
router.route("/blogs/:id/delete").delete(deleteBlog);

module.exports = router;