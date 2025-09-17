import { NextResponse } from "next/server";

// Test academy management endpoint that doesn't require database
export async function GET(request) {
  try {
    // Return mock academies for testing
    const mockAcademies = [
      {
        id: 'academy-1',
        name: 'Quick Touch Academy - Main Campus',
        location: 'Lahore, Pakistan',
        description: 'Main campus of Quick Touch Academy with state-of-the-art facilities',
        contactEmail: 'info@quicktouchacademy.com',
        contactPhone: '+92-300-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-2',
        name: 'Quick Touch Academy - Karachi Branch',
        location: 'Karachi, Pakistan',
        description: 'Karachi branch offering comprehensive football training programs',
        contactEmail: 'karachi@quicktouchacademy.com',
        contactPhone: '+92-21-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-3',
        name: 'Quick Touch Academy - Islamabad Branch',
        location: 'Islamabad, Pakistan',
        description: 'Islamabad branch with modern training facilities and experienced coaches',
        contactEmail: 'islamabad@quicktouchacademy.com',
        contactPhone: '+92-51-1234567',
        users: [],
        players: [],
        matches: [],
        trainingPlans: []
      }
    ];

    return NextResponse.json(
      { message: 'Academies retrieved successfully (test data)', academies: mockAcademies },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET Test Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch academies', details: error.message },
      { status: 500 }
    );
  }
}


