"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionControll_1 = require("../controller/QuestionControll");
const authControll_1 = require("../controller/authControll");
const VoteControll_1 = require("../controller/VoteControll");
const router = (0, express_1.Router)();
// Define route handlers with proper middleware
router.post('/createpoll', authControll_1.jwtVerify, QuestionControll_1.createVoteQuestion);
router.delete('/delete/:questionId', authControll_1.jwtVerify, QuestionControll_1.deleteVoteQuestion);
router.get('/get/poll', authControll_1.jwtVerify, QuestionControll_1.getVotesQuestions);
router.post('/create/vote', authControll_1.jwtVerify, VoteControll_1.voteOnOption);
exports.default = router;
