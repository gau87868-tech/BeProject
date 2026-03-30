/**
 * @description Global Error Handler Middleware
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

exports.AppError = AppError;

exports.errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: errors
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            status: 'fail',
            message: `${field} already exists. Please use a different ${field}.`
        });
    }

    // Handle Mongoose cast errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID format'
        });
    }

    res.status(statusCode).json({
        status: statusCode < 500 ? 'fail' : 'error',
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

exports.asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
