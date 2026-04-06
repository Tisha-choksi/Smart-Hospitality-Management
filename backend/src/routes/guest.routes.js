const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../index');

const router = express.Router();

router.get(
    '/',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const guests = await prisma.user.findMany({
            where: { role: 'GUEST' },
            select: { id: true, email: true, name: true, role: true },
        });
        res.json({ success: true, data: guests });
    })
);

router.get(
    '/:id',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const guest = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!guest) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: guest });
    })
);

router.patch(
    '/:id',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { name, email } = req.body;
        const guest = await prisma.user.update({
            where: { id: req.params.id },
            data: { name, email },
            select: { id: true, email: true, name: true, role: true },
        });
        res.json({ success: true, message: 'Updated', data: guest });
    })
);

module.exports = router;