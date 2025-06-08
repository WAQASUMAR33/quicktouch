import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { p_id: productId },
      select: {
        p_id: true,
        p_title: true,
        created_at: true,
        updated_at: true,
        sales: {
          select: {
            sale_id: true,
            amount_per_bag: true,
            no_of_bags: true,
            total_amount: true,
            created_at: true,
          },
        },
        saleDetails: {
          select: {
            sales_details_id: true,
            sales_id: true,
            v_no: true,
            no_of_bags: true,
            unit_rate: true,
            total_amount: true,
            created_at: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
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
    if (!data.p_title) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { p_id: productId },
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
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { p_id: productId },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete product with associated sales or sale details" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}