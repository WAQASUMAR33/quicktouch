import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new tax
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
    if (!data.tax_name || data.tax_per === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: tax_name, tax_per",
        },
        { status: 400 }
      );
    }

    // Validate tax_per
    const taxPer = parseFloat(data.tax_per);
    if (isNaN(taxPer) || taxPer < 0) {
      return NextResponse.json(
        { error: "Invalid tax_per: must be a non-negative number" },
        { status: 400 }
      );
    }

    // Create tax
    const tax = await prisma.tax.create({
      data: {
        tax_name: data.tax_name,
        tax_per: taxPer,
      },
    });

    return NextResponse.json(
      {
        id: tax.tax_id,
        tax_name: tax.tax_name,
        tax_per: tax.tax_per,
        created_at: tax.created_at,
        updated_at: tax.updated_at,
        message: "Tax created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create tax", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all taxes
export async function GET() {
  try {
    const taxes = await prisma.tax.findMany({
      select: {
        tax_id: true,
        tax_name: true,
        tax_per: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(taxes, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch taxes", details: error.message },
      { status: 500 }
    );
  }
}