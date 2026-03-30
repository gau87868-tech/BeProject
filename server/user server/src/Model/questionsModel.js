const mongoose = require('mongoose');

const questionItemSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: [true, "Question ID is required"],
  },
  question: {
    type: String,
    required: [true, "Question text is required"],
  },
}, { _id: false });

const questionSchema = new mongoose.Schema({
    slug : {
        type : String,
        required : [true,"Slug is required to identify question."],
        unique : true,
    },
    questions : {
        type : [questionItemSchema],
        required : true
    }
},{timestamps : true})

module.exports = mongoose.model("Question",questionSchema);