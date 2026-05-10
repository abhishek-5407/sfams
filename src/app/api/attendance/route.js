import connectDB from "../../../../backend-api/db/mongodb";
import Attendance from "../../../../backend-api/models/Attendance";
import Student from "../../../../backend-api/models/Student"; // Needed for population
import User from "../../../../backend-api/models/User";       // Needed for population
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Save Attendance (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Attendance POST Body:", JSON.stringify(body, null, 2));
    const { attendanceData, date, markedBy } = body;
    await connectDB();

    if (!attendanceData || attendanceData.length === 0) {
      return NextResponse.json({ message: "No attendance data provided" }, { status: 400 });
    }

    // Normalize date to midnight UTC
    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    if (!mongoose.Types.ObjectId.isValid(markedBy)) {
      return NextResponse.json({ message: "Invalid markedBy ID" }, { status: 400 });
    }

    // Use bulkWrite for efficient upserts
    const operations = attendanceData.map(item => {
      if (!mongoose.Types.ObjectId.isValid(item.studentId)) {
        throw new Error(`Invalid student ID: ${item.studentId}`);
      }
      return {
        updateOne: {
          filter: { 
            student: new mongoose.Types.ObjectId(item.studentId), 
            date: attendanceDate 
          },
          update: { 
            $set: { 
              status: item.status, 
              markedBy: new mongoose.Types.ObjectId(markedBy),
              remarks: item.remarks || "" 
            } 
          },
          upsert: true
        }
      };
    });

    await Attendance.bulkWrite(operations);

    return NextResponse.json({ message: "Attendance saved/updated successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// Fetch Attendance (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    
    await connectDB();
    
    let query = {};
    if (studentId) query.student = studentId;
    if (date) {
      const searchDate = new Date(date);
      searchDate.setUTCHours(0, 0, 0, 0);
      query.date = searchDate;
    }

    const records = await Attendance.find(query)
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
      .sort({ date: -1 });
      
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Error fetching attendance" }, { status: 500 });
  }
}
