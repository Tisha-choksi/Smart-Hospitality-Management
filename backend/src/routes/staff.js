const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { prisma } = require('../database');

const router = express.Router();

router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const staff = await prisma.user.findMany({ where: { role: { in: ['STAFF', 'ADMIN'] } } });
    res.json({ success: true, data: staff });
}));

module.exports = router;