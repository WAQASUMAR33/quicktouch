import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

// POST: Create a new sale
export async function POST(request) {
  const startTime = Date.now();
  console.log('Starting POST /api/sale');

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

    // Validate required fields for Sale
    const requiredSaleFields = [
      "p_id",
      "sup_id",
      "weight",
      "no_of_bags",
      "amount_per_bag",
      "freight_per_bag",
      "total_amount",
      "total_freight_amount",
      "net_total",
      "total_sale_amount",
      "vehicle_no",
      "pre_balance",
      "payment",
      "balance",
      "created_at",
    ];
    const missingSaleFields = requiredSaleFields.filter((field) => data[field] === undefined);
    if (missingSaleFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required sale fields: ${missingSaleFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate date and created_at
    if (data.date && isNaN(Date.parse(data.date))) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }
    if (isNaN(Date.parse(data.created_at))) {
      return NextResponse.json(
        { error: "Invalid created_at format" },
        { status: 400 }
      );
    }

    // Validate saleDetails is an array and not empty
    if (!Array.isArray(data.saleDetails) || data.saleDetails.length === 0) {
      return NextResponse.json(
        { error: "saleDetails must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate required fields for each SaleDetails entry
    const requiredSaleDetailsFields = [
      "v_no",
      "p_id",
      "d_id",
      "no_of_bags",
      "unit_rate",
      "freight_rate",
      "total_amount_bags",
      "total_amount_freight",
      "net_total_amount",
      "pre_balance",
      "payment",
      "balance",
      "created_at",
    ];
    for (const [index, detail] of data.saleDetails.entries()) {
      const missingFields = requiredSaleDetailsFields.filter(
        (field) => detail[field] === undefined
      );
      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Missing required fields in saleDetails[${index}]: ${missingFields.join(", ")}` },
          { status: 400 }
        );
      }
      if (isNaN(Date.parse(detail.created_at))) {
        return NextResponse.json(
          { error: `Invalid created_at format in saleDetails[${index}]` },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields for Sale
    const saleNumericFields = {
      p_id: parseInt(data.p_id),
      sup_id: parseInt(data.sup_id),
      weight: parseFloat(data.weight),
      no_of_bags: parseInt(data.no_of_bags),
      amount_per_bag: parseFloat(data.amount_per_bag),
      freight_per_bag: parseFloat(data.freight_per_bag),
      total_amount: parseFloat(data.total_amount),
      total_freight_amount: parseFloat(data.total_freight_amount),
      net_total: parseFloat(data.net_total),
      total_sale_amount: parseFloat(data.total_sale_amount),
      pre_balance: parseFloat(data.pre_balance),
      payment: parseFloat(data.payment),
      balance: parseFloat(data.balance),
    };

    // Check for invalid numeric fields in Sale
    const invalidSaleFields = Object.entries(saleNumericFields).filter(([_, value]) => isNaN(value));
    if (invalidSaleFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid numeric fields in sale: ${invalidSaleFields.map(([field]) => field).join(", ")}` },
        { status: 400 }
      );
    }

    // Validate numeric fields for each SaleDetails entry
    const saleDetailsNumericFields = data.saleDetails.map((detail, index) => {
      const numericFields = {
        p_id: parseInt(detail.p_id),
        d_id: parseInt(detail.d_id),
        no_of_bags: parseInt(detail.no_of_bags),
        unit_rate: parseFloat(detail.unit_rate),
        freight_rate: parseFloat(detail.freight_rate),
        total_amount_bags: parseFloat(detail.total_amount_bags),
        total_amount_freight: parseFloat(detail.total_amount_freight),
        net_total_amount: parseFloat(detail.net_total_amount),
        pre_balance: parseFloat(detail.pre_balance),
        payment: parseFloat(detail.payment),
        balance: parseFloat(detail.balance),
      };
      const invalidFields = Object.entries(numericFields).filter(([_, value]) => isNaN(value));
      if (invalidFields.length > 0) {
        throw new Error(`Invalid numeric fields in saleDetails[${index}]: ${invalidFields.map(([field]) => field).join(", ")}`);
      }
      return numericFields;
    });

    // Validate positive or non-negative fields for Sale
    const nonNegativeSaleFields = [
      "weight",
      "no_of_bags",
      "amount_per_bag",
      "freight_per_bag",
      "total_amount",
      "total_freight_amount",
      "net_total",
      "payment",
    ];
    const negativeSaleFields = nonNegativeSaleFields.filter((field) => saleNumericFields[field] < 0);
    if (negativeSaleFields.length > 0) {
      return NextResponse.json(
        { error: `Sale fields must be non-negative: ${negativeSaleFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate positive or non-negative fields for each SaleDetails entry
    const nonNegativeSaleDetailsFields = [
      "no_of_bags",
      "unit_rate",
      "freight_rate",
      "total_amount_bags",
      "total_amount_freight",
      "net_total_amount",
      "payment",
    ];
    for (const [index, numericFields] of saleDetailsNumericFields.entries()) {
      const negativeFields = nonNegativeSaleDetailsFields.filter(
        (field) => numericFields[field] < 0
      );
      if (negativeFields.length > 0) {
        return NextResponse.json(
          { error: `SaleDetails[${index}] fields must be non-negative: ${negativeFields.join(", ")}` },
          { status: 400 }
        );
      }
    }

    // Fetch product, supplier, and unique dealers concurrently
    console.log('Fetching product, supplier, dealers');
    const uniqueDealerIds = [...new Set(data.saleDetails.map((detail) => parseInt(detail.d_id)))];
    const [product, supplier, dealers] = await Promise.all([
      prisma.product.findUnique({
        where: { p_id: saleNumericFields.p_id },
      }),
      prisma.supplier.findUnique({
        where: { sup_id: saleNumericFields.sup_id },
        select: { sup_id: true, sup_balance: true },
      }),
      prisma.dealer.findMany({
        where: { dealer_id: { in: uniqueDealerIds } },
        select: { dealer_id: true, dealer_balance: true },
      }),
    ]);
    console.log(`Fetched data in ${Date.now() - startTime}ms`);

    // Validate product exists
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate supplier exists
    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    // Validate all dealers exist
    const foundDealerIds = dealers.map((dealer) => dealer.dealer_id);
    const missingDealerIds = uniqueDealerIds.filter((id) => !foundDealerIds.includes(id));
    if (missingDealerIds.length > 0) {
      return NextResponse.json(
        { error: `Dealers not found: ${missingDealerIds.join(", ")}` },
        { status: 404 }
      );
    }

    // Start transaction with increased timeout (30 seconds)
    console.log('Starting transaction');
    const result = await prisma.$transaction(
      async (tx) => {
        // Create sale with manual created_at
        console.log('Creating sale');
        const sale = await tx.sale.create({
          data: {
            p_id: saleNumericFields.p_id,
            sup_id: saleNumericFields.sup_id,
            weight: saleNumericFields.weight,
            no_of_bags: saleNumericFields.no_of_bags,
            amount_per_bag: saleNumericFields.amount_per_bag,
            freight_per_bag: saleNumericFields.freight_per_bag,
            total_amount: saleNumericFields.total_amount,
            total_freight_amount: saleNumericFields.total_freight_amount,
            net_total: saleNumericFields.net_total,
            total_sale_amount: saleNumericFields.total_sale_amount,
            vehicle_no: data.vehicle_no,
            pre_balance: saleNumericFields.pre_balance,
            payment: saleNumericFields.payment,
            balance: saleNumericFields.balance,
            date: data.date,
            created_at: new Date(data.created_at),
          },
        });
        console.log(`Sale created in ${Date.now() - startTime}ms`, { sale_id: sale.sale_id });

        // Update supplier balance and create SupTrnx
        console.log('Updating supplier');
        const newSupplierBalance = supplier.sup_balance + saleNumericFields.net_total - saleNumericFields.payment;
        await tx.supplier.update({
          where: { sup_id: saleNumericFields.sup_id },
          data: { sup_balance: newSupplierBalance },
        });
        await tx.supTrnx.create({
          data: {
            sup_id: saleNumericFields.sup_id,
            pre_balance: supplier.sup_balance,
            amount_out: saleNumericFields.net_total,
            payment: saleNumericFields.payment,
            balance: newSupplierBalance,
            details: `Sale ID: ${sale.sale_id}`,
            created_at: new Date(data.created_at),
          },
        });
        console.log(`Supplier updated in ${Date.now() - startTime}ms`);

        // Create sale details with manual created_at
        console.log('Creating saleDetails');
        const saleDetailsData = data.saleDetails.map((detail, index) => {
          const numericFields = saleDetailsNumericFields[index];
          return {
            sale_id: sale.sale_id,
            v_no: detail.v_no,
            p_id: numericFields.p_id,
            d_id: numericFields.d_id,
            no_of_bags: numericFields.no_of_bags,
            unit_rate: numericFields.unit_rate,
            freight_rate: numericFields.freight_rate,
            total_amount_bags: numericFields.total_amount_bags,
            total_amount_freight: numericFields.total_amount_freight,
            net_total_amount: numericFields.net_total_amount,
            pre_balance: numericFields.pre_balance,
            payment: numericFields.payment,
            balance: numericFields.balance,
            created_at: new Date(detail.created_at),
          };
        });
        const saleDetailsResult = await tx.saleDetails.createMany({
          data: saleDetailsData,
        });
        console.log(`SaleDetails created in ${Date.now() - startTime}ms`, { count: saleDetailsResult.count });

        // Update dealer balances and create DealerTrnx
        console.log('Updating dealers');
        const dealerUpdates = [];
        const dealerTrnxData = [];
        for (const [index, detail] of data.saleDetails.entries()) {
          const numericFields = saleDetailsNumericFields[index];
          const dealer = dealers.find((d) => d.dealer_id === numericFields.d_id);
          const newDealerBalance = dealer.dealer_balance + numericFields.net_total_amount - numericFields.payment;
          dealerUpdates.push(
            tx.dealer.update({
              where: { dealer_id: numericFields.d_id },
              data: { dealer_balance: newDealerBalance },
            })
          );
          dealerTrnxData.push({
            d_id: numericFields.d_id,
            pre_balance: dealer.dealer_balance,
            amount_out: numericFields.net_total_amount,
            payment: numericFields.payment,
            balance: newDealerBalance,
            details: `Sale Details ID: ${sale.sale_id}-${index + 1}`,
            created_at: new Date(detail.created_at),
          });
        }
        await Promise.all(dealerUpdates);
        await tx.dealerTrnx.createMany({
          data: dealerTrnxData,
        });
        console.log(`Dealers updated in ${Date.now() - startTime}ms`);

        return { sale_id: sale.sale_id, sale_details_ids: Array(saleDetailsResult.count).fill(sale.sale_id) };
      },
      {
        timeout: 30000, // Maximum reasonable timeout (30 seconds)
      }
    );

    console.log(`Transaction completed in ${Date.now() - startTime}ms`);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Invalid product ID, supplier ID, or dealer ID" },
        { status: 400 }
      );
    }
    if (error.message.includes("Unknown argument")) {
      return NextResponse.json(
        { error: "Invalid field in sale creation", details: error.message },
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
        weight: true,
        no_of_bags: true,
        amount_per_bag: true,
        freight_per_bag: true,
        total_amount: true,
        total_freight_amount: true,
        net_total: true,
        total_sale_amount: true,
        vehicle_no: true,
        pre_balance: true,
        payment: true,
        balance: true,
        date: true,
        created_at: true,
        updated_at: true,
        saleDetails: {
          select: {
            sales_details_id: true,
            v_no: true,
            p_id: true,
            d_id: true,
            product: {
              select: {
                p_id: true,
                p_title: true,
              },
            },
            dealer: {
              select: {
                dealer_id: true,
                dealer_name: true,
              },
            },
            no_of_bags: true,
            unit_rate: true,
            freight_rate: true,
            total_amount_bags: true,
            total_amount_freight: true,
            net_total_amount: true,
            pre_balance: true,
            payment: true,
            balance: true,
            created_at: true,
            updated_at: true,
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