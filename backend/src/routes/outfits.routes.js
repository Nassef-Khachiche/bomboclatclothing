const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const slugify = require("../utils/slugify");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const outfits = await prisma.outfit.findMany({
      include: {
        products: {
          include: {
            product: { include: { images: true, category: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const normalized = outfits.map((outfit) => {
      const totalPrice = outfit.products.reduce((sum, item) => sum + item.product.price, 0);
      return { ...outfit, totalPrice };
    });

    return res.json(normalized);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const outfitId = Number(req.params.id);
    const isNumeric = !Number.isNaN(outfitId);

    const outfit = await prisma.outfit.findFirst({
      where: isNumeric ? { id: outfitId } : { slug: req.params.id },
      include: {
        products: {
          include: {
            product: { include: { images: true, category: true, collection: true } }
          }
        }
      }
    });

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    const totalPrice = outfit.products.reduce((sum, item) => sum + item.product.price, 0);
    return res.json({ ...outfit, totalPrice });
  } catch (error) {
    return next(error);
  }
});

router.post("/", authRequired, adminRequired, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string().min(8),
      heroImage: z.string().url(),
      productIds: z.array(z.number().int()).min(1)
    });

    const payload = schema.parse(req.body);

    const outfit = await prisma.outfit.create({
      data: {
        name: payload.name,
        slug: slugify(`${payload.name}-${Date.now()}`),
        description: payload.description,
        heroImage: payload.heroImage,
        products: {
          create: payload.productIds.map((productId) => ({ productId }))
        }
      },
      include: {
        products: {
          include: {
            product: { include: { images: true } }
          }
        }
      }
    });

    return res.status(201).json(outfit);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const outfitId = Number(req.params.id);
    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(8).optional(),
      heroImage: z.string().url().optional(),
      productIds: z.array(z.number().int()).optional()
    });

    const payload = schema.parse(req.body);

    await prisma.outfit.update({
      where: { id: outfitId },
      data: {
        ...(payload.name ? { name: payload.name, slug: slugify(payload.name) } : {}),
        ...(payload.description ? { description: payload.description } : {}),
        ...(payload.heroImage ? { heroImage: payload.heroImage } : {})
      }
    });

    if (payload.productIds) {
      await prisma.outfitProduct.deleteMany({ where: { outfitId } });
      await prisma.outfitProduct.createMany({
        data: payload.productIds.map((productId) => ({ outfitId, productId }))
      });
    }

    const updated = await prisma.outfit.findUnique({
      where: { id: outfitId },
      include: {
        products: {
          include: {
            product: { include: { images: true, category: true } }
          }
        }
      }
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const outfitId = Number(req.params.id);
    await prisma.outfit.delete({ where: { id: outfitId } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
