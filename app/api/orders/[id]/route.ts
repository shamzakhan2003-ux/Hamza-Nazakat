import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // =========================
    // ADMIN AUTHENTICATION
    // =========================

    const cookieStore = await cookies();
    const adminSession =
      cookieStore.get("admin_session");

    if (adminSession?.value !== "authenticated") {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    // =========================
    // ORDER ID
    // =========================

    const { id } = await context.params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID." },
        { status: 400 }
      );
    }

    // =========================
    // REQUEST BODY
    // =========================

    const body = await request.json();

    const hasStatus =
      typeof body.status === "string";

    const hasTracking =
      "courier" in body ||
      "trackingNumber" in body ||
      "trackingUrl" in body;

    if (!hasStatus && !hasTracking) {
      return NextResponse.json(
        { error: "No update data provided." },
        { status: 400 }
      );
    }

    // =========================
    // FIND ORDER
    // =========================

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    // =========================
    // TRACKING DETAILS UPDATE
    // =========================

    if (hasTracking) {
      const updatedOrder =
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            courier:
              typeof body.courier === "string"
                ? body.courier.trim() || null
                : order.courier,

            trackingNumber:
              typeof body.trackingNumber === "string"
                ? body.trackingNumber.trim() || null
                : order.trackingNumber,

            trackingUrl:
              typeof body.trackingUrl === "string"
                ? body.trackingUrl.trim() || null
                : order.trackingUrl,
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Delivery tracking details saved successfully.",
        order: updatedOrder,
      });
    }

    // =========================
    // STATUS UPDATE
    // =========================

    const status =
      typeof body.status === "string"
        ? body.status.trim()
        : "";

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    if (order.status === status) {
      return NextResponse.json({
        success: true,
        message:
          "Order status is already set to this status.",
        order,
      });
    }

    // =========================
    // TRACKING MESSAGES
    // =========================

    const trackingMessages: Record<
      string,
      string
    > = {
      Pending:
        "Order has been placed.",

      Confirmed:
        "Order has been confirmed by the seller.",

      Shipped:
        "Order has been shipped and handed over to the courier.",

      "Out for Delivery":
        "Your order is out for delivery.",

      Delivered:
        "Your order has been delivered.",

      Cancelled:
        "Order has been cancelled.",
    };

    // =========================
    // UPDATE ORDER + HISTORY
    // =========================

    const updatedOrder =
      await prisma.$transaction(
        async (tx) => {
          const updated =
            await tx.order.update({
              where: {
                id: orderId,
              },
              data: {
                status,
              },
            });

          await tx.orderTracking.create({
            data: {
              orderId,
              status,
              message:
                trackingMessages[status] ||
                `Order status changed to ${status}.`,
            },
          });

          return updated;
        }
      );

    return NextResponse.json({
      success: true,
      message:
        "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update order.",
      },
      { status: 500 }
    );
  }
}