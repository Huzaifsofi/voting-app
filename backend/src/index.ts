import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import AuthRoute from './router/authsRoute';
import VoteRoute from './router/QuestionRoute';

const app: Application  = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // specify the exact origin
    credentials: true, // allow cookies to be sent
  }));
  
  

app.use('/auths', AuthRoute);
app.use('/vote', VoteRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Running on port ${PORT}`))

mongoose.connect(
    'mongodb+srv://huzaif:huzaifmtb@cluster0.tkpiyzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then(() => console.log('database connected'))
.catch((err: Error) => console.log('database connected'))
