const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

const statusSteps = ["PENDING", "PAID", "PACKED", "SHIPPED", "DELIVERED"];

router.get("/:orderNumber", async (req, res, next) => {
  try {
    const querySchema = z.object({ email: z.string().email() });
    const { email } = querySchema.parse(req.query);

    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: {
          include: { product: { include: { images: true } } }
        }
      }
    });

    if (!order || order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({ message: "Order not found" });
    }

    const activeIndex = statusSteps.indexOf(order.status);
    const timeline = statusSteps.map((status, index) => ({
      status,
      completed: index <= activeIndex,
      active: status === order.status
    }));

    return res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      timeline,
      items: order.items,
      shippingAddress: {
        address: order.shippingAddress,
        city: order.city,
        postalCode: order.postalCode,
        country: order.country
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
