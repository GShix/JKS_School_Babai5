const { heroSlides } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');
const { Op } = require('sequelize');

// Helper function to normalize hero slide data
const normalizeHeroSlide = (slide) => {
  const data = slide.toJSON ? slide.toJSON() : slide;
  return {
    ...data,
    status: data.status || 'active',
    displayOrder: data.displayOrder || 0,
  };
};

// Create Hero Slide
exports.createHeroSlide = async (req, res) => {
  try {
    const { title, displayOrder, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload to Supabase
    const { url: imageUrl } = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      'hero-slides',
      req.file.mimetype
    );

    const newSlide = await heroSlides.create({
      title: title || null,
      imageUrl,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      status: status || 'active',
      uploadedBy: req.user.id,
    });

    return res.status(201).json({
      message: 'Hero slide created successfully',
      data: normalizeHeroSlide(newSlide),
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return res.status(500).json({
      message: 'Could not create hero slide',
      error: error.message,
    });
  }
};

// Get All Hero Slides
exports.getHeroSlides = async (req, res) => {
  try {
    const { status } = req.query;

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const allSlides = await heroSlides.findAll({
      where: whereClause,
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
    });

    const validSlides = allSlides
      .filter(slide => slide != null)
      .map(normalizeHeroSlide);

    return res.status(200).json({
      message: 'Hero slides retrieved successfully',
      data: validSlides,
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return res.status(500).json({
      message: 'Could not retrieve hero slides',
      error: error.message,
    });
  }
};

// Get Active Hero Slides (Public)
exports.getActiveHeroSlides = async (req, res) => {
  try {
    const activeSlides = await heroSlides.findAll({
      where: { status: 'active' },
      order: [['displayOrder', 'ASC']],
    });

    const validSlides = activeSlides.map(normalizeHeroSlide);

    return res.status(200).json({
      message: 'Active hero slides retrieved successfully',
      data: validSlides,
    });
  } catch (error) {
    console.error('Error fetching active hero slides:', error);
    return res.status(500).json({
      message: 'Could not retrieve hero slides',
      error: error.message,
    });
  }
};

// Get Hero Slide by ID
exports.getHeroSlideById = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await heroSlides.findByPk(id);

    if (!slide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    return res.status(200).json({
      message: 'Hero slide retrieved successfully',
      data: normalizeHeroSlide(slide),
    });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return res.status(500).json({
      message: 'Could not retrieve hero slide',
      error: error.message,
    });
  }
};

// Update Hero Slide
exports.updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, displayOrder, status } = req.body;

    const slide = await heroSlides.findByPk(id);

    if (!slide) {
      if (req.file) {
        await deleteFromSupabase(req.file.originalname, 'hero-slides');
      }
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title || null;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (status) updateData.status = status;

    // If new image is uploaded, replace the old one
    if (req.file) {
      // Delete old image from Supabase
      if (slide.imageUrl) {
        await deleteFromSupabase(slide.imageUrl, 'hero-slides');
      }

      // Upload new image
      const { url: imageUrl } = await uploadToSupabase(
        req.file.buffer,
        req.file.originalname,
        'hero-slides',
        req.file.mimetype
      );

      updateData.imageUrl = imageUrl;
    }

    await slide.update(updateData);

    return res.status(200).json({
      message: 'Hero slide updated successfully',
      data: normalizeHeroSlide(slide),
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    if (req.file) {
      await deleteFromSupabase(req.file.originalname, 'hero-slides');
    }
    return res.status(500).json({
      message: 'Could not update hero slide',
      error: error.message,
    });
  }
};

// Delete Hero Slide
exports.deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await heroSlides.findByPk(id);

    if (!slide) {
      return res.status(404).json({ message: 'Hero slide not found' });
    }

    // Delete image from Supabase
    if (slide.imageUrl) {
      await deleteFromSupabase(slide.imageUrl, 'hero-slides');
    }

    await slide.destroy();

    return res.status(200).json({
      message: 'Hero slide deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return res.status(500).json({
      message: 'Could not delete hero slide',
      error: error.message,
    });
  }
};

// Reorder Hero Slides
exports.reorderHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: 'Slides must be an array' });
    }

    // Update display order for each slide
    await Promise.all(
      slides.map(({ id, displayOrder }) =>
        heroSlides.update(
          { displayOrder },
          { where: { id } }
        )
      )
    );

    return res.status(200).json({
      message: 'Hero slides reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering hero slides:', error);
    return res.status(500).json({
      message: 'Could not reorder hero slides',
      error: error.message,
    });
  }
};
