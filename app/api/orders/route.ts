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
    const currentCustomer = await getCurrentCustomer();

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

    // =========================
    // VALIDATE DELIVERY INFO
    // =========================

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
          error: "All delivery information is required.",
        },
        { status: 400 }
      );
    }

    // =========================
    // VALIDATE CART
    // =========================

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // =========================
    // VERIFIED CUSTOMER CHECK
    // =========================

    if (currentCustomer && !currentCustomer.emailVerified) {
      return NextResponse.json(
        {
          error:
            "Please verify your email address before placing an order.",
        },
        { status: 403 }
      );
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = await prisma.$transaction(async (tx) => {
      const orderItems: {
        productId: number;
        name: string;
        price: number;
        quantity: number;
      }[] = [];

      let serverTotal = 0;

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

        const productPrice = Number(product.price);

        serverTotal += productPrice * quantity;

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
          price: productPrice,
          quantity,
        });
      }

      serverTotal =
        Math.round(serverTotal * 100) / 100;

      const orderNumber = generateOrderNumber();

      return await tx.order.create({
        data: {
          orderNumber,
          customerId: currentCustomer?.id ?? null,
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

    // =========================
    // SEND ORDER CONFIRMATION
    // =========================

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const itemRows = order.items
          .map(
            (item) => `
              <tr>
                <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
                  ${item.name}
                </td>

                <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">
                  ${item.quantity}
                </td>

                <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">
                  £${Number(item.price).toFixed(2)}
                </td>
              </tr>
            `
          )
          .join("");

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

              to: [String(email).trim()],

              subject: `Order ${order.orderNumber} received - Click&Pick`,

              html: `
                <div
                  style="
                    font-family:Arial,sans-serif;
                    max-width:650px;
                    margin:0 auto;
                    padding:30px;
                    color:#111827;
                  "
                >

                  <h2 style="color:#f97316;margin-bottom:10px;">
                    Click&Pick
                  </h2>

                  <h1 style="font-size:24px;">
                    Thank you for your order!
                  </h1>

                  <p>
                    Hello ${String(customerName).trim()},
                  </p>

                  <p>
                    Your order has been successfully placed.
                    We have received your order and will process it shortly.
                  </p>

                  <div
                    style="
                      background:#f3f4f6;
                      padding:18px;
                      border-radius:8px;
                      margin:25px 0;
                    "
                  >

                    <p style="margin:5px 0;">
                      <strong>Order Number:</strong>
                      ${order.orderNumber}
                    </p>

                    <p style="margin:5px 0;">
                      <strong>Order Status:</strong>
                      ${order.status}
                    </p>

                    <p style="margin:5px 0;">
                      <strong>Order Total:</strong>
                      £${Number(order.total).toFixed(2)}
                    </p>

                  </div>

                  <h3>
                    Ordered Products
                  </h3>

                  <table
                    style="
                      width:100%;
                      border-collapse:collapse;
                      margin-top:15px;
                    "
                  >

                    <thead>

                      <tr>

                        <th
                          style="
                            padding:12px;
                            background:#f9fafb;
                            text-align:left;
                          "
                        >
                          Product
                        </th>

                        <th
                          style="
                            padding:12px;
                            background:#f9fafb;
                            text-align:center;
                          "
                        >
                          Qty
                        </th>

                        <th
                          style="
                            padding:12px;
                            background:#f9fafb;
                            text-align:right;
                          "
                        >
                          Price
                        </th>

                      </tr>

                    </thead>

                    <tbody>
                      ${itemRows}
                    </tbody>

                  </table>

                  <div
                    style="
                      margin-top:20px;
                      padding-top:15px;
                      border-top:2px solid #111827;
                      text-align:right;
                      font-size:20px;
                      font-weight:bold;
                    "
                  >
                    Total: £${Number(order.total).toFixed(2)}
                  </div>

                  <h3 style="margin-top:30px;">
                    Delivery Information
                  </h3>

                  <p style="line-height:1.7;">
                    ${String(customerName).trim()}<br />
                    ${String(address).trim()}<br />
                    ${String(city).trim()}<br />
                    ${String(postcode).trim()}<br />
                    ${String(phone).trim()}
                  </p>

                  <p style="margin-top:30px;">
                    We will send you another email when your order status
                    changes.
                  </p>

                  <p style="margin-top:30px;">
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
            "Order confirmation email error:",
            resendError
          );
        }
      } catch (emailError) {
        console.error(
          "Order confirmation email failed:",
          emailError
        );
      }
    } else {
      console.error(
        "RESEND_API_KEY is missing. Order confirmation email was not sent."
      );
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================

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