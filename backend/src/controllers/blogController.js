
const { blogs } = require("../database/connection");
const { uploadToSupabase } = require('../config/supabase');

exports.createBlog = async(req, res) => {
  try {
    console.log('Request body:', req.body);
    const { blogTitle, blogDescription, blogAuthor, blogStatus, blogImage, blogCategory } = req.body;
    const newBlog = await blogs.create({
      blogTitle,
      blogDescription,
      blogAuthor,
      blogStatus,
      blogImage,
      blogCategory
    });
    res.status(201).json({
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      message: 'Error creating blog',
      error: error.message
    });
  }
}
exports.fetchBlogs= async(req, res) => {
  try {
    const allBlogs = await blogs.findAll();
    res.json({
      message: 'Blogs fetched successfully',
      data: allBlogs
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blogs',
      error: error.message
    });
  }
}
exports.fetchSingleBlog = async(req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogs.findByPk(id);
    if (blog) {
      res.json({
        message: 'Blog details',
        data: blog
      });
    } else {
      res.status(404).json({
        message: 'Blog not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blog',
      error: error.message
    });
  }
}
exports.updateBlog = async(req, res) => {
    const { id } = req.params;
    try {
        const { blogTitle, blogDescription, blogAuthor, blogStatus, blogImage, blogCategory } = req.body;
        const blog = await blogs.findByPk(id);
        if (blog) {
        blog.blogTitle = blogTitle || blog.blogTitle;
        blog.blogDescription = blogDescription || blog.blogDescription;
        blog.blogAuthor = blogAuthor || blog.blogAuthor;
        blog.blogStatus = blogStatus || blog.blogStatus;
        blog.blogImage = blogImage || blog.blogImage;
        blog.blogCategory = blogCategory || blog.blogCategory;
    
        await blog.save();
        res.json({
            message: 'Blog updated successfully',
            data: blog
        });
        } else {
        res.status(404).json({
            message: 'Blog not found'
        });
        }
    } catch (error) {
        res.status(500).json({
        message: 'Error updating blog',
        error: error.message
        });
    }
}
exports.deleteBlog = async(req, res) => {
    const { id } = req.params;
    try {
        const blog = await blogs.findByPk(id);
        if (blog) {
            await blog.destroy();
            res.json({
                message: 'Blog deleted successfully'
            });
        } else {
            res.status(404).json({
                message: 'Blog not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting blog',
            error: error.message
        });
    }
}

// Upload image for blog content (rich text editor)
exports.uploadImage = async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No image file provided'
            });
        }

        // Upload to Supabase Storage
        const uploadResult = await uploadToSupabase(
            req.file.buffer,
            req.file.originalname,
            'blogs',
            req.file.mimetype
        );
        
        res.json({
            message: 'Image uploaded successfully',
            url: uploadResult.url
        });
    } catch (error) {
        console.error('Error uploading blog image:', error);
        res.status(500).json({
            message: 'Error uploading image',
            error: error.message
        });
    }
}
