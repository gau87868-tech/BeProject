const express = require("express");
const orgController = require("../controllers/organizationController");
const { validateOrgToken } = require("../middleware/auth");
const { validateOrgSignup, validateOrgLogin } = require("../middleware/validation");

const router = express.Router();

/**
 * @route POST /api/v2/organization/register
 * @desc Register a new organization
 * @access Public
 */
router.post("/register", validateOrgSignup, orgController.registerCompany);

/**
 * @route POST /api/v2/organization/login
 * @desc Login organization
 * @access Public
 */
router.post("/login", validateOrgLogin, orgController.login);

/**
 * @route POST /api/v2/organization/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post("/refresh-token", orgController.refreshToken);

/**
 * @route GET /api/v2/organization/dashboard/overview
 * @desc Get organization dashboard stats
 * @access Private
 *
 * FIX: Now uses validateOrgToken middleware (consistent with all other routes)
 * instead of orgController.validateToken. This ensures req.organization.id
 * is set correctly for the controller.
 */
router.get("/dashboard/overview", validateOrgToken, orgController.getDashboardOverview);

/**
 * @route PATCH /api/v2/organization/profile
 * @desc Update organization profile
 * @access Private
 * NEW ENDPOINT
 */
router.patch("/profile", validateOrgToken, orgController.updateProfile);

/**
 * @route PATCH /api/v2/organization/password
 * @desc Change organization password
 * @access Private
 * NEW ENDPOINT
 */
router.patch("/password", validateOrgToken, orgController.changePassword);

module.exports = router;
