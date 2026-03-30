
const interviewData = require("./../DummyData/questionos.json");
const Questions = require("./../Model/questionsModel");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc   Get all default questions
 * @route  GET /api/v1/questions/all
 * @access Public
 */
exports.getQuestions = asyncHandler(async (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            questions: interviewData
        }
    });
});

/**
 * @desc   Get questions by role/slug
 * @route  GET /api/v1/questions/:slug
 * @access Public
 */
exports.getQuestionsAsRole = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const questionsSet = await Questions.findOne({ slug });

    if (!questionsSet) {
        return res.status(404).json({
            status: "fail",
            message: `No questions found for role: ${slug}`
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            numberOfQuestions: questionsSet.questions.length,
            questionsSet
        }
    });
});

/**
 * @desc   Add new questions for a role
 * @route  POST /api/v1/questions/add
 * @access Private
 */
exports.addQuestions = asyncHandler(async (req, res) => {
    const { slug, questions } = req.body;

    if (!slug || !questions || questions.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Slug and questions array are required"
        });
    }

    // Check if slug already exists
    const existing = await Questions.findOne({ slug });
    if (existing) {
        return res.status(400).json({
            status: "fail",
            message: `Questions for role '${slug}' already exist`
        });
    }

    const newQuestions = await Questions.create({
        slug,
        questions
    });

    res.status(201).json({
        status: "success",
        message: "Questions added successfully",
        data: {
            questionsSet: newQuestions
        }
    });
});

/**
 * @desc   Update questions for a role
 * @route  PUT /api/v1/questions/:slug
 * @access Private
 */
exports.updateQuestions = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { questions } = req.body;

    if (!questions || questions.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Questions array is required"
        });
    }

    const updatedQuestions = await Questions.findOneAndUpdate(
        { slug },
        { questions },
        { new: true, runValidators: true }
    );

    if (!updatedQuestions) {
        return res.status(404).json({
            status: "fail",
            message: `No questions found for role: ${slug}`
        });
    }

    res.status(200).json({
        status: "success",
        message: "Questions updated successfully",
        data: {
            questionsSet: updatedQuestions
        }
    });
});

/**
 * @desc   Delete questions for a role
 * @route  DELETE /api/v1/questions/:slug
 * @access Private
 */
exports.deleteQuestions = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const deletedQuestions = await Questions.findOneAndDelete({ slug });

    if (!deletedQuestions) {
        return res.status(404).json({
            status: "fail",
            message: `No questions found for role: ${slug}`
        });
    }

    res.status(200).json({
        status: "success",
        message: "Questions deleted successfully"
    });
});

