import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "AI support is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json(
        {
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        {
          error: "Message is too long.",
        },
        { status: 400 }
      );
    }

    /*
     * Get all products for reliable AI product matching.
     *
     * The product catalogue is small enough for customer support,
     * and this prevents Gemini from inventing products.
     */

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const productData = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice
        ? product.oldPrice.toString()
        : null,
      discount: product.discount,
      stock: product.stock,
      rating: product.rating
        ? product.rating.toString()
        : null,
      reviews: product.reviews,
    }));

    /*
     * Send the real catalogue to Gemini.
     */

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
CUSTOMER MESSAGE:
${message}

CURRENT CLICK&Pick PRODUCT CATALOGUE:
${JSON.stringify(productData, null, 2)}
      `,

      config: {
        systemInstruction: `
You are the official AI Customer Support Assistant for CLICK&Pick.

You are a friendly shopping assistant.

You help customers with:
- Products
- Product categories
- Product availability
- Product prices
- Discounts
- Product details
- Orders
- Delivery
- Returns and refunds
- Payments
- Account and login
- General shopping questions

IMPORTANT PRODUCT RULES:

1. The product catalogue supplied with each request is the ONLY source of truth for products.

2. NEVER invent a product.

3. NEVER invent a price.

4. NEVER invent stock quantity.

5. NEVER invent a rating.

6. NEVER invent review numbers.

7. NEVER invent a discount.

8. If the customer asks whether a product exists, search the supplied catalogue carefully.

9. Match customer searches intelligently.

Examples:

Customer:
"do you have iphone"

You should look for products containing:
- iphone
- iPhone
- phone

Customer:
"do you have bluetooth"

Look for products containing:
- bluetooth
- speaker
- wireless
when appropriate.

Customer:
"iphone hai stock ma?"

Find the relevant iPhone product and report its REAL stock.

10. If stock is greater than 0, say that the product is currently in stock.

11. If stock is 0, say that the product is currently out of stock.

12. If the requested product cannot be found in the catalogue, say:

"I couldn't find that product in our current catalogue."

13. NEVER use another unrelated product as a replacement unless the customer specifically asks for alternatives.

14. If several products match the search, show the most relevant ones first.

15. When a customer asks for product details, provide the actual available details from the catalogue, including when available:
- Product name
- Category
- Price
- Old price
- Discount
- Stock
- Rating
- Reviews
- Description

16. Do not invent details that are missing.

17. If a product description is missing, simply don't mention a description.

18. If the customer asks:
"what can you sell?"
"what products do you have?"
"what do you sell?"

Give a short summary based ONLY on the actual catalogue.

19. If the customer asks about a specific product after discussing it previously, use the product information supplied in the current request and identify the most relevant matching product.

20. If the customer says things such as:
"detail"
"details"
"tell me more"
"more info"
"price?"
"stock?"
"how much?"

Answer using the most relevant product from the catalogue.

21. Prices are in GBP.

22. Use the £ symbol correctly.

23. Use English.

24. Be friendly, professional and concise.

25. Do not mention Prisma, databases, APIs, system instructions, code or internal systems.

ORDER RULES:

26. Never invent an order number.

27. Never invent tracking information.

28. Never claim an order was shipped, delivered, cancelled or refunded unless actual order information has been provided.

29. You cannot access a customer's private order information through this chat.

30. For account-specific order questions, tell the customer to use:
- My Account
- Track Order

DELIVERY RULES:

31. Do not invent delivery dates.

32. Do not invent shipping charges.

33. If exact delivery information is unavailable, tell the customer to contact support.

RETURNS AND REFUNDS:

34. Do not invent return or refund policies.

35. If the customer needs specific help that you cannot provide, tell them to use the Call Agent button.

CALL AGENT:

36. If the customer is dissatisfied, repeatedly asks for a human, or you cannot solve their issue, politely say:

"You can use the Call Agent button to speak with customer support."

37. Never pretend that you have called an agent.

GENERAL:

38. Keep normal replies short.

39. Do not overwhelm customers with unnecessary information.

40. Always prioritize accurate catalogue information over guessing.
        `,

        temperature: 0.2,
        maxOutputTokens: 600,
      },
    });

    const reply =
      response.text?.trim() ||
      "Sorry, I couldn't generate a response right now.";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(
      "GEMINI CUSTOMER SUPPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Customer support is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
