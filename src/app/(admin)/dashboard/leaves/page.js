"use client";
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  User,
  MessageSquare,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminLeavesPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaves');
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    setActioningId(leaveId);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('/api/leaves', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leaveId, 
          status, 
          reviewedBy: user.id || '6639d1b2e4b0a1a1a1a1a1a1' 
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests(requests.map(r => r._id === leaveId ? updated : r));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Leave Management</h1>
        <p className="text-slate-400 text-sm">Review and approve student leave requests</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4 bg-slate-900 rounded-3xl border border-slate-800">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-slate-400">Loading requests...</p>
          </div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                    {request.student?.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{request.student?.user?.name || 'Unknown Student'}</h3>
                    <div className="flex items-center text-slate-500 text-xs mt-1 space-x-3">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest">{request.leaveType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                   <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Status</div>
                   <StatusBadge status={request.status} />
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-950 rounded-2xl border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1 text-blue-500" /> Reason
                </div>
                <p className="text-sm text-slate-300 italic">"{request.reason}"</p>
              </div>

              {request.status === 'Pending' && (
                <div className="mt-6 flex items-center space-x-3">
                  <button 
                    onClick={() => handleStatusUpdate(request._id, 'Approved')}
                    disabled={actioningId === request._id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {actioningId === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Approve</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                    disabled={actioningId === request._id}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {actioningId === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-slate-900 rounded-3xl border border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No leave requests found.</p>
          </div>
        )}
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
    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}
