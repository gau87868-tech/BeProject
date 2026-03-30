const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        required: [true, "Organization ID is required"],
        ref  : "Organization"
    },
    title : {
        type : String,
        required : [true,"Title is Required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    role : {
        type : String,
        required : [true,"Role is Required"],
        trim: true
    },
    scheduledAt : {
        type : Date,
        required : [true,"Scheduling Interview is Required in ISO format"]
    },
    accessType : {
        type : String,
        enum : ["public","private"],
        required : [true,"Choose public or private"]
    },
    duration: {
        type: Number,
        default: 30, // minutes
        min: 5,
        max: 180
    },
    invitedStudents : [{
        email : {
            type: String,
            lowercase: true
        },
        inviteToken : String,
        invitedOn : {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'started', 'completed'],
            default: 'pending'
        },
        completedAt: Date
    }],
    isActive: {
        type: Boolean,
        default: true
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

const interviewModel = mongoose.model("orgInterviewSchema", interviewSchema);
module.exports = interviewModel;