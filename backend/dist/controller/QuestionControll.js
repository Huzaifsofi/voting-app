"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVotesQuestions = exports.deleteVoteQuestion = exports.createVoteQuestion = void 0;
const voteModel_1 = __importDefault(require("../model/voteModel"));
const createVoteQuestion = async (req, res) => {
    try {
        const { questionText, options } = req.body;
        const userId = req.user?.id; // Access user without custom interface
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!questionText || !Array.isArray(options)) {
            res.status(400).json({ message: 'Question text and options are required' });
            return;
        }
        if (options.length > 10) {
            res.status(400).json({ message: 'You can only add up to 10 options' });
            return;
        }
        const formattedOptions = options.map(option => ({
            text: option.text?.trim(),
        }));
        if (formattedOptions.some(option => !option.text)) {
            res.status(400).json({ message: 'Each option must have text' });
            return;
        }
        const newQuestion = new voteModel_1.default({
            user: userId,
            questionText: questionText.trim(),
            options: formattedOptions,
        });
        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully', question: newQuestion });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.createVoteQuestion = createVoteQuestion;
const deleteVoteQuestion = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const question = await voteModel_1.default.findById(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }
        if (question.user.toString() !== userId && userRole !== 'admin') {
            res.status(403).json({ message: 'You are not authorized to delete this question' });
            return;
        }
        await voteModel_1.default.findByIdAndDelete(questionId);
        res.status(200).json({ message: 'Question deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteVoteQuestion = deleteVoteQuestion;
const getVotesQuestions = async (req, res, next) => {
    try {
        const votes = await voteModel_1.default.find()
            .populate({ path: 'user', model: 'User2', select: 'username email' })
            .populate({ path: 'options.voters', model: 'User2', select: 'username email' })
            .populate({ path: 'comments', model: 'vote-comment' });
        if (!votes || votes.length === 0) {
            res.status(404).json({ message: 'No votes found' });
            return;
        }
        res.status(200).json(votes);
    }
    catch (error) {
        next(error);
    }
};
exports.getVotesQuestions = getVotesQuestions;
