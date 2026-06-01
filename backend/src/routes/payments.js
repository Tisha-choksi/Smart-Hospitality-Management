const express = require('express');
const router = express.Router();
const { prisma } = require('../database');
const emailService = require('../services/email');
const { authenticateToken, asyncHandler } = require('../middleware');

const getStripeClient = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }
    return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

// Create payment intent
router.post('/intent', authenticateToken, asyncHandler(async (req, res) => {
    const { amount, bookingId } = req.body;
    const userId = req.user.id;
    const stripe = getStripeClient();

    if (!stripe) {
        return res.status(503).json({
            error: 'Payments are not configured. Missing STRIPE_SECRET_KEY.'
        });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: {
                userId,
                bookingId
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

// Confirm payment
router.post('/confirm', authenticateToken, asyncHandler(async (req, res) => {
    const { paymentIntentId, amount, bookingId } = req.body;
    const userId = req.user.id;

    try {
        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                userId,
                bookingId,
                amount,
                method: 'STRIPE',
                stripeId: paymentIntentId,
                status: 'COMPLETED'
            }
        });

        // Send receipt email
        const user = await prisma.user.findUnique({ where: { id: userId } });
        await emailService.sendPaymentReceipt(user.email, {
            amount,
            method: 'Credit Card',
            date: new Date(),
            transactionId: paymentIntentId
        });

        res.json({ data: payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

// Get payments
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const payments = await prisma.payment.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
    });

    res.json({ data: payments });
}));

module.exports = router;