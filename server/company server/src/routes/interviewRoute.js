const express = require("express");
const interviewController = require("../controllers/interviewController");
const { validateOrgToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /api/v2/interview/create
 * @desc    Create a new interview
 * @access  Private
 */
router.post("/create", validateOrgToken, interviewController.createInterview);

/**
 * @route   POST /api/v2/interview/:id/invite
 * @desc    Invite students to interview
 * @access  Private
 */
router.post("/:id/invite", validateOrgToken, interviewController.inviteStudents);

/**
 * @route   POST /api/v2/interview/submit
 * @desc    Submit interview answers
 * @access  Public
 */
router.post("/submit", interviewController.submitInterview);

/**
 * @route   GET /api/v2/interview/results/:interviewId
 * @desc    Get interview results
 * @access  Private
 */
router.get("/results/:interviewId", validateOrgToken, interviewController.getInterviewResults);

/**
 * @route   GET /api/v2/interview/result/:resultId
 * @desc    Get single result by ID
 * @access  Private
 */
router.get("/result/:resultId", validateOrgToken, interviewController.getResultById);

module.exports = router;

