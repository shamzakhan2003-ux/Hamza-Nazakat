import type { Metadata } from "next";
import Header from "../../components/Header";
import ProductDetails from "../../components/ProductDetails";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return {
      title: "Product Not Found | Click&Pick UK",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | Click&Pick UK",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const description =
    product.description?.trim() ||
    `Shop ${product.name} online at Click&Pick UK. Discover quality products at competitive prices with UK delivery.`;

  const canonicalUrl = `https://clickpick.uk/products/${product.id}`;

  return {
    title: `${product.name} | Click&Pick UK`,
    description: description.slice(0, 160),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${product.name} | Click&Pick UK`,
      description: description.slice(0, 160),
      siteName: "Click&Pick",
      locale: "en_GB",
      images: product.image
        ? [
            {
              url: product.image,
              alt: `${product.name} - Click&Pick UK`,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Click&Pick UK`,
      description: description.slice(0, 160),
      images: product.image ? [product.image] : undefined,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    oldPrice: product.oldPrice
      ? product.oldPrice.toString()
      : null,
    discount: product.discount,
    image: product.image,
    image2: product.image2,
    image3: product.image3,
    image4: product.image4,
    descriptionImage: product.descriptionImage,
    description: product.description,
    stock: product.stock,
    reviews: product.reviews,

    // Delivery Information
    handlingTime: product.handlingTime,
    deliveryTime: product.deliveryTime,
  };

  const productDescription =
    product.description?.trim() ||
    `Shop ${product.name} online at Click&Pick UK.`;

  const productUrl = `https://clickpick.uk/products/${product.id}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    image: [
      product.image,
      product.image2,
      product.image3,
      product.image4,
    ].filter(Boolean),
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "Click&Pick",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GBP",
      price: product.price.toString(),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <ProductDetails product={productData} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            © 2026 Click&Pick. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}