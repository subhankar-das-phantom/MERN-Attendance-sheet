const Student = require('../models/Student');

// @desc    Get all active students
// @route   GET /api/students
// @access  Public
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).sort({ rollNumber: 1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Public
exports.createStudent = async (req, res) => {
  try {
    const { name, rollNumber } = req.body;
    if (!name || !rollNumber) return res.status(400).json({ message: 'Name and roll number are required' });

    const exists = await Student.findOne({ rollNumber });
    if (exists) return res.status(400).json({ message: 'Student with this roll number already exists' });

    const student = new Student({ name, rollNumber });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Server error creating student' });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Public
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (name) student.name = name;
    if (rollNumber) student.rollNumber = rollNumber;

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error updating student' });
  }
};

// @desc    Soft delete student
// @route   DELETE /api/students/:id
// @access  Public
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.isActive = false;
    await student.save();
    
    res.status(200).json({ message: 'Student deactivated safely' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student' });
  }
};
