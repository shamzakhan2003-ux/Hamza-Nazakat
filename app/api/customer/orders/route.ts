import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/app/lib/customerAuth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: customer.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
          },
        },
        trackingHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Customer orders error:", error);

    return NextResponse.json(
      {
        error: "Unable to load your orders.",
      },
      { status: 500 }
    );
  }
}
