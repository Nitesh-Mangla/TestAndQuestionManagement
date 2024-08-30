const mongoose = require('mongoose');

const UserAnswer = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    question_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required:true,
    },
    answer:{
        type: Number,
        required: true,
    },
    difficulty_level:{
      type: Number,
      required: true,
    },
    test_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "UsersTest"
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("UserAnswer", UserAnswer)