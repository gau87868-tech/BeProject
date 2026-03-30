const Question = require("../models/questionModel");
const Interview = require("../models/interviewModel");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc   Add questions to an interview
 * @route  POST /api/v2/questions/create
 * @access Private
 */
exports.addQuestions = asyncHandler(async (req, res) => {
    const { interviewId, organizationId, questions } = req.body;

    if (!interviewId || !organizationId || !questions || questions.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide interviewId, organizationId, and questions'
        });
    }

    // Check if interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
        return res.status(404).json({
            status: 'fail',
            message: 'Interview not found'
        });
    }

    // Check if questions already exist for this interview
    const existingQuestions = await Question.findOne({ interviewId });
    if (existingQuestions) {
        return res.status(400).json({
            status: 'fail',
            message: 'Questions already exist for this interview. Use update endpoint.'
        });
    }

    const newQuestions = await Question.create({
        interviewId,
        organizationId,
        questions
    });

    res.status(201).json({
        status: 'success',
        message: 'Questions added successfully',
        data: {
            questions: newQuestions
        }
    });
});

/**
 * @desc   Get questions for an interview
 * @route  GET /api/v2/questions/:interviewId
 * @access Private
 */
exports.getQuestions = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    const questions = await Question.findOne({ interviewId });

    if (!questions) {
        return res.status(404).json({
            status: 'fail',
            message: 'No questions found for this interview'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            questions,
            totalQuestions: questions.questions.length
        }
    });
});

/**
 * @desc   Update questions for an interview
 * @route  PUT /api/v2/questions/:interviewId
 * @access Private
 */
exports.updateQuestions = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;
    const { questions } = req.body;

    if (!questions || questions.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Questions array is required'
        });
    }

    const updatedQuestions = await Question.findOneAndUpdate(
        { interviewId },
        { questions },
        { new: true, runValidators: true }
    );

    if (!updatedQuestions) {
        return res.status(404).json({
            status: 'fail',
            message: 'No questions found for this interview'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Questions updated successfully',
        data: {
            questions: updatedQuestions
        }
    });
});

/**
 * @desc   Delete questions for an interview
 * @route  DELETE /api/v2/questions/:interviewId
 * @access Private
 */
exports.deleteQuestions = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    const deletedQuestions = await Question.findOneAndDelete({ interviewId });

    if (!deletedQuestions) {
        return res.status(404).json({
            status: 'fail',
            message: 'No questions found for this interview'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Questions deleted successfully'
    });
});

/**
 * @desc   Get questions by organization
 * @route  GET /api/v2/questions/org/:organizationId
 * @access Private
 */
exports.getOrganizationQuestions = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;

    const questions = await Question.find({ organizationId }).populate('interviewId', 'title role');

    res.status(200).json({
        status: 'success',
        data: {
            questions,
            total: questions.length
        }
    });
});
