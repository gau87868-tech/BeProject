const Interview = require("../models/interviewModel");
const Question = require("../models/questionModel");
const Result = require("../models/resultsModel");
const { generateInviteToken, verifyInviteToken } = require("../utils/tokenUtils");
const { sendInterviewInvite } = require("../utils/emailService");
const { asyncHandler } = require("../middleware/errorHandler");

// ✅ Bug #6 FIXED: Changed interviewModel.create → Interview.create
exports.createInterview = async(req,res)=>{
    try {
        req.body.organizationId = req.organization.id;
        const createdInterview = await Interview.create(req.body);
        if(createdInterview){
            res.status(201).json({
                status : "success",
                message : "Interview Scheduled Successfully!",
                createdInterview
            })
        }
    } catch (error) {
        res.status(400).json({
            status : "fail",
            message : error.message
        })
    }
}

exports.getInterviews = async (req, res) => {
    try {
        const organizationId = req.organization.id;
        const interviews = await Interview.find({ organizationId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            count: interviews.length,
            data: interviews
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


//  Bug #7 FIXED: Changed interviewModel.findById → Interview.findById
//  Bug #8 FIXED: Changed sendInviteEmail → sendInterviewInvite
//  Bug #9 FIXED: Read interviewId from req.params.id instead of req.body
exports.inviteStudents = async (req,res)=>{
    try {
        const interviewId = req.params.id;
        const { emails } = req.body;
        
        const interview = await Interview.findById(interviewId);
        if(!interview){
            return res.status(404).json({
                status : "fail",
                message : "No Interview found with this Id"
            })
        }

        if(interview.accessType.toLocaleLowerCase() !== "private"){
            return res.status(400).json({
                status : "fail",
                message : "Interview is not private | Only private interviews can sent emails"
            })
        }
        for (const email of emails) {
            const token = generateInviteToken();
            const inviteLink = `${process.env.FRONTEND_URL}/interview/join/${token}`;

            interview.invitedStudents.push({
                email,
                inviteToken: token,
                invitedAt: new Date()
            });

            await sendInterviewInvite(email, inviteLink);
        }

        await interview.save();

        res.status(200).json({
            status : "Success",
            message : "Invitation Sent !",
            interview
        })
        
    } catch (error) {
        res.status(400).json({
            status : "fail",
            message : error.message
        })
    }
}


exports.submitInterview = async (req, res) => {
    try {
        const {
            interviewId,
            candidateId,
            organizationId,
            answers
        } = req.body;

        const result = await Result.create({
            interviewId,
            organizationId,
            candidateId,
            answers,
            status: "SUBMITTED"
        });

        return res.status(201).json({
            status: "success",
            message: "Interview submitted successfully",
            resultId: result._id
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                status: "fail",
                message: "Interview already submitted"
            });
        }

        return res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

//  Bug #12 FIXED: Changed req.user.id → req.organization.id (set by validateOrgToken)
exports.getInterviewResults = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const organizationId = req.organization.id;

        const results = await Result.find({
            interviewId,
            organizationId
        })
            .populate("candidateId", "name email")
            .select(
                "candidateId aiScore recommendation status completedAt"
            )
            .sort({ completedAt: -1 });

        return res.status(200).json({
            status: "success",
            count: results.length,
            data: results
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};

//  Bug #14 FIXED: Changed req.user.id → req.organization.id (set by validateOrgToken)
exports.getResultById = async (req, res) => {
    try {
        const { resultId } = req.params;
        const organizationId = req.organization.id;

        const result = await Result.findOne({
            _id: resultId,
            organizationId
        })
            .populate("candidateId", "name email")
            .populate("interviewId", "title role")
            .populate("answers.questionId", "questionText");

        if (!result) {
            return res.status(404).json({
                status: "fail",
                message: "Result not found"
            });
        }

        return res.status(200).json({
            status: "success",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};
