import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const SITE_URL = "https://clickpick.uk";

function escapeCsv(value: unknown): string {
  const text = String(value ?? "")
    .replace(/\r?\n|\r/g, " ")
    .trim();

  return `"${text.replace(/"/g, '""')}"`;
}

function absoluteUrl(value: string | null | undefined): string {
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${SITE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function cleanDescription(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const headers = [
      "id",
      "title",
      "description",
      "link",
      "image_link",
      "price",
      "sale_price",
      "availability",
      "brand",
      "condition",
      "product_type",
      "colour",
      "additional_image_link",
    ];

    const rows = products.map((product) => {
      const currentPrice = Number(product.price);
      const oldPrice = product.oldPrice
        ? Number(product.oldPrice)
        : null;

      const hasSalePrice =
        oldPrice !== null && oldPrice > currentPrice;

      const price = hasSalePrice ? oldPrice : currentPrice;
      const salePrice = hasSalePrice ? currentPrice : null;

      const additionalImages = [
        product.image2,
        product.image3,
        product.image4,
      ]
        .filter(Boolean)
        .map((image) => absoluteUrl(image))
        .join(",");

      return [
        product.id,
        product.name,
        cleanDescription(product.description),
        `${SITE_URL}/products/${product.id}`,
        absoluteUrl(product.image),
        `${price.toFixed(2)} GBP`,
        salePrice !== null ? `${salePrice.toFixed(2)} GBP` : "",
        product.stock > 0 ? "in stock" : "out of stock",
        "Click&Pick",
        "new",
        product.category,
        product.color ?? "",
        additionalImages,
      ];
    });

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Pinterest feed error:", error);

    return new NextResponse("Unable to generate Pinterest product feed.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}