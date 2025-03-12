import { Schema, model } from 'mongoose'

const CommentSchema = new Schema({
    text: {type: String, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User2', // Assuming you have a User model
        required: true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Vote', // Assuming you have a User model
        required: true,
    }
})

const Comments = model('vote-comment', CommentSchema)

export default Comments