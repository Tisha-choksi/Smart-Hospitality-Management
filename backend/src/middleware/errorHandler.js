const { requestLogger } = require('../utils/logger');

// ==========================================
// CUSTOM ERROR CLASS
// ==========================================

class AppError extends Error {
    constructor(statusCode, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// ==========================================
// ERROR HANDLER MIDDLEWARE
// ==========================================

const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let details = undefined;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
    }

    requestLogger.error('Error occurred', {
        statusCode,
        message,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            statusCode,
            message,
            ...(process.env.NODE_ENV === 'development' && { details }),
        },
    });
};

// ==========================================
// 404 NOT FOUND HANDLER
// ==========================================

const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            statusCode: 404,
            message: `Route not found: ${req.method} ${req.path}`,
        },
    });
};

// ==========================================
// ASYNC ROUTE WRAPPER
// ==========================================

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler,
    asyncHandler,
};