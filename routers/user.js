import express from 'express';
import profileRouter from '../routers/user/profile.js';

const userRouter = new express.Router();

userRouter.use('/profile', profileRouter);

export default userRouter;
