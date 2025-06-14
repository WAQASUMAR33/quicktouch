import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// GET: Fetch all dealer transactions with full dealer details
export async function GET(request) {
  try {
    const transactions = await prisma.dealerTrnx.findMany({
      select: {
        trnx_id: true,
        d_id: true,
        pre_balance: true,
        amount_in: true,
        amount_out: true,
        balance: true,
        details: true,
        created_at: true,
        updated_at: true,
        dealer: {
          select: {
            dealer_id: true,
            dealer_name: true,
            dealer_address: true,
            dealer_balance: true,
            dealer_city: true,
            dealer_route: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealer transactions", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new dealer transaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { d_id, amount_in = 0, amount_out = 0, details = '' } = body;

    // Validate input
    if (!d_id || isNaN(parseInt(d_id))) {
      return NextResponse.json(
        { error: "Valid Dealer ID is required" },
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
      // Fetch dealer's current balance
      const dealer = await tx.dealer.findUnique({
        where: { dealer_id: parseInt(d_id) },
        select: { dealer_id: true, dealer_balance: true },
      });

      if (!dealer) {
        throw new Error("Dealer not found");
      }

      // Calculate balances
      const pre_balance = dealer.dealer_balance;
      const balance = pre_balance + parseFloat(amount_in) - parseFloat(amount_out);

      // Create transaction
      const newTransaction = await tx.dealerTrnx.create({
        data: {
          d_id: dealer.dealer_id,
          pre_balance,
          amount_in: parseFloat(amount_in),
          amount_out: parseFloat(amount_out),
          balance,
          details,
        },
        select: {
          trnx_id: true,
          d_id: true,
          pre_balance: true,
          amount_in: true,
          amount_out: true,
          balance: true,
          details: true,
          created_at: true,
          updated_at: true,
          dealer: {
            select: {
              dealer_id: true,
              dealer_name: true,
              dealer_address: true,
              dealer_balance: true,
              dealer_city: true,
              dealer_route: true,
            },
          },
        },
      });

      // Update dealer balance
      await tx.dealer.update({
        where: { dealer_id: dealer.dealer_id },
        data: { dealer_balance: balance },
      });

      return newTransaction;
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: error.message === "Dealer not found" ? "Dealer not found" : "Failed to create transaction", details: error.message },
      { status: error.message === "Dealer not found" ? 404 : 500 }
    );
  }
}