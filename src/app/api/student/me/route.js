import connectDB from "../../../../../backend-api/db/mongodb";
import Student from "../../../../../backend-api/models/Student";
import User from "../../../../../backend-api/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    await connectDB();

    const studentData = await Student.findOne({ user: userId }).populate('user', 'name email avatar');

    if (!studentData) {
      return NextResponse.json({ message: "Student record not found" }, { status: 404 });
    }

    return NextResponse.json(studentData, { status: 200 });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
