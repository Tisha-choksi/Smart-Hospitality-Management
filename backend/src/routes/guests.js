const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { prisma } = require('../database');

const router = express.Router();

router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const guests = await prisma.user.findMany({ where: { role: 'GUEST' } });
    res.json({ success: true, data: guests });
}));

router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const guest = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!guest) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: guest });
}));

module.exports = router;