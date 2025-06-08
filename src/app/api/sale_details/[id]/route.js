import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single sale detail by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const saleDetailId = parseInt(id);

    if (isNaN(saleDetailId)) {
      return NextResponse.json(
        { error: "Invalid sale detail ID" },
        { status: 400 }
      );
    }

    const saleDetail = await prisma.saleDetails.findUnique({
      where: { sales_details_id: saleDetailId },
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

    if (!saleDetail) {
      return NextResponse.json(
        { error: "Sale detail not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(saleDetail, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale detail", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a sale detail by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const saleDetailId = parseInt(id);

    if (isNaN(saleDetailId)) {
      return NextResponse.json(
        { error: "Invalid sale detail ID" },
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
      !data.sales_id &&
      !data.v_no &&
      !data.p_id &&
      !data.d_id &&
      data.no_of_bags === undefined &&
      data.unit_rate === undefined &&
      data.freight === undefined &&
      data.total_amount === undefined &&
      data.tax_1 === undefined &&
      data.tax_2 === undefined &&
      data.tax_3 === undefined &&
      data.total_amount_without_tax === undefined &&
      data.total_amount_with_tax === undefined
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate numeric fields if provided
    let saleId, productId, dealerId, noOfBags, unitRate, freight, totalAmount, totalAmountWithoutTax, totalAmountWithTax, tax1, tax2, tax3;
    if (data.sales_id) {
      saleId = parseInt(data.sales_id);
      if (isNaN(saleId)) {
        return NextResponse.json(
          { error: "Invalid sales_id: must be a valid number" },
          { status: 400 }
        );
      }
      const sale = await prisma.sale.findUnique({
        where: { sale_id: saleId },
      });
      if (!sale) {
        return NextResponse.json(
          { error: "Sale not found" },
          { status: 404 }
        );
      }
    }

    if (data.p_id) {
      productId = parseInt(data.p_id);
      if (isNaN(productId)) {
        return NextResponse.json(
          { error: "Invalid p_id: must be a valid number" },
          { status: 400 }
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
    }

    if (data.d_id) {
      dealerId = parseInt(data.d_id);
      if (isNaN(dealerId)) {
        return NextResponse.json(
          { error: "Invalid d_id: must be a valid number" },
          { status: 400 }
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
    }

    if (data.no_of_bags !== undefined) {
      noOfBags = parseInt(data.no_of_bags);
      if (isNaN(noOfBags) || noOfBags <= 0) {
        return NextResponse.json(
          { error: "Invalid no_of_bags: must be a positive integer" },
          { status: 400 }
        );
      }
    }

    if (data.unit_rate !== undefined) {
      unitRate = parseFloat(data.unit_rate);
      if (isNaN(unitRate) || unitRate < 0) {
        return NextResponse.json(
          { error: "Invalid unit_rate: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    if (data.freight !== undefined) {
      freight = parseFloat(data.freight);
      if (isNaN(freight) || freight < 0) {
        return NextResponse.json(
          { error: "Invalid freight: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    if (data.total_amount !== undefined) {
      totalAmount = parseFloat(data.total_amount);
      if (isNaN(totalAmount) || totalAmount < 0) {
        return NextResponse.json(
          { error: "Invalid total_amount: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    if (data.total_amount_without_tax !== undefined) {
      totalAmountWithoutTax = parseFloat(data.total_amount_without_tax);
      if (isNaN(totalAmountWithoutTax) || totalAmountWithoutTax < 0) {
        return NextResponse.json(
          { error: "Invalid total_amount_without_tax: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    if (data.total_amount_with_tax !== undefined) {
      totalAmountWithTax = parseFloat(data.total_amount_with_tax);
      if (isNaN(totalAmountWithTax) || totalAmountWithTax < 0) {
        return NextResponse.json(
          { error: "Invalid total_amount_with_tax: must be a non-negative number" },
          { status: 400 }
        );
      }
    }

    if (data.tax_1 !== undefined) {
      tax1 = parseFloat(data.tax_1);
      if (isNaN(tax1)) {
        return NextResponse.json(
          { error: "Invalid tax_1: must be a valid number" },
          { status: 400 }
        );
      }
    }

    if (data.tax_2 !== undefined) {
      tax2 = parseFloat(data.tax_2);
      if (isNaN(tax2)) {
        return NextResponse.json(
          { error: "Invalid tax_2: must be a valid number" },
          { status: 400 }
        );
      }
    }

    if (data.tax_3 !== undefined) {
      tax3 = parseFloat(data.tax_3);
      if (isNaN(tax3)) {
        return NextResponse.json(
          { error: "Invalid tax_3: must be a valid number" },
          { status: 400 }
        );
      }
    }

    // Update sale detail
    const saleDetail = await prisma.saleDetails.update({
      where: { sales_details_id: saleDetailId },
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

    return NextResponse.json(
      {
        id: saleDetail.sales_details_id,
        sales_id: saleDetail.sales_id,
        v_no: saleDetail.v_no,
        p_id: saleDetail.p_id,
        d_id: saleDetail.d_id,
        no_of_bags: saleDetail.no_of_bags,
        unit_rate: saleDetail.unit_rate,
        freight: saleDetail.freight,
        total_amount: saleDetail.total_amount,
        tax_1: saleDetail.tax_1,
        tax_2: saleDetail.tax_2,
        tax_3: saleDetail.tax_3,
        total_amount_without_tax: saleDetail.total_amount_without_tax,
        total_amount_with_tax: saleDetail.total_amount_with_tax,
        created_at: saleDetail.created_at,
        updated_at: saleDetail.updated_at,
        message: "Sale detail updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Sale detail not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid sale ID, product ID, or dealer ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update sale detail", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a sale detail by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const saleDetailId = parseInt(id);

    if (isNaN(saleDetailId)) {
      return NextResponse.json(
        { error: "Invalid sale detail ID" },
        { status: 400 }
      );
    }

    await prisma.saleDetails.delete({
      where: { sales_details_id: saleDetailId },
    });

    return NextResponse.json(
      { message: "Sale detail deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Sale detail not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete sale detail", details: error.message },
      { status: 500 }
    );
  }
}