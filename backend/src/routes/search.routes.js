const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();

    if (!q) {
      const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" }
      });

      return res.json({ products: [], outfits: [], categories });
    }

    const [products, outfits, categories] = await Promise.all([
      prisma.product.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, slug: true, price: true },
        take: 8
      }),
      prisma.outfit.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, slug: true },
        take: 8
      }),
      prisma.category.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true },
        take: 8
      })
    ]);

    return res.json({ products, outfits, categories });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
