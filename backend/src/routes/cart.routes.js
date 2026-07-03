const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

async function getOrCreateCart(sessionId) {
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: { include: { product: { include: { images: true } } } } }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
      include: { items: { include: { product: { include: { images: true } } } } }
    });
  }

  return cart;
}

router.get("/", async (req, res, next) => {
  try {
    const sessionId = (req.query.sessionId || "guest-cart").toString();
    const cart = await getOrCreateCart(sessionId);
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const schema = z.object({
      sessionId: z.string().min(3),
      productId: z.number().int(),
      quantity: z.number().int().min(1).default(1)
    });

    const payload = schema.parse(req.body);
    const cart = await getOrCreateCart(payload.sessionId);

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: payload.productId
        }
      }
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + payload.quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: payload.productId,
          quantity: payload.quantity
        }
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: { include: { images: true } } }
        }
      }
    });

    return res.status(201).json(updated);
  } catch (error) {
    return next(error);
  }
});

router.put("/item/:itemId", async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    const schema = z.object({ quantity: z.number().int().min(1) });
    const { quantity } = schema.parse(req.body);

    const item = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

router.delete("/item/:itemId", async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);
    await prisma.cartItem.delete({ where: { id: itemId } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.delete("/clear/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const cart = await prisma.cart.findUnique({ where: { sessionId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
