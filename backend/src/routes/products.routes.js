const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const slugify = require("../utils/slugify");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

function toCsv(values) {
  return (values || []).map((item) => item.trim()).filter(Boolean).join(",");
}

function fromCsv(value) {
  if (!value) {
    return [];
  }
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function normalizeProduct(product) {
  return {
    ...product,
    sizes: fromCsv(product.sizes),
    colors: fromCsv(product.colors)
  };
}

router.get("/", async (req, res, next) => {
  try {
    const {
      q,
      category,
      collection,
      outfit,
      size,
      color,
      limited,
      availability,
      minPrice,
      maxPrice,
      sort = "newest",
      page = "1",
      pageSize = "12"
    } = req.query;

    const where = {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } }
              ]
            }
          : {},
        category ? { category: { name: { equals: category, mode: "insensitive" } } } : {},
        collection ? { collection: { slug: collection } } : {},
        outfit ? { outfits: { some: { outfit: { slug: outfit } } } } : {},
        size ? { sizes: { contains: size } } : {},
        color ? { colors: { contains: color } } : {},
        limited === "true" ? { limitedEdition: true } : {},
        availability === "in_stock" ? { stock: { gt: 0 } } : {},
        availability === "out_of_stock" ? { stock: { lte: 0 } } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {}
      ]
    };

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const currentPage = Number(page);
    const take = Number(pageSize);
    const skip = (currentPage - 1) * take;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          category: true,
          collection: true,
          outfits: { include: { outfit: true } }
        },
        orderBy,
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    return res.json({ items: items.map(normalizeProduct), total, page: currentPage, pageSize: take });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const isNumeric = !Number.isNaN(productId);

    const product = await prisma.product.findFirst({
      where: isNumeric ? { id: productId } : { slug: req.params.id },
      include: {
        images: true,
        category: true,
        collection: true,
        outfits: {
          include: {
            outfit: {
              include: {
                products: {
                  include: {
                    product: { include: { images: true, category: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const normalized = {
      ...normalizeProduct(product),
      outfits: product.outfits.map((entry) => ({
        ...entry,
        outfit: {
          ...entry.outfit,
          products: entry.outfit.products.map((outfitItem) => ({
            ...outfitItem,
            product: normalizeProduct(outfitItem.product)
          }))
        }
      }))
    };

    return res.json(normalized);
  } catch (error) {
    return next(error);
  }
});

router.post("/", authRequired, adminRequired, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string().min(8),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      categoryId: z.number().int(),
      collectionId: z.number().int().optional(),
      limitedEdition: z.boolean().optional(),
      sizes: z.array(z.string()).default([]),
      colors: z.array(z.string()).default([]),
      imageUrls: z.array(z.string().url()).default([]),
      outfitIds: z.array(z.number().int()).default([])
    });

    const payload = schema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: payload.name,
        slug: slugify(`${payload.name}-${Date.now()}`),
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        categoryId: payload.categoryId,
        collectionId: payload.collectionId,
        limitedEdition: payload.limitedEdition ?? false,
        sizes: toCsv(payload.sizes),
        colors: toCsv(payload.colors),
        images: { create: payload.imageUrls.map((url) => ({ url })) },
        outfits: {
          create: payload.outfitIds.map((outfitId) => ({ outfitId }))
        }
      },
      include: { images: true, outfits: true }
    });

    return res.status(201).json(normalizeProduct(product));
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().min(8).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      categoryId: z.number().int().optional(),
      collectionId: z.number().int().nullable().optional(),
      limitedEdition: z.boolean().optional(),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      imageUrls: z.array(z.string().url()).optional(),
      outfitIds: z.array(z.number().int()).optional()
    });

    const payload = schema.parse(req.body);

    await prisma.product.update({
      where: { id: productId },
      data: {
        ...(payload.name ? { name: payload.name, slug: slugify(payload.name) } : {}),
        ...(payload.description ? { description: payload.description } : {}),
        ...(payload.price ? { price: payload.price } : {}),
        ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
        ...(payload.categoryId ? { categoryId: payload.categoryId } : {}),
        ...(payload.collectionId !== undefined ? { collectionId: payload.collectionId } : {}),
        ...(payload.limitedEdition !== undefined ? { limitedEdition: payload.limitedEdition } : {}),
        ...(payload.sizes ? { sizes: toCsv(payload.sizes) } : {}),
        ...(payload.colors ? { colors: toCsv(payload.colors) } : {})
      }
    });

    if (payload.imageUrls) {
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.createMany({
        data: payload.imageUrls.map((url) => ({ url, productId }))
      });
    }

    if (payload.outfitIds) {
      await prisma.outfitProduct.deleteMany({ where: { productId } });
      await prisma.outfitProduct.createMany({
        data: payload.outfitIds.map((outfitId) => ({ outfitId, productId }))
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        collection: true,
        outfits: { include: { outfit: true } }
      }
    });

    return res.json(normalizeProduct(updated));
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", authRequired, adminRequired, async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    await prisma.product.delete({ where: { id: productId } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
