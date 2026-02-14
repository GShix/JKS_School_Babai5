const { students } = require('../database/connection');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      class: studentClass,
      section,
      rollNumber,
      admissionDate,
      previousSchool,
      bloodGroup,
      status,
      profileImage,
      previousGrade,
      previousPercentage,
      medicalInfo,
      notes,
    } = req.body;

    if (!fullName || !studentClass) {
      return res.status(400).json({ message: 'Full name and class are required' });
    }

    const newStudent = await students.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      class: studentClass,
      section,
      rollNumber,
      admissionDate,
      previousSchool,
      bloodGroup,
      status,
      profileImage,
      previousGrade,
      previousPercentage,
      medicalInfo,
      notes,
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
    const allStudents = await students.findAll({
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
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      class: studentClass,
      section,
      rollNumber,
      admissionDate,
      previousSchool,
      bloodGroup,
      status,
      profileImage,
      previousGrade,
      previousPercentage,
      medicalInfo,
      notes,
    } = req.body;

    await student.update({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      class: studentClass,
      section,
      rollNumber,
      admissionDate,
      previousSchool,
      bloodGroup,
      status,
      profileImage,
      previousGrade,
      previousPercentage,
      medicalInfo,
      notes,
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
