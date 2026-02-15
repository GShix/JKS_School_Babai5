const { announcements } = require('../database/connection');
const { Op } = require('sequelize');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

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

// Helper function to process uploaded files (with Supabase)
const processUploadedFiles = async (files, bucketFolder = 'announcements') => {
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
const deleteFiles = async (attachments, bucketFolder = 'announcements') => {
  if (!attachments || attachments.length === 0) return;
  
  for (const attachment of attachments) {
    try {
      await deleteFromSupabase(attachment.url, bucketFolder);
    } catch (error) {
      console.error(`Error deleting file ${attachment.filename}:`, error);
    }
  }
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
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Validate title and content are not just whitespace
    if (title.trim() === '' || content.trim() === '') {
      return res.status(400).json({ message: 'Title and content cannot be empty' });
    }

    // Upload files to Supabase
    let attachments = [];
    try {
      if (req.files && req.files.length > 0) {
        attachments = await processUploadedFiles(req.files, 'announcements');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      await deleteFiles(attachments, 'announcements');
      return res.status(500).json({
        message: 'Error uploading files',
        error: uploadError.message,
      });
    }

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
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Validate title and content if provided
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    
    if (content !== undefined && content.trim() === '') {
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    // Get existing attachments
    let existingAttachments = announcement.attachments || [];
    
    // Remove specified attachments from Supabase
    if (removeAttachments) {
      const filesToRemove = typeof removeAttachments === 'string' 
        ? JSON.parse(removeAttachments) 
        : removeAttachments;
      
      if (Array.isArray(filesToRemove)) {
        const attachmentsToDelete = existingAttachments.filter(att => 
          filesToRemove.includes(att.filename)
        );
        await deleteFiles(attachmentsToDelete, 'announcements');
        
        existingAttachments = existingAttachments.filter(att => 
          !filesToRemove.includes(att.filename)
        );
      }
    }

    // Upload new attachments to Supabase
    let newAttachments = [];
    try {
      if (req.files && req.files.length > 0) {
        newAttachments = await processUploadedFiles(req.files, 'announcements');
      }
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      await deleteFiles(newAttachments, 'announcements');
      return res.status(500).json({
        message: 'Error uploading new files',
        error: uploadError.message,
      });
    }

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

    // Delete associated files from Supabase
    await deleteFiles(announcement.attachments || [], 'announcements');

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
