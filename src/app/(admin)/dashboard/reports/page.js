"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download,
  Loader2,
  Table as TableIcon
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('students');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData(reportType);
  }, [reportType]);

  const fetchReportData = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/reports?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        const result = await res.json();
        toast.error(result.error || result.message || 'Failed to load report');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (data.length === 0) return;
    const doc = new jsPDF();
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 15);
    
    let head = [];
    let body = [];

    if (reportType === 'students') {
      head = [['Name', 'Roll Number', 'Class', 'Total Fees', 'Paid Amount']];
      body = data.map(s => [s.user?.name || '', s.rollNumber, s.class, s.totalFees, s.paidAmount]);
    } else if (reportType === 'attendance') {
      head = [['Name', 'Roll Number', 'Class', 'Total Classes', 'Present', 'Percentage']];
      body = data.map(s => [s.name, s.rollNumber, s.class, s.totalClasses, s.present, `${s.percentage}%`]);
    } else if (reportType === 'fees') {
      head = [['Student Name', 'Roll Number', 'Amount', 'Date', 'Method', 'Month']];
      body = data.map(f => [f.studentName, f.rollNumber, f.amount, new Date(f.paymentDate).toLocaleDateString(), f.method, f.month]);
    } else if (reportType === 'defaulters') {
      head = [['Name', 'Roll Number', 'Phone', 'Total Fees', 'Paid Amount', 'Due Amount']];
      body = data.map(s => [s.name, s.rollNumber, s.phone, s.totalFees, s.paidAmount, s.dueAmount]);
    }

    doc.autoTable({
      head: head,
      body: body,
      startY: 20,
    });
    doc.save(`${reportType}-report.pdf`);
  };

  const handleExportExcel = () => {
    if (data.length === 0) return;
    
    let excelData = [];
    if (reportType === 'students') {
      excelData = data.map(s => ({
        Name: s.user?.name || '', 
        'Roll Number': s.rollNumber, 
        Class: s.class, 
        'Total Fees': s.totalFees, 
        'Paid Amount': s.paidAmount
      }));
    } else if (reportType === 'attendance') {
      excelData = data.map(s => ({
        Name: s.name, 
        'Roll Number': s.rollNumber, 
        Class: s.class, 
        'Total Classes': s.totalClasses, 
        Present: s.present, 
        Percentage: `${s.percentage}%`
      }));
    } else if (reportType === 'fees') {
      excelData = data.map(f => ({
        'Student Name': f.studentName, 
        'Roll Number': f.rollNumber, 
        Amount: f.amount, 
        Date: new Date(f.paymentDate).toLocaleDateString(), 
        Method: f.method, 
        Month: f.month
      }));
    } else if (reportType === 'defaulters') {
      excelData = data.map(s => ({
        Name: s.name, 
        'Roll Number': s.rollNumber, 
        Phone: s.phone, 
        'Total Fees': s.totalFees, 
        'Paid Amount': s.paidAmount, 
        'Due Amount': s.dueAmount
      }));
    }

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}-report.xlsx`);
  };

  const renderTableHeaders = () => {
    if (reportType === 'students') {
      return (
        <tr>
          <th className="px-6 py-4 font-medium text-left">Name</th>
          <th className="px-6 py-4 font-medium text-left">Roll Number</th>
          <th className="px-6 py-4 font-medium text-left">Class</th>
          <th className="px-6 py-4 font-medium text-left">Total Fees</th>
          <th className="px-6 py-4 font-medium text-left">Paid Amount</th>
        </tr>
      );
    } else if (reportType === 'attendance') {
      return (
        <tr>
          <th className="px-6 py-4 font-medium text-left">Name</th>
          <th className="px-6 py-4 font-medium text-left">Roll Number</th>
          <th className="px-6 py-4 font-medium text-left">Class</th>
          <th className="px-6 py-4 font-medium text-left">Attendance</th>
          <th className="px-6 py-4 font-medium text-left">Percentage</th>
        </tr>
      );
    } else if (reportType === 'fees') {
      return (
        <tr>
          <th className="px-6 py-4 font-medium text-left">Student Name</th>
          <th className="px-6 py-4 font-medium text-left">Amount</th>
          <th className="px-6 py-4 font-medium text-left">Date</th>
          <th className="px-6 py-4 font-medium text-left">Method</th>
          <th className="px-6 py-4 font-medium text-left">Month</th>
        </tr>
      );
    } else if (reportType === 'defaulters') {
      return (
        <tr>
          <th className="px-6 py-4 font-medium text-left">Name</th>
          <th className="px-6 py-4 font-medium text-left">Roll Number</th>
          <th className="px-6 py-4 font-medium text-left">Phone</th>
          <th className="px-6 py-4 font-medium text-left">Due Amount</th>
        </tr>
      );
    }
  };

  const renderTableBody = () => {
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
            No data found for this report.
          </td>
        </tr>
      );
    }

    if (reportType === 'students') {
      return data.map((s, i) => (
        <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors text-slate-300">
          <td className="px-6 py-4">{s.user?.name}</td>
          <td className="px-6 py-4">{s.rollNumber}</td>
          <td className="px-6 py-4">{s.class}</td>
          <td className="px-6 py-4">₹{s.totalFees}</td>
          <td className="px-6 py-4">₹{s.paidAmount}</td>
        </tr>
      ));
    } else if (reportType === 'attendance') {
      return data.map((s, i) => (
        <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors text-slate-300">
          <td className="px-6 py-4">{s.name}</td>
          <td className="px-6 py-4">{s.rollNumber}</td>
          <td className="px-6 py-4">{s.class}</td>
          <td className="px-6 py-4">{s.present} / {s.totalClasses}</td>
          <td className="px-6 py-4">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${s.percentage >= 75 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
              {s.percentage}%
            </span>
          </td>
        </tr>
      ));
    } else if (reportType === 'fees') {
      return data.map((f, i) => (
        <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors text-slate-300">
          <td className="px-6 py-4">{f.studentName}</td>
          <td className="px-6 py-4 font-medium">₹{f.amount}</td>
          <td className="px-6 py-4">{new Date(f.paymentDate).toLocaleDateString()}</td>
          <td className="px-6 py-4">{f.method}</td>
          <td className="px-6 py-4">{f.month}</td>
        </tr>
      ));
    } else if (reportType === 'defaulters') {
      return data.map((s, i) => (
        <tr key={i} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors text-slate-300">
          <td className="px-6 py-4">{s.name}</td>
          <td className="px-6 py-4">{s.rollNumber}</td>
          <td className="px-6 py-4">{s.phone}</td>
          <td className="px-6 py-4 font-bold text-rose-500">₹{s.dueAmount}</td>
        </tr>
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            System Reports
          </h1>
          <p className="text-slate-400">Generate and export administrative reports</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
          >
            <TableIcon className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-colors shadow-lg shadow-rose-600/20"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-800">
          {['students', 'attendance', 'fees', 'defaulters'].map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                reportType === type 
                  ? 'bg-blue-600/10 text-blue-500 border-b-2 border-blue-500' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-400 text-sm">
                  {renderTableHeaders()}
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {renderTableBody()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
