const { schoolMessages } = require('../database/connection');
const path = require('path');
const fs = require('fs').promises;

// Get all messages (with optional filter for active only)
const getAllMessages = async (req, res) => {
  try {
    const { active } = req.query;
    
    const whereClause = {};
    if (active === 'true') {
      whereClause.isActive = true;
    }
    
    const messages = await schoolMessages.findAll({
      where: whereClause,
      order: [
        ['displayOrder', 'ASC'],
        ['createdAt', 'DESC']
      ]
    });
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Get single message
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await schoolMessages.findByPk(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message',
      error: error.message
    });
  }
};

// Create new message
const createMessage = async (req, res) => {
  try {
    const {
      personName,
      personPosition,
      message,
      displayOrder,
      isActive
    } = req.body;
    
    // Handle photo upload if exists
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/messages/${req.file.filename}`;
    }
    
    const newMessage = await schoolMessages.create({
      personName,
      personPosition,
      message,
      photo: photoPath,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create message',
      error: error.message
    });
  }
};

// Update message
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      personName,
      personPosition,
      message,
      displayOrder,
      isActive
    } = req.body;
    
    // Check if message exists
    const existingMessage = await schoolMessages.findByPk(id);
    
    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Handle photo upload if new file exists
    let photoPath = existingMessage.photo;
    if (req.file) {
      // Delete old photo if exists
      if (existingMessage.photo) {
        const oldPhotoPath = path.join(__dirname, '..', existingMessage.photo);
        try {
          await fs.unlink(oldPhotoPath);
        } catch (err) {
          console.log('Old photo not found or already deleted');
        }
      }
      photoPath = `/uploads/messages/${req.file.filename}`;
    }
    
    await existingMessage.update({
      personName,
      personPosition,
      message,
      photo: photoPath,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.json({
      success: true,
      message: 'Message updated successfully',
      data: existingMessage
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get message to delete photo
    const message = await schoolMessages.findByPk(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    // Delete photo if exists
    if (message.photo) {
      const photoPath = path.join(__dirname, '..', message.photo);
      try {
        await fs.unlink(photoPath);
      } catch (err) {
        console.log('Photo file not found or already deleted');
      }
    }
    
    await message.destroy();
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
};
