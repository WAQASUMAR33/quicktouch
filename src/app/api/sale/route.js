import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new sale
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
      !data.p_id ||
      !data.sup_id ||
      data.amount_per_bag === undefined ||
      data.no_of_bags === undefined ||
      data.freight_per_bag === undefined ||
      data.total_amount === undefined ||
      data.net_total === undefined ||
      !data.vehicle_no
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: p_id, sup_id, amount_per_bag, no_of_bags, freight_per_bag, total_amount, net_total, vehicle_no",
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const productId = parseInt(data.p_id);
    const supplierId = parseInt(data.sup_id);
    const amountPerBag = parseFloat(data.amount_per_bag);
    const noOfBags = parseInt(data.no_of_bags);
    const freightPerBag = parseFloat(data.freight_per_bag);
    const totalAmount = parseFloat(data.total_amount);
    const netTotal = parseFloat(data.net_total);
    const tax1 = data.tax_1 ? parseFloat(data.tax_1) : 0.0;
    const tax2 = data.tax_2 ? parseFloat(data.tax_2) : 0.0;
    const tax3 = data.tax_3 ? parseFloat(data.tax_3) : 0.0;

    if (
      isNaN(productId) ||
      isNaN(supplierId) ||
      isNaN(amountPerBag) ||
      isNaN(noOfBags) ||
      isNaN(freightPerBag) ||
      isNaN(totalAmount) ||
      isNaN(netTotal) ||
      isNaN(tax1) ||
      isNaN(tax2) ||
      isNaN(tax3)
    ) {
      return NextResponse.json(
        { error: "Invalid numeric fields: must be valid numbers" },
        { status: 400 }
      );
    }

    if (amountPerBag < 0 || freightPerBag < 0 || totalAmount < 0 || netTotal < 0 || noOfBags <= 0) {
      return NextResponse.json(
        { error: "Numeric fields must be positive (no_of_bags > 0)" },
        { status: 400 }
      );
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { p_id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Validate supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { sup_id: supplierId },
    });
    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        p_id: productId,
        sup_id: supplierId,
        amount_per_bag: amountPerBag,
        no_of_bags: noOfBags,
        freight_per_bag: freightPerBag,
        total_amount: totalAmount,
        tax_1: tax1,
        tax_2: tax2,
        tax_3: tax3,
        net_total: netTotal,
        vehicle_no: data.vehicle_no,
      },
    });

    // Return only the sale_id
    return NextResponse.json(sale.sale_id, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid product ID or supplier ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create sale", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all sales
export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      select: {
        sale_id: true,
        p_id: true,
        sup_id: true,
        product: {
          select: {
            p_id: true,
            p_title: true,
          },
        },
        supplier: {
          select: {
            sup_id: true,
            sup_name: true,
          },
        },
        amount_per_bag: true,
        no_of_bags: true,
        freight_per_bag: true,
        total_amount: true,
        tax_1: true,
        tax_2: true,
        tax_3: true,
        net_total: true,
        vehicle_no: true,
        created_at: true,
        updated_at: true,
        saleDetails: {
          select: {
            sales_details_id: true,
            v_no: true,
            p_id: true,
            no_of_bags: true,
            unit_rate: true,
            freight: true,
            total_amount: true,
          },
        },
      },
    });

    return NextResponse.json(sales, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales", details: error.message },
      { status: 500 }
    );
  }
}