const mongoose = require("mongoose")

const QuestionSchema = mongoose.Schema({
    topic:{
        required: true,
        type: String,
    },
    title:{
        required: true,
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    difficulty_level: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    status: {
        type: Number,
        default: 1
    },
    correct_answer: {
        type: Number,
        required: true,
    },
    option1: {
        type: String,
        required: true,
    },
    option2:{
        type: String,
        required: true,
    },
    option3:{
        type: String,
        required: true,
    },
    option4:{
        type: String,
        required: true,
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updated_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    updated_at:{
        type: Date,
        default: Date.now()
    },
    deleted_at:{
        type: Date,
        default:  null
    }
},{
    versionKey: false
})

module.exports = mongoose.model("Questions", QuestionSchema)