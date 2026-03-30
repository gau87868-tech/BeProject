
const mongoose = require("mongoose");

const interviewInnerSchema = new mongoose.Schema({
    companyName: { 
        type: String, 
        required: true,
    },
    companyRole: { 
        type: String, 
        required: true,
    },
    candidateAnswers : [{
            question: { type: String, required: true },
            answer: { type: String, required: true },
            _id : false
    }],
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    completedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true,_id : false });

const interviewModel = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        required : [true, "Candidate/User Id is required"],
        ref : "User",
        unique : [true,"Candidate already Exist, Duplicate Id"]
    },
    interviews : [
        interviewInnerSchema
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Interview = mongoose.model("Interview",interviewModel);
module.exports = Interview;