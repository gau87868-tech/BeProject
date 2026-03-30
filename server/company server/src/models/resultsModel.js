const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    answerText: {
      type: String,
      required: true
    }
  },
  { _id: false }
);


const interviewResultSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interviews",
      required: true,
      index: true
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
      index: true
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true
    },

    answers: {
      type: [answerSchema],
      default: []
    },

    aiScore: {
      type: Number, 
      min: 0,
      max: 100,
    },

    strengths: {
      type: [String],
      default: []
    },

    weaknesses: {
      type: [String],
      default: []
    },

    recommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Hold", "Reject"],
    },

    status: {
      type: String,
      enum: ["STARTED", "SUBMITTED", "EVALUATED"],
      default: "SUBMITTED",
      index: true
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

interviewResultSchema.index(
  { interviewId: 1, candidateId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InterviewResult",
  interviewResultSchema
);
