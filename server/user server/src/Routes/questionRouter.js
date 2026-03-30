const express = require("express");
const questionsController = require("../Controllers/questionsController");
const { validateToken } = require("../middleware/auth");

const questionRouter = express.Router();

/**
 * @route   GET /api/v1/questions/all
 * @desc    Get all default questions
 * @access  Public
 */
questionRouter.get("/all", questionsController.getQuestions);

/**
 * @route   GET /api/v1/questions/:slug
 * @desc    Get questions by role/slug
 * @access  Public
 */
questionRouter.get("/:slug", questionsController.getQuestionsAsRole);

/**
 * @route   POST /api/v1/questions/add
 * @desc    Add new questions for a role
 * @access  Private
 */
questionRouter.post("/add", validateToken, questionsController.addQuestions);

/**
 * @route   PUT /api/v1/questions/:slug
 * @desc    Update questions for a role
 * @access  Private
 */
questionRouter.put("/:slug", validateToken, questionsController.updateQuestions);

/**
 * @route   DELETE /api/v1/questions/:slug
 * @desc    Delete questions for a role
 * @access  Private
 */
questionRouter.delete("/:slug", validateToken, questionsController.deleteQuestions);

module.exports = questionRouter;
