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
  Loader2,
  XCircle,
  IndianRupee,
  Calendar,
  Bell,
  Printer,
  ChevronLeft,
  ChevronRight,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export default function FeesPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Payment Modal State
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'Cash',
    transactionId: '',
    month: new Date().toLocaleString('default', { month: 'long' })
  });

  const fetchFeeData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (res.ok) setStudents(data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Payment recorded successfully');
        setShowModal(false);
        setPaymentData({ 
          studentId: '', 
          amount: '', 
          paymentMethod: 'Cash', 
          transactionId: '',
          month: new Date().toLocaleString('default', { month: 'long' }) 
        });
        fetchFeeData();
        
        // Open receipt modal
        setSelectedReceipt(data);
        generateQR(`Receipt No: ${data._id}\nStudent: ${data.studentId}\nAmount: ₹${data.amount}\nDate: ${new Date(data.date).toLocaleDateString()}`);
        setShowReceipt(true);
      } else {
        toast.error(data.message || 'Error recording payment');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const sendAlert = async (studentId, type) => {
    try {
      toast.loading('Sending alert...', { id: 'alert' });
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, studentId })
      });
      if (res.ok) {
        toast.success('Alert sent successfully', { id: 'alert' });
      } else {
        toast.error('Failed to send alert', { id: 'alert' });
      }
    } catch (err) {
      toast.error('Error sending alert', { id: 'alert' });
    }
  };

  const generateQR = async (text) => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrCodeData(url);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    totalCollection: students.reduce((acc, s) => acc + (s.paidAmount || 0), 0),
    totalDues: students.reduce((acc, s) => acc + ((s.totalFees || 0) - (s.paidAmount || 0)), 0),
    paidStudents: students.filter(s => s.feesStatus === 'paid').length
  };

  const filtered = students.filter(s => 
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Fees Management</h1>
          <p className="text-slate-400 text-sm mt-1">Track payments, manage dues and generate receipts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold text-sm"
          >
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
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
              placeholder="Search by student name or Roll No..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
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
                  <th className="px-8 py-5">Dues</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {currentItems.map((record, i) => (
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
                    <td className="px-8 py-5 text-rose-400 font-bold">₹{((record.totalFees || 0) - (record.paidAmount || 0)).toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <FeeStatusBadge status={record.feesStatus} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {record.feesStatus !== 'paid' && (
                          <button 
                            onClick={() => sendAlert(record._id, 'fee-due')}
                            className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                            title="Send Fee Alert"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between text-white">
          <div className="text-xs text-slate-500 font-medium">
            Showing {Math.min(filtered.length, (currentPage-1)*itemsPerPage+1)} to {Math.min(filtered.length, currentPage*itemsPerPage)} of {filtered.length} students
          </div>
          <div className="flex items-center space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg">{currentPage} / {totalPages || 1}</div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600/10 p-2 rounded-xl">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Record Payment</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">New Fee Entry</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-500 hover:text-white transition-all"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleRecordPayment} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Student</label>
                <select 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                  value={paymentData.studentId}
                  onChange={(e) => setPaymentData({...paymentData, studentId: e.target.value})}
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.user?.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="number"
                    required
                    placeholder="Enter amount paid"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Method</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer"
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                  >
                    <option>Cash</option>
                    <option>Online</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Check</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">For Month</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none cursor-pointer"
                    value={paymentData.month}
                    onChange={(e) => setPaymentData({...paymentData, month: e.target.value})}
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transaction ID (Optional)</label>
                <input 
                  type="text"
                  placeholder="Reference number if any..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                <span>{submitting ? 'Processing...' : 'Confirm Payment'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal with QR */}
      {showReceipt && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className="bg-white text-slate-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative p-8">
            <div className="text-center space-y-4 border-b border-dashed border-slate-300 pb-6 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
                <IndianRupee className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-blue-600">Payment Receipt</h3>
                <p className="text-slate-500 text-xs font-bold">SFAMS Digital Receipt</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Amount Paid</span>
                <span className="text-2xl font-black text-slate-900">₹{selectedReceipt.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Receipt No</span>
                <span className="text-xs font-mono font-bold text-slate-700">{selectedReceipt._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Date</span>
                <span className="text-xs font-bold text-slate-700">{new Date(selectedReceipt.date).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Method</span>
                <span className="text-xs font-bold text-slate-700">{selectedReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-200">
              {qrCodeData && <img src={qrCodeData} alt="QR Code" className="w-32 h-32" />}
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan to verify</span>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button onClick={() => setShowReceipt(false)} className="px-6 bg-slate-100 text-slate-900 font-bold py-3 rounded-xl">Close</button>
            </div>
          </div>
        </div>
      )}
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
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.unpaid}`}>
      {status || 'unpaid'}
    </span>
  );
}

