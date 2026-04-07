const express = require('express');
const { authenticateToken, staffOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/database');

const router = express.Router();

router.get('/', staffOnly, asyncHandler(async (req, res) => {
    const staff = await prisma.user.findMany({
        where: { role: { in: ['STAFF', 'ADMIN'] } },
    });
    res.json({ success: true, data: staff });
}));

router.get('/:id', staffOnly, asyncHandler(async (req, res) => {
    const staff = await prisma.user.findUnique({
        where: { id: req.params.id },
    });
    if (!staff) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: staff });
}));

module.exports = router;