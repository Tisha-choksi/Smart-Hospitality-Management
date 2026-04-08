const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

// WebSocket Events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });

    // Join user-specific room
    socket.on('join', (userId) => {
        socket.join(`user-${userId}`);
    });

    // Listen for request updates
    socket.on('request-updated', (data) => {
        io.to(`user-${data.userId}`).emit('notification', {
            type: 'REQUEST_UPDATED',
            title: 'Request Updated',
            message: data.message,
            timestamp: new Date()
        });
    });

    // Listen for booking confirmations
    socket.on('booking-confirmed', (data) => {
        io.to(`user-${data.userId}`).emit('notification', {
            type: 'BOOKING_CONFIRMED',
            title: 'Booking Confirmed',
            message: data.message,
            timestamp: new Date()
        });
    });

    // Listen for payment notifications
    socket.on('payment-received', (data) => {
        io.to(`user-${data.userId}`).emit('notification', {
            type: 'PAYMENT_RECEIVED',
            title: 'Payment Received',
            message: data.message,
            timestamp: new Date()
        });
    });
});

const PORT = process.env.BACKEND_PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket listening`);
});

module.exports = { app, io };