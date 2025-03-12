"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    bio: { type: String },
    role: { type: String, default: 'user' },
});
const User = (0, mongoose_1.model)('User2', UserSchema);
exports.default = User;
