"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authControll_1 = require("../controller/authControll");
router.post('/signup', authControll_1.signup);
router.post('/login', authControll_1.login);
router.get('/checkusers', authControll_1.checkUser);
exports.default = router;
