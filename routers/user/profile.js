import express from 'express';
import fetch from '../../routes/common/profile/fetch.js';
import update from '../../routes/user/update.js';
// import changePassword from '../../routes/user/changePassword.js';

const profileRouter = new express.Router();

// GET
profileRouter.get('/', fetch);

// PATCH
profileRouter.patch('/', update);

// profileRouter.patch('/photo', upload.single('photo'), updatePic);
// profileRouter.patch('/change-password', changePassword);

export default profileRouter;
