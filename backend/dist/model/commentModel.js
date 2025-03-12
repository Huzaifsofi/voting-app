"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User2', // Assuming you have a User model
        required: true,
    },
    question: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vote', // Assuming you have a User model
        required: true,
    }
});
const Comments = (0, mongoose_1.model)('vote-comment', CommentSchema);
exports.default = Comments;
