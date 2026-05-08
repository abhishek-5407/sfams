"use client";
import React from 'react';
import { 
  Search, 
  ChevronLeft, 
  Mail, 
  Phone,
  BarChart,
  User,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';

const myStudents = [
  { id: 'STU001', name: 'Rahul Sharma', email: 'rahul@example.com', attendance: '88%', status: 'Normal' },
  { id: 'STU002', name: 'Anjali Gupta', email: 'anjali@example.com', attendance: '92%', status: 'Excellent' },
  { id: 'STU003', name: 'Vikas Singh', email: 'vikas@example.com', attendance: '65%', status: 'Critical' },
  { id: 'STU004', name: 'Priya Verma', email: 'priya@example.com', attendance: '78%', status: 'Normal' },
  { id: 'STU005', name: 'Amit Kumar', email: 'amit@example.com', attendance: '82%', status: 'Normal' },
];

export default function TeacherStudents() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/teacher-dashboard" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">My Students</h1>
            <p className="text-slate-400 text-sm">Class: BCA 2nd Year • 45 Students</p>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
          <input 
            type="text"
            placeholder="Find a student in your class..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-2">Sort by:</div>
          <select className="bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-4 py-2 outline-none">
            <option>Name (A-Z)</option>
            <option>Attendance %</option>
            <option>Roll No</option>
          </select>
        </div>
      </div>

      {/* Students Grid/Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                <th className="px-8 py-5">Student Profile</th>
                <th className="px-8 py-5">Attendance %</th>
                <th className="px-8 py-5">Risk Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {myStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">{student.name}</div>
                        <div className="text-slate-500 text-[10px] flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                       <div className="flex-1 bg-slate-950 h-1.5 w-24 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${parseInt(student.attendance) < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: student.attendance }}
                          ></div>
                       </div>
                       <span className="text-sm font-bold text-white">{student.attendance}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                       student.status === 'Critical' 
                       ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                       : student.status === 'Excellent'
                       ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                       : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                     }`}>
                       {student.status}
                     </span>
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
        </div>
      </div>
    </div>
  );
}
