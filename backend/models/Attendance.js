const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true,
  }
});

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  records: [attendanceRecordSchema],
}, { timestamps: true });

// Crucial: unique index ensures no duplicate dates exist
attendanceSchema.index({ date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
