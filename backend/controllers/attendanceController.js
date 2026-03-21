const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Helper to normalize date to midnight
const normalizeDate = (dateString) => {
  const date = new Date(dateString);
  date.setUTCHours(0, 0, 0, 0); // use UTC to avoid timezone shifts causing DB duplicate days
  return date;
};

// @desc    Mark attendance for a specific date
// @route   POST /api/attendance
// @access  Public
exports.markAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Please provide date and valid records array' });
    }

    const normalizedDate = normalizeDate(date);

    // Check if attendance already exists for this date
    const existing = await Attendance.findOne({ date: normalizedDate });
    if (existing) {
      return res.status(400).json({ 
        message: 'Attendance already exists for this date', 
        existingId: existing._id 
      });
    }

    const attendance = new Attendance({
      date: normalizedDate,
      records
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    console.error('Error marking attendance:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already exists for this date (duplicate key)' });
    }
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

// @desc    Update attendance for a specific date
// @route   PUT /api/attendance/:dateStr
// @access  Public
exports.updateAttendance = async (req, res) => {
  try {
    const { dateStr } = req.params;
    const { records } = req.body;

    const normalizedDate = normalizeDate(dateStr);
    
    let attendance = await Attendance.findOne({ date: normalizedDate });
    if (!attendance) {
      return res.status(404).json({ message: 'No attendance record found for this date to update' });
    }

    attendance.records = records;
    await attendance.save();
    
    res.status(200).json({ message: 'Attendance updated successfully', attendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error updating attendance' });
  }
};

// @desc    Get all attendance dates & records (supports date query)
// @route   GET /api/attendance
// @access  Public
exports.getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (date) {
      const normalizedDate = normalizeDate(date);
      const record = await Attendance.findOne({ date: normalizedDate }).populate('records.studentId', 'name rollNumber');
      return res.status(200).json(record ? [record] : []);
    }
    
    const records = await Attendance.find({}).sort({ date: -1 }).populate('records.studentId', 'name rollNumber');
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};

// @desc    Get summary stats (Total classes, percentage per student, trend)
// @route   GET /api/summary
// @access  Public
exports.getSummary = async (req, res) => {
  try {
    // 1. Get total classes
    const totalClasses = await Attendance.countDocuments();
    
    // 2. Fetch all students to build initial map
    const students = await Student.find({}).sort({ rollNumber: 1 });
    const statsMap = {};
    
    students.forEach(s => {
      statsMap[s._id.toString()] = {
        student: { _id: s._id, name: s.name, rollNumber: s.rollNumber },
        totalPresent: 0,
        totalAbsent: 0,
        percentage: 0,
        trend: [] // will hold 'P' or 'A' for all classes
      };
    });

    if (totalClasses === 0) {
      return res.status(200).json({
        totalClasses: 0,
        studentStats: Object.values(statsMap),
        defaulters: []
      });
    }

    // 3. Process all attendance records (sorted oldest to newest to build trend correctly)
    const allAttendance = await Attendance.find({}).sort({ date: 1 });
    
    allAttendance.forEach(att => {
      att.records.forEach(record => {
        const sId = record.studentId.toString();
        if (statsMap[sId]) {
          if (record.status === 'present') {
             statsMap[sId].totalPresent += 1;
             statsMap[sId].trend.push('P');
          } else if (record.status === 'absent') {
             statsMap[sId].totalAbsent += 1;
             statsMap[sId].trend.push('A');
          }
        }
      });
    });

    // 4. Calculate percentage, format trend to last 5, sort and find defaulters
    let studentListArray = Object.values(statsMap).map(stat => {
      // Calculate percentage
      const totalAttended = stat.totalPresent + stat.totalAbsent;
      stat.percentage = totalClasses > 0 && totalAttended > 0 
        ? Math.round((stat.totalPresent / totalClasses) * 100) 
        : 0;
      
      // Full history is retained
      return stat;
    });

    // Sort by lowest attendance percentage first (worst at top)
    studentListArray.sort((a, b) => a.percentage - b.percentage);

    const defaulters = studentListArray.filter(s => s.percentage < 75);

    res.status(200).json({
      totalClasses,
      studentStats: studentListArray,
      defaulters
    });

  } catch (error) {
    console.error('Error computing summary:', error);
    res.status(500).json({ message: 'Server error computing summary' });
  }
};

// @desc    Get attendance history for a specific student
// @route   GET /api/students/:id/attendance
// @access  Public
exports.getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get total classes
    const totalClasses = await Attendance.countDocuments();

    // Find all attendance records containing this student, sorted by date
    const allAttendance = await Attendance.find({
      'records.studentId': id
    }).sort({ date: 1 });

    let totalPresent = 0;
    let totalAbsent = 0;

    const history = allAttendance.map(att => {
      const record = att.records.find(r => r.studentId.toString() === id);
      const status = record ? record.status : 'absent';
      if (status === 'present') totalPresent++;
      else totalAbsent++;

      return {
        date: att.date,
        status
      };
    });

    const percentage = totalClasses > 0 
      ? Math.round((totalPresent / totalClasses) * 100) 
      : 0;

    res.status(200).json({
      student: { _id: student._id, name: student.name, rollNumber: student.rollNumber },
      totalClasses,
      totalPresent,
      totalAbsent,
      percentage,
      history
    });

  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Server error fetching student attendance' });
  }
};
