const express = require('express');
const router = express.Router();
const { prisma } = require('../database');
const emailService = require('../services/email');
const { authenticateToken, asyncHandler } = require('../middleware');

// Create request
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { title, description, type } = req.body;
    const guestId = req.user.id;

    const request = await prisma.serviceRequest.create({
        data: { guestId, title, description, type }
    });

    // Send confirmation email
    await emailService.sendRequestConfirmation(
        req.user.email,
        title,
        request.id
    );

    res.status(201).json({ data: request });
}));

// Update request status
router.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.serviceRequest.findUnique({ where: { id } });

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    const updated = await prisma.serviceRequest.update({
        where: { id },
        data: { status, completedAt: status === 'COMPLETED' ? new Date() : null }
    });

    // Send completion email
    if (status === 'COMPLETED') {
        const guest = await prisma.user.findUnique({ where: { id: request.guestId } });
        await emailService.sendRequestCompleted(
            guest.email,
            request.title,
            request.id
        );
    }

    res.json({ data: updated });
}));

// Get all requests
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const requests = await prisma.serviceRequest.findMany({
        where: req.user.role === 'GUEST' ? { guestId: req.user.id } : {},
        include: { guest: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
    });

    res.json({ data: requests });
}));

module.exports = router;