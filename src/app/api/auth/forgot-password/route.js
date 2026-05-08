import connectDB from "../../../../../backend-api/db/mongodb";
import User from "../../../../../backend-api/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sendEmail from "../../../../../backend-api/utils/sendEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    console.log("Searching for email:", email);
    if (!user) {
      console.log("No user found with this email in the database.");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log("User found:", user.email);

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 3600000); // 1 Hour

    // Save to User
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    // Reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - SFAMS",
        message: `You requested a password reset. Please use this link: ${resetUrl}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 10px;">
            <h2 style="color: #2563eb;">Password Reset Request</h2>
            <p>Hi ${user.name || 'User'},</p>
            <p>Someone requested a password reset for your SFAMS account. If this was you, click the button below to set a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p style="color: #64748b; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      user.resetToken = undefined;
      user.resetTokenExpire = undefined;
      await user.save();
      return NextResponse.json({ message: "Error sending email" }, { status: 500 });
    }

    return NextResponse.json({ message: "Reset link sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
