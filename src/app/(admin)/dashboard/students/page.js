"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone,
  ArrowUpDown,
  Download,
  Trash2,
  Edit,
  Loader2,
  Calendar,
  XCircle,
  Clock,
  CheckCircle2,
  Plus,
  ArrowLeft,
  GraduationCap,
  MapPin,
  User as UserIcon,
  Users as UsersIcon,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    class: '',
    batch: '',
    phone: '',
    fatherName: '',
    course: '',
    semester: '',
    address: '',
    totalFees: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Adding student...');
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Student added successfully', { id: loadId });
        setShowAddModal(false);
        setFormData({ name: '', email: '', rollNumber: '', class: '', batch: '', phone: '', fatherName: '', course: '', semester: '', address: '', totalFees: '' });
        fetchStudents();
      } else {
        const d = await res.json();
        toast.error(d.message || 'Error adding student', { id: loadId });
      }
    } catch (err) {
      toast.error('Network error', { id: loadId });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading('Updating student...');
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedStudent._id, ...formData })
      });
      if (res.ok) {
        toast.success('Student updated', { id: loadId });
        setShowEditModal(false);
        fetchStudents();
      } else {
        toast.error('Update failed', { id: loadId });
      }
    } catch (err) {
      toast.error('Network error', { id: loadId });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    const loadId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted successfully', { id: loadId });
        fetchStudents();
      } else {
        toast.error('Delete failed', { id: loadId });
      }
    } catch (err) {
      toast.error('Network error', { id: loadId });
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      rollNumber: student.rollNumber || '',
      class: student.class || '',
      batch: student.batch || '',
      phone: student.phone || '',
      fatherName: student.fatherName || '',
      course: student.course || '',
      semester: student.semester || '',
      address: student.address || '',
      totalFees: student.totalFees || ''
    });
    setShowEditModal(true);
  };

  const fetchAttendanceHistory = async (studentId) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/attendance?studentId=${studentId}`);
      const data = await res.json();
      if (res.ok) setAttendanceHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openHistory = (student) => {
    setSelectedStudent(student);
    fetchAttendanceHistory(student._id);
    setShowHistoryModal(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = courseFilter === '' || student.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 text-sm">Manage student profiles, academic info and fees</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name or Roll No..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
        >
          <option value="">All Courses</option>
          <option value="BCA">BCA</option>
          <option value="B.Tech">B.Tech</option>
          <option value="MCA">MCA</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Student Details</th>
                  <th className="px-8 py-5">Roll No</th>
                  <th className="px-8 py-5">Academic Info</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30 transition-colors group text-sm">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all capitalize">
                          {s.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{s.user?.name}</div>
                          <div className="text-[10px] text-slate-500">{s.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-slate-300">{s.rollNumber}</td>
                    <td className="px-8 py-5">
                      <div className="text-white font-medium">{s.course} - {s.semester}</div>
                      <div className="text-[10px] text-slate-500">{s.class} ({s.batch})</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${s.feesStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                        {s.feesStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openHistory(s)} className="p-2 bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all" title="Attendance History"><Calendar className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(s)} className="p-2 bg-slate-800 text-slate-400 hover:bg-white hover:text-slate-900 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-2 bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative scrollbar-hide">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600/10 p-2 rounded-xl">
                  {showAddModal ? <UserPlus className="w-6 h-6 text-blue-500" /> : <Edit className="w-6 h-6 text-blue-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{showAddModal ? 'Register New Student' : 'Edit Student Profile'}</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Personal & Academic Info</p>
                </div>
              </div>
              <button onClick={() => {setShowAddModal(false); setShowEditModal(false);}} className="p-2 text-slate-500 hover:text-white transition-all"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Full Name" icon={<UserIcon />} value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
                <FormInput label="Email Address" icon={<Mail />} type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} required />
                <FormInput label="Roll Number" icon={<MoreHorizontal />} value={formData.rollNumber} onChange={(v) => setFormData({...formData, rollNumber: v})} required />
                <FormInput label="Father's Name" icon={<UserIcon />} value={formData.fatherName} onChange={(v) => setFormData({...formData, fatherName: v})} />
                <FormInput label="Mobile Number" icon={<Phone />} value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Course</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
                <FormInput label="Semester" icon={<GraduationCap />} value={formData.semester} onChange={(v) => setFormData({...formData, semester: v})} />
                <FormInput label="Class/Section" icon={<UsersIcon />} value={formData.class} onChange={(v) => setFormData({...formData, class: v})} />
                <FormInput label="Batch Year" icon={<Calendar />} value={formData.batch} onChange={(v) => setFormData({...formData, batch: v})} />
                <FormInput label="Total Fees (₹)" icon={<IndianRupeeIcon />} type="number" value={formData.totalFees} onChange={(v) => setFormData({...formData, totalFees: v})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Address</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[80px]"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
              >
                {showAddModal ? <UserPlus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                <span>{showAddModal ? 'Create Student Profile' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
             <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">Attendance: {selectedStudent.user?.name}</h3>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 text-slate-500 hover:text-white transition-all"><XCircle className="w-6 h-6" /></button>
             </div>
             <div className="p-8 max-h-[60vh] overflow-y-auto">
               {loadingHistory ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div> : (
                 <div className="space-y-4">
                    {attendanceHistory.map(h => (
                      <div key={h._id} className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <div className="text-sm font-bold text-white">{new Date(h.date).toLocaleDateString()}</div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${h.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{h.status}</span>
                      </div>
                    ))}
                    {attendanceHistory.length === 0 && <p className="text-center text-slate-500">No records found</p>}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormInput({ label, icon, type="text", value, onChange, required=false }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4">{icon}</div>
        <input 
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
        />
      </div>
    </div>
  );
}

function IndianRupeeIcon() {
  return <span className="font-bold italic">₹</span>;
}


