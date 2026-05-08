"use client";
import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

const studentsList = [
  { id: 'STU001', name: 'Rahul Sharma', class: 'BCA 2nd Year', status: 'present' },
  { id: 'STU002', name: 'Anjali Gupta', class: 'BCA 2nd Year', status: 'absent' },
  { id: 'STU003', name: 'Vikas Singh', class: 'BCA 2nd Year', status: 'present' },
  { id: 'STU004', name: 'Priya Verma', class: 'BCA 2nd Year', status: 'leave' },
  { id: 'STU005', name: 'Amit Kumar', class: 'BCA 2nd Year', status: 'present' },
  { id: 'STU006', name: 'Sneha Roy', class: 'BCA 2nd Year', status: 'present' },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState('May 08, 2026');
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily Attendance</h1>
          <p className="text-slate-400 text-sm">Mark and manage student attendance records</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 px-4">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span className="text-white font-bold text-sm tracking-tight">{selectedDate}</span>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AttendanceStatCard label="Total Students" value="48" icon={<Users className="w-5 h-5" />} color="blue" />
        <AttendanceStatCard label="Present" value="42" icon={<CheckCircle2 className="w-5 h-5" />} color="emerald" />
        <AttendanceStatCard label="Absent" value="04" icon={<XCircle className="w-5 h-5" />} color="rose" />
        <AttendanceStatCard label="On Leave" value="02" icon={<Clock className="w-5 h-5" />} color="amber" />
      </div>

      {/* Controls Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Select Class</label>
            <select className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all w-full md:w-48 appearance-none cursor-pointer">
              <option>BCA 2nd Year</option>
              <option>B.Tech CS</option>
              <option>B.Com 1st Year</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Select Session</label>
            <select className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all w-full md:w-40 appearance-none cursor-pointer">
              <option>Morning</option>
              <option>Afternoon</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64 group hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input 
              type="text"
              placeholder="Search student..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm font-bold w-full md:w-auto">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-800">
                <th className="px-8 py-5">Roll No & Student Name</th>
                <th className="px-8 py-5 text-center">Mark Attendance</th>
                <th className="px-8 py-5 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {studentsList.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="text-slate-500 font-mono text-xs">{student.id}</div>
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{student.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center space-x-2">
                      <AttendanceToggleButton label="Present" active={student.status === 'present'} color="emerald" />
                      <AttendanceToggleButton label="Absent" active={student.status === 'absent'} color="rose" />
                      <AttendanceToggleButton label="Leave" active={student.status === 'leave'} color="amber" />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <input 
                      type="text" 
                      placeholder="Add note..."
                      className="bg-transparent border-b border-slate-800 text-xs text-slate-400 focus:border-blue-500/50 outline-none transition-all py-1 w-32 text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-950/30 text-center border-t border-slate-800">
          <p className="text-slate-500 text-xs">Viewing attendance for <span className="text-white font-bold">BCA 2nd Year</span> | Last updated 10 mins ago</p>
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

function AttendanceToggleButton({ label, active, color }) {
  const colors = {
    emerald: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10',
    rose: active ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10',
    amber: active ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10',
  };

  return (
    <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${colors[color]}`}>
      {label}
    </button>
  );
}
