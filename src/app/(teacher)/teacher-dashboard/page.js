"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, classesToday: 0 });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        // Fetch attendance marked by this teacher
        // Note: We need to filter by markedBy in the API
        const res = await fetch(`/api/attendance`); // In a real app, filter by teacherId
        const data = await res.json();
        
        if (res.ok) {
          setRecentActivity(data.slice(0, 5));
          setStats({
            totalStudents: data.length,
            classesToday: new Set(data.map(r => new Date(r.date).toDateString())).size
          });
        }
      } catch (err) {
        console.error("Teacher Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest animate-pulse">LOADING TEACHER PORTAL...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Teacher Dashboard</h1>
          <p className="text-slate-400">Welcome back! Manage your classes and attendance.</p>
        </div>
        <Link href="/teacher-dashboard/attendance" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2">
          <CalendarCheck className="w-5 h-5" />
          <span>Mark New Attendance</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeacherStatCard label="Records Marked" value={stats.totalStudents} icon={<Users className="w-6 h-6" />} color="emerald" />
        <TeacherStatCard label="Days Active" value={stats.classesToday} icon={<BookOpen className="w-6 h-6" />} color="blue" />
        <TeacherStatCard label="Avg Attendance" value="92%" icon={<TrendingUp className="w-6 h-6" />} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Marking Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                Recent Marking Activity
              </h3>
            </div>
            <div className="divide-y divide-slate-800/50">
              {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-all group">
                  <div className="flex items-center space-x-6">
                    <div className="text-slate-400 font-mono text-sm">
                      {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </div>
                    <div>
                      <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">
                        {item.student?.user?.name || `ID: ${(item.student?._id || item.student || '').toString().substring(0, 8)}...`}
                      </div>
                      <div className="text-slate-500 text-xs uppercase tracking-widest font-bold">Status: {item.status}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    item.status === 'present' ? 'bg-emerald-500/10 text-emerald-500' : 
                    item.status === 'absent' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">No recent activity recorded.</div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link href="/teacher-dashboard/attendance" className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
                <span className="text-sm font-bold text-white">Mark Attendance</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500" />
              </Link>
              <Link href="/teacher-dashboard/students" className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group">
                <span className="text-sm font-bold text-white">My Students</span>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function TeacherStatCard({ label, value, icon, color }) {
  const colors = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} bg-slate-900 flex flex-col items-center justify-center space-y-2 group hover:scale-[1.02] transition-transform`}>
      <div className="opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
      <div className="text-xs uppercase font-bold tracking-widest opacity-60">{label}</div>
    </div>
  );
}
