import { NextResponse } from "next/server";

// Test academy management endpoint that doesn't require database
export async function GET(request) {
  try {
    // Return mock academies for testing
    const mockAcademies = [
      {
        id: 'academy-1',
        name: 'Football Academy - Main Campus',
        location: 'Main City, Country',
        description: 'Main campus with state-of-the-art facilities',
        contactEmail: 'info@footballacademy.com',
        contactPhone: '+1-555-1234567',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-2',
        name: 'Football Academy - Branch 1',
        location: 'Branch City, Country',
        description: 'Branch offering comprehensive football training programs',
        contactEmail: 'branch1@footballacademy.com',
        contactPhone: '+1-555-1234568',
        users: [],
        players: [],
        matches: [],
        events: [],
        trainingPlans: []
      },
      {
        id: 'academy-3',
        name: 'Football Academy - Branch 2',
        location: 'Branch City 2, Country',
        description: 'Branch with modern training facilities and experienced coaches',
        contactEmail: 'branch2@footballacademy.com',
        contactPhone: '+1-555-1234569',
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


