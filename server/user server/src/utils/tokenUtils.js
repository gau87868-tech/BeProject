/**
 * @description JWT Token Generation and Verification Utilities
 */

const jwt = require('jsonwebtoken');

/**
 * Generate access and refresh tokens
 * @param {string} userId - User ID
 * @returns {Object} {accessToken, refreshToken}
 */
exports.generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_STRING,
        { expiresIn: '3d' }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_STRING,
        { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Verify and decode token
 * @param {string} token - JWT Token
 * @returns {Object} Decoded token
 */
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_STRING);
    } catch (error) {
        throw error;
    }
};
