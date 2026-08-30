import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/app/lib/customerAuth";

export async function GET() {
  try {
    const customer = await getCurrentCustomer();

    if (!customer) {
      return NextResponse.json({
        loggedIn: false,
        customer: null,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        mobileVerified: customer.mobileVerified,
      },
    });
  } catch (error) {
    console.error("Customer session error:", error);

    return NextResponse.json(
      {
        loggedIn: false,
        customer: null,
      },
      { status: 500 }
    );
  }
}
