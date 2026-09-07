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
    const adminSession = cookieStore.get("admin_session");

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
        {
          error: "Invalid order ID.",
        },
        { status: 400 }
      );
    }

    // =========================
    // REQUEST BODY
    // =========================

    const body = await request.json();

    const hasStatus = typeof body.status === "string";

    const hasTracking =
      "courier" in body ||
      "trackingNumber" in body ||
      "trackingUrl" in body;

    if (!hasStatus && !hasTracking) {
      return NextResponse.json(
        {
          error: "No update data provided.",
        },
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
        {
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    // =========================
    // TRACKING DETAILS UPDATE
    // =========================

    if (hasTracking) {
      const updatedOrder = await prisma.order.update({
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

    const trackingMessages: Record<string, string> = {
      Pending:
        "Your order has been placed and is awaiting processing.",

      Confirmed:
        "Your order has been confirmed by Click&Pick.",

      Shipped:
        "Your order has been shipped and handed over to the courier.",

      "Out for Delivery":
        "Your order is out for delivery and should arrive soon.",

      Delivered:
        "Your order has been delivered successfully.",

      Cancelled:
        "Your order has been cancelled.",
    };

    // =========================
    // UPDATE ORDER + HISTORY
    // =========================

    const updatedOrder = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.order.update({
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

    // =========================
    // SEND STATUS EMAIL
    // =========================

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (resendApiKey && order.email) {
      try {
        const resendResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from:
                process.env.RESEND_FROM_EMAIL ||
                "Click&Pick <onboarding@resend.dev>",

              to: [order.email],

              subject: `Order ${order.orderNumber} status update - Click&Pick`,

              html: `
                <div
                  style="
                    font-family: Arial, sans-serif;
                    max-width: 650px;
                    margin: 0 auto;
                    padding: 30px;
                    color: #111827;
                  "
                >
                  <h2
                    style="
                      color: #f97316;
                      margin-bottom: 20px;
                    "
                  >
                    Click&Pick
                  </h2>

                  <h1
                    style="
                      font-size: 24px;
                      margin-bottom: 20px;
                    "
                  >
                    Order Status Update
                  </h1>

                  <p>
                    Hello ${order.customerName},
                  </p>

                  <p>
                    There has been an update to your Click&Pick order.
                  </p>

                  <div
                    style="
                      margin: 25px 0;
                      padding: 20px;
                      background: #f3f4f6;
                      border-radius: 10px;
                    "
                  >
                    <p style="margin: 8px 0;">
                      <strong>Order Number:</strong>
                      ${order.orderNumber}
                    </p>

                    <p style="margin: 8px 0;">
                      <strong>Previous Status:</strong>
                      ${order.status}
                    </p>

                    <p style="margin: 8px 0;">
                      <strong>New Status:</strong>
                      ${status}
                    </p>
                  </div>

                  <div
                    style="
                      margin: 25px 0;
                      padding: 18px;
                      background: #fff7ed;
                      border-left: 4px solid #f97316;
                    "
                  >
                    <strong>
                      ${trackingMessages[status]}
                    </strong>
                  </div>

                  <p>
                    Order Total:
                    <strong>
                      £${Number(order.total).toFixed(2)}
                    </strong>
                  </p>

                  ${
                    order.trackingNumber
                      ? `
                        <p>
                          <strong>Tracking Number:</strong>
                          ${order.trackingNumber}
                        </p>
                      `
                      : ""
                  }

                  ${
                    order.courier
                      ? `
                        <p>
                          <strong>Courier:</strong>
                          ${order.courier}
                        </p>
                      `
                      : ""
                  }

                  ${
                    order.trackingUrl
                      ? `
                        <p style="margin-top: 20px;">
                          <a
                            href="${order.trackingUrl}"
                            style="
                              display: inline-block;
                              background: #f97316;
                              color: white;
                              text-decoration: none;
                              padding: 12px 20px;
                              border-radius: 6px;
                              font-weight: bold;
                            "
                          >
                            Track Your Order
                          </a>
                        </p>
                      `
                      : ""
                  }

                  <p
                    style="
                      margin-top: 30px;
                      line-height: 1.6;
                    "
                  >
                    Thank you for shopping with Click&Pick.
                  </p>

                  <p style="margin-top: 30px;">
                    Regards,<br />
                    <strong>Click&Pick</strong>
                  </p>
                </div>
              `,
            }),
          }
        );

        if (!resendResponse.ok) {
          const resendError =
            await resendResponse.text();

          console.error(
            "Order status email error:",
            resendError
          );
        }
      } catch (emailError) {
        console.error(
          "Order status email failed:",
          emailError
        );
      }
    } else {
      console.error(
        "RESEND_API_KEY is missing or customer email is unavailable."
      );
    }

    // =========================
    // RESPONSE
    // =========================

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