"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.addComment = exports.voteOnOption = void 0;
const voteModel_1 = __importDefault(require("../model/voteModel"));
const commentModel_1 = __importDefault(require("../model/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const voteOnOption = async (req, res, next) => {
    const { questionId, optionId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const question = await voteModel_1.default.findById(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }
        const option = question.options.id(optionId);
        if (!option) {
            res.status(404).json({ message: 'Option not found' });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // Check if the user has already voted
        if (option.voters.some((voterId) => voterId.toString() === userObjectId.toString())) {
            res.status(400).json({ message: 'You have already voted for this option' });
            return;
        }
        // Remove user vote from all options
        question.options.forEach((opt) => {
            opt.voters = opt.voters.filter((voterId) => voterId.toString() !== userObjectId.toString());
            if (opt._id.toString() === optionId) {
                opt.votes += 1;
                opt.voters.push(userObjectId);
            }
        });
        await question.save();
        res.status(200).json({ message: 'Vote recorded successfully', question });
    }
    catch (error) {
        next(error); // Pass error to Express error handler
    }
};
exports.voteOnOption = voteOnOption;
const addComment = async (req, res) => {
    const { text } = req.body;
    const userId = req.user?.id;
    const { questionId } = req.params;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const question = await voteModel_1.default.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        const newComment = new commentModel_1.default({ text, user: userId, question: questionId });
        await newComment.save();
        question.comments.push(newComment._id);
        await question.save();
        return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.addComment = addComment;
const deleteComment = async (req, res) => {
    const userId = req.user?.id;
    const { commentId } = req.params;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const comment = await commentModel_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments' });
        }
        await voteModel_1.default.findByIdAndUpdate(comment.question, { $pull: { comments: commentId } });
        await commentModel_1.default.findByIdAndDelete(commentId);
        return res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.deleteComment = deleteComment;
