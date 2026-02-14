const { announcements } = require('../database/connection');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Helper function to normalize announcement data
const normalizeAnnouncement = (announcement) => {
  const data = announcement.toJSON ? announcement.toJSON() : announcement;
  return {
    ...data,
    priority: data.priority || 'medium',
    targetAudience: data.targetAudience || 'all',
    isPinned: data.isPinned || false,
    attachments: data.attachments || [],
    status: data.status || 'active'
  };
};

// Helper function to process uploaded files
const processUploadedFiles = (files) => {
  if (!files || files.length === 0) return [];
  
  return files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    fileType: file.mimetype,
    url: `/uploads/announcements/${file.filename}`,
    size: file.size
  }));
};

// Helper function to delete files
const deleteFiles = (attachments) => {
  if (!attachments || attachments.length === 0) return;
  
  attachments.forEach(attachment => {
    const filePath = path.join(__dirname, '..', attachment.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      targetAudience,
      priority,
      isPinned,
      startDate,
      endDate,
      status
    } = req.body;

    if (!title || !content) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Validate title and content are not just whitespace
    if (title.trim() === '' || content.trim() === '') {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(400).json({ message: 'Title and content cannot be empty' });
    }

    // Process uploaded files
    const attachments = processUploadedFiles(req.files);

    const newAnnouncement = await announcements.create({
      title: title.trim(),
      content: content.trim(),
      targetAudience: targetAudience || 'all',
      priority: priority || 'medium',
      isPinned: isPinned === 'true' || isPinned === true || false,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      attachments,
      status: status || 'active',
      createdBy: req.user.id
    });

    return res.status(201).json({ 
      message: 'Announcement created successfully', 
      data: normalizeAnnouncement(newAnnouncement)
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    return res.status(500).json({ 
      message: 'Could not create announcement', 
      error: error.message 
    });
  }
};

// Get All Announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const { targetAudience, priority, status } = req.query;

    let whereClause = {};

    if (targetAudience) whereClause.targetAudience = targetAudience;
    if (priority) whereClause.priority = priority;
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'active'; // Default to active only
    }

    const allAnnouncements = await announcements.findAll({
      where: whereClause,
      order: [
        ['isPinned', 'DESC'], // Pinned first
        ['priority', 'DESC'],
        ['startDate', 'DESC']
      ]
    });

    // Filter out any null records and normalize data
    const validAnnouncements = allAnnouncements
      .filter(announcement => announcement != null)
      .map(normalizeAnnouncement);

    return res.json({ 
      message: 'Announcements fetched successfully', 
      data: validAnnouncements
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not fetch announcements', 
      error: error.message 
    });
  }
};

// Get Single Announcement
exports.getSingleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await announcements.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    return res.json({ 
      message: 'Announcement fetched successfully', 
      data: normalizeAnnouncement(announcement)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not fetch announcement', 
      error: error.message 
    });
  }
};

// Update Announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      targetAudience,
      priority,
      isPinned,
      startDate,
      endDate,
      status,
      removeAttachments // Array of filenames to remove
    } = req.body;

    const announcement = await announcements.findByPk(id);
    if (!announcement) {
      // Clean up uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Validate title and content if provided
    if (title !== undefined && title.trim() === '') {
      // Clean up uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    
    if (content !== undefined && content.trim() === '') {
      // Clean up uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = file.path;
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    // Get existing attachments
    let existingAttachments = announcement.attachments || [];
    
    // Remove specified attachments
    if (removeAttachments) {
      const filesToRemove = typeof removeAttachments === 'string' 
        ? JSON.parse(removeAttachments) 
        : removeAttachments;
      
      if (Array.isArray(filesToRemove)) {
        const attachmentsToDelete = existingAttachments.filter(att => 
          filesToRemove.includes(att.filename)
        );
        deleteFiles(attachmentsToDelete);
        
        existingAttachments = existingAttachments.filter(att => 
          !filesToRemove.includes(att.filename)
        );
      }
    }

    // Add new attachments
    const newAttachments = processUploadedFiles(req.files);
    const allAttachments = [...existingAttachments, ...newAttachments];

    await announcement.update({
      title: title !== undefined ? title.trim() : announcement.title,
      content: content !== undefined ? content.trim() : announcement.content,
      targetAudience: targetAudience !== undefined ? targetAudience : announcement.targetAudience,
      priority: priority !== undefined ? priority : announcement.priority,
      isPinned: isPinned !== undefined ? (isPinned === 'true' || isPinned === true) : announcement.isPinned,
      startDate: startDate !== undefined ? startDate : announcement.startDate,
      endDate: endDate !== undefined ? endDate : announcement.endDate,
      attachments: allAttachments,
      status: status !== undefined ? status : announcement.status,
    });

    return res.json({ 
      message: 'Announcement updated successfully', 
      data: normalizeAnnouncement(announcement)
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    return res.status(500).json({ 
      message: 'Could not update announcement', 
      error: error.message 
    });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await announcements.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Delete associated files
    deleteFiles(announcement.attachments || []);

    await announcements.destroy({ where: { id } });
    return res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not delete announcement', 
      error: error.message 
    });
  }
};

// Toggle Pin
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPinned } = req.body;

    const announcement = await announcements.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.update({ isPinned });

    return res.json({ 
      message: 'Announcement pin status updated', 
      data: normalizeAnnouncement(announcement)
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Could not update pin status', 
      error: error.message 
    });
  }
};
