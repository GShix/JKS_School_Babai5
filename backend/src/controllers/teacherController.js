const { teacher } = require('../database/connection');
const { uploadToSupabase, deleteFromSupabase } = require('../config/supabase');

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      nin,
      dateOfBirth,
      gender,
      citizenship,
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      fatherName,
      motherName,
      spouseName,
      willPerson,
      caste,
      motherTongue,
      disability,
      mobile,
      email,
      pan,
      bankName,
      bankAccount,
      employeeId,
      department,
      subjects,
      teachingLicense,
      joiningDate,
      qualification,
      experience,
      bloodGroup,
      karmachariSanachayakosh,
      sabadhikBimaKosh,
      ssf,
      nagarikLaganiKosh,
      status,
      notes,
    } = req.body;

    if (!firstName || !lastName || !email || !mobile) {
      return res.status(400).json({ 
        message: 'First name, last name, email, and mobile are required' 
      });
    }

    let profileImageUrl = null;

    // Handle file upload if present
    if (req.file) {
      try {
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'teacher-images',
          req.file.mimetype
        );
        profileImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          message: 'Error uploading teacher image',
          error: uploadError.message,
        });
      }
    }

    const newTeacher = await teacher.create({
      firstName,
      middleName,
      lastName,
      nin,
      dateOfBirth,
      gender,
      citizenship,
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      fatherName,
      motherName,
      spouseName,
      willPerson,
      caste,
      motherTongue,
      disability,
      mobile,
      email,
      pan,
      bankName,
      bankAccount,
      employeeId,
      department: department || 'Teaching',
      subjects,
      teachingLicense,
      joiningDate,
      qualification,
      experience,
      bloodGroup,
      karmachariSanachayakosh,
      sabadhikBimaKosh,
      ssf,
      nagarikLaganiKosh,
      status: status || 'active',
      profileImage: profileImageUrl,
      notes,
    });

    res.status(201).json({
      message: 'Teacher created successfully',
      data: newTeacher,
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({
      message: 'Error creating teacher',
      error: error.message,
    });
  }
};

// Fetch all teachers
exports.fetchTeachers = async (req, res) => {
  try {
    const allTeachers = await teacher.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({
      message: 'Teachers fetched successfully',
      data: allTeachers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching teachers',
      error: error.message,
    });
  }
};

// Fetch a single teacher by ID
exports.fetchSingleTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacherData = await teacher.findByPk(id);
    if (teacherData) {
      res.json({
        message: 'Teacher details',
        data: teacherData,
      });
    } else {
      res.status(404).json({
        message: 'Teacher not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching teacher',
      error: error.message,
    });
  }
};

// Update a teacher
exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacherData = await teacher.findByPk(id);
    if (!teacherData) {
      return res.status(404).json({
        message: 'Teacher not found',
      });
    }

    const {
      firstName,
      middleName,
      lastName,
      nin,
      dateOfBirth,
      gender,
      citizenship,
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      fatherName,
      motherName,
      spouseName,
      willPerson,
      caste,
      motherTongue,
      disability,
      mobile,
      email,
      pan,
      bankName,
      bankAccount,
      employeeId,
      department,
      subjects,
      teachingLicense,
      joiningDate,
      qualification,
      experience,
      bloodGroup,
      karmachariSanachayakosh,
      sabadhikBimaKosh,
      ssf,
      nagarikLaganiKosh,
      status,
      notes,
    } = req.body;

    let profileImageUrl = teacherData.profileImage; // Keep existing image by default

    // Handle new file upload if present
    if (req.file) {
      try {
        // Delete old image if exists
        if (teacherData.profileImage) {
          await deleteFromSupabase(teacherData.profileImage, 'teacher-images');
        }

        // Upload new image
        const uploadResult = await uploadToSupabase(
          req.file.buffer,
          req.file.originalname,
          'teacher-images',
          req.file.mimetype
        );
        profileImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return res.status(500).json({
          message: 'Error uploading teacher image',
          error: uploadError.message,
        });
      }
    }

    await teacherData.update({
      firstName,
      middleName,
      lastName,
      nin,
      dateOfBirth,
      gender,
      citizenship,
      permanentProvince,
      permanentDistrict,
      permanentMunicipality,
      permanentWard,
      temporaryProvince,
      temporaryDistrict,
      temporaryMunicipality,
      temporaryWard,
      fatherName,
      motherName,
      spouseName,
      willPerson,
      caste,
      motherTongue,
      disability,
      mobile,
      email,
      pan,
      bankName,
      bankAccount,
      employeeId,
      department,
      subjects,
      teachingLicense,
      joiningDate,
      qualification,
      experience,
      bloodGroup,
      karmachariSanachayakosh,
      sabadhikBimaKosh,
      ssf,
      nagarikLaganiKosh,
      status,
      profileImage: profileImageUrl,
      notes,
    });

    res.json({
      message: 'Teacher updated successfully',
      data: teacherData,
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({
      message: 'Error updating teacher',
      error: error.message,
    });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacherData = await teacher.findByPk(id);
    if (teacherData) {
      // Delete profile image from Supabase if exists
      if (teacherData.profileImage) {
        await deleteFromSupabase(teacherData.profileImage, 'teacher-images');
      }

      await teacher.destroy({ where: { id } });
      res.json({
        message: 'Teacher deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Teacher not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting teacher',
      error: error.message,
    });
  }
};

// Get teachers by department
exports.fetchTeachersByDepartment = async (req, res) => {
  const { department } = req.params;
  try {
    const deptTeachers = await teacher.findAll({
      where: { department },
      order: [['firstName', 'ASC'], ['lastName', 'ASC']],
    });
    res.json({
      message: `Teachers in ${department} department`,
      data: deptTeachers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching teachers by department',
      error: error.message,
    });
  }
};

// Get teachers by status
exports.fetchTeachersByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const statusTeachers = await teacher.findAll({
      where: { status },
      order: [['createdAt', 'DESC']],
    });
    res.json({
      message: `Teachers with status: ${status}`,
      data: statusTeachers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching teachers by status',
      error: error.message,
    });
  }
};
