"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  LogOut, 
  GraduationCap,
  Bell,
  History
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Teacher Dashboard', href: '/teacher-dashboard' },
  { icon: CalendarCheck, label: 'Mark Attendance', href: '/teacher-dashboard/attendance' },
  { icon: History, label: 'Attendance History', href: '/dashboard/attendance-history' },
  { icon: Users, label: 'My Students', href: '/teacher-dashboard/students' },
];

export default function TeacherSidebar() {
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
          <div className="bg-emerald-600 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SFAMS</span>
        </Link>
        <div className="mt-2 px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-lg inline-block border border-emerald-500/20">
          Teacher Portal
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
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold">
            MS
          </div>
          <div>
            <div className="text-sm font-bold text-white">Mr. Sharma</div>
            <div className="text-xs text-slate-500">Mathematics Dept.</div>
          </div>
          <button className="ml-auto text-slate-500 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
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
