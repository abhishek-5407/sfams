import { NextResponse } from 'next/server';
import connectDB from '../../../../backend-api/db/mongodb';
import Student from '../../../../backend-api/models/Student';
import Fee from '../../../../backend-api/models/Fee';
import Attendance from '../../../../backend-api/models/Attendance';
import User from '../../../../backend-api/models/User';
import * as jose from 'jose';

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
    let decoded;
    try {
      const { payload } = await jose.jwtVerify(token, secret);
      decoded = payload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    let userId = decoded.id;
    if (typeof userId === 'object') {
      userId = userId._id || userId.id || (userId.toString && userId.toString() !== '[object Object]' ? userId.toString() : null);
    }
    
    if (!userId || userId === '[object Object]') {
      // Last resort: if it's a buffer-like object from the screenshot
      const rawId = decoded.id;
      if (rawId && typeof rawId === 'object') {
        userId = rawId.toString('hex');
      }
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'students') {
      const students = await Student.find().populate('user', 'name email');
      return NextResponse.json(students, { status: 200 });
    } 
    else if (type === 'attendance') {
      // Calculate attendance per student
      const students = await Student.find().populate('user', 'name');
      const attendances = await Attendance.find();

      const attendanceReport = students.map(student => {
        const studentAttendances = attendances.filter(a => a.student && a.student.toString() === student._id.toString());
        const total = studentAttendances.length;
        const present = studentAttendances.filter(a => a.status === 'present').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
        
        return {
          id: student._id,
          name: student.user?.name || 'Unknown',
          rollNumber: student.rollNumber || 'N/A',
          class: student.class || 'N/A',
          totalClasses: total,
          present: present,
          percentage: percentage
        };
      });
      return NextResponse.json(attendanceReport, { status: 200 });
    }
    else if (type === 'fees') {
      const fees = await Fee.find().populate({
        path: 'student',
        populate: { path: 'user', select: 'name' }
      }).sort({ paymentDate: -1 });
      
      const feesReport = fees.map(f => ({
        id: f._id,
        studentName: f.student?.user?.name || 'Unknown',
        rollNumber: f.student?.rollNumber || 'N/A',
        amount: f.amount,
        paymentDate: f.paymentDate,
        method: f.paymentMethod,
        month: f.month,
        status: f.status
      }));
      return NextResponse.json(feesReport, { status: 200 });
    }
    else if (type === 'defaulters') {
      const students = await Student.find().populate('user', 'name');
      const defaulters = students.filter(s => (s.totalFees - s.paidAmount) > 0).map(s => ({
        id: s._id,
        name: s.user?.name || 'Unknown',
        rollNumber: s.rollNumber || 'N/A',
        phone: s.phone || 'N/A',
        totalFees: s.totalFees || 0,
        paidAmount: s.paidAmount || 0,
        dueAmount: (s.totalFees || 0) - (s.paidAmount || 0)
      }));
      return NextResponse.json(defaulters, { status: 200 });
    }
    else {
      return NextResponse.json({ message: 'Invalid report type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Reports API Error:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
