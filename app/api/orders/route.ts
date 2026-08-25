import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

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
      total,
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

    const order = await prisma.$transaction(async (tx) => {
      const orderItems = [];

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

        if (product.stock < quantity) {
          throw new Error(
            `"${product.name}" only has ${product.stock} item(s) in stock.`
          );
        }

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

        orderItems.push({
          productId,
          name: product.name,
          price: Number(product.price),
          quantity,
        });
      }

      const orderNumber = generateOrderNumber();

      return await tx.order.create({
        data: {
          orderNumber,
          customerName: String(customerName),
          email: String(email),
          phone: String(phone),
          address: String(address),
          city: String(city),
          postcode: String(postcode),
          total: Number(total),

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