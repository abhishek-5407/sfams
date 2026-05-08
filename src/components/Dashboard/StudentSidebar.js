"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CreditCard, 
  FileText,
  LogOut, 
  GraduationCap,
  Bell,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'My Dashboard', href: '/student-dashboard' },
  { icon: CalendarCheck, label: 'My Attendance', href: '/student-dashboard/attendance' },
  { icon: CreditCard, label: 'Fees & Payments', href: '/student-dashboard/fees' },
  { icon: FileText, label: 'Apply Leave', href: '/student-dashboard/leave' },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SFAMS</span>
        </Link>
        <div className="mt-2 px-2 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest rounded-lg inline-block border border-indigo-500/20">
          Student Portal
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
            RS
          </div>
          <div>
            <div className="text-sm font-bold text-white">Student User</div>
            <div className="text-xs text-slate-500">SFAMS Student</div>
          </div>
          <button className="ml-auto text-slate-500 hover:text-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
