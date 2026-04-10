const express = require("express");
const interviewController = require("../controllers/interviewController");
const { validateOrgToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /api/v2/interview/create
 * @desc Create a new interview
 * @access Private
 */
router.post("/create", validateOrgToken, interviewController.createInterview);

/**
 * @route GET /api/v2/interview/list
 * @desc Get all interviews for logged-in organization
 * @access Private
 */
router.get("/list", validateOrgToken, interviewController.getInterviews);

/**
 * @route GET /api/v2/interview/detail/:id
 * @desc Get single interview by ID
 * @access Private
 * NEW ENDPOINT
 */
router.get("/detail/:id", validateOrgToken, interviewController.getInterviewById);

/**
 * @route PATCH /api/v2/interview/update/:id
 * @desc Update interview details
 * @access Private
 * NEW ENDPOINT
 */
router.patch("/update/:id", validateOrgToken, interviewController.updateInterview);

/**
 * @route DELETE /api/v2/interview/delete/:id
 * @desc Delete interview and associated questions/results
 * @access Private
 * NEW ENDPOINT
 */
router.delete("/delete/:id", validateOrgToken, interviewController.deleteInterview);

/**
 * @route PATCH /api/v2/interview/status/:id
 * @desc Update interview status (draft / published / closed)
 * @access Private
 * NEW ENDPOINT
 */
router.patch("/status/:id", validateOrgToken, interviewController.updateInterviewStatus);

/**
 * @route POST /api/v2/interview/:id/invite
 * @desc Invite students to interview
 * @access Private
 */
router.post("/:id/invite", validateOrgToken, interviewController.inviteStudents);

/**
 * @route POST /api/v2/interview/submit
 * @desc Submit interview answers
 * @access Public
 */
router.post("/submit", interviewController.submitInterview);

/**
 * @route GET /api/v2/interview/results/:interviewId
 * @desc Get interview results
 * @access Private
 */
router.get("/results/:interviewId", validateOrgToken, interviewController.getInterviewResults);

/**
 * @route GET /api/v2/interview/result/:resultId
 * @desc Get single result by ID
 * @access Private
 */
router.get("/result/:resultId", validateOrgToken, interviewController.getResultById);

/**
 * @route PATCH /api/v2/interview/shortlist/:resultId
 * @desc Shortlist or un-shortlist a candidate
 * @access Private
 * NEW ENDPOINT
 */
router.patch("/shortlist/:resultId", validateOrgToken, interviewController.shortlistCandidate);

/**
 * @route GET /api/v2/interview/analytics/:interviewId
 * @desc Get analytics for an interview (score distribution, pass/fail, etc.)
 * @access Private
 * NEW ENDPOINT
 */
router.get("/analytics/:interviewId", validateOrgToken, interviewController.getInterviewAnalytics);

module.exports = router;
