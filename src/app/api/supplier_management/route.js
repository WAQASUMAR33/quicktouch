import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new supplier
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
      !data.sup_name ||
      !data.sup_address ||
      !data.sup_phoneNo ||
      !data.sup_taxNo
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: sup_name, sup_address, sup_phoneNo, sup_taxNo",
        },
        { status: 400 }
      );
    }

    // Validate sup_balance
    const supplierBalance = data.sup_balance
      ? parseFloat(data.sup_balance)
      : 0.0;
    if (isNaN(supplierBalance)) {
      return NextResponse.json(
        { error: "Invalid sup_balance: must be a valid number" },
        { status: 400 }
      );
    }

    // Validate sup_phoneNo format (basic check for digits and optional +)
    if (!/^\+?\d{7,15}$/.test(data.sup_phoneNo)) {
      return NextResponse.json(
        { error: "Invalid sup_phoneNo: must be 7-15 digits, optional leading +" },
        { status: 400 }
      );
    }

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        sup_name: data.sup_name,
        sup_address: data.sup_address,
        sup_phoneNo: data.sup_phoneNo,
        sup_taxNo: data.sup_taxNo,
        sup_balance: supplierBalance,
      },
    });

    return NextResponse.json(
      {
        id: supplier.sup_id,
        sup_name: supplier.sup_name,
        sup_address: supplier.sup_address,
        sup_phoneNo: supplier.sup_phoneNo,
        sup_taxNo: supplier.sup_taxNo,
        sup_balance: supplier.sup_balance,
        created_at: supplier.created_at,
        updated_at: supplier.updated_at,
        message: "Supplier created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("sup_taxNo")) {
      return NextResponse.json(
        { error: "Supplier tax number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create supplier", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: {
        sup_id: true,
        sup_name: true,
        sup_address: true,
        sup_phoneNo: true,
        sup_taxNo: true,
        sup_balance: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(suppliers, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers", details: error.message },
      { status: 500 }
    );
  }
}