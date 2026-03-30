
const express = require("express");
const authController = require("../Controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validation");
const router = express.Router();

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validateSignup, authController.signUp);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", validateLogin, authController.login);

/**
 * @route   POST /api/v1/auth/refreshToken
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
