import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";

async function checkAdmin() {
  const cookieStore = await cookies();

  const adminSession = cookieStore.get("admin_session");

  return adminSession?.value === "authenticated";
}

// =========================
// GET PRODUCTS
// =========================

export async function GET() {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(products, {
      status: 200,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        error: "Failed to load products.",
      },
      { status: 500 }
    );
  }
}

// =========================
// CREATE PRODUCT
// =========================

export async function POST(request: Request) {
  try {
    // =========================
    // ADMIN AUTHENTICATION
    // =========================

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    // =========================
    // REQUEST BODY
    // =========================

    const body = await request.json();

    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    const description = String(body.description || "").trim();

    const image = String(body.image || "").trim();
    const image2 = String(body.image2 || "").trim();
    const image3 = String(body.image3 || "").trim();
    const image4 = String(body.image4 || "").trim();

    const descriptionImage = String(
      body.descriptionImage || ""
    ).trim();

    const price = Number(body.price);

    const oldPrice =
      body.oldPrice === null ||
      body.oldPrice === undefined ||
      body.oldPrice === ""
        ? null
        : Number(body.oldPrice);

    const stock = Number(body.stock);

    const reviews = Number(body.reviews || 0);

    const featured = body.featured === true;

    const flashDeal = body.flashDeal === true;

    const newArrival = body.newArrival === true;

    const discount =
      body.discount === null ||
      body.discount === undefined ||
      body.discount === ""
        ? null
        : Number(body.discount);

    // =========================
    // VALIDATION
    // =========================

    if (!name) {
      return NextResponse.json(
        {
          error: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Category is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error: "Description is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          error: "Please enter a valid price.",
        },
        { status: 400 }
      );
    }

    if (
      oldPrice !== null &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid old price.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        {
          error: "Please enter a valid stock quantity.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(reviews) || reviews < 0) {
      return NextResponse.json(
        {
          error: "Please enter a valid reviews number.",
        },
        { status: 400 }
      );
    }

    if (
      discount !== null &&
      (!Number.isInteger(discount) ||
        discount < 1 ||
        discount > 100)
    ) {
      return NextResponse.json(
        {
          error: "Discount must be between 1% and 100%.",
        },
        { status: 400 }
      );
    }

    if (flashDeal && discount === null) {
      return NextResponse.json(
        {
          error:
            "Please enter a discount percentage for the Flash Deal.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CREATE PRODUCT
    // =========================

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,

        // Product images
        image: image || null,
        image2: image2 || null,
        image3: image3 || null,
        image4: image4 || null,
        descriptionImage: descriptionImage || null,

        // Pricing
        price: price.toFixed(2),

        oldPrice:
          oldPrice !== null
            ? oldPrice.toFixed(2)
            : null,

        discount,

        // Stock
        stock,

        // Reviews
        reviews,

        // Product status
        featured,
        flashDeal,
        newArrival,
      },
    });

    // =========================
    // SUCCESS
    // =========================

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}