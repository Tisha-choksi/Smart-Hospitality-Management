const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/database');

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { title, description, type } = req.body;
    const request = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        type,
        status: 'PENDING',
        guestId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: request });
  })
);

router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const requests = await prisma.serviceRequest.findMany({
      where: { guestId: req.user.id },
    });
    res.json({ success: true, data: requests });
  })
);

router.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: req.params.id },
    });
    if (!request) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: request });
  })
);

module.exports = router;