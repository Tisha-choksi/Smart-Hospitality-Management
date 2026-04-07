const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Concierge chat endpoint' });
});

module.exports = router;