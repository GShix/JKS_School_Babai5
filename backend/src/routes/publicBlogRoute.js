const router = require('express').Router();
const { getPublishedBlogs, getSinglePublishedBlog } = require('../controllers/publicBlogController');

// GET /api/blogs        — list all published blogs (optionally filter by ?category= or ?audience=)
router.get('/blogs', getPublishedBlogs);

// GET /api/blogs/:id    — read a single published blog
router.get('/blogs/:id', getSinglePublishedBlog);

module.exports = router;
