const express = require("express");
const questionController = require("../controllers/questionController");
const { validateOrgToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /api/v2/questions/create
 * @desc    Add questions to an interview
 * @access  Private
 */
router.post("/create", validateOrgToken, questionController.addQuestions);

/**
 * @route   GET /api/v2/questions/:interviewId
 * @desc    Get questions for an interview
 * @access  Private
 */
router.get("/:interviewId", validateOrgToken, questionController.getQuestions);

/**
 * @route   PUT /api/v2/questions/:interviewId
 * @desc    Update questions for an interview
 * @access  Private
 */
router.put("/:interviewId", validateOrgToken, questionController.updateQuestions);

/**
 * @route   DELETE /api/v2/questions/:interviewId
 * @desc    Delete questions for an interview
 * @access  Private
 */
router.delete("/:interviewId", validateOrgToken, questionController.deleteQuestions);

/**
 * @route   GET /api/v2/questions/org/:organizationId
 * @desc    Get questions by organization
 * @access  Private
 */
router.get("/org/:organizationId", validateOrgToken, questionController.getOrganizationQuestions);

module.exports = router;
