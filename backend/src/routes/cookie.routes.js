const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const schema = z.object({
      email: z.string().email().optional(),
      decision: z.enum(["ACCEPTED", "DECLINED", "MANAGED"]),
      preferences: z.record(z.boolean()).optional()
    });

    const payload = schema.parse(req.body);

    const consent = await prisma.cookieConsent.create({ data: payload });
    return res.status(201).json(consent);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
