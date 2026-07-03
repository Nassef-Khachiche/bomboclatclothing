const { PrismaClient, OrderStatus, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const categories = ["Hoodies", "Pants", "Shoes", "Hats", "Bags", "Jackets"];
const collections = [
  { name: "Core", slug: "core" },
  { name: "Urban Black Pack", slug: "urban-black-pack" },
  { name: "Summer Drop", slug: "summer-drop" },
  { name: "Limited", slug: "limited" },
  { name: "Techwear", slug: "techwear" }
];

const productTemplates = [
  "Oversized Hoodie",
  "Utility Cargo Pants",
  "Street Sneakers",
  "Structured Cap",
  "Crossbody Bag",
  "Zip Jacket",
  "Boxy Tee",
  "Relaxed Shorts",
  "Leather Belt",
  "Knit Beanie"
];

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "White", "Stone", "Olive", "Navy"];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.outfitProduct.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.outfit.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin12345", 10);
  await prisma.user.create({
    data: {
      email: "admin@bomboclat.com",
      password: adminPassword,
      role: Role.ADMIN
    }
  });

  const createdCategories = await Promise.all(
    categories.map((name) => prisma.category.create({ data: { name } }))
  );

  const createdCollections = await Promise.all(
    collections.map((item) => prisma.collection.create({ data: item }))
  );

  const products = [];

  for (let i = 0; i < 32; i += 1) {
    const template = productTemplates[i % productTemplates.length];
    const productName = `${template} ${i + 1}`;
    const category = createdCategories[i % createdCategories.length];
    const collection = createdCollections[i % createdCollections.length];
    const limitedEdition = i < 5;

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: slugify(productName),
        description:
          "Premium construction with minimal branding, built for daily wear with a luxury street silhouette.",
        price: Number((89 + i * 4.75).toFixed(2)),
        stock: 8 + (i % 9),
        categoryId: category.id,
        limitedEdition,
        sizes,
        colors: [colors[i % colors.length], colors[(i + 2) % colors.length]],
        collectionId: collection.id,
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80&sig=${i + 1}`
            },
            {
              url: `https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80&sig=${i + 101}`
            }
          ]
        }
      },
      include: { images: true }
    });

    products.push(product);
  }

  const outfitNames = [
    "Urban Black Pack",
    "Night Runner",
    "Concrete Uniform",
    "After Hours",
    "Monochrome Motion",
    "Limited Capsule One",
    "Downtown Utility",
    "Airport Fit",
    "Gallery Weekend",
    "Silent Luxury"
  ];

  for (let i = 0; i < outfitNames.length; i += 1) {
    const outfit = await prisma.outfit.create({
      data: {
        name: outfitNames[i],
        slug: slugify(outfitNames[i]),
        description: "Curated head-to-toe styling with versatile premium essentials.",
        heroImage: `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80&sig=${i + 500}`
      }
    });

    const start = i * 3;
    const members = [products[start % products.length], products[(start + 1) % products.length], products[(start + 2) % products.length], products[(start + 3) % products.length]];

    await Promise.all(
      members.map((product) =>
        prisma.outfitProduct.create({
          data: {
            outfitId: outfit.id,
            productId: product.id
          }
        })
      )
    );
  }

  for (let i = 0; i < 10; i += 1) {
    const base = i * 2;
    const orderProducts = [products[base], products[base + 1], products[base + 2]].filter(Boolean);

    const subtotal = orderProducts.reduce((sum, product) => sum + product.price, 0);
    const taxes = Number((subtotal * 0.12).toFixed(2));
    const shipping = subtotal > 250 ? 0 : 15;
    const total = Number((subtotal + taxes + shipping).toFixed(2));

    await prisma.order.create({
      data: {
        orderNumber: `BMB-${Date.now().toString().slice(-6)}-${i + 1}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        customerPhone: `+1-555-000-${String(i + 1).padStart(4, "0")}`,
        shippingAddress: `${100 + i} Fashion Avenue`,
        city: "Kingston",
        postalCode: `000${i + 1}`,
        country: "Jamaica",
        status: Object.values(OrderStatus)[i % Object.values(OrderStatus).length],
        subtotal,
        taxes,
        shipping,
        total,
        items: {
          create: orderProducts.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: product.price
          }))
        }
      }
    });
  }

  console.log("Seed completed.");
  console.log("Admin login: admin@bomboclat.com / admin12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
