const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/database');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { rating, comment, category } = req.body;
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        category,
        guestId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: feedback });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const feedback = await prisma.feedback.findMany();
    res.json({ success: true, data: feedback });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const feedback = await prisma.feedback.findUnique({
      where: { id: req.params.id },
    });
    if (!feedback) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: feedback });
  })
);

module.exports = router;