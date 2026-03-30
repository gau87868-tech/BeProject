const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { validateToken } = require('../middleware/auth');

/**
 * @route   GET /api/v1/users/profile/:id
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile/:id', userController.getUserProfile);

/**
 * @route   PUT /api/v1/users/profile/:id
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile/:id', userController.updateUserProfile);

/**
 * @route   GET /api/v1/users/credits/:id
 * @desc    Get user credits
 * @access  Private
 */
router.get('/credits/:id', userController.getCredits);

/**
 * @route   POST /api/v1/users/buy-credits/:id
 * @desc    Buy/Add credits
 * @access  Private
 */
router.post('/buy-credits/:id', userController.buyCredits);

/**
 * @route   GET /api/v1/users/all
 * @desc    Get all users (admin only)
 * @access  Private
 */
router.get('/all', userController.getAllUsers);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
