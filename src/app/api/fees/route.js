import connectDB from "../../../../backend-api/db/mongodb";
import Fee from "../../../../backend-api/models/Fee";
import Student from "../../../../backend-api/models/Student";
import { NextResponse } from "next/server";

// Fetch Fee Records (GET)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    await connectDB();
    
    let query = {};
    if (studentId) query.student = studentId;

    const fees = await Fee.find(query).populate('student').sort({ date: -1 });
    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching fees" }, { status: 500 });
  }
}

// Record Payment (POST)
export async function POST(req) {
  try {
    const { studentId, amount, paymentMethod, transactionId, month } = await req.json();
    await connectDB();

    const numAmount = Number(amount);

    // Create Fee Record
    const feeRecord = await Fee.create({
      student: studentId,
      amount: numAmount,
      paymentMethod,
      transactionId: transactionId || "",
      status: 'Paid',
      date: new Date(),
      month
    });

    // Update Student's paidAmount and feesStatus
    const student = await Student.findById(studentId);
    if (student) {
      const newPaidAmount = (student.paidAmount || 0) + numAmount;
      let newStatus = 'unpaid';
      if (newPaidAmount >= student.totalFees) {
        newStatus = 'paid';
      } else if (newPaidAmount > 0) {
        newStatus = 'partial';
      }
      
      await Student.findByIdAndUpdate(studentId, {
        paidAmount: newPaidAmount,
        feesStatus: newStatus
      });
    }

    return NextResponse.json(feeRecord, { status: 201 });
  } catch (error) {
    console.error("Fee Payment Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
