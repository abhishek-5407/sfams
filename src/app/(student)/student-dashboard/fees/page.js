"use client";
import React from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Receipt
} from 'lucide-react';

const paymentHistory = [
  { id: 'PAY-8821', date: 'May 02, 2026', amount: '₹12,500', method: 'UPI / PhonePe', status: 'Success' },
  { id: 'PAY-7712', date: 'Jan 15, 2026', amount: '₹15,000', method: 'Net Banking', status: 'Success' },
  { id: 'PAY-4401', date: 'Aug 10, 2025', amount: '₹15,000', method: 'Debit Card', status: 'Success' },
];

export default function StudentFees() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fees & Payments</h1>
          <p className="text-slate-400 text-sm">Manage your tuition fees and payment history</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl shadow-xl shadow-amber-500/10 transition-all font-bold text-sm">
          <CreditCard className="w-5 h-5" />
          <span>Pay Pending Dues</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Total Fee (Annual)</div>
           <div className="text-3xl font-black text-white tracking-tighter">₹45,000</div>
           <div className="mt-4 flex items-center text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Fully Verified
           </div>
           <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-800/20 group-hover:text-indigo-500/10 transition-all -z-10" />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Paid Amount</div>
           <div className="text-3xl font-black text-white tracking-tighter text-emerald-500">₹42,500</div>
           <div className="mt-4 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
           <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Pending Balance</div>
           <div className="text-3xl font-black text-white tracking-tighter text-amber-500">₹2,500</div>
           <div className="mt-4 flex items-center text-slate-400 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Due by June 15, 2026
           </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800">
           <h3 className="text-lg font-bold text-white flex items-center tracking-tight">
             <Receipt className="w-5 h-5 mr-2 text-indigo-500" />
             Payment History
           </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold border-b border-slate-800">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Method</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {paymentHistory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs text-white font-bold">{item.id}</span>
                  </td>
                  <td className="px-8 py-5 text-slate-400 text-sm">{item.date}</td>
                  <td className="px-8 py-5 font-black text-white text-sm">{item.amount}</td>
                  <td className="px-8 py-5 text-slate-500 text-xs uppercase tracking-wider">{item.method}</td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-indigo-500/10 rounded-xl text-slate-500 hover:text-indigo-500 transition-all shadow-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-950/30 text-center border-t border-slate-800">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Only successful transactions are listed here</p>
        </div>
      </div>

      {/* Important Note */}
      <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl flex items-start space-x-4">
         <AlertCircle className="w-6 h-6 text-indigo-500 flex-shrink-0" />
         <div>
            <h4 className="text-white font-bold text-sm mb-1 tracking-tight">Need assistance with payments?</h4>
            <p className="text-slate-400 text-xs leading-relaxed">If you face any issues while paying your fees online, please visit the accounts department between 10:00 AM to 04:00 PM or email us at <span className="text-indigo-400 font-bold">accounts@sfams.edu</span>.</p>
         </div>
      </div>
    </div>
  );
}
