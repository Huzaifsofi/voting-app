import { Schema, model } from 'mongoose';


const optionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    votes: {
        type: Number,
        default: 0,
    },
    voters: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // References users who voted for this option
    }]
});



const questionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User2', // Assuming you have a User model
        required: true,
    },
    questionId: {
        type: String,
        required: true,
    },
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [optionSchema],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10 options'],
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'vote-comment', // Assuming this references the comment model
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Validator to limit options array to max 10
function arrayLimit(val: string | any[]) {
    return val.length <= 10;
}

const Vote = model('Vote', questionSchema);

export default Vote;
