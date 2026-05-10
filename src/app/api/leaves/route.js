import connectDB from "../../../../backend-api/db/mongodb";
import Leave from "../../../../backend-api/models/Leave";
import Student from "../../../../backend-api/models/Student";
import User from "../../../../backend-api/models/User";
import Attendance from "../../../../backend-api/models/Attendance"; // Needed to sync approved leaves
import { NextResponse } from "next/server";

// Fetch Leaves (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    await connectDB();
    
    let query = {};
    if (studentId) query.student = studentId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ appliedAt: -1 });
      
    return NextResponse.json(leaves, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching leaves" }, { status: 500 });
  }
}

// Submit Leave (POST)
export async function POST(req) {
  try {
    const { studentId, leaveType, startDate, endDate, reason } = await req.json();
    await connectDB();

    const leave = await Leave.create({
      student: studentId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'Pending'
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error("Leave Submit Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Update Leave Status (PATCH)
export async function PATCH(req) {
  try {
    const { leaveId, status, reviewedBy } = await req.json();
    await connectDB();

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status, reviewedBy },
      { new: true }
    ).populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' }
    });

    if (!updatedLeave) {
      return NextResponse.json({ message: "Leave request not found" }, { status: 404 });
    }

    // If approved, sync with Attendance history
    if (status === 'Approved') {
      const { student, startDate, endDate } = updatedLeave;
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const attendanceOps = [];
      let current = new Date(start);
      
      while (current <= end) {
        const d = new Date(current);
        d.setUTCHours(0, 0, 0, 0);
        
        attendanceOps.push({
          updateOne: {
            filter: { student: student._id, date: d },
            update: { $set: { status: 'leave', markedBy: reviewedBy } },
            upsert: true
          }
        });
        
        current.setDate(current.getDate() + 1);
      }

      if (attendanceOps.length > 0) {
        await Attendance.bulkWrite(attendanceOps);
      }
    }

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error("Leave Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
