"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Save,
  Users,
  Loader2,
  Mail,
  AlertTriangle,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resStudents = await fetch('/api/students');
        const studentsData = await resStudents.json();
        
        if (resStudents.ok) {
          setStudents(studentsData);
          
          const resAttendance = await fetch(`/api/attendance?date=${currentDate.toISOString()}`);
          const attendanceData = await resAttendance.json();
          
          const initial = {};
          studentsData.forEach(s => initial[s._id] = 'present');
          
          if (resAttendance.ok && attendanceData.length > 0) {
            attendanceData.forEach(record => {
              const sId = record.student?._id || record.student;
              if (sId) initial[sId] = record.status;
            });
          }
          setAttendance(initial);
        }
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentDate]);

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const updated = { ...attendance };
    students.forEach(s => updated[s._id] = status);
    setAttendance(updated);
    toast.success(`All marked as ${status}`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const attendanceData = Object.keys(attendance).map(id => ({
        studentId: id,
        status: attendance[id]
      }));

      // Normalize date to midnight for consistency
      const dateToSave = new Date(currentDate);
      dateToSave.setHours(0, 0, 0, 0);

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendanceData,
          date: dateToSave.toISOString(),
          markedBy: user._id || user.id || '6639d1b2e4b0a1a1a1a1a1a1'
        })
      });

      if (res.ok) {
        toast.success('Attendance saved successfully');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save attendance');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  const sendAttendanceWarning = async (studentId) => {
    try {
      toast.loading('Sending warning email...', { id: 'warn' });
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'attendance-warning', studentId })
      });
      if (res.ok) {
        toast.success('Warning email sent', { id: 'warn' });
      } else {
        toast.error('Failed to send email', { id: 'warn' });
      }
    } catch (err) {
      toast.error('Connection error', { id: 'warn' });
    }
  };

  const exportToExcel = () => {
    const data = students.map(s => ({
      'Roll No': s.rollNumber,
      'Student Name': s.user?.name,
      'Status': attendance[s._id],
      'Attendance %': s.attendancePercentage + '%'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${currentDate.toLocaleDateString()}.xlsx`);
  };

  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    leave: Object.values(attendance).filter(s => s === 'leave').length,
  };

  const filteredStudents = students.filter(s => 
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Attendance</h1>
          <p className="text-slate-400 text-sm">Mark and manage student attendance records</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button 
            onClick={() => setCurrentDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() - 1);
              return d;
            })}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 px-4">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold text-sm tracking-tight">
              {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <button 
            onClick={() => setCurrentDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() + 1);
              return d;
            })}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AttendanceStatCard label="Total Students" value={stats.total} icon={<Users className="w-5 h-5" />} color="blue" />
        <AttendanceStatCard label="Present" value={stats.present} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
        <AttendanceStatCard label="Absent" value={stats.absent} icon={<XCircle className="w-5 h-5" />} color="rose" />
        <AttendanceStatCard label="On Leave" value={stats.leave} icon={<Clock className="w-5 h-5" />} color="amber" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Bulk Actions</label>
            <div className="flex space-x-2">
              <button onClick={() => markAll('present')} className="px-3 py-1.5 bg-emerald-600/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">All Present</button>
              <button onClick={() => markAll('absent')} className="px-3 py-1.5 bg-rose-600/10 text-rose-500 rounded-lg text-[10px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all">All Absent</button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button onClick={exportToExcel} className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all" title="Export to Excel">
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm font-bold w-full md:w-auto disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Roll No & Student Name</th>
                  <th className="px-8 py-5 text-center">Mark Attendance</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="text-slate-500 font-mono text-xs">{student.rollNumber}</div>
                        <div>
                          <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{student.user?.name}</div>
                          <div className={`text-[10px] font-bold ${student.attendancePercentage < 75 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {student.attendancePercentage}% Attendance
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center space-x-2">
                        <AttendanceToggleButton label="P" active={attendance[student._id] === 'present'} color="emerald" onClick={() => handleStatusChange(student._id, 'present')} />
                        <AttendanceToggleButton label="A" active={attendance[student._id] === 'absent'} color="rose" onClick={() => handleStatusChange(student._id, 'absent')} />
                        <AttendanceToggleButton label="L" active={attendance[student._id] === 'leave'} color="amber" onClick={() => handleStatusChange(student._id, 'leave')} />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {student.attendancePercentage < 75 && (
                        <button 
                          onClick={() => sendAttendanceWarning(student._id)}
                          className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                          title="Send Attendance Warning"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function AttendanceStatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} flex flex-col items-center justify-center space-y-1`}>
      <div className="mb-1 opacity-80">{icon}</div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">{label}</div>
    </div>
  );
}

function AttendanceToggleButton({ label, active, color, onClick }) {
  const colors = {
    emerald: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10',
    rose: active ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10',
    amber: active ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10',
  };

  return (
    <button onClick={onClick} className={`w-10 h-10 rounded-xl text-xs font-black transition-all border ${colors[color]}`}>
      {label}
    </button>
  );
}
