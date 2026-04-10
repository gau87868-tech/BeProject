const Interview = require("../models/interviewModel");
const Question = require("../models/questionModel");
const Result = require("../models/resultsModel");
const { generateInviteToken, verifyInviteToken } = require("../utils/tokenUtils");
const { sendInterviewInvite } = require("../utils/emailService");

// ────────────────────────────────────────────
// CREATE
// ────────────────────────────────────────────

exports.createInterview = async (req, res) => {
  try {
    req.body.organizationId = req.organization.id;
    const createdInterview = await Interview.create(req.body);
    if (createdInterview) {
      res.status(201).json({
        status: "success",
        message: "Interview Scheduled Successfully!",
        createdInterview,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// LIST  (for the organization)
// ────────────────────────────────────────────

exports.getInterviews = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const interviews = await Interview.find({ organizationId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      status: "success",
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// GET SINGLE INTERVIEW BY ID
// ────────────────────────────────────────────

exports.getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id;

    const interview = await Interview.findOne({
      _id: id,
      organizationId,
    });

    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: interview,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// UPDATE INTERVIEW  (NEW)
// ────────────────────────────────────────────

exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id;

    const allowedFields = [
      "title",
      "role",
      "description",
      "type",
      "difficulty",
      "duration",
      "scheduledAt",
      "accessType",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for update",
      });
    }

    updates.updatedAt = new Date();

    const updatedInterview = await Interview.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({
        status: "fail",
        message: "Interview not found or not authorized",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Interview updated successfully",
      data: updatedInterview,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// DELETE INTERVIEW  (NEW)
// ────────────────────────────────────────────

exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      organizationId,
    });

    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message: "Interview not found or not authorized",
      });
    }

    // Also delete associated questions and results
    await Question.deleteMany({ interviewId: id, organizationId });
    await Result.deleteMany({ interviewId: id, organizationId });

    return res.status(200).json({
      status: "success",
      message: "Interview and associated data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// UPDATE STATUS  (draft / published / closed) (NEW)
// ────────────────────────────────────────────

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.organization.id;

    const validStatuses = ["draft", "published", "closed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedInterview = await Interview.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({
        status: "fail",
        message: "Interview not found or not authorized",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Interview status updated to '${status}'`,
      data: updatedInterview,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// INVITE STUDENTS
// ────────────────────────────────────────────

exports.inviteStudents = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { emails } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        status: "fail",
        message: "No Interview found with this Id",
      });
    }

    if (interview.accessType.toLowerCase() !== "private") {
      return res.status(400).json({
        status: "fail",
        message:
          "Interview is not private | Only private interviews can send emails",
      });
    }

    for (const email of emails) {
      const token = generateInviteToken();
      const inviteLink = `${process.env.FRONTEND_URL}/interview/join/${token}`;

      interview.invitedStudents.push({
        email,
        inviteToken: token,
        invitedAt: new Date(),
      });

      await sendInterviewInvite(email, inviteLink);
    }

    await interview.save();

    res.status(200).json({
      status: "success",
      message: "Invitation Sent!",
      interview,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// SUBMIT INTERVIEW
// ────────────────────────────────────────────

exports.submitInterview = async (req, res) => {
  try {
    const { interviewId, candidateId, organizationId, answers } = req.body;

    const result = await Result.create({
      interviewId,
      organizationId,
      candidateId,
      answers,
      status: "SUBMITTED",
    });

    return res.status(201).json({
      status: "success",
      message: "Interview submitted successfully",
      resultId: result._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "Interview already submitted",
      });
    }

    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// RESULTS
// ────────────────────────────────────────────

exports.getInterviewResults = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const organizationId = req.organization.id;

    const results = await Result.find({
      interviewId,
      organizationId,
    })
      .populate("candidateId", "name email")
      .select(
        "candidateId aiScore recommendation status completedAt shortlistedAt"
      )
      .sort({ completedAt: -1 });

    return res.status(200).json({
      status: "success",
      count: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    const organizationId = req.organization.id;

    const result = await Result.findOne({
      _id: resultId,
      organizationId,
    })
      .populate("candidateId", "name email")
      .populate("interviewId", "title role")
      .populate("answers.questionId", "questionText");

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// SHORTLIST CANDIDATE  (NEW)
// ────────────────────────────────────────────

exports.shortlistCandidate = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { shortlisted } = req.body; // true or false
    const organizationId = req.organization.id;

    const newStatus = shortlisted ? "SHORTLISTED" : "EVALUATED";
    const updateData = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (shortlisted) {
      updateData.shortlistedAt = new Date();
    } else {
      updateData.$unset = { shortlistedAt: 1 };
    }

    // Handle $unset separately to avoid mixing $set and $unset
    let result;
    if (shortlisted) {
      result = await Result.findOneAndUpdate(
        { _id: resultId, organizationId },
        {
          $set: {
            status: "SHORTLISTED",
            shortlistedAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
    } else {
      result = await Result.findOneAndUpdate(
        { _id: resultId, organizationId },
        {
          $set: { status: "EVALUATED", updatedAt: new Date() },
          $unset: { shortlistedAt: 1 },
        },
        { new: true }
      );
    }

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Result not found or not authorized",
      });
    }

    return res.status(200).json({
      status: "success",
      message: shortlisted
        ? "Candidate shortlisted"
        : "Candidate removed from shortlist",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// ANALYTICS  (NEW)
// ────────────────────────────────────────────

exports.getInterviewAnalytics = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const organizationId = req.organization.id;

    const results = await Result.find({ interviewId, organizationId });

    if (results.length === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          totalCandidates: 0,
          avgScore: 0,
          passCount: 0,
          failCount: 0,
          scoreDistribution: [],
          recommendationBreakdown: {},
        },
      });
    }

    const scores = results.map((r) => r.aiScore || 0);
    const avgScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
    const passCount = scores.filter((s) => s >= 60).length;
    const failCount = scores.filter((s) => s < 60).length;

    // Score distribution in buckets: 0-20, 21-40, 41-60, 61-80, 81-100
    const buckets = [
      { label: "0-20", min: 0, max: 20, count: 0 },
      { label: "21-40", min: 21, max: 40, count: 0 },
      { label: "41-60", min: 41, max: 60, count: 0 },
      { label: "61-80", min: 61, max: 80, count: 0 },
      { label: "81-100", min: 81, max: 100, count: 0 },
    ];

    for (const score of scores) {
      for (const bucket of buckets) {
        if (score >= bucket.min && score <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    }

    // Recommendation breakdown
    const recommendationBreakdown = {};
    for (const r of results) {
      const rec = r.recommendation || "Pending";
      recommendationBreakdown[rec] =
        (recommendationBreakdown[rec] || 0) + 1;
    }

    return res.status(200).json({
      status: "success",
      data: {
        totalCandidates: results.length,
        avgScore,
        passCount,
        failCount,
        scoreDistribution: buckets.map((b) => ({
          label: b.label,
          count: b.count,
        })),
        recommendationBreakdown,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
