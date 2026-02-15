const { attendance } = require('../database/connection');
const { Op } = require('sequelize');

// Mark Attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, class: className, section, remarks } = req.body;

    if (!studentId || !date || !status || !className) {
      return res.status(400).json({ message: 'Student ID, date, status, and class are required' });
    }

    // Check if attendance already marked
    const existing = await attendance.findOne({ 
      where: { studentId, date, class: className } 
    });

    if (existing) {
      // Update existing attendance
      await existing.update({ status, remarks, markedBy: req.user.id });
      return res.json({ message: 'Attendance updated successfully', data: existing });
    }

    const newAttendance = await attendance.create({
      studentId,
      date,
      status,
      class: className,
      section,
      remarks,
      markedBy: req.user.id
    });

    return res.status(201).json({ message: 'Attendance marked successfully', data: newAttendance });
  } catch (error) {
    return res.status(500).json({ message: 'Could not mark attendance', error: error.message });
  }
};

// Bulk Mark Attendance (for whole class)
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { date, class: className, section, attendanceRecords } = req.body;
    // attendanceRecords = [{ studentId, status, remarks }, ...]

    if (!date || !className || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: 'Date, class, and attendance records array are required' });
    }

    const results = [];
    for (const record of attendanceRecords) {
      const existing = await attendance.findOne({ 
        where: { studentId: record.studentId, date, class: className } 
      });

      if (existing) {
        await existing.update({ 
          status: record.status, 
          remarks: record.remarks,
          markedBy: req.user.id 
        });
        results.push(existing);
      } else {
        const newRecord = await attendance.create({
          studentId: record.studentId,
          date,
          status: record.status,
          class: className,
          section,
          remarks: record.remarks,
          markedBy: req.user.id
        });
        results.push(newRecord);
      }
    }

    return res.status(201).json({ 
      message: 'Bulk attendance marked successfully', 
      data: results,
      count: results.length 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not mark bulk attendance', error: error.message });
  }
};

// Get Attendance by Student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    let whereClause = { studentId };

    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [startDate, endDate] };
    } else if (month && year) {
      const start = `${year}-${month.padStart(2, '0')}-01`;
      const end = new Date(year, month, 0).toISOString().split('T')[0];
      whereClause.date = { [Op.between]: [start, end] };
    }

    const records = await attendance.findAll({
      where: whereClause,
      order: [['date', 'DESC']]
    });

    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length,
    };

    return res.json({ message: 'Attendance fetched successfully', data: records, stats });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch attendance', error: error.message });
  }
};

// Get Attendance by Class and Date
exports.getClassAttendance = async (req, res) => {
  try {
    const { date, class: className, section } = req.query;

    if (!date || !className) {
      return res.status(400).json({ message: 'Date and class are required' });
    }

    let whereClause = { date, class: className };
    if (section) whereClause.section = section;

    const records = await attendance.findAll({
      where: whereClause,
      order: [['studentId', 'ASC']]
    });

    return res.json({ message: 'Class attendance fetched successfully', data: records });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch class attendance', error: error.message });
  }
};

// Delete Attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await attendance.findByPk(id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.destroy({ where: { id } });
    return res.json({ message: 'Attendance deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete attendance', error: error.message });
  }
};
