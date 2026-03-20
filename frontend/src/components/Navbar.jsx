import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, CalendarCheck, LayoutDashboard, Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6" />
                Attendify
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/attendance"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/attendance') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Mark Attendance
              </Link>
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/dashboard') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-1"/>
                Dashboard
              </Link>
              <Link
                to="/students"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/students') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Users className="w-4 h-4 mr-1"/>
                Students
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-shrink-0">
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <LogOut className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </div>
            
            {/* Mobile menu toggle button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/attendance"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/attendance')
                  ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              Mark Attendance
            </Link>
            <Link
              to="/students"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/students')
                  ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              Students
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800">
            <button
               onClick={handleLogout}
               className="flex w-full items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
               <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
               Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
