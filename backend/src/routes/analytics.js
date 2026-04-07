const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { prisma } = require('../database');

const router = express.Router();

router.get('/sentiment', authenticateToken, asyncHandler(async (req, res) => {
    const feedback = await prisma.feedback.findMany();
    res.json({ success: true, data: feedback });
}));

module.exports = router;