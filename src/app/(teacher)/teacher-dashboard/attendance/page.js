"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Save,
  Users,
  ChevronLeft,
  Search,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: status }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
          // Initialize all as present
          const initial = {};
          data.forEach(s => initial[s._id] = 'present');
          setAttendance(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const attendanceData = Object.keys(attendance).map(id => ({
        studentId: id,
        status: attendance[id]
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendanceData,
          date: new Date().toISOString(),
          markedBy: user.id || '6639d1b2e4b0a1a1a1a1a1a1' // Fallback for testing
        })
      });

      if (res.ok) {
        setMessage('Attendance saved successfully!');
      } else {
        setMessage('Failed to save attendance');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  const [selectedStudent, setSelectedStudent] = useState(null);

  const stats = {
    total: students.length,
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    leave: Object.values(attendance).filter(s => s === 'leave').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/teacher-dashboard" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mark Attendance</h1>
            <p className="text-slate-400 text-sm">Update today's records</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-xl">
          <CalendarIcon className="w-5 h-5 text-emerald-500" />
          <span className="text-white font-bold tracking-tight">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TeacherStatMini label="Total" value={stats.total} color="slate" />
        <TeacherStatMini label="Present" value={stats.present} color="emerald" />
        <TeacherStatMini label="Absent" value={stats.absent} color="rose" />
        <TeacherStatMini label="Leave" value={stats.leave} color="amber" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
          <input 
            type="text"
            placeholder="Search students..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center space-x-4">
          {message && <span className="text-sm font-bold text-emerald-500">{message}</span>}
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm font-bold w-full md:w-auto disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'Saving...' : "Save Today's Attendance"}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Roll No & Student Name</th>
                  <th className="px-8 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-5">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center space-x-4 hover:opacity-80 transition-all"
                      >
                        <div className="text-slate-500 font-mono text-xs">{student.rollNumber}</div>
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">{student.user?.name}</div>
                      </button>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center space-x-2">
                        <AttendanceBtn label="P" active={attendance[student._id] === 'present'} color="emerald" onClick={() => handleStatusChange(student._id, 'present')} />
                        <AttendanceBtn label="A" active={attendance[student._id] === 'absent'} color="rose" onClick={() => handleStatusChange(student._id, 'absent')} />
                        <AttendanceBtn label="L" active={attendance[student._id] === 'leave'} color="amber" onClick={() => handleStatusChange(student._id, 'leave')} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/20">
                {selectedStudent.user?.name.charAt(0)}
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{selectedStudent.user?.name}</h3>
              <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest mt-1">Roll No: {selectedStudent.rollNumber}</p>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Email</span>
                <span className="text-white font-medium">{selectedStudent.user?.email}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Department</span>
                <span className="text-white font-medium">{selectedStudent.department}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Semester</span>
                <span className="text-white font-medium">{selectedStudent.semester}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedStudent(null)}
              className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendanceBtn({ label, active, color, onClick }) {
  const styles = {
    emerald: active ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
    rose: active ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
    amber: active ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
  };

  return (
    <button onClick={onClick} className={`w-10 h-10 rounded-xl text-xs font-black transition-all border ${styles[color]}`}>
      {label}
    </button>
  );
}

function TeacherStatMini({ label, value, color }) {
  const colors = {
    slate: 'bg-slate-800 text-slate-400',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    rose: 'bg-rose-500/10 text-rose-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };
  return (
    <div className={`p-4 rounded-2xl border border-slate-800 ${colors[color]} flex items-center justify-between`}>
      <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">{label}</span>
      <span className="text-xl font-bold tracking-tight">{value}</span>
    </div>
  );
}

