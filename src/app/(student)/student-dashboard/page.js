"use client";
import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  CreditCard, 
  Bell, 
  ArrowRight, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        // Fetch Profile
        const profileRes = await fetch(`/api/student/me?userId=${user.id}`);
        const profileData = await profileRes.json();
        
        if (profileRes.ok) {
          setProfile(profileData);
          
          // Fetch Attendance for this student
          const attRes = await fetch(`/api/attendance?studentId=${profileData._id}`);
          const attData = await attRes.json();
          if (attRes.ok) {
            setRecentAttendance(attData.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest animate-pulse">LOADING DASHBOARD...</p>
      </div>
    );
  }

  // Calculate dynamic attendance percentage
  const totalRecords = recentAttendance.length;
  const presentRecords = recentAttendance.filter(r => r.status === 'present').length;
  const dynamicPct = totalRecords > 0 ? ((presentRecords / totalRecords) * 100).toFixed(1) : (profile?.attendancePercentage || 0);
  
  const dashOffset = 176 - (176 * dynamicPct) / 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {profile?.user?.name || 'Student'}!</h1>
          <p className="text-slate-400">Your academic progress is looking great this semester.</p>
        </div>
        <div className="text-sm font-bold text-slate-500 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          Roll No: {profile?.rollNumber || 'N/A'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Attendance</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-4xl font-black text-white tracking-tighter">{dynamicPct}%</div>
              <div className="text-sm text-emerald-500 font-bold mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {dynamicPct >= 75 ? 'Above threshold' : 'Low Attendance'}
              </div>
            </div>
            <div className="w-16 h-16 relative">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                 <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="176" strokeDashoffset={dashOffset} className="text-indigo-500 transition-all duration-1000" />
               </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Fees Status</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">₹{profile ? (profile.totalFees - profile.paidAmount).toLocaleString() : '0'} <span className="text-sm font-normal text-slate-500 uppercase tracking-widest ml-1">Due</span></div>
            <div className="text-xs text-slate-400 mt-2">Status: <span className={`font-bold uppercase ${profile?.feesStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{profile?.feesStatus}</span></div>
          </div>
          <Link href="/student-dashboard/fees" className="mt-6 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
            Manage Payments
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Bell className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Notifications</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-xs">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
              <p className="text-slate-300">Your attendance for today has been marked.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                Recent Attendance
              </h3>
              <Link href="/student-dashboard/attendance" className="text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">View Detailed</Link>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {recentAttendance.length > 0 ? recentAttendance.map((record, i) => (
                <AttendanceDay 
                  key={i} 
                  day={new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })} 
                  date={new Date(record.date).getDate()} 
                  status={record.status} 
                />
              )) : (
                <div className="col-span-full py-4 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">No recent records</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4 leading-tight">Need Leave?</h3>
            <p className="text-slate-400 text-sm mb-6">Apply online and track your request status in real-time.</p>
            <Link href="/student-dashboard/leave" className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all shadow-lg">
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceDay({ day, date, status }) {
  const statusColors = {
    present: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    absent: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    leave: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  const statusText = {
    present: 'text-emerald-500/60',
    absent: 'text-rose-500/60',
    leave: 'text-amber-500/60',
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50">
      <span className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">{day}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border ${statusColors[status] || statusColors.absent}`}>
        {date}
      </div>
      <span className={`text-[8px] uppercase font-black tracking-widest ${statusText[status] || statusText.absent}`}>
        {status}
      </span>
    </div>
  );
}

function QuickLinkCard({ title, icon, href }) {
  return (
    <Link href={href} className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all group">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-950 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="font-bold text-white tracking-tight">{title}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-all mr-2" />
    </Link>
  );
}
