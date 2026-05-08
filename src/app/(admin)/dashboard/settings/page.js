"use client";
import React from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Camera,
  Save,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-slate-400 mt-2">Manage your account, preferences and institution configurations</p>
      </div>

      {/* Profile Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20">
              AD
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Administrator</h3>
            <p className="text-slate-400 text-sm">Super Admin • Last login 2 hours ago</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all">Change Avatar</button>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all">Remove</button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Display Name</label>
              <input type="text" defaultValue="Administrator" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Email Address</label>
              <input type="email" defaultValue="admin@sfams.edu" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* General Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-white mb-2">Preferences</h3>
          <p className="text-sm text-slate-500">Global system configurations and display settings</p>
        </div>
        <div className="md:col-span-2 space-y-4">
          <SettingsOption icon={<Globe className="w-5 h-5" />} title="Language" description="English (United States)" />
          <SettingsOption icon={<Bell className="w-5 h-5" />} title="Notifications" description="Email and Push notifications enabled" />
          <SettingsOption icon={<Shield className="w-5 h-5" />} title="Security" description="Two-factor authentication is active" />
        </div>
      </div>

      {/* Institution Info */}
      <section className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center">
          <SettingsIcon className="w-5 h-5 mr-2 text-blue-500" />
          Institution Details
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1">College Name</label>
            <input type="text" defaultValue="SFAMS University of Technology" className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Current Session</label>
              <select className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none">
                <option>2025 - 2026</option>
                <option>2026 - 2027</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 ml-1">Timezone</label>
              <select className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none">
                <option>Asia/Kolkata (GMT+5:30)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <button className="flex items-center space-x-2 text-rose-500 hover:text-rose-400 font-bold transition-all px-4 py-2 hover:bg-rose-500/5 rounded-xl">
          <LogOut className="w-4 h-4" />
          <span>Logout Session</span>
        </button>
        <button className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all font-bold group">
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
}

function SettingsOption({ icon, title, description }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all group text-left">
      <div className="flex items-center space-x-4">
        <div className="p-2.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all">
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-all mr-2" />
    </button>
  );
}
