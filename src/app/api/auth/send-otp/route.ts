import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    // Replace with Twilio / Firebase Phone Auth in production
    // For now, return success
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your phone",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
