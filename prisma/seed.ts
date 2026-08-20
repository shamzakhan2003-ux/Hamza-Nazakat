import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.create({
    data: {
      name: "Wireless Bluetooth Speaker",
      description: "Portable wireless Bluetooth speaker",
      price: 14.99,
      oldPrice: 24.99,
      discount: 40,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
      category: "Electronics",
      stock: 50,
      rating: 4.5,
      reviews: 128,
      featured: true,
      flashDeal: true,
    },
  });

  console.log("Test product created successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });