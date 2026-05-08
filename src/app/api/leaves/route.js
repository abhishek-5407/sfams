import connectDB from "../../../../backend-api/db/mongodb";
import Leave from "../../../../backend-api/models/Leave";
import { NextResponse } from "next/server";

// Fetch Leaves (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    await connectDB();
    
    let query = {};
    if (studentId) query.student = studentId;

    const leaves = await Leave.find(query).sort({ appliedAt: -1 });
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
