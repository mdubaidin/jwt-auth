import './config/config.js';
import express from 'express';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import userRouter from './routers/user.js';
import authenticate from './middlewares/authenticate.js';
import openRouter from './routers/open.js';
import cors from 'cors';

const app = new express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/static', express.static('./uploads'));
app.use('/.well-known', express.static('./.well-known'));

app.use('/open/', openRouter);
app.use('/user/', authenticate, userRouter);

app.use(errorHandler);

export default app;
