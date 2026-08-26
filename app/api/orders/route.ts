import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getCurrentCustomer } from "@/app/lib/customerAuth";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);

  return `AM-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      email,
      phone,
      address,
      city,
      postcode,
      items,
    } = body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode
    ) {
      return NextResponse.json(
        {
          error: "All customer information is required.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // =========================
    // GET LOGGED-IN CUSTOMER
    // =========================

    const currentCustomer = await getCurrentCustomer();

    // =========================
    // CREATE ORDER
    // =========================

    const order = await prisma.$transaction(async (tx) => {
      const orderItems = [];

      let serverTotal = 0;

      // =========================
      // CHECK PRODUCTS
      // =========================

      for (const item of items) {
        const productId = Number(item.id);
        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(productId) ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error("Invalid product or quantity.");
        }

        const product = await tx.product.findUnique({
          where: {
            id: productId,
          },
        });

        if (!product) {
          throw new Error(
            `Product "${item.name}" was not found.`
          );
        }

        // =========================
        // STOCK CHECK
        // =========================

        if (product.stock < quantity) {
          throw new Error(
            `"${product.name}" only has ${product.stock} item(s) in stock.`
          );
        }

        // =========================
        // SERVER PRICE
        // =========================

        const productPrice = Number(product.price);

        serverTotal += productPrice * quantity;

        // =========================
        // DECREASE STOCK
        // =========================

        await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });

        // =========================
        // ORDER ITEM
        // =========================

        orderItems.push({
          productId,
          name: product.name,
          price: productPrice,
          quantity,
        });
      }

      serverTotal =
        Math.round(serverTotal * 100) / 100;

      const orderNumber = generateOrderNumber();

      // =========================
      // CREATE ORDER
      // =========================

      return await tx.order.create({
        data: {
          orderNumber,

          // IMPORTANT
          // Save logged-in customer's ID
          customerId: currentCustomer
            ? currentCustomer.id
            : null,

          customerName: String(customerName).trim(),

          email: String(email).trim(),

          phone: String(phone).trim(),

          address: String(address).trim(),

          city: String(city).trim(),

          postcode: String(postcode).trim(),

          total: serverTotal,

          items: {
            create: orderItems,
          },
        },

        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORDER API ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create order.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 }
    );
  }
}