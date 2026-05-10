"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Students', 
      value: data?.totalStudents || 0, 
      change: '+5%', 
      trend: 'up', 
      icon: Users,
      color: 'blue'
    },
    { 
      label: 'Total Fees Collected', 
      value: `₹${data?.totalFeesCollected?.toLocaleString() || 0}`, 
      change: '+12%', 
      trend: 'up', 
      icon: CreditCard,
      color: 'emerald'
    },
    { 
      label: 'Avg. Attendance', 
      value: `${data?.avgAttendance || 0}%`, 
      change: '+2%', 
      trend: 'up', 
      icon: CalendarCheck,
      color: 'indigo'
    },
    { 
      label: 'Pending Dues', 
      value: `₹${data?.pendingDues?.toLocaleString() || 0}`, 
      change: '-5%', 
      trend: 'down', 
      icon: TrendingUp,
      color: 'amber'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, Administrator</p>
        </div>
        <button 
          onClick={() => router.push('/dashboard/reports')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
        >
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span>{stat.change}</span>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Monthly Collection (Fees)</h3>
          <div className="h-64 w-full">
            {data?.feeChartData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.feeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <RechartsTooltip 
                    cursor={{fill: '#1e293b'}} 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Attendance Analytics (Last 7 Days)</h3>
          <div className="h-64 w-full">
            {data?.attendanceAnalytics && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.attendanceAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a'}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Fee Payments</h3>
            <button className="text-slate-400 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-sm border-b border-slate-800/50">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {data?.recentFees?.length > 0 ? data.recentFees.map((fee) => (
                  <tr key={fee._id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                          {fee.studentName.charAt(0).toUpperCase()}
                        </div>
                        <span>{fee.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{fee.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(fee.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No recent payments</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
            <button onClick={() => router.push('/dashboard/fees')} className="text-blue-500 hover:text-blue-400 font-bold text-sm">View All Transactions</button>
          </div>
        </div>

        {/* Quick Actions / Attendance Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Attendance Overview</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Today's Avg Attendance</span>
                <span className="text-white font-bold">{data?.avgAttendance || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${data?.avgAttendance || 0}%` }}></div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => router.push('/dashboard/students')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Add Student
                </button>
                <button onClick={() => router.push('/dashboard/attendance')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Mark Attendance
                </button>
                <button onClick={() => router.push('/dashboard/fees')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Collect Fees
                </button>
                <button onClick={() => router.push('/dashboard/reports')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
