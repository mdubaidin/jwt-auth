import express from 'express';
import { login, checkEmail } from '../routes/unauthorized/login.js';
import createPassword from '../routes/unauthorized/createPassword.js';
import generateResetToken from '../routes/unauthorized/generate-reset-token.js';
import exists from '../routes/unauthorized/exists.js';
import verifyResetToken from '../routes/unauthorized/verifyResetToken.js';
import getUnusedEmails from '../routes/unauthorized/getUnusedEmails.js';
import getUserInfo from '../routes/unauthorized/getUserInfo.js';
import getUsersInfo from '../routes/unauthorized/getUsersInfo.js';
import createAccount from '../routes/unauthorized/createAccount.js';

const openRouter = new express.Router();

// GET
openRouter.get('/reset-code/:email', generateResetToken);
openRouter.get('/user-info', getUserInfo);

// POST
openRouter.post('/create', createAccount.createAccount);
openRouter.post('/users-info', getUsersInfo);
openRouter.post('/exists/email', exists('email'));
openRouter.post('/find', checkEmail);
openRouter.post('/login', login);
openRouter.post('/verify/reset-code', verifyResetToken);
openRouter.post('/unused-emails', getUnusedEmails);

// PATCH
openRouter.patch('/create-password', createPassword);

export default openRouter;
