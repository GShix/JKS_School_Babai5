const { gallery } = require('../database/connection');
const { Op } = require('sequelize');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

// Helper function to normalize gallery data
const normalizeGallery = (item) => {
  const data = item.toJSON ? item.toJSON() : item;
  return {
    ...data,
    category: data.category || 'events',
    featured: data.featured || false,
    status: data.status || 'active',
    images: data.images || [],
    videos: data.videos || [],
    views: data.views || 0,
    tags: data.tags || ''
  };
};

// Helper function to process uploaded files (with Supabase)
const processUploadedFiles = async (files, bucketFolder = 'gallery') => {
  if (!files || files.length === 0) return [];
  
  const uploadedFiles = [];
  for (const file of files) {
    try {
      const uploadResult = await uploadToSupabase(
        file.buffer,
        file.originalname,
        bucketFolder,
        file.mimetype
      );
      
      uploadedFiles.push({
        filename: uploadResult.path,
        originalName: file.originalname,
        fileType: file.mimetype,
        url: uploadResult.url,
        size: file.size
      });
    } catch (error) {
      console.error(`Error uploading file ${file.originalname}:`, error);
      throw error;
    }
  }
  
  return uploadedFiles;
};

// Helper function to delete files from Supabase
const deleteFiles = async (files, bucketFolder = 'gallery-images') => {
  if (!files || files.length === 0) return;
  
  for (const file of files) {
    try {
      await deleteFromSupabase(file.url, bucketFolder);
    } catch (error) {
      console.error(`Error deleting file ${file.filename}:`, error);
    }
  }
};

// Create Gallery Item
exports.createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      eventDate,
      tags,
      featured,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Upload files to Supabase
    let images = [];
    let videos = [];

    try {
      if (req.files?.images) {
        images = await processUploadedFiles(req.files.images, 'gallery-images');
      }
      if (req.files?.videos) {
        videos = await processUploadedFiles(req.files.videos, 'gallery-videos');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      // Clean up any successfully uploaded files
      await deleteFiles(images, 'gallery-images');
      await deleteFiles(videos, 'gallery-videos');
      return res.status(500).json({
        message: 'Error uploading files',
        error: uploadError.message,
      });
    }

    if (images.length === 0 && videos.length === 0) {
      return res.status(400).json({ message: 'At least one image or video is required' });
    }

    const newItem = await gallery.create({
      title: title.trim(),
      description: description?.trim() || '',
      category: category || 'events',
      eventDate: eventDate || null,
      tags: tags || '',
      featured: featured === 'true' || featured === true || false,
      status: status || 'active',
      images,
      videos,
      views: 0,
      uploadedBy: req.user.id
    });

    return res.status(201).json({ 
      message: 'Gallery item created successfully', 
      data: normalizeGallery(newItem)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not create gallery item', 
      error: error.message 
    });
  }
};

// Get All Gallery Items
exports.getAllGallery = async (req, res) => {
  try {
    const { category, featured, status } = req.query;

    const whereClause = {};
    if (category) whereClause.category = category;
    if (featured !== undefined) whereClause.featured = featured === 'true';
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'active'; // Default to active only
    }

    const items = await gallery.findAll({
      where: whereClause,
      order: [
        ['featured', 'DESC'],
        ['eventDate', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    const validItems = items
      .filter(item => item != null)
      .map(normalizeGallery);

    return res.json({ 
      message: 'Gallery items fetched successfully', 
      data: validItems
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not fetch gallery items', 
      error: error.message 
    });
  }
};

// Get Single Gallery Item
exports.getSingleGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await gallery.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Increment views
    await item.update({ views: item.views + 1 });

    return res.json({ 
      message: 'Gallery item fetched successfully', 
      data: normalizeGallery(item)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not fetch gallery item', 
      error: error.message 
    });
  }
};

// Update Gallery Item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      eventDate,
      tags,
      featured,
      status,
      removeImages, // Array of filenames to remove
      removeVideos  // Array of filenames to remove
    } = req.body;

    const item = await gallery.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Get existing files
    let existingImages = item.images || [];
    let existingVideos = item.videos || [];
    
    // Remove specified images from Supabase
    if (removeImages) {
      const filesToRemove = typeof removeImages === 'string' 
        ? JSON.parse(removeImages) 
        : removeImages;
      
      if (Array.isArray(filesToRemove)) {
        const imagesToDelete = existingImages.filter(img => 
          filesToRemove.includes(img.filename)
        );
        await deleteFiles(imagesToDelete, 'gallery-images');
        
        existingImages = existingImages.filter(img => 
          !filesToRemove.includes(img.filename)
        );
      }
    }

    // Remove specified videos from Supabase
    if (removeVideos) {
      const filesToRemove = typeof removeVideos === 'string' 
        ? JSON.parse(removeVideos) 
        : removeVideos;
      
      if (Array.isArray(filesToRemove)) {
        const videosToDelete = existingVideos.filter(vid => 
          filesToRemove.includes(vid.filename)
        );
        await deleteFiles(videosToDelete, 'gallery-videos');
        
        existingVideos = existingVideos.filter(vid => 
          !filesToRemove.includes(vid.filename)
        );
      }
    }

    // Upload new files to Supabase
    let newImages = [];
    let newVideos = [];
    
    try {
      if (req.files?.images) {
        newImages = await processUploadedFiles(req.files.images, 'gallery-images');
      }
      if (req.files?.videos) {
        newVideos = await processUploadedFiles(req.files.videos, 'gallery-videos');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      // Clean up any successfully uploaded files
      await deleteFiles(newImages, 'gallery-images');
      await deleteFiles(newVideos, 'gallery-videos');
      return res.status(500).json({
        message: 'Error uploading new files',
        error: uploadError.message,
      });
    }

    const allImages = [...existingImages, ...newImages];
    const allVideos = [...existingVideos, ...newVideos];

    await item.update({
      title: title !== undefined ? title.trim() : item.title,
      description: description !== undefined ? description.trim() : item.description,
      category: category !== undefined ? category : item.category,
      eventDate: eventDate !== undefined ? eventDate : item.eventDate,
      tags: tags !== undefined ? tags : item.tags,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : item.featured,
      status: status !== undefined ? status : item.status,
      images: allImages,
      videos: allVideos,
    });

    return res.json({ 
      message: 'Gallery item updated successfully', 
      data: normalizeGallery(item)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not update gallery item', 
      error: error.message 
    });
  }
};

// Delete Gallery Item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await gallery.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete associated files from Supabase
    await deleteFiles(item.images, 'gallery-images');
    await deleteFiles(item.videos, 'gallery-videos');

    await item.destroy();
    return res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not delete gallery item', 
      error: error.message 
    });
  }
};

// Toggle Featured Status
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const item = await gallery.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await item.update({ 
      featured: featured !== undefined ? featured : !item.featured 
    });

    return res.json({ 
      message: 'Featured status updated successfully', 
      data: normalizeGallery(item)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not update featured status', 
      error: error.message 
    });
  }
};
