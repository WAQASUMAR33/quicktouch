import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// GET: Fetch all supplier transactions with full supplier details
export async function GET(request) {
  try {
    const transactions = await prisma.supTrnx.findMany({
      select: {
        trnx_id: true,
        sup_id: true,
        pre_balance: true,
        amount_in: true,
        amount_out: true,
        balance: true,
        details: true,
        created_at: true,
        updated_at: true,
        supplier: {
          select: {
            sup_id: true,
            sup_name: true,
            sup_address: true,
            sup_phoneNo: true,
            sup_taxNo: true,
            sup_balance: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier transactions", details: error.message },
      { status: 500 }
    );
  }
}


// POST: Create a new supplier transaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { sup_id, amount_in = 0, amount_out = 0, details = '' } = body;

    // Validate input
    if (!sup_id || isNaN(parseInt(sup_id))) {
      return NextResponse.json(
        { error: "Valid Supplier ID is required" },
        { status: 400 }
      );
    }
    if (isNaN(amount_in) || isNaN(amount_out)) {
      return NextResponse.json(
        { error: "Amount In and Amount Out must be valid numbers" },
        { status: 400 }
      );
    }
    if (amount_in < 0 || amount_out < 0) {
      return NextResponse.json(
        { error: "Amount In and Amount Out must be non-negative" },
        { status: 400 }
      );
    }

    // Use Prisma transaction for atomicity
    const transaction = await prisma.$transaction(async (tx) => {
      // Fetch supplier's current balance
      const supplier = await tx.supplier.findUnique({
        where: { sup_id: parseInt(sup_id) },
        select: { sup_id: true, sup_balance: true },
      });

      if (!supplier) {
        throw new Error("Supplier not found");
      }

      // Calculate balances
      const pre_balance = supplier.sup_balance;
      const balance = pre_balance + parseFloat(amount_in) - parseFloat(amount_out);

      // Create transaction
      const newTransaction = await tx.supTrnx.create({
        data: {
          sup_id: supplier.sup_id,
          pre_balance,
          amount_in: parseFloat(amount_in),
          amount_out: parseFloat(amount_out),
          balance,
          details,
        },
        select: {
          trnx_id: true,
          sup_id: true,
          pre_balance: true,
          amount_in: true,
          amount_out: true,
          balance: true,
          details: true,
          created_at: true,
          updated_at: true,
          supplier: {
            select: {
              sup_id: true,
              sup_name: true,
              sup_address: true,
              sup_phoneNo: true,
              sup_taxNo: true,
              sup_balance: true,
            },
          },
        },
      });

      // Update supplier balance
      await tx.supplier.update({
        where: { sup_id: supplier.sup_id },
        data: { sup_balance: balance },
      });

      return newTransaction;
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message === "Supplier not found" ? "Supplier not found" : "Failed to create transaction", details: error.message },
      { status: error.message === "Supplier not found" ? 404 : 500 }
    );
  }
}