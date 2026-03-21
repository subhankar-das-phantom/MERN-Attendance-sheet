import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Navbar from './components/Navbar';

// Very simple wrapper to restrict unauthenticated access
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <HashRouter>
      {/* Global dark UI handling. You can swap 'dark' mode class in index.html to toggle, but we will force it globally */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/attendance" element={
            <ProtectedRoute>
              <Navbar />
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute>
              <Navbar />
              <Students />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/attendance" replace />} />
        </Routes>

        {/* Minimal watermark */}
        <div className="fixed bottom-3 w-full text-center pointer-events-none">
          <p className="text-[13px] text-gray-400 dark:text-gray-600 uppercase tracking-widest font-mono">
            made by subhankar das
          </p>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
