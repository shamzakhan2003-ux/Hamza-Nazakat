import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const orderNumber =
      request.nextUrl.searchParams.get("orderNumber");

    if (!orderNumber?.trim()) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber.trim(),
      },
      select: {
        orderNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        courier: true,
        trackingNumber: true,
        trackingUrl: true,

        trackingHistory: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            status: true,
            message: true,
            createdAt: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Track order error:", error);

    return NextResponse.json(
      { error: "Unable to track order." },
      { status: 500 }
    );
  }
}