import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

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

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerName: String(customerName),
        email: String(email),
        phone: String(phone),
        address: String(address),
        city: String(city),
        postcode: String(postcode),
        total: Number(total),

        items: {
          create: items.map(
            (item: {
              id: number;
              name: string;
              price: string;
              quantity: number;
            }) => ({
              productId: Number(item.id),
              name: String(item.name),
              price: Number(item.price),
              quantity: Number(item.quantity),
            })
          ),
        },
      },

      include: {
        items: true,
      },
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

    return NextResponse.json(
      {
        error: "Failed to create order.",
      },
      { status: 500 }
    );
  }
}