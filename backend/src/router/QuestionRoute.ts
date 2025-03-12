import { Router } from 'express';
import { createVoteQuestion, deleteVoteQuestion, getVotesQuestions, getMyVotesQuestion, addPools, getVotesQuestionsById, getallQuestion } from '../controller/QuestionControll';
import { jwtVerify } from '../controller/authControll';
import { addComment, voteOnOption } from '../controller/VoteControll';


const router = Router();

// Define route handlers with proper middleware
router.post('/createpoll', jwtVerify, createVoteQuestion);
router.delete('/delete/:questionId', jwtVerify, deleteVoteQuestion);
router.get('/get/poll', jwtVerify, getVotesQuestions);
router.post('/create/vote', jwtVerify, voteOnOption);

router.get('/get/mypool', jwtVerify, getMyVotesQuestion)
router.post('/post/addpool',jwtVerify, addPools)
router.get('/get/pool', jwtVerify, getVotesQuestions)
router.get('/get/pool/:questionId', jwtVerify, getVotesQuestionsById)
router.get('/get/all/questions', getallQuestion)

//comment
router.post('/add/comment/:questionId', jwtVerify, addComment)

export default router;
