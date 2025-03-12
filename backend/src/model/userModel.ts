import { Schema, model } from 'mongoose';


const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  bio: { type: String },
  role: { type: String, default: 'user' },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Vote',
  }],
});

const User = model('User2', UserSchema);

export default User;
