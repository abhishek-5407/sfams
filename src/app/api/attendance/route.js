import connectDB from "../../../../backend-api/db/mongodb";
import Attendance from "../../../../backend-api/models/Attendance";
import { NextResponse } from "next/server";

// Save Attendance (POST)
export async function POST(req) {
  try {
    const { attendanceData, date, markedBy } = await req.json();
    await connectDB();

    // Create multiple records
    const records = attendanceData.map(item => ({
      student: item.studentId,
      date: new Date(date),
      status: item.status,
      markedBy,
      remarks: item.remarks || ""
    }));

    await Attendance.insertMany(records);

    return NextResponse.json({ message: "Attendance saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Fetch Attendance (GET - optionally filtered by student/date)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    
    await connectDB();
    
    let query = {};
    if (studentId) query.student = studentId;

    const records = await Attendance.find(query).sort({ date: -1 });
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching attendance" }, { status: 500 });
  }
}
