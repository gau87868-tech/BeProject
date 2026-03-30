/**
 * @description Authentication Middleware
 * Validates JWT tokens from Authorization header
 */

const jwt = require('jsonwebtoken');

exports.validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'fail',
                message: 'No token provided. Please provide a valid authentication token.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);
        req.user = decoded;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Token has expired. Please login again.'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                status: 'fail',
                message: 'Invalid token. Please provide a valid authentication token.'
            });
        }

        return res.status(403).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);
            req.user = decoded;
        }
        next();

    } catch (error) {
        // Optional auth - don't fail, just log and continue
        next();
    }
};
