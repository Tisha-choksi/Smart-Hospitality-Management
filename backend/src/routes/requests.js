const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { prisma } = require('../database');

const router = express.Router();

router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { title, description, type } = req.body;
    const request = await prisma.serviceRequest.create({
        data: { title, description, type, status: 'PENDING', guestId: req.user.id }
    });
    res.status(201).json({ success: true, data: request });
}));

router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const requests = await prisma.serviceRequest.findMany({ where: { guestId: req.user.id } });
    res.json({ success: true, data: requests });
}));

module.exports = router;