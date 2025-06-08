import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single tax by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const taxId = parseInt(id);

    if (isNaN(taxId)) {
      return NextResponse.json(
        { error: "Invalid tax ID" },
        { status: 400 }
      );
    }

    const tax = await prisma.tax.findUnique({
      where: { tax_id: taxId },
      select: {
        tax_id: true,
        tax_name: true,
        tax_per: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!tax) {
      return NextResponse.json(
        { error: "Tax not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tax, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tax", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a tax by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const taxId = parseInt(id);

    if (isNaN(taxId)) {
      return NextResponse.json(
        { error: "Invalid tax ID" },
        { status: 400 }
      );
    }

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

    // Validate that at least one field is provided
    if (!data.tax_name && data.tax_per === undefined) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate tax_per if provided
    let taxPer;
    if (data.tax_per !== undefined) {
      taxPer = parseFloat(data.tax_per);
      if (isNaN(taxPer) || taxPer < 0) {
        return NextResponse.json(
          { error: "Invalid tax_per: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    // Update tax
    const tax = await prisma.tax.update({
      where: { tax_id: taxId },
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
        message: "Tax updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Tax not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update tax", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a tax by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const taxId = parseInt(id);

    if (isNaN(taxId)) {
      return NextResponse.json(
        { error: "Invalid tax ID" },
        { status: 400 }
      );
    }

    await prisma.tax.delete({
      where: { tax_id: taxId },
    });

    return NextResponse.json(
      { message: "Tax deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Tax not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete tax", details: error.message },
      { status: 500 }
    );
  }
}