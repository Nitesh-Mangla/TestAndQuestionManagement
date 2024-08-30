const mongoose = require('mongoose');

const UsersTest = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url:{
        type: String,
        required: true,
        unique: true,
    },
    status:{
      type: Number,
      default: 1
    },
    start_date:{
      type: Date,
      required: true,
    },
    expire_on:{
        type: Date,
        required: true,
    },
    result:{
      type: Number,
      required: false,
      default: 0
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    updated_at:{
        type: Date,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("UsersTest", UsersTest)