"use client";
import React from 'react';
import { 
  Users, 
  CreditCard, 
  CalendarCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';

const stats = [
  { 
    label: 'Total Students', 
    value: '2,420', 
    change: '+12%', 
    trend: 'up', 
    icon: Users,
    color: 'blue'
  },
  { 
    label: 'Total Fees Collected', 
    value: '₹12.5L', 
    change: '+8%', 
    trend: 'up', 
    icon: CreditCard,
    color: 'emerald'
  },
  { 
    label: 'Avg. Attendance', 
    value: '84.2%', 
    change: '-2%', 
    trend: 'down', 
    icon: CalendarCheck,
    color: 'indigo'
  },
  { 
    label: 'Pending Dues', 
    value: '₹3.2L', 
    change: '+5%', 
    trend: 'up', 
    icon: TrendingUp,
    color: 'amber'
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back, Administrator</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20">
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
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                      <span>Rahul Sharma</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹12,500</td>
                  <td className="px-6 py-4 text-sm text-slate-500">2 mins ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Success</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                      <span>Anjali Gupta</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹8,000</td>
                  <td className="px-6 py-4 text-sm text-slate-500">1 hour ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">Pending</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                      <span>Vikas Singh</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹15,000</td>
                  <td className="px-6 py-4 text-sm text-slate-500">5 hours ago</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Success</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
            <button className="text-blue-500 hover:text-blue-400 font-bold text-sm">View All Transactions</button>
          </div>
        </div>

        {/* Quick Actions / Attendance Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Attendance Status</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Classes Today</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[80%] rounded-full"></div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Add Student
                </button>
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Mark Attendance
                </button>
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Fee Waiver
                </button>
                <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all text-center">
                  Send Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
