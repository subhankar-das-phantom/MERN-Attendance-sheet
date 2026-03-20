import { useState, useEffect, useMemo } from 'react';
import { Calendar, CalendarCheck, CheckCircle, XCircle, Loader2, Save, CalendarDays, RefreshCw } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAPI } from '../services/swrFetcher';

const Attendance = () => {
  const [records, setRecords] = useState({}); // { studentId: 'present' | 'absent' }
  const [originalRecords, setOriginalRecords] = useState({}); // Baseline for change detection
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // SWR: Cache student list
  const { data: students = [], isLoading: studentsLoading } = useAPI('/students');
  
  // SWR: Cache attendance by date
  const { data: attData, isLoading: attLoading, mutate: mutateAtt } = useAPI(
    `/attendance?date=${selectedDate}`,
    { revalidateOnFocus: false }
  );
  
  const loadingInitial = studentsLoading || attLoading;

  // Derive records from SWR data whenever students or attData change
  useEffect(() => {
    if (studentsLoading || attLoading) return;
    
    const recordsMap = {};
    if (attData && attData.length > 0) {
      setIsEditMode(true);
      attData[0].records.forEach(r => {
        const sId = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
        recordsMap[sId] = r.status;
      });
      students.forEach(s => {
        if (!recordsMap[s._id]) recordsMap[s._id] = 'absent';
      });
    } else {
      setIsEditMode(false);
      students.forEach(s => {
        recordsMap[s._id] = 'absent';
      });
    }
    
    setRecords(recordsMap);
    setOriginalRecords(recordsMap);
  }, [students, attData, studentsLoading, attLoading]);

  const handleToggle = (studentId) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const markAll = (status) => {
    const newRecords = {};
    students.forEach(s => {
      newRecords[s._id] = status;
    });
    setRecords(newRecords);
  };

  const preparePayload = () => {
    const payload = [];
    Object.keys(records).forEach(key => {
      payload.push({ studentId: key, status: records[key] });
    });
    return payload;
  };

  const handleSubmit = async (e, forceOverwrite = false) => {
    if (e) e.preventDefault();
    if (Object.keys(records).length === 0) return toast.error('No students to mark');
    
    setLoadingSubmit(true);
    const payloadRecords = preparePayload();

    try {
      if (forceOverwrite) {
        await api.put(`/attendance/${selectedDate}`, { records: payloadRecords });
        toast.success(`Attendance updated for ${selectedDate}`);
        setShowOverwriteModal(false);
      } else {
        await api.post('/attendance', { date: selectedDate, records: payloadRecords });
        toast.success('Attendance saved successfully!');
      }
      
      setIsEditMode(true);
      setOriginalRecords({...records});
      mutateAtt(); // Revalidate SWR cache for this date
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message.includes('exists')) {
        // Trigger overwrite confirmation
        setShowOverwriteModal(true);
      } else {
        toast.error(error.response?.data?.message || 'Error saving attendance');
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const formatToday = () => {
    const _today = new Date().toISOString().split('T')[0];
    setSelectedDate(_today);
  };

  const hasChanges = JSON.stringify(records) !== JSON.stringify(originalRecords);

  if (loadingInitial) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Header & Date Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <CalendarCheck className="w-7 h-7 text-primary-600 hidden sm:block" />
              Mark Attendance
            </h1>
            {isEditMode && (
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-200 uppercase tracking-widest hidden sm:block animate-fade-in">Edit Mode</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a date and toggle student presence.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={formatToday}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg transition-colors border border-primary-200 dark:border-primary-800"
          >
            <CalendarDays className="w-4 h-4"/>
            Today
          </button>
          <input
            type="date"
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500 text-sm font-medium transition-colors"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => markAll('absent')}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
        >
          <XCircle className="w-4 h-4" /> All Absent
        </button>
        <button
          onClick={() => markAll('present')}
          className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" /> All Present
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {students.map((student) => {
          const isPresent = records[student._id] === 'present';
          const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

          return (
            <div 
              key={student._id} 
              className={`group relative overflow-hidden bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:-translate-y-0.5 ${
                 isPresent 
                   ? 'border-primary-100 hover:border-primary-300 dark:border-primary-900/50 dark:hover:border-primary-700'
                   : 'border-red-100 hover:border-red-300 dark:border-red-900/30 dark:hover:border-red-800'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isPresent ? 'bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/10' : 'bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10'}`}></div>

              <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto overflow-hidden">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ring-4 ring-white dark:ring-gray-800 transition-colors ${
                  isPresent 
                    ? 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 text-primary-700 dark:text-primary-300'
                    : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-300'
                }`}>
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-gray-900 dark:text-white text-base truncate pr-4">{student.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">Roll</span>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                      isPresent
                        ? 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border-primary-100 dark:border-primary-800/50'
                        : 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800/50'
                    }`}>
                      {student.rollNumber}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 w-full sm:w-auto flex justify-end items-center border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0 mt-3 sm:mt-0">
                <button
                  type="button"
                  onClick={() => handleToggle(student._id)}
                  className={`relative inline-flex h-9 w-[110px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                    isPresent ? 'bg-primary-500' : 'bg-red-500'
                  }`}
                >
                  <span className="sr-only">Toggle presence</span>
                  <span
                    className={`pointer-events-none relative inline-block h-8 w-8 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isPresent ? 'translate-x-[74px]' : 'translate-x-0'
                    }`}
                  >
                    <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isPresent ? 'opacity-100' : 'opacity-0'}`}>
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                    </span>
                    <span className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${!isPresent ? 'opacity-100' : 'opacity-0'}`}>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </span>
                  </span>
                  
                  {/* Label beside toggle handle */}
                  <span className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-white uppercase tracking-wider ${isPresent ? 'left-3' : 'right-3'}`}>
                    {isPresent ? 'Present' : 'Absent'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        {students.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No active students</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Please add students to the directory first.</p>
          </div>
        )}
      </div>

      {/* Submit Sticky Footer or Button */}
      <div className="flex justify-end sticky bottom-6 z-10 transition-all">
        <button
           onClick={(e) => isEditMode ? handleSubmit(e, true) : handleSubmit(e, false)}
           disabled={loadingSubmit || (isEditMode && !hasChanges)}
           className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {loadingSubmit ? 'Saving...' : (isEditMode ? (hasChanges ? 'Update Attendance' : 'Up to Date') : 'Submit Attendance')}
        </button>
      </div>

      {/* Overwrite Confirmation Modal */}
      {showOverwriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-4 text-orange-600 dark:text-orange-500">
              <RefreshCw className="w-8 h-8 p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Record Exists</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
              Attendance already exists for <span className="text-gray-900 dark:text-white font-bold">{selectedDate}</span>. 
              Do you want to overwrite it with the current selection?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowOverwriteModal(false)}
                className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={loadingSubmit}
              >
                Cancel
              </button>
              <button
                onClick={(e) => handleSubmit(e, true)}
                className="flex-1 py-2.5 px-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 flex justify-center items-center transition-colors"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Yes, Overwrite'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Attendance;
