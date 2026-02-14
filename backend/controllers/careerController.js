const db = require('../database/connection');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const CareerPosition = db.careerPositions;
const JobApplication = db.jobApplications;

// ==================== CAREER POSITIONS ====================

// Get all active career positions (Public)
exports.getActivePositions = async (req, res) => {
  try {
    const positions = await CareerPosition.findAll({
      where: {
        status: 'active',
        [Op.or]: [
          { applicationDeadline: null },
          { applicationDeadline: { [Op.gte]: new Date() } }
        ]
      },
      order: [['postedDate', 'DESC'], ['createdAt', 'DESC']],
      attributes: { exclude: ['createdBy'] }
    });

    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    console.error('Error fetching active positions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching career positions',
      error: error.message 
    });
  }
};

// Get all career positions (Admin)
exports.getAllPositions = async (req, res) => {
  try {
    const { status, department, type } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (department) whereClause.department = department;
    if (type) whereClause.type = type;

    const positions = await CareerPosition.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching career positions',
      error: error.message 
    });
  }
};

// Get single position by ID (Public)
exports.getPositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await CareerPosition.findByPk(id);

    if (!position) {
      return res.status(404).json({ 
        success: false,
        message: 'Position not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Error fetching position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching position',
      error: error.message 
    });
  }
};

// Create career position (Admin)
exports.createPosition = async (req, res) => {
  try {
    const {
      title,
      department,
      type,
      location,
      description,
      requirements,
      responsibilities,
      salaryRange,
      vacancies,
      applicationDeadline,
      status,
      postedDate
    } = req.body;

    if (!title || !department || !description) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        success: false,
        message: 'Title, department, and description are required' 
      });
    }

    const positionData = {
      title: title.trim(),
      department: department.trim(),
      type: type || 'Full-time',
      location: location || 'Padampur, Dang',
      description: description.trim(),
      requirements: requirements?.trim(),
      responsibilities: responsibilities?.trim(),
      salaryRange: salaryRange?.trim(),
      vacancies: vacancies || 1,
      applicationDeadline: applicationDeadline || null,
      status: status || 'active',
      postedDate: postedDate || new Date(),
      createdBy: req.adminId || null
    };

    // Handle uploaded notice file
    if (req.file) {
      positionData.noticeFileName = req.file.originalname;
      positionData.noticeFileUrl = `/uploads/career/notices/${req.file.filename}`;
    }

    const position = await CareerPosition.create(positionData);

    res.status(201).json({
      success: true,
      message: 'Career position created successfully',
      data: position
    });
  } catch (error) {
    console.error('Error creating position:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ 
      success: false,
      message: 'Error creating career position',
      error: error.message 
    });
  }
};

// Update career position (Admin)
exports.updatePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await CareerPosition.findByPk(id);

    if (!position) {
      // Clean up uploaded file if position not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ 
        success: false,
        message: 'Position not found' 
      });
    }

    const {
      title,
      department,
      type,
      location,
      description,
      requirements,
      responsibilities,
      salaryRange,
      vacancies,
      applicationDeadline,
      status
    } = req.body;

    const updateData = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (type !== undefined) updateData.type = type;
    if (location !== undefined) updateData.location = location.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (requirements !== undefined) updateData.requirements = requirements.trim();
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities.trim();
    if (salaryRange !== undefined) updateData.salaryRange = salaryRange.trim();
    if (vacancies !== undefined) updateData.vacancies = vacancies;
    if (applicationDeadline !== undefined) updateData.applicationDeadline = applicationDeadline;
    if (status !== undefined) updateData.status = status;

    // Handle new uploaded notice file
    if (req.file) {
      // Delete old file if exists
      if (position.noticeFileUrl) {
        const oldFilePath = path.join(__dirname, '..', position.noticeFileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.noticeFileName = req.file.originalname;
      updateData.noticeFileUrl = `/uploads/career/notices/${req.file.filename}`;
    }

    await position.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Career position updated successfully',
      data: position
    });
  } catch (error) {
    console.error('Error updating position:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ 
      success: false,
      message: 'Error updating career position',
      error: error.message 
    });
  }
};

// Delete career position (Admin)
exports.deletePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const position = await CareerPosition.findByPk(id);

    if (!position) {
      return res.status(404).json({ 
        success: false,
        message: 'Position not found' 
      });
    }

    // Delete associated notice file
    if (position.noticeFileUrl) {
      const filePath = path.join(__dirname, '..', position.noticeFileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await position.destroy();

    res.status(200).json({
      success: true,
      message: 'Career position deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting position:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting career position',
      error: error.message 
    });
  }
};

// ==================== JOB APPLICATIONS ====================

// Submit job application (Public)
exports.submitApplication = async (req, res) => {
  try {
    const { positionId, applicantName, email, phone, coverLetter } = req.body;

    if (!positionId || !applicantName || !email || !phone) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        success: false,
        message: 'Position ID, name, email, and phone are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Resume file is required' 
      });
    }

    // Check if position exists and is active
    const position = await CareerPosition.findByPk(positionId);
    if (!position) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        message: 'Career position not found' 
      });
    }

    if (position.status !== 'active') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        message: 'This position is no longer accepting applications' 
      });
    }

    // Check if deadline has passed
    if (position.applicationDeadline && new Date(position.applicationDeadline) < new Date()) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false,
        message: 'Application deadline has passed' 
      });
    }

    const applicationData = {
      positionId,
      positionTitle: position.title,
      applicantName: applicantName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      coverLetter: coverLetter?.trim() || null,
      resumeFileName: req.file.originalname,
      resumeFileUrl: `/uploads/career/resumes/${req.file.filename}`,
      status: 'pending'
    };

    const application = await JobApplication.create(applicationData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. We will contact you if you are shortlisted.',
      data: application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(500).json({ 
      success: false,
      message: 'Error submitting application',
      error: error.message 
    });
  }
};

// Get all applications (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { positionId, status } = req.query;
    const whereClause = {};

    if (positionId) whereClause.positionId = positionId;
    if (status) whereClause.status = status;

    const applications = await JobApplication.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching applications',
      error: error.message 
    });
  }
};

// Get single application by ID (Admin)
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching application',
      error: error.message 
    });
  }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    if (status && status !== 'pending') {
      updateData.reviewedBy = req.adminId || null;
      updateData.reviewedAt = new Date();
    }

    await application.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating application',
      error: error.message 
    });
  }
};

// Delete application (Admin)
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    // Delete associated resume file
    if (application.resumeFileUrl) {
      const filePath = path.join(__dirname, '..', application.resumeFileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await application.destroy();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting application',
      error: error.message 
    });
  }
};
