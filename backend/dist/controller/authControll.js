"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.jwtVerify = exports.signup = exports.login = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const jwtkey = '123456';
// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkemail = await userModel_1.default.findOne({ email });
        if (!checkemail || !(await (0, bcryptjs_1.compare)(password, checkemail.password))) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }
        const user = {
            id: checkemail._id.toString(),
            email: checkemail.email,
            username: checkemail.username,
            role: checkemail.role,
        };
        const token = (0, jsonwebtoken_1.sign)(user, jwtkey, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Successfully logged in',
            token,
            user,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
// Signup Controller
const signup = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const checkemail = await userModel_1.default.findOne({ email });
        if (checkemail) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }
        const hashedPassword = (0, bcryptjs_1.hashSync)(password, 10);
        const user = new userModel_1.default({
            email,
            username,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'Successfully registered', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.signup = signup;
// JWT Verification Middleware
const jwtVerify = (req, res, next) => {
    // console.log("hii")
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   res.status(401).json({ isValid: false, message: 'No token provided' });
    //   return;
    // }
    // const token = authHeader.split(' ')[1];
    // verify(token, jwtkey, (err, user) => {
    //   if (err || !user) {
    //     res.status(403).json({ isValid: false, message: 'Invalid token' });
    //     return;
    //   }
    //   const payload = user as JwtPayload;
    //   req.user = {
    //     id: payload.id,
    //     email: payload.email,
    //     username: payload.username,
    //     role: payload.role,
    //   };
    //   next();
    // });
    next();
};
exports.jwtVerify = jwtVerify;
// Check Authenticated User
const checkUser = (req, res) => {
    // if (!req.user) {
    //   res.status(401).json({ isValid: false, message: 'Invalid token' });
    //   return;
    // }
    // res.status(200).json({ isValid: true, user: `${req.user}` });
    res.json({ message: 'User check successfully!' });
};
exports.checkUser = checkUser;
