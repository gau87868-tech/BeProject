const Organization = require("../models/organizationModel");
const Interview = require("../models/interviewModel");
const Question = require("../models/questionModel");
const Result = require("../models/resultsModel");
const { generateOrgTokens } = require("../utils/tokenUtils");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc   Register a new organization
 * @route  POST /api/v2/organization/register
 * @access Public
 */
exports.registerOrganization = asyncHandler(async (req, res) => {
    const { companyName, companyEmail, password, contactPerson, phoneNumber, industry, website } = req.body;

    // Check if organization already exists
    const existing = await Organization.findOne({ companyEmail });
    if (existing) {
        return res.status(400).json({
            status: 'fail',
            message: 'Organization with this email already exists'
        });
    }

    const organization = await Organization.create({
        companyName,
        companyEmail,
        password,
        contactPerson,
        phoneNumber,
        industry,
        website
    });

    const orgData = await Organization.findById(organization._id).select('-password');
    const { accessToken, refreshToken } = generateOrgTokens(organization._id);

    res.status(201).json({
        status: 'success',
        message: 'Organization registered successfully',
        data: {
            organization: orgData,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

/**
 * @desc   Login organization
 * @route  POST /api/v2/organization/login
 * @access Public
 */
exports.loginOrganization = asyncHandler(async (req, res) => {
    const { companyEmail, password } = req.body;

    const organization = await Organization.findOne({ companyEmail }).select('+password');
    if (!organization) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }

    const passwordMatch = await organization.comparePassword(password);
    if (!passwordMatch) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }

    const orgData = await Organization.findById(organization._id).select('-password');
    const { accessToken, refreshToken } = generateOrgTokens(organization._id);

    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            organization: orgData,
            tokens: {
                accessToken,
                refreshToken
            }
        }
    });
});

/**
 * @desc   Get organization profile
 * @route  GET /api/v2/organization/profile/:id
 * @access Private
 */
exports.getOrganizationProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const organization = await Organization.findById(id).select('-password');
    if (!organization) {
        return res.status(404).json({
            status: 'fail',
            message: 'Organization not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            organization
        }
    });
});

/**
 * @desc   Update organization profile
 * @route  PUT /api/v2/organization/profile/:id
 * @access Private
 */
exports.updateOrganizationProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { companyName, contactPerson, phoneNumber, industry, description, website } = req.body;

    const organization = await Organization.findByIdAndUpdate(
        id,
        { companyName, contactPerson, phoneNumber, industry, description, website },
        { new: true, runValidators: true }
    ).select('-password');

    if (!organization) {
        return res.status(404).json({
            status: 'fail',
            message: 'Organization not found'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Organization profile updated successfully',
        data: {
            organization
        }
    });
});

/**
 * @desc   Get organization dashboard stats
 * @route  GET /api/v2/organization/dashboard/:id
 * @access Private
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const interviews = await Interview.countDocuments({ organizationId: id });
    const candidates = await Interview.aggregate([
        { $match: { organizationId: id } },
        { $unwind: '$invitedStudents' },
        { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    const completedInterviews = await Result.countDocuments({
        organizationId: id,
        status: 'completed'
    });

    const averageScore = await Result.aggregate([
        { $match: { organizationId: id } },
        { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            totalInterviews: interviews,
            totalCandidates: candidates[0]?.count || 0,
            completedInterviews,
            averageScore: averageScore[0]?.avgScore || 0
        }
    });
});

/**
 * @desc   Refresh access token
 * @route  POST /api/v2/organization/refresh-token
 * @access Private
 */
exports.refreshToken = asyncHandler(async (req, res) => {
    const { companyEmail, refreshToken: incomingToken } = req.body;

    if (!companyEmail || !incomingToken) {
        return res.status(400).json({
            status: 'fail',
            message: 'Email and refresh token are required'
        });
    }

    try {
        require('jsonwebtoken').verify(incomingToken, process.env.JWT_SECRET_STRING);
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired refresh token'
        });
    }

    const organization = await Organization.findOne({ companyEmail });
    if (!organization) {
        return res.status(401).json({
            status: 'fail',
            message: 'Organization not found'
        });
    }

    const { accessToken, refreshToken } = generateOrgTokens(organization._id);

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
