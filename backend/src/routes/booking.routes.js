const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/database');

const router = express.Router();

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate, totalPrice } = req.body;
  const booking = await prisma.booking.create({
    data: { roomId, checkInDate: new Date(checkInDate), checkOutDate: new Date(checkOutDate), totalPrice },
  });
  res.status(201).json({ success: true, data: booking });
}));

module.exports = router;
