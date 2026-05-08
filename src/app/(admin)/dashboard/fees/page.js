"use client";
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';

export default function FeesPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const res = await fetch('/api/students');
        const data = await res.json();
        if (res.ok) setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeData();
  }, []);

  const stats = {
    totalCollection: students.reduce((acc, s) => acc + (s.paidAmount || 0), 0),
    totalDues: students.reduce((acc, s) => acc + ((s.totalFees || 0) - (s.paidAmount || 0)), 0),
    paidStudents: students.filter(s => s.feesStatus === 'paid').length
  };

  const filtered = students.filter(s => 
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fees Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track payments, manage dues and generate receipts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold text-sm">
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeeStatCard label="Total Collection" value={`₹${stats.totalCollection.toLocaleString()}`} change="+5.2%" trend="up" icon={<CheckCircle2 className="w-6 h-6" />} color="blue" />
        <FeeStatCard label="Pending Dues" value={`₹${stats.totalDues.toLocaleString()}`} change="+1.4%" trend="down" icon={<Clock className="w-6 h-6" />} color="amber" />
        <FeeStatCard label="Paid Students" value={stats.paidStudents} change="100%" trend="neutral" icon={<CreditCard className="w-6 h-6" />} color="rose" />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or Roll No..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg hover:text-white transition-all text-xs font-bold">
              <Download className="w-3.5 h-3.5" />
              <span>Export List</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                  <th className="px-8 py-5">Student Information</th>
                  <th className="px-8 py-5">Paid Amount</th>
                  <th className="px-8 py-5">Total Fees</th>
                  <th className="px-8 py-5">Dues</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((record, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors group text-sm">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {record.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-tight">{record.user?.name}</div>
                          <div className="text-slate-500 text-[10px] font-mono">{record.rollNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-bold text-emerald-500">₹{record.paidAmount?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-slate-400">₹{record.totalFees?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-rose-400">₹{(record.totalFees - record.paidAmount).toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <FeeStatusBadge status={record.feesStatus} />
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


function FeeStatCard({ label, value, change, trend, icon, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
          <span>{change}</span>
          {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : trend === 'down' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
        </div>
      </div>
      <div>
        <div className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">{label}</div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:bg-blue-600/10 transition-all"></div>
    </div>
  );
}

function FeeStatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    partial: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    unpaid: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
}
