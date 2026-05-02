"use client";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">SFAMS</h1>
        <div>
          <button className="mr-4 hover:text-gray-200">Login</button>
          <button className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200">
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-20 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Student Fees & Attendance Management System
        </h2>
        <p className="text-lg mb-6">
          Manage student data, attendance and fees easily in one place.
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 grid md:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Student Management</h3>
          <p>Add, update and manage all student records easily.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
          <p>Mark and track daily attendance with reports.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Fees Management</h3>
          <p>Track fees payments and pending dues efficiently.</p>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center p-4">
        © 2026 SFAMS | All Rights Reserved
      </footer>

    </div>
  );
};