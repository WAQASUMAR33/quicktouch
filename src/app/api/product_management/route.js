import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new product
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
    if (!data.p_title) {
      return NextResponse.json(
        { error: "Missing required field: p_title" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        p_title: data.p_title,
      },
    });

    return NextResponse.json(
      {
        id: product.p_id,
        p_title: product.p_title,
        created_at: product.created_at,
        updated_at: product.updated_at,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}