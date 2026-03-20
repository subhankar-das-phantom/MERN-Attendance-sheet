import { useState, useEffect } from 'react';
import { Download, AlertTriangle, Users, CalendarDays, TrendingUp, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState({ totalClasses: 0, studentStats: [], defaulters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data: resData } = await api.get('/summary');
      setData(resData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (data.studentStats.length === 0) return toast.error('No data to export');
    
    const headers = ['Roll Number', 'Name', 'Classes Attended', 'Classes Missed', 'Attendance %'];
    
    // Formatting data for CSV
    const csvContent = [
      headers.join(','),
      ...data.studentStats.map((s) => {
        return `${s.student.rollNumber},"${s.student.name}",${s.totalPresent},${s.totalAbsent},${s.percentage}%`;
      })
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'attendance_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time attendance insights and defaulter identification.</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          Export Report
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-bl-[100px] opacity-50 z-0 transition-transform group-hover:scale-110"></div>
          <CalendarDays className="w-8 h-8 text-primary-500 mb-2 z-10" />
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 z-10">{data.totalClasses}</h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1 z-10">Total Classes</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-bl-[100px] opacity-50 z-0 transition-transform group-hover:scale-110"></div>
          <Users className="w-8 h-8 text-blue-500 mb-2 z-10" />
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 z-10">{data.studentStats.length}</h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1 z-10">Registered Students</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-colors">
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-bl-[100px] opacity-50 z-0 transition-transform group-hover:scale-110"></div>
           <AlertTriangle className="w-8 h-8 text-red-500 mb-2 z-10" />
           <h3 className="text-4xl font-extrabold text-red-600 dark:text-red-500 z-10">{data.defaulters.length}</h3>
           <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1 z-10">Defaulters (&lt; 75%)</p>
        </div>
      </div>

      {/* Defaulters Section (Crucial Feature) */}
      {data.defaulters.length > 0 && (
        <div className="mb-10 animate-fade-in-up">
          <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-400 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              Critical Action Required: Defaulters List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.defaulters.map(def => (
                <div key={def.student._id} className="bg-white dark:bg-gray-800 border-l-4 border-l-red-500 p-4 rounded-xl shadow-sm flex justify-between items-center transition-colors">
                   <div>
                     <p className="font-bold text-gray-900 dark:text-gray-100">{def.student.name}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{def.student.rollNumber}</p>
                   </div>
                   <div className="text-right">
                     <span className="block text-2xl font-black text-red-600 dark:text-red-500">{def.percentage}%</span>
                     <span className="text-[10px] uppercase font-bold text-red-400">Attendance</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">Comprehensive Report</h3>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5"/> Trend = Last 5 Classes</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-gray-800 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold text-center">Present</th>
                <th className="px-6 py-4 font-semibold text-center">Absent</th>
                <th className="px-6 py-4 font-semibold text-center">Trend</th>
                <th className="px-6 py-4 font-semibold text-right">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.studentStats.map((stat) => {
                const isDefaulter = stat.percentage < 75;
                return (
                  <tr key={stat.student._id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${isDefaulter ? 'bg-red-50/20 dark:bg-red-900/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-semibold ${isDefaulter ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>{stat.student.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{stat.student.rollNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm">
                        {stat.totalPresent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold text-sm">
                         {stat.totalAbsent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        {stat.trend.map((tr, idx) => (
                           <span key={idx} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${tr === 'P' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                             {tr}
                           </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-extrabold ${
                        isDefaulter 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-200 dark:ring-red-900/50' 
                          : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-primary-200 dark:ring-primary-900/50'
                      }`}>
                        {stat.percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              
              {data.studentStats.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No attendance records found yet. Start by marking attendance!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
