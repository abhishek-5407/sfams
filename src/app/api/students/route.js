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

export async function POST(req) {
  try {
    const { name, email, rollNumber, class: className, batch, phone, fatherName, course, semester, address, totalFees } = await req.json();
    await connectDB();

    // 1. Create User
    const user = await User.create({
      name,
      email,
      password: "password123", // Default password
      role: 'student'
    });

    // 2. Create Student profile
    const student = await Student.create({
      user: user._id,
      rollNumber,
      class: className,
      batch,
      phone,
      fatherName,
      course,
      semester,
      address,
      totalFees: Number(totalFees),
      paidAmount: 0,
      attendancePercentage: 0
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, email, ...updateData } = await req.json();
    await connectDB();

    const student = await Student.findById(id).populate('user');
    if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 });

    // Update User details
    if (name || email) {
      await User.findByIdAndUpdate(student.user._id, { name, email });
    }

    // Update Student details
    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, { new: true }).populate('user');

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connectDB();

    const student = await Student.findById(id);
    if (student) {
      await User.findByIdAndDelete(student.user);
      await Student.findByIdAndDelete(id);
    }

    return NextResponse.json({ message: "Student deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
