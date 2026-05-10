import connectDB from "../../../../backend-api/db/mongodb";
import Student from "../../../../backend-api/models/Student";
import User from "../../../../backend-api/models/User";
import sendEmail from "../../../../backend-api/utils/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { type, studentId } = await req.json();
    await connectDB();

    const student = await Student.findById(studentId).populate("user");
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const user = student.user;
    if (!user || !user.email) {
      return NextResponse.json({ message: "Student email not found" }, { status: 400 });
    }

    let subject = "";
    let message = "";
    let html = "";

    if (type === "fee-due") {
      const dueAmount = student.totalFees - student.paidAmount;
      subject = "Fee Payment Reminder - SFAMS";
      message = `Dear ${user.name}, this is a reminder that your fee payment of ₹${dueAmount} is pending. Please pay at the earliest.`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #2563eb;">Fee Due Reminder</h2>
          <p>Dear <b>${user.name}</b>,</p>
          <p>This is a reminder regarding your outstanding fees for the current semester.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Total Fees:</b> ₹${student.totalFees}</p>
            <p style="margin: 5px 0;"><b>Paid Amount:</b> ₹${student.paidAmount}</p>
            <p style="margin: 5px 0; color: #e11d48;"><b>Remaining Balance:</b> ₹${dueAmount}</p>
          </div>
          <p>Please visit the accountant office or pay online via the student portal.</p>
          <p style="font-size: 12px; color: #64748b;">SFAMS Management System</p>
        </div>
      `;
    } else if (type === "attendance-warning") {
      subject = "Low Attendance Warning - SFAMS";
      message = `Dear ${user.name}, your attendance is currently ${student.attendancePercentage}%, which is below the required 75%. Please attend classes regularly.`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #e11d48;">Attendance Warning</h2>
          <p>Dear <b>${user.name}</b>,</p>
          <p>We noticed that your attendance has fallen below the mandatory requirement of 75%.</p>
          <div style="background: #fff1f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecdd3;">
            <p style="margin: 5px 0;"><b>Current Attendance:</b> <span style="color: #e11d48; font-weight: bold;">${student.attendancePercentage}%</span></p>
          </div>
          <p>Low attendance can affect your eligibility for examinations. Please ensure regular attendance in your upcoming classes.</p>
          <p style="font-size: 12px; color: #64748b;">SFAMS Management System</p>
        </div>
      `;
    } else {
      return NextResponse.json({ message: "Invalid notification type" }, { status: 400 });
    }

    await sendEmail({
      email: user.email,
      subject,
      message,
      html
    });

    return NextResponse.json({ message: "Notification sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Notification Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
