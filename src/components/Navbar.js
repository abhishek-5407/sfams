"use client";
import React, { useState, useEffect } from 'react';
import { GraduationCap, Menu, X, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SFAMS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Features</Link>
            <Link href="#about" className="text-slate-300 hover:text-white transition-colors font-medium">About</Link>
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors font-medium">Login</Link>
            <Link href="/register" className="text-slate-300 hover:text-white transition-colors font-medium border-l border-slate-800 pl-8">Register</Link>
            <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/25">
              <LogIn className="w-4 h-4" />
              <span>Portal Access</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4 absolute top-full left-0 right-0 animate-in slide-in-from-top duration-300">
          <Link href="#features" className="block text-slate-300 font-medium py-2">Features</Link>
          <Link href="#about" className="block text-slate-300 font-medium py-2">About</Link>
          <Link href="/login" className="block text-slate-300 font-medium py-2">Login</Link>
          <Link href="/register" className="block bg-blue-600 text-white text-center py-3 rounded-xl font-bold">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
