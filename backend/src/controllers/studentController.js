const { students } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const {
      // Basic Information
      nationalIdNumber,
      firstName,
      middleName,
      lastName,
      iemisId,
      email,
      phone,
      contactNumber,
      dateOfBirth,
      gender,
      isForeignStudent,
      
      // Permanent Address
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      
      // Temporary Address
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      sameAsPermAddress,
      
      // Family Information
      fatherName,
      motherName,
      guardianName,
      guardianPhone,
      guardianContactNo,
      guardianEmail,
      
      // Academic Information
      class: studentClass,
      section,
      rollNumber,
      admitYear,
      admissionDate,
      previousSchool,
      previousGrade,
      previousPercentage,
      subject,
      
      // Personal Details
      caste,
      motherTongue,
      disabilityType,
      bloodGroup,
      
      // School Information
      schoolingSource,
      scholarship,
      
      // Status and Other
      status,
      profileImage,
      photo,
      medicalInfo,
      notes,
      
      // Legacy field
      address,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !studentClass) {
      return res.status(400).json({ 
        message: 'First name, last name, and class are required' 
      });
    }

    // Build full name
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    // Handle photo upload to Supabase if file is provided
    let photoUrl = null;
    if (req.file) {
      try {
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'student-images', // Supabase bucket for student photos
          req.file.mimetype
        );
        photoUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading student photo:', uploadError);
        // Continue without photo rather than failing the whole operation
      }
    }

    const newStudent = await students.create({
      nationalIdNumber,
      firstName,
      middleName,
      lastName,
      fullName,
      iemisId,
      email,
      phone,
      contactNumber,
      dateOfBirth,
      gender,
      isForeignStudent: isForeignStudent || false,
      
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      sameAsPermAddress: sameAsPermAddress || false,
      
      fatherName,
      motherName,
      guardianName,
      guardianPhone,
      guardianContactNo,
      guardianEmail,
      
      class: studentClass,
      section,
      rollNumber,
      admitYear,
      admissionDate,
      previousSchool,
      previousGrade,
      previousPercentage,
      subject,
      
      caste,
      motherTongue,
      disabilityType,
      bloodGroup,
      
      schoolingSource,
      scholarship,
      
      status: status || 'active',
      profileImage,
      photo: photoUrl || photo, // Use uploaded photo URL or provided photo URL
      medicalInfo,
      notes,
      address,
    });

    res.status(201).json({
      message: 'Student created successfully',
      data: newStudent,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      message: 'Error creating student',
      error: error.message,
    });
  }
};

// Fetch all students
exports.fetchStudents = async (req, res) => {
  try {
    const { class: className, section, search, status } = req.query;
    const whereClause = {};

    // Filter by class if provided
    if (className) {
      whereClause.class = className;
    }

    // Filter by section if provided
    if (section) {
      whereClause.section = section;
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status;
    }

    // Search by name or roll number if provided
    if (search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { rollNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const allStudents = await students.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    
    res.json({
      message: 'Students fetched successfully',
      data: allStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students',
      error: error.message,
    });
  }
};

// Fetch a single student by ID
exports.fetchSingleStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await students.findByPk(id);
    if (student) {
      res.json({
        message: 'Student details',
        data: student,
      });
    } else {
      res.status(404).json({
        message: 'Student not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching student',
      error: error.message,
    });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await students.findByPk(id);
    if (!student) {
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    const {
      // Basic Information
      nationalIdNumber,
      firstName,
      middleName,
      lastName,
      iemisId,
      email,
      phone,
      contactNumber,
      dateOfBirth,
      gender,
      isForeignStudent,
      
      // Permanent Address
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      
      // Temporary Address
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      sameAsPermAddress,
      
      // Family Information
      fatherName,
      motherName,
      guardianName,
      guardianPhone,
      guardianContactNo,
      guardianEmail,
      
      // Academic Information
      class: studentClass,
      section,
      rollNumber,
      admitYear,
      admissionDate,
      previousSchool,
      previousGrade,
      previousPercentage,
      subject,
      
      // Personal Details
      caste,
      motherTongue,
      disabilityType,
      bloodGroup,
      
      // School Information
      schoolingSource,
      scholarship,
      
      // Status and Other
      status,
      profileImage,
      photo,
      medicalInfo,
      notes,
      
      // Legacy field
      address,
    } = req.body;

    // Build full name if name fields are provided
    let fullName = student.fullName;
    if (firstName || lastName) {
      fullName = [
        firstName || student.firstName, 
        middleName, 
        lastName || student.lastName
      ].filter(Boolean).join(' ');
    }

    // Handle photo upload to Supabase if new file is provided
    let photoUrl = photo; // Use provided photo URL by default
    if (req.file) {
      try {
        // Delete old photo if exists
        if (student.photo) {
          await deleteFromSupabase(student.photo, 'student-images');
        }
        
        // Upload new photo
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'student-images',
          req.file.mimetype
        );
        photoUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading student photo:', uploadError);
        // Keep existing photo if upload fails
        photoUrl = student.photo;
      }
    }

    await student.update({
      nationalIdNumber,
      firstName,
      middleName,
      lastName,
      fullName,
      iemisId,
      email,
      phone,
      contactNumber,
      dateOfBirth,
      gender,
      isForeignStudent,
      
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      sameAsPermAddress,
      
      fatherName,
      motherName,
      guardianName,
      guardianPhone,
      guardianContactNo,
      guardianEmail,
      
      class: studentClass,
      section,
      rollNumber,
      admitYear,
      admissionDate,
      previousSchool,
      previousGrade,
      previousPercentage,
      subject,
      
      caste,
      motherTongue,
      disabilityType,
      bloodGroup,
      
      schoolingSource,
      scholarship,
      
      status,
      profileImage,
      photo: photoUrl,
      medicalInfo,
      notes,
      address,
    });

    res.json({
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      message: 'Error updating student',
      error: error.message,
    });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await students.findByPk(id);
    if (student) {
      await students.destroy({ where: { id } });
      res.json({
        message: 'Student deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Student not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting student',
      error: error.message,
    });
  }
};

// Get students by class
exports.fetchStudentsByClass = async (req, res) => {
  const { className } = req.params;
  try {
    const classStudents = await students.findAll({
      where: { class: className },
      order: [['rollNumber', 'ASC']],
    });
    res.json({
      message: `Students in class ${className}`,
      data: classStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students by class',
      error: error.message,
    });
  }
};

// Get students by status
exports.fetchStudentsByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const statusStudents = await students.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      message: `Students with status: ${status}`,
      data: statusStudents,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students by status',
      error: error.message,
    });
  }
};
