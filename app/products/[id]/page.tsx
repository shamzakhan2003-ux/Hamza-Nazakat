import Header from "../../components/Header";
import ProductDetails from "../../components/ProductDetails";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <Header />

      <ProductDetails product={productData} />

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center">
          <p className="text-sm text-gray-400">
            © 2026 AM Whole Sale UK. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}