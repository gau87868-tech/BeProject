
const Answer = require("../Model/answersModel");
const Question = require("./../Model/questionsModel");

exports.saveAnswers = async (req,res)=>{
    try {
        const answer = new Answer(req.body);
        await answer.save();

        res.status(201).json({
            status : "success",
            message : "Record saved successfully!",
        })

    } catch (error) {
        res.status(400).json({
            status : "fail",
            error : error.message
        })
    }
}


exports.getAnswers = async (req,res)=>{
    try {
        const {userId,questionSetId} = req.params;
        const questionSet = await Question.findOne({_id : questionSetId});
        const answer = await Answer.findOne({candidate : userId}).populate("candidate");
        console.log(answer.answers.length)
        const answerSetArr = [];

        let quetionArr = questionSet.questions;
        for(let i = 0; i <answer.answers.length; i++){
            let idx = quetionArr.findIndex(x => x.questionId == answer.answers[i].questionId);
            let question = quetionArr[idx >= 0 ? idx : 0].question;
            let answerFromDb = answer?.answers[i].answer;
            console.log(question,answerFromDb);
            answerSetArr.push({
                question,answerFromDb
            })
        }   
        res.status(200).json({
            status : "success",
            candidate : answer.candidate,
            answerDetails : answerSetArr,
        })

    } catch (error) {
        res.status(400).json({
            status : "fail",
            error : error.message
        })
    }
}