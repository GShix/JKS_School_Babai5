const { grades } = require('../database/connection');
const { Op } = require('sequelize');

// Add Grade
exports.addGrade = async (req, res) => {
  try {
    const {
      studentId,
      subject,
      examType,
      marksObtained,
      totalMarks,
      class: className,
      section,
      academicYear,
      remarks
    } = req.body;

    if (!studentId || !subject || !examType || marksObtained === undefined || !totalMarks || !className || !academicYear) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const percentage = ((marksObtained / totalMarks) * 100).toFixed(2);
    let grade = 'F';
    
    // Grade calculation
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C+';
    else if (percentage >= 40) grade = 'C';
    else if (percentage >= 32) grade = 'D';

    const newGrade = await grades.create({
      studentId,
      subject,
      examType,
      marksObtained,
      totalMarks,
      percentage,
      grade,
      class: className,
      section,
      academicYear,
      remarks,
      enteredBy: req.user.id
    });

    return res.status(201).json({ message: 'Grade added successfully', data: newGrade });
  } catch (error) {
    return res.status(500).json({ message: 'Could not add grade', error: error.message });
  }
};

// Get Student Grades
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { examType, academicYear, subject } = req.query;

    let whereClause = { studentId };
    if (examType) whereClause.examType = examType;
    if (academicYear) whereClause.academicYear = academicYear;
    if (subject) whereClause.subject = subject;

    const studentGrades = await grades.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ message: 'Grades fetched successfully', data: studentGrades });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch grades', error: error.message });
  }
};

// Get Class Grades
exports.getClassGrades = async (req, res) => {
  try {
    const { class: className, section, examType, academicYear, subject } = req.query;

    if (!className) {
      return res.status(400).json({ message: 'Class is required' });
    }

    let whereClause = { class: className };
    if (section) whereClause.section = section;
    if (examType) whereClause.examType = examType;
    if (academicYear) whereClause.academicYear = academicYear;
    if (subject) whereClause.subject = subject;

    const classGrades = await grades.findAll({
      where: whereClause,
      order: [['studentId', 'ASC'], ['subject', 'ASC']]
    });

    return res.json({ message: 'Class grades fetched successfully', data: classGrades });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch class grades', error: error.message });
  }
};

// Update Grade
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, totalMarks, remarks } = req.body;

    const gradeRecord = await grades.findByPk(id);
    if (!gradeRecord) {
      return res.status(404).json({ message: 'Grade record not found' });
    }

    const marks = marksObtained !== undefined ? marksObtained : gradeRecord.marksObtained;
    const total = totalMarks !== undefined ? totalMarks : gradeRecord.totalMarks;
    const percentage = ((marks / total) * 100).toFixed(2);
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C+';
    else if (percentage >= 40) grade = 'C';
    else if (percentage >= 32) grade = 'D';

    await gradeRecord.update({
      marksObtained: marks,
      totalMarks: total,
      percentage,
      grade,
      remarks: remarks !== undefined ? remarks : gradeRecord.remarks
    });

    return res.json({ message: 'Grade updated successfully', data: gradeRecord });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update grade', error: error.message });
  }
};

// Delete Grade
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const gradeRecord = await grades.findByPk(id);
    if (!gradeRecord) {
      return res.status(404).json({ message: 'Grade record not found' });
    }

    await grades.destroy({ where: { id } });
    return res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete grade', error: error.message });
  }
};
