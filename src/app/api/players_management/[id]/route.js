import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single supplier by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.findUnique({
      where: { sup_id: supplierId },
      select: {
        sup_id: true,
        sup_name: true,
        sup_address: true,
        sup_phoneNo: true,
        sup_taxNo: true,
        sup_balance: true,
        created_at: true,
        updated_at: true,
        supTrnx: {
          select: {
            trnx_id: true,
            amount_in: true,
            amount_out: true,
            balance: true,
            details: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a supplier by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID" },
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
    if (
      !data.sup_name &&
      !data.sup_address &&
      !data.sup_phoneNo &&
      !data.sup_taxNo &&
      data.sup_balance === undefined
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate sup_balance if provided
    let supplierBalance;
    if (data.sup_balance !== undefined) {
      supplierBalance = parseFloat(data.sup_balance);
      if (isNaN(supplierBalance)) {
        return NextResponse.json(
          { error: "Invalid sup_balance: must be a valid number" },
          { status: 400 }
        );
      }
    }

    // Validate sup_phoneNo if provided
    if (data.sup_phoneNo && !/^\+?\d{7,15}$/.test(data.sup_phoneNo)) {
      return NextResponse.json(
        { error: "Invalid sup_phoneNo: must be 7-15 digits, optional leading +" },
        { status: 400 }
      );
    }

    // Update supplier
    const supplier = await prisma.supplier.update({
      where: { sup_id: supplierId },
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
        message: "Supplier updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2002" && error.meta?.target?.includes("sup_taxNo")) {
      return NextResponse.json(
        { error: "Supplier tax number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update supplier", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a supplier by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const supplierId = parseInt(id);

    if (isNaN(supplierId)) {
      return NextResponse.json(
        { error: "Invalid supplier ID" },
        { status: 400 }
      );
    }

    await prisma.supplier.delete({
      where: { sup_id: supplierId },
    });

    return NextResponse.json(
      { message: "Supplier deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete supplier with associated transactions" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete supplier", details: error.message },
      { status: 500 }
    );
  }
}