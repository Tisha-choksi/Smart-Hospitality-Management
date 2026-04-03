import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running ✅' });
});

// Placeholder routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/guests', require('./routes/guest.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/requests', require('./routes/request.routes'));

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});