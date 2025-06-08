import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new supplier transaction
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
    if (!data.sup_id || data.details === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: sup_id, details" },
        { status: 400 }
      );
    }

    // Validate sup_id
    const supId = parseInt(data.sup_id);
    if (isNaN(supId) || supId <= 0) {
      return NextResponse.json(
        { error: "Invalid sup_id: must be a positive integer" },
        { status: 400 }
      );
    }

    // Validate amount_in and amount_out
    const amountIn = data.amount_in !== undefined ? parseFloat(data.amount_in) : 0;
    const amountOut = data.amount_out !== undefined ? parseFloat(data.amount_out) : 0;
    if (isNaN(amountIn) || amountIn < 0) {
      return NextResponse.json(
        { error: "Invalid amount_in: must be a non-negative number" },
        { status: 400 }
      );
    }
    if (isNaN(amountOut) || amountOut < 0) {
      return NextResponse.json(
        { error: "Invalid amount_out: must be a non-negative number" },
        { status: 400 }
      );
    }
    if (amountIn > 0 && amountOut > 0) {
      return NextResponse.json(
        { error: "Cannot have both amount_in and amount_out in the same transaction" },
        { status: 400 }
      );
    }

    // Validate details
    if (typeof data.details !== "string" || data.details.trim() === "") {
      return NextResponse.json(
        { error: "Invalid details: must be a non-empty string" },
        { status: 400 }
      );
    }

    // Run in a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Fetch the supplier
      const supplier = await tx.supplier.findUnique({
        where: { sup_id: supId },
      });

      if (!supplier) {
        throw new Error("Supplier not found");
      }

      // Calculate new balance
      const currentBalance = supplier.sup_balance;
      const newBalance = currentBalance + amountIn - amountOut;

      // Update supplier balance
      await tx.supplier.update({
        where: { sup_id: supId },
        data: { sup_balance: newBalance },
      });

      // Create SupTrnx record
      const supTrnx = await tx.supTrnx.create({
        data: {
          sup_id: supId,
          pre_balance: currentBalance,
          amount_in: amountIn,
          amount_out: amountOut,
          balance: newBalance,
          details: data.details,
        },
      });

      return supTrnx;
    });

    return NextResponse.json(
      {
        trnx_id: result.trnx_id,
        sup_id: result.sup_id,
        pre_balance: result.pre_balance,
        amount_in: result.amount_in,
        amount_out: result.amount_out,
        balance: result.balance,
        details: result.details,
        created_at: result.created_at,
        updated_at: result.updated_at,
        message: "Supplier transaction created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create supplier transaction", details: error.message },
      { status: 500 }
    );
  }
}