"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar as CalendarIcon, 
  Filter, 
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AttendanceHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(''); // Optional date filter

  useEffect(() => {
    const fetchFullHistory = async () => {
      setLoading(true);
      try {
        // Fetch all attendance records
        // We'll use the existing GET /api/attendance but without studentId to get all
        // Actually, the current API might need to be checked if it returns all when no ID is provided.
        const res = await fetch('/api/attendance'); 
        const data = await res.json();
        
        if (res.ok) {
          // Since Attendance records only have student ID, we might need to fetch student details too
          // Or the API should populate student info. Let's check the API again.
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullHistory();
  }, []);

  // Filter logic
  const filteredHistory = history.filter(record => {
    const matchesSearch = record.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesDate = !selectedDate || new Date(record.date).toISOString().split('T')[0] === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Full Attendance History</h1>
          <p className="text-slate-400 text-sm">Detailed logs of all student attendance records</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all text-sm font-semibold">
          <Download className="w-4 h-4" />
          <span>Export Records</span>
        </button>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative group col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by student name or roll no..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select 
            className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
          </select>
        </div>

        <div className="relative">
          <input 
            type="date"
            className="w-full bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-medium">Loading history logs...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Student Info</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredHistory.length > 0 ? filteredHistory.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-white font-medium text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
                        {record.student?.user?.name || 'Unknown'}
                      </div>
                      <div className="text-slate-500 text-xs font-mono mt-0.5">
                        {record.student?.rollNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center space-x-1.5 border ${
                          record.status === 'present' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : record.status === 'absent' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {record.status === 'present' && <CheckCircle2 className="w-3 h-3" />}
                          {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                          {record.status === 'leave' && <Clock className="w-3 h-3" />}
                          <span>{record.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right text-slate-500 text-xs italic">
                      {record.remarks || 'No remarks'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-slate-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
