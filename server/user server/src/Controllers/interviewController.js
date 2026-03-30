
const Interview = require("./../Model/interviewModel");
const User = require("./../Model/userModel");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc   Submit interview answers
 * @route  POST /api/v1/interview/submit
 * @access Private
 */
exports.submitInterview = asyncHandler(async (req, res) => {
    const { candidate, interviews } = req.body;

    if (!candidate || !interviews || interviews.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Candidate ID and interviews data are required"
        });
    }

    // Deduct 5 credits for interview submission
    const user = await User.findByIdAndUpdate(
        candidate,
        { $inc: { credits: -5 } },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({
            status: "fail",
            message: "User not found"
        });
    }

    // Save interview
    const updated = await Interview.findOneAndUpdate(
        { candidate },
        { $push: { interviews: { $each: interviews, $position: 0 } } },
        { new: true, upsert: true }
    ).populate('candidate', 'name email');

    res.status(201).json({
        status: "success",
        message: "Interview submitted successfully",
        data: {
            interview:updated,
            credits: user.credits
        }
    });
});

/**
 * @desc   Get interview history for a user
 * @route  GET /api/v1/interview/history/:userId
 * @access Private
 */
exports.getInterviewHistory = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const interviewHistory = await Interview.findOne({ candidate: userId })
        .populate('candidate', 'name email credits');

    if (!interviewHistory) {
        return res.status(404).json({
            status: "fail",
            message: "No interview history found for this user"
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            interviewHistory,
            totalInterviews: interviewHistory.interviews.length
        }
    });
});

/**
 * @desc   Get all interviews (admin only)
 * @route  GET /api/v1/interview/all
 * @access Private
 */
exports.getAllInterviews = asyncHandler(async (req, res) => {
    const interviews = await Interview.find().populate('candidate', 'name email');

    res.status(200).json({
        status: "success",
        data: {
            interviews,
            total: interviews.length
        }
    });
});

/**
 * @desc   Get interview by ID
 * @route  GET /api/v1/interview/:id
 * @access Private
 */
exports.getInterviewById = asyncHandler(async (req, res) => {
    const interview = await Interview.findById(req.params.id).populate('candidate', 'name email');

    if (!interview) {
        return res.status(404).json({
            status: "fail",
            message: "Interview not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            interview
        }
    });
});

/**
 * @desc   Delete interview
 * @route  DELETE /api/v1/interview/:id
 * @access Private
 */
exports.deleteInterview = asyncHandler(async (req, res) => {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
        return res.status(404).json({
            status: "fail",
            message: "Interview not found"
        });
    }

    res.status(200).json({
        status: "success",
        message: "Interview deleted successfully"
    });
});
