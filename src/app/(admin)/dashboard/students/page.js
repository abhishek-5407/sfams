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
  Loader2
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        } else {
          setError('Failed to load students');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 text-sm">Manage and view all student records in one place</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all text-sm font-semibold">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all text-sm font-bold">
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, Roll No or email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 transition-all text-sm w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl hover:bg-slate-900 transition-all text-sm w-full md:w-auto justify-center">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-medium">Loading student records...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center text-rose-500 font-bold">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-800">
                  <th className="px-6 py-5">Student Details</th>
                  <th className="px-6 py-5">Roll Number</th>
                  <th className="px-6 py-5">Course / Batch</th>
                  <th className="px-6 py-5">Fees Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                          {student.user?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{student.user?.name || 'N/A'}</div>
                          <div className="text-slate-500 text-[10px] flex items-center mt-0.5">
                            <Mail className="w-3 h-3 mr-1" />
                            {student.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-mono text-xs bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 tracking-tight">
                        {student.rollNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white text-xs font-bold">{student.class}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{student.batch}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        student.feesStatus === 'paid' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : student.feesStatus === 'partial'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {student.feesStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-500">
                      No students found matching your search.
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

