"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-sm font-semibold">New: Next-Gen Analytics for 2026</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Modern Student Management <br /> <span className="text-blue-500">Reimagined</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            SFAMS provides a seamless, unified platform for college administrators, teachers, and students to track attendance and manage fees with elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-500/25 active:scale-95">
              <span>Enter Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-bold text-lg transition-all active:scale-95 text-white">
              Register Now
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-slate-800/50 py-10">
            <div>
              <div className="text-3xl font-bold mb-1 text-white">50k+</div>
              <div className="text-sm text-slate-500 font-medium">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">99.9%</div>
              <div className="text-sm text-slate-500 font-medium">System Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">120+</div>
              <div className="text-sm text-slate-500 font-medium">Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1 text-white">24/7</div>
              <div className="text-sm text-slate-500 font-medium">Instant Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-blue-500 font-bold tracking-wider uppercase text-sm mb-3">Core Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Designed for Modern Academia</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Student Lifecycle"
              description="Complete management from enrollment to graduation with dynamic record tracking."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8" />}
              title="Attendance Intelligence"
              description="Smart marking systems with automated percentage calculation and low-attendance alerts."
            />
            <FeatureCard 
              icon={<CreditCard className="w-8 h-8" />}
              title="Secure Fee Portals"
              description="Digital payment tracking with automated receipt generation and due date notifications."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8" />}
              title="Deep Analytics"
              description="Visual reports for administrators to track revenue trends and academic participation."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8" />}
              title="Role-Based Security"
              description="Enterprise-grade security with granular permissions for Admin, Teacher, and Student."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-8 h-8" />}
              title="Automated Reports"
              description="Generate PDF/Excel reports instantly for defaulter lists and attendance summaries."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">Ready to transform your college?</h3>
              <p className="text-blue-100 mb-10 text-lg max-w-2xl mx-auto">
                Join hundreds of educational institutions that trust SFAMS to manage their daily operations.
              </p>
              <Link href="/register" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all inline-flex items-center space-x-2">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 SFAMS (Student Fees & Attendance Management System). All Rights Reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-slate-400 text-xs">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">API Status</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all hover:translate-y-[-8px]">
      <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h4>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}