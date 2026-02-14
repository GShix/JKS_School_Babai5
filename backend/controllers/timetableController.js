const { timetables } = require('../database/connection');

// Create Timetable Entry
exports.createTimetable = async (req, res) => {
  try {
    const {
      class: className,
      section,
      day,
      subject,
      teacher,
      teacherId,
      startTime,
      endTime,
      room,
      academicYear
    } = req.body;

    if (!className || !day || !subject || !startTime || !endTime || !academicYear) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newTimetable = await timetables.create({
      class: className,
      section,
      day,
      subject,
      teacher,
      teacherId,
      startTime,
      endTime,
      room,
      academicYear,
      status: 'active'
    });

    return res.status(201).json({ message: 'Timetable created successfully', data: newTimetable });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create timetable', error: error.message });
  }
};

// Get Timetable by Class
exports.getClassTimetable = async (req, res) => {
  try {
    const { class: className, section, academicYear, day } = req.query;

    if (!className) {
      return res.status(400).json({ message: 'Class is required' });
    }

    let whereClause = { class: className, status: 'active' };
    if (section) whereClause.section = section;
    if (academicYear) whereClause.academicYear = academicYear;
    if (day) whereClause.day = day;

    const classTimetable = await timetables.findAll({
      where: whereClause,
      order: [['day', 'ASC'], ['startTime', 'ASC']]
    });

    return res.json({ message: 'Timetable fetched successfully', data: classTimetable });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch timetable', error: error.message });
  }
};

// Get Timetable by Teacher
exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { academicYear, day } = req.query;

    let whereClause = { teacherId, status: 'active' };
    if (academicYear) whereClause.academicYear = academicYear;
    if (day) whereClause.day = day;

    const teacherTimetable = await timetables.findAll({
      where: whereClause,
      order: [['day', 'ASC'], ['startTime', 'ASC']]
    });

    return res.json({ message: 'Teacher timetable fetched successfully', data: teacherTimetable });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch teacher timetable', error: error.message });
  }
};

// Update Timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject,
      teacher,
      teacherId,
      startTime,
      endTime,
      room,
      status
    } = req.body;

    const timetable = await timetables.findByPk(id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    await timetable.update({
      subject: subject !== undefined ? subject : timetable.subject,
      teacher: teacher !== undefined ? teacher : timetable.teacher,
      teacherId: teacherId !== undefined ? teacherId : timetable.teacherId,
      startTime: startTime !== undefined ? startTime : timetable.startTime,
      endTime: endTime !== undefined ? endTime : timetable.endTime,
      room: room !== undefined ? room : timetable.room,
      status: status !== undefined ? status : timetable.status,
    });

    return res.json({ message: 'Timetable updated successfully', data: timetable });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update timetable', error: error.message });
  }
};

// Delete Timetable
exports.deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await timetables.findByPk(id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    await timetables.destroy({ where: { id } });
    return res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete timetable', error: error.message });
  }
};
