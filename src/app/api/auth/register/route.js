import connectDB from "../../../../../backend-api/db/mongodb";
import User from "../../../../../backend-api/models/User";
import Student from "../../../../../backend-api/models/Student";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    // If role is student, also create a student record
    if (user.role === "student") {
      await Student.create({
        user: user._id,
        rollNumber: `STU-${Date.now().toString().slice(-6)}`, // Temporary roll number
        class: "Not Assigned",
        batch: "2025-26",
        totalFees: 0,
      });
    }

    return NextResponse.json({ message: "User registered successfully", user: { id: user._id, name: user.name, role: user.role } }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
