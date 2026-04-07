const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const { prisma } = require('./database');
const { errorHandler, notFoundHandler } = require('./middleware');

const authRoutes = require('./routes/auth');
const guestRoutes = require('./routes/guests');
const staffRoutes = require('./routes/staff');
const requestRoutes = require('./routes/requests');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    try {
        await prisma.$connect();
        console.log('✓ Database connected');

        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();