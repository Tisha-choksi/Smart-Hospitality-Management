const express = require('express');
const router = express.Router();
const { prisma } = require('../database');
const { authenticateToken, asyncHandler } = require('../middleware');

// Get dashboard analytics
router.get('/dashboard', authenticateToken, asyncHandler(async (req, res) => {
    const user = req.user;

    // Get stats for admin/staff
    if (user.role === 'ADMIN' || user.role === 'STAFF') {
        const totalRequests = await prisma.serviceRequest.count();
        const completedRequests = await prisma.serviceRequest.count({
            where: { status: 'COMPLETED' }
        });

        const totalBookings = await prisma.booking.count();
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'COMPLETED' }
        });

        const avgRating = await prisma.feedback.aggregate({
            _avg: { rating: true }
        });

        // Request status breakdown
        const requestStats = await prisma.serviceRequest.groupBy({
            by: ['status'],
            _count: { id: true }
        });

        // Recent requests
        const recentRequests = await prisma.serviceRequest.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { guest: { select: { name: true, email: true } } }
        });

        // Feedback breakdown
        const feedbackStats = await prisma.feedback.groupBy({
            by: ['sentiment'],
            _count: { id: true }
        });

        return res.json({
            data: {
                totalRequests,
                completedRequests,
                completionRate: totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(2) : 0,
                totalBookings,
                totalRevenue: totalRevenue._sum.amount || 0,
                avgRating: avgRating._avg.rating || 0,
                requestStats,
                feedbackStats,
                recentRequests
            }
        });
    }

    // Get stats for guest
    const guestRequests = await prisma.serviceRequest.count({
        where: { guestId: user.id }
    });

    const guestBookings = await prisma.booking.count({
        where: { guestId: user.id }
    });

    const guestFeedback = await prisma.feedback.count({
        where: { guestId: user.id }
    });

    res.json({
        data: {
            totalRequests: guestRequests,
            totalBookings: guestBookings,
            totalFeedback: guestFeedback,
            recentRequests: await prisma.serviceRequest.findMany({
                where: { guestId: user.id },
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        }
    });
}));

// Get analytics by date range
router.get('/range', authenticateToken, asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const requests = await prisma.serviceRequest.groupBy({
        by: ['createdAt'],
        _count: { id: true },
        where: {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        }
    });

    res.json({ data: requests });
}));

// Get request metrics
router.get('/requests', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const metrics = await prisma.serviceRequest.groupBy({
        by: ['type', 'status'],
        _count: { id: true },
        _avg: { id: true }
    });

    res.json({ data: metrics });
}));

// Get revenue analytics
router.get('/revenue', authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const revenue = await prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: { amount: true },
        _count: { id: true }
    });

    res.json({ data: revenue });
}));

module.exports = router;