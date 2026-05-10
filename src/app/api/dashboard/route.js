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
      const rawId = decoded.id;
      if (rawId && typeof rawId === 'object') {
        userId = rawId.toString('hex');
      }
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Total Students
    const totalStudents = await Student.countDocuments();

    // Total Fees Collected
    const fees = await Fee.find({ status: 'Paid' });
    const totalFeesCollected = fees.reduce((sum, fee) => sum + fee.amount, 0);

    // Pending Dues
    const students = await Student.find();
    const pendingDues = students.reduce((sum, student) => {
      const total = student.totalFees || 0;
      const paid = student.paidAmount || 0;
      return sum + (total - paid);
    }, 0);

    // Average Attendance
    const attendances = await Attendance.find();
    const totalAttendanceCount = attendances.length;
    const presentAttendanceCount = attendances.filter(a => a.status === 'present').length;
    const avgAttendance = totalAttendanceCount > 0 ? ((presentAttendanceCount / totalAttendanceCount) * 100).toFixed(1) : 0;

    // Recent Fee Payments
    const recentFees = await Fee.find({ status: 'Paid' })
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ paymentDate: -1 })
      .limit(5);

    // Monthly Collection Chart Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // Aggregate fees by month
    const monthlyFees = await Fee.aggregate([
      {
        $match: {
          status: 'Paid',
          paymentDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$paymentDate" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    const feeChartData = months.map((month, index) => {
      const monthData = monthlyFees.find(m => m._id === index + 1);
      return {
        name: month,
        amount: monthData ? monthData.total : 0
      };
    });

    // Attendance Analytics Data (last 7 days)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const attendanceAnalytics = [];
    for (const dateStr of last7Days) {
      const startOfDay = new Date(dateStr);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);

      const dayAttendances = await Attendance.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      const total = dayAttendances.length;
      const present = dayAttendances.filter(a => a.status === 'present').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      attendanceAnalytics.push({
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        percentage
      });
    }

    return NextResponse.json({
      totalStudents,
      totalFeesCollected,
      pendingDues,
      avgAttendance,
      recentFees: recentFees.map(fee => ({
        _id: fee._id,
        studentName: fee.student?.user?.name || 'Unknown',
        amount: fee.amount,
        date: fee.paymentDate,
        status: fee.status
      })),
      feeChartData,
      attendanceAnalytics
    }, { status: 200 });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
