import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new sale detail
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
      !data.sales_id ||
      !data.v_no ||
      !data.p_id ||
      !data.d_id ||
      data.no_of_bags === undefined ||
      data.unit_rate === undefined ||
      data.freight === undefined ||
      data.total_amount === undefined ||
      data.total_amount_without_tax === undefined ||
      data.total_amount_with_tax === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: sales_id, v_no, p_id, d_id, no_of_bags, unit_rate, freight, total_amount, total_amount_without_tax, total_amount_with_tax",
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const saleId = parseInt(data.sales_id);
    const productId = parseInt(data.p_id);
    const dealerId = parseInt(data.d_id);
    const noOfBags = parseInt(data.no_of_bags);
    const unitRate = parseFloat(data.unit_rate);
    const freight = parseFloat(data.freight);
    const totalAmount = parseFloat(data.total_amount);
    const totalAmountWithoutTax = parseFloat(data.total_amount_without_tax);
    const totalAmountWithTax = parseFloat(data.total_amount_with_tax);
    const tax1 = data.tax_1 ? parseFloat(data.tax_1) : 0.0;
    const tax2 = data.tax_2 ? parseFloat(data.tax_2) : 0.0;
    const tax3 = data.tax_3 ? parseFloat(data.tax_3) : 0.0;

    if (
      isNaN(saleId) ||
      isNaN(productId) ||
      isNaN(dealerId) ||
      isNaN(noOfBags) ||
      isNaN(unitRate) ||
      isNaN(freight) ||
      isNaN(totalAmount) ||
      isNaN(totalAmountWithoutTax) ||
      isNaN(totalAmountWithTax) ||
      isNaN(tax1) ||
      isNaN(tax2) ||
      isNaN(tax3)
    ) {
      return NextResponse.json(
        { error: "Invalid numeric fields: must be valid numbers" },
        { status: 400 }
      );
    }

    if (
      noOfBags <= 0 ||
      unitRate < 0 ||
      freight < 0 ||
      totalAmount < 0 ||
      totalAmountWithoutTax < 0 ||
      totalAmountWithTax < 0
    ) {
      return NextResponse.json(
        { error: "Numeric fields must be positive (no_of_bags > 0)" },
        { status: 400 }
      );
    }

    // Validate foreign keys
    const sale = await prisma.sale.findUnique({
      where: { sale_id: saleId },
    });
    if (!sale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { p_id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const dealer = await prisma.dealer.findUnique({
      where: { dealer_id: dealerId },
    });
    if (!dealer) {
      return NextResponse.json(
        { error: "Dealer not found" },
        { status: 404 }
      );
    }

    // Create sale detail
    const saleDetail = await prisma.saleDetails.create({
      data: {
        sales_id: saleId,
        v_no: data.v_no,
        p_id: productId,
        d_id: dealerId,
        no_of_bags: noOfBags,
        unit_rate: unitRate,
        freight: freight,
        total_amount: totalAmount,
        tax_1: tax1,
        tax_2: tax2,
        tax_3: tax3,
        total_amount_without_tax: totalAmountWithoutTax,
        total_amount_with_tax: totalAmountWithTax,
      },
    });

    // Return only the sales_details_id
    return NextResponse.json(saleDetail.sales_details_id, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid sale ID, product ID, or dealer ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create sale detail", details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all sale details
export async function GET() {
  try {
    const saleDetails = await prisma.saleDetails.findMany({
      select: {
        sales_details_id: true,
        sales_id: true,
        sale: {
          select: {
            sale_id: true,
          },
        },
        v_no: true,
        p_id: true,
        product: {
          select: {
            p_id: true,
            p_title: true,
          },
        },
        d_id: true,
        dealer: {
          select: {
            dealer_id: true,
            dealer_name: true,
          },
        },
        no_of_bags: true,
        unit_rate: true,
        freight: true,
        total_amount: true,
        tax_1: true,
        tax_2: true,
        tax_3: true,
        total_amount_without_tax: true,
        total_amount_with_tax: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(saleDetails, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale details", details: error.message },
      { status: 500 }
    );
  }
}