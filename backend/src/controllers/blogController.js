
const { blogs } = require("../database/connection");
const { uploadToSupabase } = require('../config/supabase');

// Create a new blog post
exports.createBlog = async(req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { blogTitle, blogDescription, blogCategory, blogStatus, audience, tags } = req.body;
    
    // Get author info from authenticated admin
    const blogAuthor = req.admin.adminName || req.admin.email;
    const authorId = req.admin.id;
    
    // Handle cover image upload
    let blogImage = null;
    if (req.file) {
      const uploadResult = await uploadToSupabase(
        req.file.buffer,
        req.file.originalname,
        'blogs',
        req.file.mimetype
      );
      blogImage = uploadResult.url;
    }
    
    // Set published date if status is published
    const publishedDate = blogStatus === 'published' ? new Date() : null;
    
    const newBlog = await blogs.create({
      blogTitle,
      blogDescription,
      blogAuthor,
      authorId,
      blogStatus: blogStatus || 'draft',
      blogImage,
      blogCategory: blogCategory || 'general',
      audience: audience || 'public',
      publishedDate,
      tags,
      views: 0
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

// Fetch all blogs (with optional filtering by audience for public view)
exports.fetchBlogs= async(req, res) => {
  try {
    const { audience, status } = req.query;
    const whereClause = {};
    
    // Filter by audience if provided
    if (audience) {
      whereClause.audience = audience;
    }
    
    // Filter by status if provided, otherwise show only published for public
    if (status) {
      whereClause.blogStatus = status;
    } else if (!req.admin) {
      // If not admin, show only published posts
      whereClause.blogStatus = 'published';
    }
    
    const allBlogs = await blogs.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
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

// Fetch single blog
exports.fetchSingleBlog = async(req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogs.findByPk(id);
    if (blog) {
      // Increment views
      blog.views = (blog.views || 0) + 1;
      await blog.save();
      
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

// Update blog
exports.updateBlog = async(req, res) => {
    const { id } = req.params;
    try {
        const { blogTitle, blogDescription, blogCategory, blogStatus, audience, tags } = req.body;
        const blog = await blogs.findByPk(id);
        
        if (!blog) {
          return res.status(404).json({
            message: 'Blog not found'
          });
        }
        
        // Handle cover image upload if new image provided
        if (req.file) {
          const uploadResult = await uploadToSupabase(
            req.file.buffer,
            req.file.originalname,
            'blogs',
            req.file.mimetype
          );
          blog.blogImage = uploadResult.url;
        }
        
        // Update fields
        if (blogTitle) blog.blogTitle = blogTitle;
        if (blogDescription) blog.blogDescription = blogDescription;
        if (blogCategory) blog.blogCategory = blogCategory;
        if (audience) blog.audience = audience;
        if (tags !== undefined) blog.tags = tags;
        
        // Handle status change
        if (blogStatus) {
          const oldStatus = blog.blogStatus;
          blog.blogStatus = blogStatus;
          
          // Set published date when changing from draft to published
          if (oldStatus === 'draft' && blogStatus === 'published' && !blog.publishedDate) {
            blog.publishedDate = new Date();
          }
        }
        
        await blog.save();
        
        res.json({
            message: 'Blog updated successfully',
            data: blog
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
          message: 'Error updating blog',
          error: error.message
        });
    }
}

// Delete blog (soft delete by archiving or hard delete)
exports.deleteBlog = async(req, res) => {
    const { id } = req.params;
    const { permanent } = req.query;
    
    try {
        const blog = await blogs.findByPk(id);
        if (!blog) {
          return res.status(404).json({
            message: 'Blog not found'
          });
        }
        
        if (permanent === 'true') {
          // Hard delete
          await blog.destroy();
          res.json({
            message: 'Blog permanently deleted successfully'
          });
        } else {
          // Soft delete - archive it
          blog.blogStatus = 'archived';
          await blog.save();
          res.json({
            message: 'Blog archived successfully',
            data: blog
          });
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
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
