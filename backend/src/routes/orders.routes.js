const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const generateOrderNumber = require("../utils/orderNumber");
const { authRequired, adminRequired } = require("../middleware/auth");

const router = express.Router();

router.post("/checkout", async (req, res, next) => {
  try {
    const schema = z.object({
      customer: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(6)
      }),
      shipping: z.object({
        address: z.string().min(4),
        city: z.string().min(2),
        postalCode: z.string().min(3),
        country: z.string().min(2)
      }),
      items: z.array(
        z.object({
          productId: z.number().int(),
          quantity: z.number().int().min(1)
        })
      )
    });

    const payload = schema.parse(req.body);

    const productIds = payload.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const itemsWithPrice = payload.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} does not exist`);
      }
      return {
        ...item,
        price: product.price
      };
    });

    const subtotal = itemsWithPrice.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = Number((subtotal * 0.12).toFixed(2));
    const shipping = subtotal > 250 ? 0 : 15;
    const total = Number((subtotal + taxes + shipping).toFixed(2));

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName: payload.customer.name,
        customerEmail: payload.customer.email,
        customerPhone: payload.customer.phone,
        shippingAddress: payload.shipping.address,
        city: payload.shipping.city,
        postalCode: payload.shipping.postalCode,
        country: payload.shipping.country,
        subtotal,
        taxes,
        shipping,
        total,
        items: {
          create: itemsWithPrice.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: { product: { include: { images: true } } }
        }
      }
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
});

router.get("/:orderNumber", async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: {
          include: { product: { include: { images: true } } }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

router.put("/:orderNumber/status", authRequired, adminRequired, async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED"])
    });

    const { status } = schema.parse(req.body);

    const order = await prisma.order.update({
      where: { orderNumber: req.params.orderNumber },
      data: { status }
    });

    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
