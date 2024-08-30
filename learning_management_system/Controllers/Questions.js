const Log = require('../config/filesystem')
const util = require("util");
const questionModel = require('../Models/Questions')

const paramsValidation = async (body) => {
    const errors = [];

    if(!body?.title){
        errors.push('Please enter a title');
    }

    if(!body?.topic){
        errors.push('Please enter a topic');
    }

    if(!body?.description){
        errors.push('Please enter a description');
    }

    if(!body?.difficulty_level){
        errors.push('Please enter a difficulty level');
    }

    if(body?.difficulty_level > 10 || body?.difficulty_level < 0) {
        errors.push('Difficulty level must be between 0 to 11 digits');
    }

    if(!body?.correct_answer){
        errors.push("Please enter a correct number");
    }

    if(!body?.option1){
        errors.push("Please enter a option 1");
    }

    if(!body?.option2){
        errors.push("Please enter a option 2");
    }

    if(!body?.option3){
        errors.push("Please enter a option 3");
    }

    if(!body?.option4){
        errors.push("Please enter a option 4");
    }

    const isValidationFailed = errors.length > 0;
    const msg = isValidationFailed ? errors[0] : '';

    return {isValidationFailed, msg};
}

exports.saveQuestion = async (req, res) => {
    try {
        Log("Info", 'questions', JSON.stringify(req.body), 'question save');
        let {isValidationFailed, msg} = await paramsValidation(req.body);
        if (isValidationFailed) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: msg,
                data: []
            });
        }

        const {title, description, difficulty_level, correct_answer, option1, option2, option3, option4, user_details, topic} = req.body;
        const  response = await questionModel.create({
            title,
            description,
            difficulty_level,
            correct_answer,
            option1,
            option2,
            option3,
            option4,
            status: 1,
            created_by: user_details?.id,
            updated_by: user_details?.id,
            topic
        });

        if (Object.keys(response).length <= 0) {
            return res.status(400).json({status: 400, msg: 'Failed to save questions', body: {}});
        }

        delete req.body?._id;

        return res.status(200).json({
            success: true,
            status: 200,
            data: response,
            message: "Question is saved successfully."
        });

    } catch(e){
        Log('error', 'questions', util.inspect(e, {depth: null}))
        return res.status(500).json({
            success: false,
            status: 500,
            message: e.message,
            data: []
        })
    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params?.id;
        const {user_details} = req.body;
        if (!id) {
            return res.status(400).json({
                success: true,
                status: 400,
                message: "Id is missing",
                data: [],
            });
        }

        const result = await questionModel.findOne({_id:req.params.id}).populate('created_by').exec() ?? [];
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Data fetched",
            data: result,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message,
            success: false,
            data: []
        })
    }
}

exports.getAll = async (req, res) => {
    try {
        const {user_details} = req.body;
        const result = await questionModel.find(
            {
                created_by:user_details.id,
                deleted_at :{$eq: null}
            }
        ).populate('created_by').exec() ?? [];
        return res.status(200).json({
            success: true,
            status: 200,
            message: "Data fetched",
            data: result,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message,
            success: false,
            data: []
        })
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const id = req.params?.id;
        const {user_details} = req.body;
        if (!id) {
            return res.status(400).json({
                success: true,
                status: 400,
                message: "Id is missing",
                data: [],
            });
        }

        const result = await questionModel.updateOne({_id: req.params.id, deleted_at: {$eq: null}}, {$set:{"deleted_at": Date.now()}}).populate('created_by').exec() ?? [];
        if(!result?.modifiedCount){
            return res.status(200).json({
                success: false,
                status: 400,
                message: "Invalid question id!",
                data: result,
            });
        }

        return res.status(200).json({
            success: true,
            status: 200,
            message: "Data deleted",
            data: result,
        });
    } catch (e) {
        return res.status(500).json({
            status: 500,
            message: e.message,
            success: false,
            data: []
        })
    }
}


