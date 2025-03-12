"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    votes: {
        type: Number,
        default: 0,
    },
    voters: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User', // References users who voted for this option
        }]
});
const questionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User2', // Assuming you have a User model
        required: true,
    },
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [optionSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10 options'],
    },
    comments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'vote-comment', // Assuming this references the comment model
        }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
// Validator to limit options array to max 10
function arrayLimit(val) {
    return val.length <= 10;
}
const Vote = (0, mongoose_1.model)('Vote', questionSchema);
exports.default = Vote;
