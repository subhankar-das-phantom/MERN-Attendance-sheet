# Attendify: Modern Attendance Management System

Attendify is a professional, full-stack MERN application designed for high-efficiency attendance tracking. It features a stunning dark-mode UI, real-time analytics, and robust student management.

## ✨ Key Features

- **🎯 Date-Centric Attendance**: Tracking is strictly organized by class date with normalized constraints (one record per day).
- **📝 Intelligent Editing**: Full support for updating historical records with smart "Up to Date" button states and overwrite confirmation modals.
- **👨‍🎓 Student Lifecycle (CRUD)**: Easily add, edit, or remove students. Implements **Soft Delete** logic to preserve historical attendance data integrity.
- **📊 Real-time Dashboard**: 
    - **KPIs**: Total Classes Conducted, Registered Students, and Average Attendance.
    - **Defaulter Tracking**: Automatically flags and sorts students with < 75% attendance.
    - **Visual Trends**: Quick-view "Last 5 Classes" status indicator for every student.
- **🎨 Premium Dark Mode UI**: A bespoke Slate & Emerald theme featuring floating cards, glassmorphism effects, and dynamic avatars that shift color based on attendance status.
- **📱 Fully Responsive**: Custom-built mobile navigation menu for managing classrooms on the go.
- **🚀 Demo Mode**: Test the entire frontend experience instantly without a database connection.

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Deployment**: Configured for independent frontend/backend hosting with CORS management.

## 📦 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# PORT=5000
# MONGO_URI=your_mongodb_uri
# FRONTEND_URL=your_frontend_url
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with:
# VITE_API_URL=http://localhost:5000/api
# VITE_DEMO_MODE=false
npm run dev
```

### 💡 Demo Login
Navigate to `http://localhost:5173`
- **Username**: `admin`
- **Password**: `admin123`

---
*Made by Subhankar Das*
