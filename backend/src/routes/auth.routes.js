const express = require('express');
const { authenticateToken, guestOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { AuthService } = require('../services/auth.service');

const router = express.Router();

// ==========================================
// REGISTER
// ==========================================

router.post(
    '/register',
    guestOnly,
    asyncHandler(async (req, res) => {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required',
            });
        }

        const result = await AuthService.register({ email, password, name });

        res.status(201).json({
            success: true,
            message: 'Registered successfully',
            data: result,
        });
    })
);

// ==========================================
// LOGIN
// ==========================================

router.post(
    '/login',
    guestOnly,
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const result = await AuthService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    })
);

// ==========================================
// GET CURRENT USER
// ==========================================

router.get(
    '/me',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const user = await AuthService.getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    })
);

// ==========================================
// CHANGE PASSWORD
// ==========================================

router.post(
    '/change-password',
    authenticateToken,
    asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both passwords are required',
            });
        }

        await AuthService.changePassword(req.user.id, oldPassword, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    })
);

module.exports = router;