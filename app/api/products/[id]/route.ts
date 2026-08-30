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

// =====================================================
// CATEGORY SYSTEM
// =====================================================

const CATEGORY_RULES = [
  {
    category: "Mobile Phone & Accessories",
    keywords: [
      "mobile",
      "phone",
      "iphone",
      "smartphone",
      "android",
      "samsung",
      "tecno",
      "infinix",
      "oppo",
      "vivo",
      "xiaomi",
      "redmi",
      "realme",
      "oneplus",
      "mobile cover",
      "phone cover",
      "phone case",
      "mobile case",
      "charger",
      "charging cable",
      "usb cable",
      "power bank",
      "earphone",
      "earphones",
      "handsfree",
      "airpods",
      "screen protector",
      "tempered glass",
      "mobile stand",
      "phone holder",
    ],
  },

  {
    category: "Electronics",
    keywords: [
      "electronic",
      "electronics",
      "laptop",
      "computer",
      "pc",
      "keyboard",
      "mouse",
      "monitor",
      "printer",
      "scanner",
      "camera",
      "cctv",
      "router",
      "wifi",
      "switch",
      "hard drive",
      "ssd",
      "memory card",
      "usb",
      "flash drive",
      "adapter",
      "projector",
      "led",
      "tv",
      "television",
    ],
  },

  {
    category: "Audio",
    keywords: [
      "audio",
      "speaker",
      "bluetooth speaker",
      "sound box",
      "soundbar",
      "headphone",
      "headphones",
      "headset",
      "microphone",
      "mic",
      "woofer",
      "subwoofer",
      "stereo",
      "music player",
    ],
  },

  {
    category: "Toys",
    keywords: [
      "toy",
      "toys",
      "toy car",
      "car toy",
      "aeroplane",
      "airplane",
      "doll",
      "teddy",
      "teddy bear",
      "remote control car",
      "rc car",
      "puzzle",
      "kids",
      "children",
      "baby toy",
      "game",
      "gaming toy",
      "lego",
    ],
  },

  {
    category: "Home & Garden",
    keywords: [
      "home",
      "garden",
      "kitchen",
      "kitchenware",
      "cooking",
      "utensil",
      "furniture",
      "chair",
      "table",
      "storage",
      "organizer",
      "cleaning",
      "cleaner",
      "lamp",
      "light",
      "decoration",
      "decor",
      "plant",
      "flower",
      "gardening",
      "garden tool",
    ],
  },

  {
    category: "Sports",
    keywords: [
      "sport",
      "sports",
      "football",
      "soccer",
      "cricket",
      "bat",
      "ball",
      "tennis",
      "badminton",
      "basketball",
      "gym",
      "fitness",
      "exercise",
      "yoga",
      "cycling",
      "swimming",
      "sportswear",
    ],
  },

  {
    category: "Beauty",
    keywords: [
      "beauty",
      "makeup",
      "cosmetic",
      "cosmetics",
      "lipstick",
      "foundation",
      "mascara",
      "eyeliner",
      "perfume",
      "fragrance",
      "skin care",
      "skincare",
      "hair",
      "hair dryer",
      "hair straightener",
      "shampoo",
      "cream",
      "lotion",
    ],
  },
];

// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

// =====================================================
// NORMALIZE MANUAL CATEGORY
// =====================================================

function normalizeManualCategory(category: string) {
  const normalized = normalizeText(category);

  if (!normalized) {
    return "Other";
  }

  // Mobile Phone & Accessories
  const mobileAliases = [
    "mobile phone and accessories",
    "mobile phone and accerories",
    "mobile phone and accerory",
    "mobile and accessories",
    "mobile and accerious",
    "mobile and accerories",
    "mobile and accerios",
    "mobile accerious",
    "mobile accessories",
    "mobile accesories",
    "mobile accessory",
    "phone accessories",
    "phone accessory",
  ];

  if (mobileAliases.includes(normalized)) {
    return "Mobile Phone & Accessories";
  }

  // Electronics
  const electronicsAliases = [
    "electronics",
    "electronic",
    "electronic items",
    "electronics items",
  ];

  if (electronicsAliases.includes(normalized)) {
    return "Electronics";
  }

  // Audio
  const audioAliases = [
    "audio",
    "sound",
    "sound system",
    "audio products",
  ];

  if (audioAliases.includes(normalized)) {
    return "Audio";
  }

  // Toys
  const toyAliases = [
    "toy",
    "toys",
    "kids toys",
    "children toys",
  ];

  if (toyAliases.includes(normalized)) {
    return "Toys";
  }

  // Home & Garden
  const homeAliases = [
    "home",
    "home garden",
    "home and garden",
    "home accessories",
    "kitchen",
  ];

  if (homeAliases.includes(normalized)) {
    return "Home & Garden";
  }

  // Sports
  const sportsAliases = [
    "sport",
    "sports",
    "sports items",
    "sports equipment",
  ];

  if (sportsAliases.includes(normalized)) {
    return "Sports";
  }

  // Beauty
  const beautyAliases = [
    "beauty",
    "beauty products",
    "cosmetics",
    "cosmetic",
    "makeup",
  ];

  if (beautyAliases.includes(normalized)) {
    return "Beauty";
  }

  // Other
  const otherAliases = [
    "other",
    "others",
    "misc",
    "miscellaneous",
  ];

  if (otherAliases.includes(normalized)) {
    return "Other";
  }

  // New manually created category is allowed
  return category.trim();
}

// =====================================================
// AUTO CATEGORY DETECTION
// =====================================================

function detectCategory(
  name: string,
  description: string
) {
  const text = normalizeText(
    `${name} ${description}`
  );

  let bestCategory = "Other";
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;

    for (const keyword of rule.keywords) {
      const normalizedKeyword =
        normalizeText(keyword);

      if (!normalizedKeyword) {
        continue;
      }

      if (text.includes(normalizedKeyword)) {
        if (normalizedKeyword.includes(" ")) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}

// =====================================================
// FINAL CATEGORY
// =====================================================

function getFinalCategory(
  requestedCategory: string,
  name: string,
  description: string
) {
  const category = requestedCategory.trim();

  if (
    category.toLowerCase() === "auto" ||
    category.toLowerCase() === "auto detect" ||
    category.toLowerCase() === "automatic"
  ) {
    return detectCategory(
      name,
      description
    );
  }

  return normalizeManualCategory(category);
}

// =====================================================
// GET PRODUCT
// =====================================================

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
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

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load product.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// UPDATE PRODUCT
// =====================================================

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    // ADMIN AUTHENTICATION

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Admin login required.",
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

    // PRODUCT FIELDS

    const name = String(
      body.name || ""
    ).trim();

    const requestedCategory = String(
      body.category || ""
    ).trim();

    const description = String(
      body.description || ""
    ).trim();

    const image = String(
      body.image || ""
    ).trim();

    const image2 = String(
      body.image2 || ""
    ).trim();

    const image3 = String(
      body.image3 || ""
    ).trim();

    const image4 = String(
      body.image4 || ""
    ).trim();

    const descriptionImage =
      String(
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

    const reviews = Number(
      body.reviews || 0
    );

    const discount =
      body.discount === null ||
      body.discount === undefined ||
      body.discount === ""
        ? null
        : Number(body.discount);

    const featured =
      body.featured === true;

    const flashDeal =
      body.flashDeal === true;

    const newArrival =
      body.newArrival === true;

    // CATEGORY

    const category =
      getFinalCategory(
        requestedCategory,
        name,
        description
      );

    console.log(
      "Updated category:",
      requestedCategory,
      "=>",
      category
    );

    // VALIDATION

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!requestedCategory) {
      return NextResponse.json(
        {
          error:
            "Category is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error:
            "Description is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid price.",
        },
        { status: 400 }
      );
    }

    if (
      oldPrice !== null &&
      (!Number.isFinite(oldPrice) ||
        oldPrice < 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid old price.",
        },
        { status: 400 }
      );
    }

    if (
      oldPrice !== null &&
      oldPrice > 0 &&
      price > oldPrice
    ) {
      return NextResponse.json(
        {
          error:
            "Price cannot be higher than the old price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid stock quantity.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(reviews) ||
      reviews < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid reviews number.",
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
          error:
            "Discount must be between 1% and 100%.",
        },
        { status: 400 }
      );
    }

    if (
      flashDeal &&
      discount === null
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a discount percentage for the Flash Deal.",
        },
        { status: 400 }
      );
    }

    // CHECK PRODUCT

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    // UPDATE

    const product =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          name,
          category,
          description,

          price:
            price.toFixed(2),

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

          image:
            image || null,

          image2:
            image2 || null,

          image3:
            image3 || null,

          image4:
            image4 || null,

          descriptionImage:
            descriptionImage || null,
        },
      });

    return NextResponse.json({
      message:
        "Product updated successfully.",

      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const isAdmin =
      await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        {
          error:
            "Invalid product ID.",
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
          error:
            "Product not found.",
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
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete product. This product may already be linked to an order.",
      },
      { status: 500 }
    );
  }
}