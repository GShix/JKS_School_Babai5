const { blogs } = require('../database/connection');

// Fetch all published blogs (public view)
exports.getPublishedBlogs = async (req, res) => {
    try {
        const { category, audience } = req.query;

        const whereClause = {
            blogStatus: 'published',
        };

        if (category) {
            whereClause.blogCategory = category;
        }

        if (audience) {
            whereClause.audience = audience;
        }

        const allBlogs = await blogs.findAll({
            where: whereClause,
            order: [['publishedDate', 'DESC']],
            attributes: [
                'id', 'blogTitle', 'blogDescription', 'blogAuthor',
                'blogImage', 'blogCategory', 'audience', 'tags',
                'views', 'publishedDate', 'createdAt'
            ],
        });

        res.json({
            message: 'Blogs fetched successfully',
            data: allBlogs,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching blogs',
            error: error.message,
        });
    }
};

// Fetch a single published blog by id (public view, increments views)
exports.getSinglePublishedBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await blogs.findOne({
            where: { id, blogStatus: 'published' },
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.views = (blog.views || 0) + 1;
        await blog.save();

        res.json({
            message: 'Blog details',
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching blog',
            error: error.message,
        });
    }
};
