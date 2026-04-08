const express = require('express');
const router = express.Router();
const { prisma } = require('../database');
const emailService = require('../services/email');
const { authenticateToken, asyncHandler } = require('../middleware');

// Create booking
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
    const { roomType, checkIn, checkOut, guests, totalPrice, specialRequests } = req.body;
    const guestId = req.user.id;

    // Validate dates
    if (new Date(checkIn) >= new Date(checkOut)) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    const booking = await prisma.booking.create({
        data: {
            guestId,
            roomType,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests,
            totalPrice,
            specialRequests,
            status: 'CONFIRMED'
        }
    });

    // Send confirmation email
    await emailService.sendBookingConfirmation(req.user.email, {
        roomType,
        checkIn,
        checkOut,
        totalPrice,
        bookingId: booking.id
    });

    res.status(201).json({ data: booking });
}));

// Get guest bookings
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
        where: { guestId: req.user.id },
        orderBy: { checkIn: 'desc' }
    });

    res.json({ data: bookings });
}));

// Get all bookings (admin/staff)
router.get('/admin/all', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const bookings = await prisma.booking.findMany({
        include: { guest: { select: { name: true, email: true } } },
        orderBy: { checkIn: 'asc' }
    });

    res.json({ data: bookings });
}));

// Update booking
router.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, specialRequests } = req.body;

    const booking = await prisma.booking.update({
        where: { id },
        data: { status, specialRequests }
    });

    res.json({ data: booking });
}));

// Cancel booking
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const booking = await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
    });

    res.json({ data: booking });
}));

module.exports = router;