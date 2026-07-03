const express = require("express");
const prisma = require("../lib/prisma");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

router.use(authRequired, adminRequired);

router.get("/dashboard", async (req, res, next) => {
  try {
    const [products, outfits, orders, customers, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.outfit.count(),
      prisma.order.count(),
      prisma.order.groupBy({ by: ["customerEmail"] }),
      prisma.product.findMany({
        where: { stock: { lt: 10 } },
        select: { id: true, name: true, stock: true },
        take: 8
      })
    ]);

    return res.json({
      totals: {
        products,
        outfits,
        orders,
        customers: customers.length
      },
      lowStock
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/orders", async (req, res, next) => {
  try {
    const data = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get("/customers", async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        customerPhone: true,
        createdAt: true,
        total: true
      },
      orderBy: { createdAt: "desc" }
    });

    const grouped = new Map();

    orders.forEach((order) => {
      if (!grouped.has(order.customerEmail)) {
        grouped.set(order.customerEmail, {
          email: order.customerEmail,
          name: order.customerName,
          phone: order.customerPhone,
          orders: 0,
          spent: 0,
          lastOrderAt: order.createdAt
        });
      }

      const current = grouped.get(order.customerEmail);
      current.orders += 1;
      current.spent += order.total;
      current.lastOrderAt = order.createdAt;
    });

    return res.json(Array.from(grouped.values()));
  } catch (error) {
    return next(error);
  }
});

router.get("/collections", async (req, res, next) => {
  try {
    const data = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

router.get("/inventory", async (req, res, next) => {
  try {
    const data = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        limitedEdition: true,
        category: { select: { name: true } },
        collection: { select: { name: true } }
      },
      orderBy: { stock: "asc" }
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
