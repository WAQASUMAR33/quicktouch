import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new dealer
export async function POST(request) {
  try {
    // Parse JSON with error handling
    let data;
    try {
      data = await request.json();
    } catch (jsonError) {
      console.error("JSON Parse Error:", jsonError.message);
      return NextResponse.json(
        { error: "Invalid JSON payload", details: jsonError.message },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !data.dealer_name ||
      !data.dealer_address ||
      !data.dealer_city ||
      !data.dealer_cnic ||
      !data.dealer_phone ||
      !data.dealer_route
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: dealer_name, dealer_address, dealer_city, dealer_route",
        },
        { status: 400 }
      );
    }

    // Validate dealer_balance
    const dealerBalance = data.dealer_balance
      ? parseFloat(data.dealer_balance)
      : 0.0;
    if (isNaN(dealerBalance)) {
      return NextResponse.json(
        { error: "Invalid dealer_balance: must be a valid number" },
        { status: 400 }
      );
    }

    // Create dealer
    const dealer = await prisma.dealer.create({
      data: {
        dealer_name: data.dealer_name,
        dealer_address: data.dealer_address,
        dealer_balance: dealerBalance,
        dealer_city: data.dealer_city,
        dealer_route: data.dealer_route,
        dealer_cnic: data.dealer_cnic,
        dealer_phone: data.dealer_phone
      },
    });

    return NextResponse.json(
      {
        id: dealer.dealer_id,
        dealer_name: dealer.dealer_name,
        dealer_address: dealer.dealer_address,
        dealer_balance: parseFloat(dealer.dealer_balance),
        dealer_city: dealer.dealer_city,
        dealer_route: dealer.dealer_route,
        dealer_cnic: dealer.dealer_cnic,
        dealer_phone: dealer.dealer_phone,
        created_at: dealer.created_at,
        updated_at: dealer.updated_at,
        message: "Dealer created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create dealer", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all dealers
export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany();

    return NextResponse.json(dealers, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealers", details: error.message },
      { status: 500 }
    );
  }
}