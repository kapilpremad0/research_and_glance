// models/ProfileMaster.js
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["text", "radio", "checkbox", "select"], // Allowed input types
        required: true
    },
    options: {
        type: [String], // Array of options for radio/checkbox/select
        default: []
    }
});

const ProfileMasterSchema = new mongoose.Schema({
    profile_name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    earn_point: {
        type: Number,
        default: 0
    },
    questions: [QuestionSchema], // Nested questions
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ProfileMaster", ProfileMasterSchema);
