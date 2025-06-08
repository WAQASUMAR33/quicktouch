import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET: Fetch a single sale by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const saleId = parseInt(id);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { error: "Invalid sale ID" },
        { status: 400 }
      );
    }

    const sale = await prisma.sale.findUnique({
      where: { sale_id: saleId },
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

    if (!sale) {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sale, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale", details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a sale by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const saleId = parseInt(id);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { error: "Invalid sale ID" },
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
      !data.p_id &&
      !data.sup_id &&
      data.amount_per_bag === undefined &&
      data.no_of_bags === undefined &&
      data.freight_per_bag === undefined &&
      data.total_amount === undefined &&
      data.tax_1 === undefined &&
      data.tax_2 === undefined &&
      data.tax_3 === undefined &&
      data.net_total === undefined &&
      !data.vehicle_no
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate numeric fields if provided
    let productId, supplierId, amountPerBag, noOfBags, freightPerBag, totalAmount, netTotal, tax1, tax2, tax3;
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

    if (data.sup_id) {
      supplierId = parseInt(data.sup_id);
      if (isNaN(supplierId)) {
        return NextResponse.json(
          { error: "Invalid sup_id: must be a valid number" },
          { status: 400 }
        );
      }
      const supplier = await prisma.supplier.findUnique({
        where: { sup_id: supplierId },
      });
      if (!supplier) {
        return NextResponse.json(
          { error: "Supplier not found" },
          { status: 404 }
        );
      }
    }

    if (data.amount_per_bag !== undefined) {
      amountPerBag = parseFloat(data.amount_per_bag);
      if (isNaN(amountPerBag) || amountPerBag < 0) {
        return NextResponse.json(
          { error: "Invalid amount_per_bag: must be a non-negative number" },
          { status: 400 }
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

    if (data.freight_per_bag !== undefined) {
      freightPerBag = parseFloat(data.freight_per_bag);
      if (isNaN(freightPerBag) || freightPerBag < 0) {
        return NextResponse.json(
          { error: "Invalid freight_per_bag: must be a non-negative number" },
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

    if (data.net_total !== undefined) {
      netTotal = parseFloat(data.net_total);
      if (isNaN(netTotal) || netTotal < 0) {
        return NextResponse.json(
          { error: "Invalid net_total: must be a non-negative number" },
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

    // Update sale
    const sale = await prisma.sale.update({
      where: { sale_id: saleId },
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

    return NextResponse.json(
      {
        id: sale.sale_id,
        p_id: sale.p_id,
        sup_id: sale.sup_id,
        amount_per_bag: sale.amount_per_bag,
        no_of_bags: sale.no_of_bags,
        freight_per_bag: sale.freight_per_bag,
        total_amount: sale.total_amount,
        tax_1: sale.tax_1,
        tax_2: sale.tax_2,
        tax_3: sale.tax_3,
        net_total: sale.net_total,
        vehicle_no: sale.vehicle_no,
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        message: "Sale updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid product ID or supplier ID" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update sale", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a sale by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const saleId = parseInt(id);

    if (isNaN(saleId)) {
      return NextResponse.json(
        { error: "Invalid sale ID" },
        { status: 400 }
      );
    }

    await prisma.sale.delete({
      where: { sale_id: saleId },
    });

    return NextResponse.json(
      { message: "Sale deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Sale not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete sale with associated sale details" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete sale", details: error.message },
      { status: 500 }
    );
  }
}