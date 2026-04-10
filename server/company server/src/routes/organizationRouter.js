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

//debug
// console.log("Exports:", Object.keys(orgController));
// console.log("registerCompany type:", typeof orgController.registerCompany);

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
 */
// ✅ Bug #11 FIXED: Removed :organizationId param — controller uses req.user.id from JWT
router.get("/dashboard/overview", orgController.validateToken, orgController.getDashboardOverview);

module.exports = router;
