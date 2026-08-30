import { NextResponse } from "next/server";
import { destroyCustomerSession } from "@/app/lib/customerAuth";

export async function POST() {
  try {
    await destroyCustomerSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Customer logout error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while logging out.",
      },
      { status: 500 }
    );
  }
}
