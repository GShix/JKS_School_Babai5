const { leaves } = require('../database/connection');

// Apply for Leave
exports.applyLeave = async (req, res) => {
  try {
    const {
      applicantType,
      applicantId,
      leaveType,
      startDate,
      endDate,
      reason
    } = req.body;

    if (!applicantType || !applicantId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = await leaves.create({
      applicantType,
      applicantId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'pending'
    });

    return res.status(201).json({ message: 'Leave application submitted successfully', data: newLeave });
  } catch (error) {
    return res.status(500).json({ message: 'Could not submit leave application', error: error.message });
  }
};

// Get Leave Applications
exports.getLeaveApplications = async (req, res) => {
  try {
    const { status, applicantType } = req.query;

    let whereClause = {};
    if (status) whereClause.status = status;
    if (applicantType) whereClause.applicantType = applicantType;

    const applications = await leaves.findAll({
      where: whereClause,
      order: [['appliedDate', 'DESC']]
    });

    return res.json({ message: 'Leave applications fetched successfully', data: applications });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch leave applications', error: error.message });
  }
};

// Get Leave by Applicant
exports.getMyLeaves = async (req, res) => {
  try {
    const { applicantType, applicantId } = req.params;

    const myLeaves = await leaves.findAll({
      where: { applicantType, applicantId },
      order: [['appliedDate', 'DESC']]
    });

    return res.json({ message: 'Leaves fetched successfully', data: myLeaves });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch leaves', error: error.message });
  }
};

// Review Leave (Approve/Reject)
exports.reviewLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewRemarks } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (approved/rejected) is required' });
    }

    const leave = await leaves.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    await leave.update({
      status,
      reviewRemarks,
      reviewedBy: req.user.id,
      reviewedDate: new Date()
    });

    return res.json({ message: `Leave ${status} successfully`, data: leave });
  } catch (error) {
    return res.status(500).json({ message: 'Could not review leave', error: error.message });
  }
};

// Delete Leave
exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await leaves.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    await leaves.destroy({ where: { id } });
    return res.json({ message: 'Leave application deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete leave', error: error.message });
  }
};
