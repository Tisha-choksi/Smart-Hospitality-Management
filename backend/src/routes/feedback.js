const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { prisma } = require('../database');

const router = express.Router();

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { rating, comment, category } = req.body;
  const feedback = await prisma.feedback.create({
    data: { rating, comment, category, guestId: req.user.id }
  });
  res.status(201).json({ success: true, data: feedback });
}));

router.get('/', asyncHandler(async (req, res) => {
  const feedback = await prisma.feedback.findMany();
  res.json({ success: true, data: feedback });
}));

module.exports = router;