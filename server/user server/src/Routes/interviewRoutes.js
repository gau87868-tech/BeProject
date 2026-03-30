
const express = require("express");
const interviewController = require("../Controllers/interviewController");
const { validateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @route   POST /api/v1/interview/submit
 * @desc    Submit interview answers
 * @access  Private
 */
router.post("/submit", validateToken, interviewController.submitInterview);

/**
 * @route   GET /api/v1/interview/history/:userId
 * @desc    Get interview history for a user
 * @access  Private
 */
router.get("/history/:userId", validateToken, interviewController.getInterviewHistory);

/**
 * @route   GET /api/v1/interview/all
 * @desc    Get all interviews (admin only)
 * @access  Private
 */
router.get("/all", validateToken, interviewController.getAllInterviews);

/**
 * @route   GET /api/v1/interview/:id
 * @desc    Get interview by ID
 * @access  Private
 */
router.get("/:id", validateToken, interviewController.getInterviewById);

/**
 * @route   DELETE /api/v1/interview/:id
 * @desc    Delete interview
 * @access  Private
 */
router.delete("/:id", validateToken, interviewController.deleteInterview);

module.exports = router;

