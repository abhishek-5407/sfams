"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaves, setLeaves] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const profileRes = await fetch(`/api/student/me?userId=${user.id}`);
        const profile = await profileRes.json();
        
        if (profileRes.ok) {
          setStudentId(profile._id);
          const leavesRes = await fetch(`/api/leaves?studentId=${profile._id}`);
          const leavesData = await leavesRes.json();
          if (leavesRes.ok) setLeaves(leavesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, studentId })
      });
      if (res.ok) {
        const newLeave = await res.json();
        setLeaves([newLeave, ...leaves]);
        setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
        setMessage('Leave request submitted!');
      }
    } catch (err) {
      setMessage('Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Leave Application</h1>
        <p className="text-slate-400 text-sm mt-1">Submit your leave requests and track their approval status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-500" />
              New Leave Request
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Leave Type</label>
                  <select 
                    value={formData.leaveType}
                    onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  >
                    <option>Sick Leave</option>
                    <option>Personal Leave</option>
                    <option>Academic Leave</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2 pt-6">
                   {message && <span className="text-xs font-bold text-emerald-500 uppercase">{message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Reason for Leave</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Explain why you need leave..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Past Requests</h3>
            <div className="space-y-4">
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-800" /> : leaves.map((req, i) => (
                <div key={i} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-white tracking-tight">{req.leaveType}</div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center font-bold">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2 italic">"{req.reason}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}
