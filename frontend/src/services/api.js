import axios from 'axios';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

const actualApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- FULLY STATEFUL DEMO MODE --- //
let mockAttendance = {
  // Pre-seed some demo attendance so the dashboard looks cool immediately
  '2024-01-01': [
    { studentId: '1', status: 'present' },
    { studentId: '2', status: 'present' },
    { studentId: '3', status: 'absent' },
    { studentId: '4', status: 'present' },
    { studentId: '5', status: 'absent' },
  ],
  '2024-01-02': [
    { studentId: '1', status: 'present' },
    { studentId: '2', status: 'present' },
    { studentId: '3', status: 'absent' },
    { studentId: '4', status: 'absent' },
    { studentId: '5', status: 'absent' },
  ]
}; 

let mockStudents = [
  { _id: '1', name: 'Alice Smith', rollNumber: 'CS001', isActive: true },
  { _id: '2', name: 'Bob Johnson', rollNumber: 'CS002', isActive: true },
  { _id: '3', name: 'Charlie Brown', rollNumber: 'CS003', isActive: true },
  { _id: '4', name: 'Diana Prince', rollNumber: 'CS004', isActive: true },
  { _id: '5', name: 'Eve Adams', rollNumber: 'CS005', isActive: true },
];

const mockDelay = (ms) => new Promise(res => setTimeout(res, ms));

const demoApi = {
  get: async (url) => {
    await mockDelay(300);
    
    if (url === '/students') {
      return { data: mockStudents.filter(s => s.isActive !== false) };
    }
    
    if (url.startsWith('/attendance?date=')) {
      const date = url.split('=')[1];
      const records = mockAttendance[date];
      return { data: records ? [{ date, records }] : [] };
    }

    if (url === '/summary') {
      const totalClasses = Object.keys(mockAttendance).length;
      
      const stats = mockStudents.map(s => {
        let present = 0;
        let absent = 0;
        let trend = [];
        
        Object.keys(mockAttendance).sort().forEach(date => {
          const rec = mockAttendance[date].find(r => r.studentId === s._id);
          if (rec?.status === 'present') { present++; trend.push('P'); }
          if (rec?.status === 'absent') { absent++; trend.push('A'); }
        });
        
        const perc = totalClasses ? Math.round((present / totalClasses) * 100) : 0;
        return {
          student: s,
          totalPresent: present,
          totalAbsent: absent,
          trend: trend.slice(-5),
          percentage: perc
        };
      });

      stats.sort((a, b) => a.percentage - b.percentage);
      const defaulters = stats.filter(s => s.percentage < 75);

      return { data: { totalClasses, studentStats: stats, defaulters } };
    }
  },
  post: async (url, payload) => {
    await mockDelay(400);
    if (url === '/login') {
      if (payload.username === 'admin' && payload.password === 'admin123') {
        return { data: { success: true, user: { role: 'admin', name: 'Demo Teacher' } } };
      }
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials. Use admin/admin123' } } });
    }
    
    if (url === '/students') {
      const newStudent = { ...payload, _id: Date.now().toString(), isActive: true };
      mockStudents.push(newStudent);
      return { data: newStudent };
    }

    if (url === '/attendance') {
      if (mockAttendance[payload.date]) {
        return Promise.reject({ response: { status: 400, data: { message: 'Attendance already exists for this date' } } });
      }
      mockAttendance[payload.date] = payload.records;
      return { data: { message: 'Success' } };
    }
  },
  put: async (url, payload) => {
    await mockDelay(400);
    
    if (url.startsWith('/students/')) {
      const id = url.split('/').pop();
      const idx = mockStudents.findIndex(s => s._id === id);
      if (idx > -1) {
        mockStudents[idx] = { ...mockStudents[idx], ...payload };
        return { data: mockStudents[idx] };
      }
      return Promise.reject({ response: { status: 404 } });
    }

    if (url.startsWith('/attendance/')) {
      const date = url.split('/').pop();
      mockAttendance[date] = payload.records;
      return { data: { message: 'Updated' } };
    }
  },
  delete: async (url) => {
    await mockDelay(400);
    if (url.startsWith('/students/')) {
      const id = url.split('/').pop();
      const idx = mockStudents.findIndex(s => s._id === id);
      if (idx > -1) {
        mockStudents[idx].isActive = false;
        return { data: { message: 'Deleted' } };
      }
    }
  }
};

export default isDemo ? demoApi : actualApi;
