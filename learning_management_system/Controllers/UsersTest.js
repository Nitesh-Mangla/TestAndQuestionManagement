const Log = require('../config/filesystem')
const util = require("util");
const UserTest = require('../Models/UsersTest')
const QuestionsModel = require('../Models/Questions');
const crypto = require('crypto');
require('dotenv').config();
const AnswerModel = require('../Models/TestUserAnswer');


exports.registerUserForTest = async (req, res) => {
    try {
        Log("info", 'UserTest', 'request params' ,util.inspect(req.body, {depth: null}));
        // generate unique url for test
        let uniqueUrl = crypto.randomBytes(16).toString('hex')
        const {user_details} = req.body

        const currentTime = new Date();
        // Set start time (e.g., 2 hours from now)
        const startTime = new Date(currentTime);
        startTime.setHours(currentTime.getHours() + process.env.TEST_START_TIME_IN_HOURS);

        // Set expiration time (e.g., 5 hours after the start time)
        const expirationDate = new Date(startTime);
        expirationDate.setHours(startTime.getHours() + process.env.TEST_EXPIRE_TIME_IN_HOURS);

        const Response = await UserTest.create({
            user_id: user_details?.id,
            url: uniqueUrl,
            expire_on: expirationDate,
            created_by: user_details?.id,
            updated_by: user_details?.id,
            start_date: startTime
        });

        if(!Response){
            Log("error", 'UserTest', "Failed to user register for test" ,util.inspect(Response, {depth: null}));
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Failed to register",
                data: []
            })
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Successfully registered",
            data: Response
        });

    } catch(e) {
        Log("error", 'UserTest', 'Failed to user register for test' ,util.inspect(e, {depth: null}));
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.getUserTestByUrl = async (req, res) => {
    try{
        Log('info', 'UserTest', 'request params' ,util.inspect(req.body, {depth: null}));
        const response = await UserTest.findOne({url:{$eq: req.params.url}}).populate('user_id');

        if(!response){
            return res.status(404).json({
                success: false,
                status: 404,
                data:[],
                message: "Invalid test!"
            });
        }

        $expireTime = response.expire_on;
        const currentDate = new Date();
        if (currentDate > $expireTime) {
            return res.status(400).json({
                message: "The URL has expired",
                success: false,
                status: 404,
                data:[],
            });
        }

        return res.status(200).json({
            message: "Fetched test details successfully!",
            success: true,
            status: 200,
            data: response,
        });
    } catch(e){
        Log("error", 'UserTest', 'Failed to get user test' ,util.inspect(e, {depth: null}));
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.startTest = async (req, res) => {
    try{
        Log('info', 'UserTest', 'request params' ,util.inspect(req.body, {depth: null}));
        const response = await UserTest.findOne({_id:req.params.test_id}).populate('user_id');
        const question = await QuestionsModel.findOne({difficulty_level: {$eq: 5}, status: {$eq: 1}});

        if(!response){
            return res.status(404).json({
                success: false,
                status: 404,
                data:[],
                message: "Invalid test!"
            });
        }

        $expireTime = response.expire_on;
        const currentDate = new Date();
        if (currentDate > $expireTime) {
            return res.status(400).json({
                message: "The test has expired",
                success: false,
                status: 400,
                data:[],
            });
        }

        const data = {
            test_details: response,
            question: question
        }

        return res.status(200).json({
            message: "Fetched test details successfully!",
            success: true,
            status: 200,
            data: data,
        });
    } catch(e){
        Log("error", 'UserTest', 'Failed to get user test' ,util.inspect(e, {depth: null}));
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.userAnswer = async (req, res) => {
    try {
        Log("info", 'UserTest', 'mark user answer ' ,util.inspect(req.body, {depth: null}));
        const {testId, questionId} = req.params;
        const {user_details, answer_id} = req.body
        if(!answer_id){
            return res.status(400).json({
                success: false,
                status: 404,
                data:[],
                message: "Please mark your answer!"
            })
        }
        // check test is valid for not
        const testData = await UserTest.findOne({_id:testId});
        if(!testData){
            return res.status(400).json({
                success: false,
                status: 400,
                data:[],
                message: "Invalid test"
            });
        }

        // fetch question data
        const questionData = await QuestionsModel.findOne({_id:questionId});
        if(!questionData){
            return res.status(400).json({
                success: false,
                status: 400,
                data:[],
                message: "Invalid question"
            });
        }

        const isAnswerAlreadyMarked = await AnswerModel.findOne({$and: [{question_id: {$eq: questionId}}, {answer: {$ne: null}}, {test_id:{$eq: testId}}]});
        let isLastQuestion = false;
        // check user has already mark 20 question or not
        const totalAnswer = await AnswerModel.find({$and: [{test_id:{$eq: testId}}, {user_id:{$eq: user_details?.id}}]}).count();
        const consecutiveQuestionsWithTenDifficulty = await AnswerModel.find({$and: [{test_id:{$eq: testId}}, {user_id:{$eq: user_details?.id}}, {difficulty_level: {$eq: 10}}]}).count();

        if(totalAnswer >= 20){
            isLastQuestion = true;
        }

        let difficultyLevel = questionData?.difficulty_level;
        let result = {};
        // fetch next question and check users has correctly answered 3 consecutive questions of difficulty 10
        if(questionData?.correct_answer === answer_id) {
            // users has correctly answered 3 consecutive questions of difficulty 10
            if(consecutiveQuestionsWithTenDifficulty === 10) {
                isLastQuestion = true;
            }
            // next question according to difficulty level of current question and user is answered
            result = await QuestionsModel.findOne({$and: [{difficulty_level: {$gt: difficultyLevel}}, {deleted_at: {$eq: null}}]}).sort({difficultyLevel: 1});
        } else if(questionData?.correct_answer !== answer_id && difficultyLevel === 1){
            isLastQuestion = true;
        } else {
            // next question according to difficulty level of current question and user is answered
            result = await QuestionsModel.findOne({$and: [{difficulty_level: {$gt: difficultyLevel}}, {deleted_at: {$eq: null}}]}).sort({difficultyLevel: 1});
        }

        if(isAnswerAlreadyMarked){
            return res.status(400).json({
                success: false,
                status: 400,
                data:result,
                message: "Answer is already marked for this question!"
            });
        } else {
            // mark answer
            const markedAnswer = await AnswerModel.create({
                test_id: testId,
                answer: answer_id,
                user_id: user_details?.id,
                question_id: questionId,
                difficulty_level: questionData?.difficulty_level
            });
        }
        // calculate total score of user
        let score = difficultyLevel+testData?.result;
        // update user score
        UserTest.updateOne({_id:req.params.test_id}, {result:{$set: score}});
        return res.status(200).json({
            success: true,
            status: 200,
            data: result,
            message: "Answer save successfully!",
            isLastQuestion: isLastQuestion
        })

    } catch(e){
        Log("error", 'UserTest', 'failed to mark user answer ' ,util.inspect(e, {depth: null}));
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.testResultByTestId = async (req, res) => {
    console.log(req.params)
    const result = await UserTest.findOne({_id:req.params.testId}).populate(['user_id', 'created_by']);
    return res.status(200).json({
        success: true,
        status: 200,
        data: result,
        message: "Test result",
    })
}


