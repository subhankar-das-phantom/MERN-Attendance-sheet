import { useState, useEffect } from 'react';
import { Users, UserPlus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '' });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', rollNumber: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNumber) return toast.error('Check fields');
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/students', newStudent);
      setStudents([...students, data]);
      setNewStudent({ name: '', rollNumber: '' });
      setShowAddForm(false);
      toast.success('Student added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    if (!editForm.name || !editForm.rollNumber) return toast.error('Check fields');
    setIsSubmitting(true);
    try {
      const { data } = await api.put(`/students/${id}`, editForm);
      setStudents(students.map(s => s._id === id ? data : s));
      setEditingId(null);
      toast.success('Student updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this student? This is a safe action (soft delete).')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
      toast.success('Student deactivated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting student');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary-600" />
            Student Directory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage active class roll list</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          {showAddForm ? <X className="w-4 h-4"/> : <UserPlus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 animate-fade-in-up">
          <form onSubmit={handleAddSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 text-sm"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Roll Number</label>
              <input
                type="text"
                required
                placeholder="e.g. CS105"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent dark:text-gray-100 focus:ring-primary-500 focus:border-primary-500 text-sm"
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
              />
            </div>
            <div className="flex items-end">
               <button disabled={isSubmitting} type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-75">
                 {isSubmitting ? 'Saving...' : 'Save'}
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {students.map((student) => {
          const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          const isEditing = editingId === student._id;

          return (
            <div 
              key={student._id} 
              className={`relative overflow-hidden group bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isEditing 
                  ? 'border-primary-400 dark:border-primary-500 shadow-md ring-4 ring-primary-50 dark:ring-primary-900/20' 
                  : 'border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-gray-600'
              }`}
            >
              {/* Decorative background blob */}
              {!isEditing && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/10 dark:to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              )}

              {isEditing ? (
                <form onSubmit={(e) => handleEditSubmit(e, student._id)} className="w-full relative z-10 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 absolute -top-2 left-2 bg-white dark:bg-gray-800 px-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border-2 border-primary-200 dark:border-primary-700 rounded-xl px-3 py-2.5 text-sm bg-transparent dark:text-gray-100 focus:outline-none focus:border-primary-500 transition-colors"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="w-full sm:w-32 relative">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 absolute -top-2 left-2 bg-white dark:bg-gray-800 px-1">Roll No.</label>
                    <input
                      type="text"
                      required
                      className="w-full border-2 border-primary-200 dark:border-primary-700 rounded-xl px-3 py-2.5 text-sm font-mono bg-transparent dark:text-gray-100 focus:outline-none focus:border-primary-500 transition-colors"
                      value={editForm.rollNumber}
                      onChange={(e) => setEditForm({...editForm, rollNumber: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm" title="Save">
                      <Check className="w-4 h-4"/> <span className="sm:hidden">Save</span>
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors" title="Cancel">
                      <X className="w-4 h-4"/> <span className="sm:hidden">Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto overflow-hidden">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-lg shadow-inner ring-4 ring-white dark:ring-gray-800">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 dark:text-white text-base truncate pr-4">{student.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">Roll</span>
                        <span className="text-xs font-mono font-semibold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-800/50">
                          {student.rollNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto justify-end border-t sm:border-t-0 border-gray-100 dark:border-gray-700 pt-3 sm:pt-0 mt-3 sm:mt-0">
                    <button 
                      onClick={() => { setEditingId(student._id); setEditForm({ name: student.name, rollNumber: student.rollNumber }); }}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/40 hover:shadow-sm rounded-xl transition-all duration-200"
                      title="Edit Student"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 hover:shadow-sm rounded-xl transition-all duration-200"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {students.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed">
            <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No active students found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Add your first student using the button above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
