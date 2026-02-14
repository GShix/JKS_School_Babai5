const { downloads } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');
const { Op } = require('sequelize');

// Helper function to normalize download data
const normalizeDownload = (download) => {
  const data = download.toJSON ? download.toJSON() : download;
  return {
    ...data,
    category: data.category || 'others',
    status: data.status || 'active',
    downloads: data.downloads || 0,
  };
};

// Helper function to calculate file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Create Download
exports.createDownload = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      class: className,
      subject,
      academicYear,
      status
    } = req.body;

    // Validation
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Validate category
    const validCategories = ['notes', 'question-papers', 'solutions', 'forms', 'syllabus', 'others'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: notes, question-papers, solutions, forms, syllabus, others' 
      });
    }

    // Determine file type
    const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';

    // Upload to Supabase
    const { url: fileUrl } = await uploadToSupabase(
      req.file.buffer,
      req.file.originalname,
      'downloads', // bucket name
      req.file.mimetype
    );

    // Calculate file size
    const fileSize = formatFileSize(req.file.size);

    const newDownload = await downloads.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      category,
      class: className || null,
      subject: subject || null,
      fileUrl,
      fileName: req.file.originalname,
      fileType,
      fileSize,
      downloads: 0,
      status: status || 'active',
      uploadedBy: req.user.id,
      academicYear: academicYear || null,
    });

    return res.status(201).json({ 
      message: 'Download created successfully', 
      data: normalizeDownload(newDownload)
    });
  } catch (error) {
    console.error('Error creating download:', error);
    return res.status(500).json({ 
      message: 'Could not create download', 
      error: error.message 
    });
  }
};

// Get All Downloads
exports.getDownloads = async (req, res) => {
  try {
    const { category, class: className, subject, status } = req.query;

    let whereClause = {};

    if (category) whereClause.category = category;
    if (className) whereClause.class = className;
    if (subject) whereClause.subject = { [Op.like]: `%${subject}%` };
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'active'; // Default to active only
    }

    const allDownloads = await downloads.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    // Filter out any null records and normalize data
    const validDownloads = allDownloads
      .filter(download => download != null)
      .map(normalizeDownload);

    return res.status(200).json({ 
      message: 'Downloads retrieved successfully', 
      data: validDownloads 
    });
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return res.status(500).json({ 
      message: 'Could not retrieve downloads', 
      error: error.message 
    });
  }
};

// Get Download by ID
exports.getDownloadById = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await downloads.findByPk(id);

    if (!download) {
      return res.status(404).json({ message: 'Download not found' });
    }

    return res.status(200).json({ 
      message: 'Download retrieved successfully', 
      data: normalizeDownload(download) 
    });
  } catch (error) {
    console.error('Error fetching download:', error);
    return res.status(500).json({ 
      message: 'Could not retrieve download', 
      error: error.message 
    });
  }
};

// Update Download
exports.updateDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      class: className,
      subject,
      academicYear,
      status
    } = req.body;

    const download = await downloads.findByPk(id);

    if (!download) {
      // Clean up uploaded file if exists
      if (req.file) {
        await deleteFromSupabase(req.file.originalname, 'downloads');
      }
      return res.status(404).json({ message: 'Download not found' });
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['notes', 'question-papers', 'solutions', 'forms', 'syllabus', 'others'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          message: 'Invalid category. Must be one of: notes, question-papers, solutions, forms, syllabus, others' 
        });
      }
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (category) updateData.category = category;
    if (className !== undefined) updateData.class = className || null;
    if (subject !== undefined) updateData.subject = subject || null;
    if (academicYear !== undefined) updateData.academicYear = academicYear || null;
    if (status) updateData.status = status;

    // If new file is uploaded, replace the old one
    if (req.file) {
      // Delete old file from Supabase
      if (download.fileUrl) {
        await deleteFromSupabase(download.fileUrl, 'downloads');
      }

      // Upload new file
      const { url: fileUrl } = await uploadToSupabase(
        req.file.buffer,
        req.file.originalname,
        'downloads',
        req.file.mimetype
      );

      updateData.fileUrl = fileUrl;
      updateData.fileName = req.file.originalname;
      updateData.fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'pdf';
      updateData.fileSize = formatFileSize(req.file.size);
    }

    await download.update(updateData);

    return res.status(200).json({ 
      message: 'Download updated successfully', 
      data: normalizeDownload(download) 
    });
  } catch (error) {
    console.error('Error updating download:', error);
    // Clean up uploaded file if exists
    if (req.file) {
      await deleteFromSupabase(req.file.originalname, 'downloads');
    }
    return res.status(500).json({ 
      message: 'Could not update download', 
      error: error.message 
    });
  }
};

// Delete Download
exports.deleteDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await downloads.findByPk(id);

    if (!download) {
      return res.status(404).json({ message: 'Download not found' });
    }

    // Delete file from Supabase
    if (download.fileUrl) {
      await deleteFromSupabase(download.fileUrl, 'downloads');
    }

    await download.destroy();

    return res.status(200).json({ 
      message: 'Download deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting download:', error);
    return res.status(500).json({ 
      message: 'Could not delete download', 
      error: error.message 
    });
  }
};

// Increment Download Count
exports.incrementDownloadCount = async (req, res) => {
  try {
    const { id } = req.params;

    const download = await downloads.findByPk(id);

    if (!download) {
      return res.status(404).json({ message: 'Download not found' });
    }

    await download.increment('downloads', { by: 1 });

    return res.status(200).json({ 
      message: 'Download count updated successfully',
      data: { downloads: download.downloads + 1 }
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    return res.status(500).json({ 
      message: 'Could not update download count', 
      error: error.message 
    });
  }
};

// Get Downloads by Category
exports.getDownloadsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ['notes', 'question-papers', 'solutions', 'forms', 'syllabus', 'others'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category. Must be one of: notes, question-papers, solutions, forms, syllabus, others' 
      });
    }

    const categoryDownloads = await downloads.findAll({
      where: { 
        category,
        status: 'active'
      },
      order: [['createdAt', 'DESC']],
    });

    const validDownloads = categoryDownloads.map(normalizeDownload);

    return res.status(200).json({ 
      message: `${category} downloads retrieved successfully`, 
      data: validDownloads 
    });
  } catch (error) {
    console.error('Error fetching downloads by category:', error);
    return res.status(500).json({ 
      message: 'Could not retrieve downloads', 
      error: error.message 
    });
  }
};
