import { NextResponse } from "next/server";

// Test signup endpoint that doesn't require database
export async function POST(request) {
  try {
    const { fullName, email, password, role, phone, academyId } = await request.json();

    // Validate input
    if (!fullName || !email || !password || !role || !academyId) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, password, role, academyId' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['player', 'coach', 'admin', 'scout', 'parent'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: player, coach, admin, scout, parent' },
        { status: 400 }
      );
    }

    // Mock successful user creation
    const mockUser = {
      id: 'test-user-' + Date.now(),
      fullName,
      email,
      role,
      phone: phone || null,
      academyId,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user: mockUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}


