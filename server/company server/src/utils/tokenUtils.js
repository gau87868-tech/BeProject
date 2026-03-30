/**
 * @description JWT Token Generation and Verification Utilities
 */

const jwt = require('jsonwebtoken');

/**
 * Generate access and refresh tokens
 * @param {string} organizationId - Organization ID
 * @returns {Object} {accessToken, refreshToken}
 */
exports.generateOrgTokens = (organizationId) => {
    const accessToken = jwt.sign(
        { id: organizationId },
        process.env.JWT_SECRET_STRING || 'your-secret-key',
        { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
        { id: organizationId },
        process.env.JWT_SECRET_STRING || 'your-secret-key',
        { expiresIn: '30d' }
    );

    return { accessToken, refreshToken };
};

/**
 * Verify and decode token
 * @param {string} token - JWT Token
 * @returns {Object} Decoded token
 */
exports.verifyOrgToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_STRING || 'your-secret-key');
    } catch (error) {
        throw error;
    }
};

/**
 * Generate invitation token (short-lived)
 * @param {string} email - Candidate email
 * @param {string} interviewId - Interview ID
 * @returns {string} Invitation token
 */
exports.generateInviteToken = (email, interviewId) => {
    const token = jwt.sign(
        { email, interviewId },
        process.env.JWT_SECRET_STRING || 'your-secret-key',
        { expiresIn: '7d' }
    );
    return token;
};

/**
 * Verify invitation token
 * @param {string} token - Invitation token
 * @returns {Object} Decoded token
 */
exports.verifyInviteToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_STRING || 'your-secret-key');
    } catch (error) {
        throw error;
    }
};
