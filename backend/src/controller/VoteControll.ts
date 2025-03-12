import { NextFunction, Request, Response } from 'express';
import Vote from '../model/voteModel';
import Comment from '../model/commentModel';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}
  
export const voteOnOption = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const { questionId, optionId } = req.body;
    const userId = req.user?.id;
  
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
  
    try {
        const question = await Vote.findById(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }
  
        const option = question.options.id(optionId);
        if (!option) {
            res.status(404).json({ message: 'Option not found' });
            return;
        }
  
        const userObjectId = new mongoose.Types.ObjectId(userId);
  
        // Check if the user has already voted
        if (option.voters.some((voterId: any) => voterId.toString() === userObjectId.toString())) {
            res.status(400).json({ message: 'You have already voted for this option' });
            return;
        }
  
        // Remove user vote from all options
        question.options.forEach((opt: any) => {
            opt.voters = opt.voters.filter((voterId: any) => voterId.toString() !== userObjectId.toString());
            if (opt._id.toString() === optionId) {
                opt.votes += 1;
                opt.voters.push(userObjectId);
            }
        });
  
        await question.save();
  
        res.status(200).json({ message: 'Vote recorded successfully', question });
    } catch (error: any) {
        next(error); // Pass error to Express error handler
    }
};


export const addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { text } = req.body;
    const userId = req.user?.id;
    const { questionId } = req.params;

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const question = await Vote.findById(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        const newComment = new Comment({ text, user: userId, question: questionId });
        await newComment.save();

        question.comments.push(newComment._id);
        await question.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const userId = req.user?.id;
    const { commentId } = req.params;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments' });
        }

        await Vote.findByIdAndUpdate(comment.question, { $pull: { comments: commentId } });
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

