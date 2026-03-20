const mongoose = require('mongoose');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
require('dotenv').config();

const connectDB = require('./config/db');

const initialStudents = [
  { name: 'Alice Smith', rollNumber: 'CS001' },
  { name: 'Bob Johnson', rollNumber: 'CS002' },
  { name: 'Charlie Brown', rollNumber: 'CS003' },
  { name: 'Diana Prince', rollNumber: 'CS004' },
  { name: 'Eve Adams', rollNumber: 'CS005' },
  { name: 'Frank Castle', rollNumber: 'CS006' },
  { name: 'Grace Hopper', rollNumber: 'CS007' },
  { name: 'Hank Pym', rollNumber: 'CS008' },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await Student.deleteMany();
    await Attendance.deleteMany();

    console.log('Inserting students...');
    await Student.insertMany(initialStudents);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data seed', error);
    process.exit(1);
  }
};

seedDatabase();
