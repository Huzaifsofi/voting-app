import { Request, Response, NextFunction } from 'express';
import { Document, Types } from 'mongoose';
import Vote from '../model/voteModel';
import crypto from 'crypto'
import User from '../model/userModel';



export const createVoteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { questionText, options } = req.body as { questionText: string; options: { text: string }[] };
        const userId = (req as any).user?.id; // Access user without custom interface

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

        const questionId = await crypto.randomUUID();

        const newQuestion = new Vote({
            user: userId,
            questionText: questionText.trim(),
            questionId: questionId,
            options: formattedOptions,
        });

        await newQuestion.save();
        res.status(201).json({ message: 'Question created successfully', question: newQuestion });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const getMyVotesQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        const question = await Vote.find({ user: userId })
        .populate({
          path: 'user', // Field to populate
          model: 'User2', // Model to use for population
          select: 'username email', // Fields to include from the User2 model
      });

        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        res.status(200).json({ question });
    } catch (error: any) {
        next(error);
    }
};



interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export const getVotesQuestions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Find user by ID and populate the 'questions' field
        const user = await User.findById(userId).populate({
            path: 'questions', // Field to populate
            populate: {
                path: 'user', // Populate the 'user' field inside each question
                model: 'User2', // Model to use for population
                select: 'username email', // Fields to include from the User2 model
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Access the populated questions
        const questions = user.questions;

        res.status(200).json({ questions });
    } catch (error) {
        next(error);
    }
};


  interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
  }
  
  export const getVotesQuestionsById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const questionId = req.params.questionId;
      const userId = req.user?.id;
  
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
  
      // Find the question by ID and populate comments with user details
      const question = await Vote.findById(questionId)
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username email' // Adjust the fields you want to retrieve
          }
        });
  
      if (!question) {
        res.status(404).json({ message: "Question not found" });
        return;
      }
  
      // Ensure options exist and are an array
      const votedOption = question.options?.find((option: any) =>
        Array.isArray(option.voters) && option.voters.includes(userId)
      );
  
      const hasVoted = Boolean(votedOption);
      console.log(hasVoted);
  
      res.status(200).json({
        question,
        hasVoted,
        votedOption: hasVoted ? votedOption : null,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  


export const addPools = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { questionId } = req.body;
        const userId = (req as any).user?.id;

        if (!questionId|| !userId) {
            res.status(400).json({ message: 'Invalid poolIds or userId' });
            return;
        }

        const questionIds = await Vote.find({ _id: questionId }) 

        if (!questionIds) {
            res.status(400).json({ message: 'Invalid questionId' });
        }

        const checkquestioninuser = await User.findOne({ _id: userId, questions: questionIds });

        

        if (checkquestioninuser) {
            res.status(400).json('Question exists in user’s questions array.');
        } else {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { questions: questionId } // Prevents duplicates
            });
        }

        res.status(201).json({ message: "sucessfully added" })

        
    } catch (error) {
        next(error);
    }
};


export const getallQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { query } = req.query;

      // Define the search criteria
      const searchCriteria = {
        $or: [
          { questionText: { $regex: query, $options: 'i' } }, // Case-insensitive search in the name field
        ],
      };


      const question = await Vote.find(searchCriteria)
            .populate({
                path: 'user', // Field to populate
                model: 'User2', // Model to use for population
                select: 'username email', // Fields to include from the User2 model
            });

      if (!question) {
          res.status(404).json({ message: 'Question not found' });
          return;
      }

      res.status(200).json({ question });
  } catch (error: any) {
      next(error);
  }
};





export const deleteVoteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { questionId } = req.params as { questionId: string };
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        const question = await Vote.findById(questionId);

        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        if (question.user.toString() !== userId && userRole !== 'admin') {
            res.status(403).json({ message: 'You are not authorized to delete this question' });
            return;
        }

        await Vote.findByIdAndDelete(questionId);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error: any) {
        next(error);
    }
};

