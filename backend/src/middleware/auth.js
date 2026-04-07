const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

// ==========================================
// JWT VERIFICATION
// ==========================================

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new AppError(401, 'No token provided');
        }

        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
            if (err) {
                throw new AppError(403, 'Invalid or expired token');
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError(500, 'Authentication failed');
    }
};

// ==========================================
// AUTHORIZATION BY ROLE
// ==========================================

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError(401, 'User not authenticated');
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError(403, `Access denied. Required roles: ${roles.join(', ')}`);
        }

        next();
    };
};

// ==========================================
// OPTIONAL AUTH
// ==========================================

const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
                if (!err) {
                    req.user = decoded;
                }
            });
        }

        next();
    } catch (error) {
        next();
    }
};

// ==========================================
// GUEST ONLY
// ==========================================

const guestOnly = (req, res, next) => {
    try {
        if (req.user) {
            throw new AppError(403, 'Already authenticated');
        }
        next();
    } catch (error) {
        next(error);
    }
};

// ==========================================
// ROLE-SPECIFIC
// ==========================================

const staffOnly = authorize('STAFF', 'ADMIN');
const adminOnly = authorize('ADMIN');

module.exports = {
    authenticateToken,
    authorize,
    optionalAuth,
    guestOnly,
    staffOnly,
    adminOnly,
};