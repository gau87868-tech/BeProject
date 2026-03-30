
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const { generateTokens } = require('../utils/tokenUtils');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc   Signup a new user
 * @route  POST /api/v1/auth/signup
 * @access Public
 */
exports.signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email already registered. Please login instead.'
        });
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const userWithoutPassword = await User.findById(user._id).select('-password');
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

/**
 * @desc   Login user
 * @route  POST /api/v1/auth/login
 * @access Public
 */
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }

    const userWithoutPassword = await User.findById(user._id).select('-password');
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

/**
 * @desc   Refresh access token
 * @route  POST /api/v1/auth/refreshToken
 * @access Public
 */
exports.refreshToken = asyncHandler(async (req, res, next) => {
    const { email, refreshToken: incomingToken } = req.body;

    if (!email || !incomingToken) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email and refresh token are required'
        });
    }

    try {
        jwt.verify(incomingToken, process.env.JWT_SECRET_STRING);
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired refresh token'
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: {
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});