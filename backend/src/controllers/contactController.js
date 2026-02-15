const { contacts } = require('../database/connection');

// Get all contacts (admin only)
const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    const contactsList = await contacts.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: contactsList
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
};

// Get single contact by ID (admin only)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await contacts.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: error.message
    });
  }
};

// Create new contact submission (public)
const createContact = async (req, res) => {
  try {
    const { name, phone, email, message, isStudent, className } = req.body;
    
    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required'
      });
    }
    
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    const cleanedPhone = phone.replace(/[-\s]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      });
    }
    
    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please enter a valid email address'
        });
      }
    }
    
    // Validate class if student
    if (isStudent && !className) {
      return res.status(400).json({
        success: false,
        message: 'Class is required for students'
      });
    }
    
    const contact = await contacts.create({
      name,
      phone: cleanedPhone,
      email: email || null,
      message: message || null,
      isStudent: isStudent || false,
      className: isStudent ? className : null,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact',
      error: error.message
    });
  }
};

// Update contact status/notes (admin only)
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const contact = await contacts.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    // Only allow updating status and notes
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    await contact.update(updateData);
    
    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error.message
    });
  }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await contacts.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    await contact.destroy();
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};
