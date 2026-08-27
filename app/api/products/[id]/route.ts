import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function checkAdmin() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  return adminSession?.value === "authenticated";
}

// GET PRODUCT
// Public because storefront needs product data.
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      {
        error: "Failed to load product.",
      },
      { status: 500 }
    );
  }
}

// UPDATE PRODUCT
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // =========================
    // PRODUCT FIELDS
    // =========================

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

    const discount =
      body.discount === null ||
      body.discount === undefined ||
      body.discount === ""
        ? null
        : Number(body.discount);

    const featured = body.featured === true;
    const flashDeal = body.flashDeal === true;
    const newArrival = body.newArrival === true;

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
    // CHECK PRODUCT
    // =========================

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    // =========================
    // UPDATE PRODUCT
    // =========================

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name,
          category,
          description,

          price: price.toFixed(2),

          oldPrice:
            oldPrice === null
              ? null
              : oldPrice.toFixed(2),

          stock,
          reviews,

          discount,
          featured,
          flashDeal,
          newArrival,

          image: image || null,
          image2: image2 || null,
          image3: image3 || null,
          image4: image4 || null,
          descriptionImage:
            descriptionImage || null,
        },
      });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      {
        error: "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          error: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to delete product. This product may already be linked to an order.",
      },
      { status: 500 }
    );
  }
}
