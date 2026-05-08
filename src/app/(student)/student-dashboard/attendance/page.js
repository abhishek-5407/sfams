"use client";
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        // First get student profile to get the Student Document ID
        const profileRes = await fetch('/api/student/me?userId=' + user.id);
        const profile = await profileRes.json();
        
        if (profile && profile._id) {
          const res = await fetch(`/api/attendance?studentId=${profile._id}`);
          const data = await res.json();
          if (res.ok) {
            setRecords(data);
            // Calculate Stats
            const p = data.filter(r => r.status === 'present').length;
            const a = data.filter(r => r.status === 'absent').length;
            const l = data.filter(r => r.status === 'leave').length;
            setStats({ present: p, absent: a, leave: l, total: data.length });
          }
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Attendance</h1>
          <p className="text-slate-400 text-sm">Review your daily attendance records</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AttendanceSummaryCard label="Total Records" value={stats.total} icon={<BarChart3 className="w-5 h-5" />} color="blue" />
        <AttendanceSummaryCard label="Present Days" value={stats.present} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
        <AttendanceSummaryCard label="Absent Days" value={stats.absent} icon={<XCircle className="w-5 h-5" />} color="rose" />
        <AttendanceSummaryCard label="On Leave" value={stats.leave} icon={<Clock className="w-5 h-5" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
              Attendance History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-10 text-center text-slate-500 italic">No attendance records found yet.</td>
                  </tr>
                ) : (
                  records.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-5 text-white font-medium">
                        {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          item.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' : 
                          item.status === 'absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-500 text-sm">
                        {item.remarks || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Overall Percentage</div>
              <div className={`text-5xl font-black mb-2 ${percentage < 75 ? 'text-rose-500' : 'text-indigo-500'}`}>
                {percentage}%
              </div>
              <p className="text-slate-400 text-sm italic">
                {percentage < 75 ? "Your attendance is low. Try to attend more classes!" : "Keep it up! You're doing great."}
              </p>
            </div>
            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceSummaryCard({ label, value, icon, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <div className={`p-5 rounded-3xl border ${colors[color]} bg-slate-900/50 flex flex-col items-center justify-center space-y-2`}>
       <div className="opacity-80">{icon}</div>
       <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
       <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 text-center">{label}</div>
    </div>
  );
}
