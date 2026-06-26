import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp || otp.length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit OTP code" },
        { status: 400 }
      );
    }

    // Replace with real OTP verification in production
    // For now, return success
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
