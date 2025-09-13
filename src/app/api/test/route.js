import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      message: "API is working!",
      timestamp: new Date().toISOString(),
      status: "success"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "API test failed", details: error.message },
      { status: 500 }
    );
  }
}


