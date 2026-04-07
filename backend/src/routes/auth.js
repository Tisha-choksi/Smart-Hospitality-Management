const express = require('express');
const { authenticateToken, asyncHandler } = require('../middleware');
const { AuthService } = require('../services/auth');

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const result = await AuthService.register(email, password, name);
    res.status(201).json({ success: true, data: result });
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const result = await AuthService.login(email, password);
    res.json({ success: true, data: result });
}));

router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user.id);
    res.json({ success: true, data: user });
}));

module.exports = router;