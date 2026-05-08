import connectDB from "../../../../backend-api/db/mongodb";
import Student from "../../../../backend-api/models/Student";
import User from "../../../../backend-api/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Fetch students and populate user details (name, email)
    const students = await Student.find({}).populate('user', 'name email');

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
