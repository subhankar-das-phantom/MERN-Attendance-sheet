import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, CalendarX2, Loader2, User, TrendingUp } from 'lucide-react';
import { useAPI } from '../services/swrFetcher';

const StudentDetail = () => {
  const { id } = useParams();
  const { data, error, isLoading } = useAPI(`/students/${id}/attendance`);

  if (isLoading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (error || !data) return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Student not found</h3>
        <Link to="/students" className="text-primary-600 dark:text-primary-400 mt-2 inline-block hover:underline">← Back to Students</Link>
      </div>
    </div>
  );

  const { student, totalClasses, totalPresent, totalAbsent, percentage, history } = data;
  const isDefaulter = percentage < 75;
  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Student Info Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 mb-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          
          {/* Avatar */}
          <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-inner ring-4 ring-white dark:ring-gray-800 transition-colors ${
            isDefaulter 
              ? 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-300'
              : 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 text-primary-700 dark:text-primary-300'
          }`}>
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{student.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">Roll</span>
              <span className="text-sm font-mono font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-0.5 rounded-md border border-primary-100 dark:border-primary-800/50">
                {student.rollNumber}
              </span>
            </div>
          </div>

          {/* Percentage Badge */}
          <div className="flex flex-col items-center">
            <span className={`text-4xl font-black ${isDefaulter ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>
              {percentage}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500 mt-0.5">
              Attendance
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center transition-colors">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{totalClasses}</span>
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-1">Total Classes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center transition-colors">
          <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">{totalPresent}</span>
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-1">Present</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center transition-colors">
          <span className="text-2xl font-extrabold text-red-600 dark:text-red-400">{totalAbsent}</span>
          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-1">Absent</p>
        </div>
      </div>

      {/* Attendance Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-6 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Attendance</span>
          <span className={`text-sm font-extrabold ${isDefaulter ? 'text-red-600 dark:text-red-400' : 'text-primary-600 dark:text-primary-400'}`}>{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${isDefaulter ? 'bg-red-500' : 'bg-primary-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {isDefaulter && (
          <p className="text-xs text-red-500 dark:text-red-400 font-semibold mt-2">⚠ Below 75% threshold — Defaulter</p>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            Date-wise Attendance History
          </h3>
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{history.length} records</span>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarX2 className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No attendance records yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Attendance will appear here once classes are marked.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[...history].reverse().map((entry, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30 ${
                  entry.status === 'present' ? '' : 'bg-red-50/20 dark:bg-red-900/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    entry.status === 'present' ? 'bg-primary-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatDate(entry.date)}
                  </span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  entry.status === 'present' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentDetail;
