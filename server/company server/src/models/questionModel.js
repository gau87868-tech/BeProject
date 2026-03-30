const mongoose = require('mongoose');

const questionItemSchema = new mongoose.Schema({
  questionText: {
        type: String,
        required: [true, "Question text is required"],
        trim: true
  },
  type: {
      type: String,
      enum: ["technical", "behavioral", "coding", "hr"],
      default: "technical"
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    }
}, { _id: true });

const questionSchema = new mongoose.Schema({
    interviewId : {
        type : mongoose.Schema.Types.ObjectId,
        required : [true,"InterviewId is Required"],
        ref : "orgInterviewSchema"
    },
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        required: [true, "Organization ID is required"],
        ref : "Organization"
    },
    questions : {
        type : [questionItemSchema],
        required : true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'At least one question is required'
        }
    },
    createdAt : {
        type : Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{timestamps : true})

module.exports = mongoose.model("orgQuestion",questionSchema);