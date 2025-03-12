"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoute_1 = __importDefault(require("./router/authRoute"));
const QuestionRoute_1 = __importDefault(require("./router/QuestionRoute"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // specify the exact origin
    credentials: true, // allow cookies to be sent
}));
app.use('/auths', authRoute_1.default);
app.use('/vote', QuestionRoute_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
mongoose_1.default.connect('mongodb+srv://huzaif:huzaifmtb@cluster0.tkpiyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('database connected'))
    .catch((err) => console.log('database connected'));
