import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
  try {
    const dealer_id = parseInt(params.id);
    if (isNaN(dealer_id)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { dealer_id },
      select: {
        dealer_id: true,
        dealer_name: true,
        dealer_address: true,
        dealer_balance: true,
        dealer_city: true,
        dealer_route: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealer", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const dealer_id = parseInt(params.id);
    if (isNaN(dealer_id)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    const data = await request.json();

    // Check if dealer exists
    const dealer = await prisma.dealer.findUnique({
      where: { dealer_id },
    });
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // Update dealer
    const updatedDealer = await prisma.dealer.update({
      where: { dealer_id },
      data: {
        dealer_name: data.dealer_name ?? dealer.dealer_name,
        dealer_address: data.dealer_address ?? dealer.dealer_address,
        dealer_balance: parseFloat(data.dealer_balance)  ?? parseFloat(dealer.dealer_balance) ,
        dealer_city: data.dealer_city ?? dealer.dealer_city,
        dealer_route: data.dealer_route ?? dealer.dealer_route,
        dealer_cnic: data.dealer_cnic ?? dealer.dealer_cnic,
        dealer_phone: data.dealer_phone ?? dealer.dealer_phone
      },
    });

    return NextResponse.json(
      {
        id: updatedDealer.dealer_id,
        dealer_name: updatedDealer.dealer_name,
        dealer_address: updatedDealer.dealer_address,
        dealer_balance: updatedDealer.dealer_balance,
        dealer_city: updatedDealer.dealer_city,
        dealer_route: updatedDealer.dealer_route,
        dealer_cnic: updatedDealer.dealer_cnic,
        dealer_phone: updatedDealer.dealer_phone,
        created_at: updatedDealer.created_at,
        updated_at: updatedDealer.updated_at,
        message: "Dealer updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update dealer", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const dealer_id = parseInt(params.id);
    if (isNaN(dealer_id)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    // Check if dealer exists
    const dealer = await prisma.dealer.findUnique({
      where: { dealer_id },
    });
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // Delete dealer
    await prisma.dealer.delete({
      where: { dealer_id },
    });

    return NextResponse.json(
      { message: "Dealer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete dealer", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}