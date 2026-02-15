const { assignments, submissions } = require('../database/connection');

// Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      class: className,
      section,
      subject,
      dueDate,
      totalMarks,
      attachments
    } = req.body;

    if (!title || !description || !className || !subject || !dueDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newAssignment = await assignments.create({
      title,
      description,
      class: className,
      section,
      subject,
      teacherId: req.user.id, // Assuming staff member creating
      dueDate,
      totalMarks: totalMarks || 100,
      attachments,
      status: 'active'
    });

    return res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create assignment', error: error.message });
  }
};

// Get Assignments
exports.getAssignments = async (req, res) => {
  try {
    const { class: className, section, subject, status } = req.query;

    let whereClause = {};
    if (className) whereClause.class = className;
    if (section) whereClause.section = section;
    if (subject) whereClause.subject = subject;
    if (status) whereClause.status = status;
    else whereClause.status = 'active';

    const allAssignments = await assignments.findAll({
      where: whereClause,
      order: [['dueDate', 'DESC']]
    });

    return res.json({ message: 'Assignments fetched successfully', data: allAssignments });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch assignments', error: error.message });
  }
};

// Get Single Assignment
exports.getSingleAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await assignments.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    return res.json({ message: 'Assignment fetched successfully', data: assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch assignment', error: error.message });
  }
};

// Update Assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, totalMarks, attachments, status } = req.body;

    const assignment = await assignments.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignment.update({
      title: title !== undefined ? title : assignment.title,
      description: description !== undefined ? description : assignment.description,
      dueDate: dueDate !== undefined ? dueDate : assignment.dueDate,
      totalMarks: totalMarks !== undefined ? totalMarks : assignment.totalMarks,
      attachments: attachments !== undefined ? attachments : assignment.attachments,
      status: status !== undefined ? status : assignment.status,
    });

    return res.json({ message: 'Assignment updated successfully', data: assignment });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update assignment', error: error.message });
  }
};

// Delete Assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await assignments.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    await assignments.destroy({ where: { id } });
    return res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete assignment', error: error.message });
  }
};

// Submit Assignment (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content, attachments } = req.body;

    const assignment = await assignments.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.status !== 'active') {
      return res.status(400).json({ message: 'Assignment is not active' });
    }

    // Check if already submitted
    const existing = await submissions.findOne({
      where: { assignmentId, studentId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Assignment already submitted. Contact teacher to resubmit.' });
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    const newSubmission = await submissions.create({
      assignmentId,
      studentId: req.user.id,
      content,
      attachments,
      status: isLate ? 'late' : 'submitted'
    });

    return res.status(201).json({ 
      message: `Assignment ${isLate ? 'submitted late' : 'submitted successfully'}`,
      data: newSubmission 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not submit assignment', error: error.message });
  }
};

// Grade Submission (Teacher/Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await submissions.findByPk(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.update({
      marksObtained,
      feedback,
      status: 'graded',
      gradedBy: req.user.id,
      gradedDate: new Date()
    });

    return res.json({ message: 'Submission graded successfully', data: submission });
  } catch (error) {
    return res.status(500).json({ message: 'Could not grade submission', error: error.message });
  }
};

// Get Submissions for Assignment
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignmentSubmissions = await submissions.findAll({
      where: { assignmentId },
      order: [['submissionDate', 'ASC']]
    });

    return res.json({ 
      message: 'Submissions fetched successfully', 
      data: assignmentSubmissions 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch submissions', error: error.message });
  }
};

// Get Student's Submissions
exports.getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const mySubmissions = await submissions.findAll({
      where: { studentId },
      order: [['submissionDate', 'DESC']]
    });

    return res.json({ message: 'Your submissions fetched successfully', data: mySubmissions });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch submissions', error: error.message });
  }
};
