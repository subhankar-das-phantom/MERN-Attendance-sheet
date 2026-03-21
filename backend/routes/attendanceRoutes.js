const express = require('express');
const router = express.Router();
const { markAttendance, updateAttendance, getAllAttendance, getSummary, getStudentAttendance } = require('../controllers/attendanceController');

router.post('/attendance', markAttendance);
router.put('/attendance/:dateStr', updateAttendance);
router.get('/attendance', getAllAttendance);
router.get('/summary', getSummary);
router.get('/students/:id/attendance', getStudentAttendance);

module.exports = router;
