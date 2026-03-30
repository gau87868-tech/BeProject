
const mongoose = require("mongoose");

const answerModel = mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    questionSetId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Question"
    },
    answers : [{
        questionId : {
            type : String,
            required : [true, "Question Id is required to Map and Populate."]
        },
        answer : {
            type : String,
            required : [true, "Answer is Required."]
        }
    }]
})

const Answer = mongoose.model("Answer",answerModel);
module.exports = Answer;