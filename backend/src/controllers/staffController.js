const { staff } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      position,
      department,
      employeeId,
      joiningDate,
      qualification,
      experience,
      salary,
      bloodGroup,
      status,
      emergencyContactName,
      emergencyContactPhone,
      subjects,
      notes,
    } = req.body;

    if (!fullName || !email || !phone || !position || !department) {
      return res.status(400).json({ 
        message: 'Full name, email, phone, position, and department are required' 
      });
    }

    let profileImageUrl = null;

    // Handle file upload if present
    if (req.file) {
      try {
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'staff-images',
          req.file.mimetype
        );
        profileImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          message: 'Error uploading staff image',
          error: uploadError.message,
        });
      }
    }

    const newStaff = await staff.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      position,
      department,
      employeeId,
      joiningDate,
      qualification,
      experience,
      salary,
      bloodGroup,
      status: status || 'active',
      profileImage: profileImageUrl,
      emergencyContactName,
      emergencyContactPhone,
      subjects,
      notes,
    });

    res.status(201).json({
      message: 'Staff member created successfully',
      data: newStaff,
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({
      message: 'Error creating staff member',
      error: error.message,
    });
  }
};

// Fetch all staff
exports.fetchStaff = async (req, res) => {
  try {
    const allStaff = await staff.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({
      message: 'Staff fetched successfully',
      data: allStaff,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching staff',
      error: error.message,
    });
  }
};

// Fetch a single staff member by ID
exports.fetchSingleStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await staff.findByPk(id);
    if (staffMember) {
      res.json({
        message: 'Staff details',
        data: staffMember,
      });
    } else {
      res.status(404).json({
        message: 'Staff member not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching staff member',
      error: error.message,
    });
  }
};

// Update a staff member
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await staff.findByPk(id);
    if (!staffMember) {
      return res.status(404).json({
        message: 'Staff member not found',
      });
    }

    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      position,
      department,
      employeeId,
      joiningDate,
      qualification,
      experience,
      salary,
      bloodGroup,
      status,
      emergencyContactName,
      emergencyContactPhone,
      subjects,
      notes,
    } = req.body;

    let profileImageUrl = staffMember.profileImage; // Keep existing image by default

    // Handle new file upload if present
    if (req.file) {
      try {
        // Delete old image if exists
        if (staffMember.profileImage) {
          await deleteFromSupabase(staffMember.profileImage, 'staff-images');
        }

        // Upload new image
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'staff-images',
          req.file.mimetype
        );
        profileImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          message: 'Error uploading staff image',
          error: uploadError.message,
        });
      }
    }

    await staffMember.update({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      position,
      department,
      employeeId,
      joiningDate,
      qualification,
      experience,
      salary,
      bloodGroup,
      status,
      profileImage: profileImageUrl,
      emergencyContactName,
      emergencyContactPhone,
      subjects,
      notes,
    });

    res.json({
      message: 'Staff member updated successfully',
      data: staffMember,
    });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({
      message: 'Error updating staff member',
      error: error.message,
    });
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const staffMember = await staff.findByPk(id);
    if (staffMember) {
      // Delete profile image from Supabase if exists
      if (staffMember.profileImage) {
        await deleteFromSupabase(staffMember.profileImage, 'staff-images');
      }

      await staff.destroy({ where: { id } });
      res.json({
        message: 'Staff member deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Staff member not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting staff member',
      error: error.message,
    });
  }
};

// Get staff by department
exports.fetchStaffByDepartment = async (req, res) => {
  const { department } = req.params;
  try {
    const deptStaff = await staff.findAll({
      where: { department },
      order: [['fullName', 'ASC']],
    });
    res.json({
      message: `Staff in ${department} department`,
      data: deptStaff,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching staff by department',
      error: error.message,
    });
  }
};

// Get staff by status
exports.fetchStaffByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const statusStaff = await staff.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      message: `Staff with status: ${status}`,
      data: statusStaff,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching staff by status',
      error: error.message,
    });
  }
};
