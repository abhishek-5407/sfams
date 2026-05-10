"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  Mail, 
  MoreVertical,
  Loader2,
  Check,
  Save
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resStudents = await fetch('/api/students');
        const studentsData = await resStudents.json();
        
        if (resStudents.ok) {
          setStudents(studentsData);
          
          const resAttendance = await fetch(`/api/attendance?date=${today.toISOString()}`);
          const attendanceData = await resAttendance.json();
          
          const initial = {};
          studentsData.forEach(s => initial[s._id] = 'present');
          
          if (resAttendance.ok && attendanceData.length > 0) {
            attendanceData.forEach(record => {
              initial[record.student] = record.status;
            });
          }
          setAttendance(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLocalStatusUpdate = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleBulkUpdate = async () => {
    setSaving(true);
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
          date: today.toISOString(),
          markedBy: user.id || '6639d1b2e4b0a1a1a1a1a1a1'
        })
      });

      if (res.ok) {
        setMessage('All records updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update records');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/teacher-dashboard" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">My Students</h1>
            <p className="text-slate-400 text-sm">Manage student attendance & records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center space-x-2 text-emerald-500 text-xs font-bold animate-in slide-in-from-right-4">
              <Check className="w-3 h-3" />
              <span>{message}</span>
            </div>
          )}
          <button 
            onClick={handleBulkUpdate}
            disabled={saving || loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm font-bold disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Updating...' : 'Update Attendance'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a student by name or roll number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Today: <span className="text-white">{today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Student Profile</th>
                  <th className="px-8 py-5">Attendance %</th>
                  <th className="px-8 py-5 text-center">Today's Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                          {student.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{student.user?.name || 'Unknown Student'}</div>
                          <div className="text-slate-500 text-[10px] flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {student.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                         <div className="flex-1 bg-slate-950 h-1.5 w-24 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${student.attendancePercentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${student.attendancePercentage}%` }}
                            ></div>
                         </div>
                         <span className="text-sm font-bold text-white">{student.attendancePercentage}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center space-x-2">
                        <StatusBtn label="P" active={attendance[student._id] === 'present'} color="emerald" onClick={() => handleLocalStatusUpdate(student._id, 'present')} />
                        <StatusBtn label="A" active={attendance[student._id] === 'absent'} color="rose" onClick={() => handleLocalStatusUpdate(student._id, 'absent')} />
                        <StatusBtn label="L" active={attendance[student._id] === 'leave'} color="amber" onClick={() => handleLocalStatusUpdate(student._id, 'leave')} />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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

function StatusBtn({ label, active, color, onClick }) {
  const styles = {
    emerald: active ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
    rose: active ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
    amber: active ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-950 text-slate-600 border-slate-800',
  };

  return (
    <button 
      onClick={onClick} 
      className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${styles[color]}`}
    >
      {label}
    </button>
  );
}
