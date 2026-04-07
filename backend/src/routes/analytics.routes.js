const express = require('express');
const { authenticateToken, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/database');

const router = express.Router();

router.get(
  '/sentiment',
  adminOnly,
  asyncHandler(async (req, res) => {
    const feedback = await prisma.feedback.findMany();
    res.json({ success: true, data: feedback });
  })
);

router.get(
  '/requests',
  adminOnly,
  asyncHandler(async (req, res) => {
    const requests = await prisma.serviceRequest.findMany();
    res.json({ success: true, data: requests });
  })
);

router.get(
  '/occupancy',
  adminOnly,
  asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
    });
    res.json({ success: true, data: bookings });
  })
);

module.exports = router;