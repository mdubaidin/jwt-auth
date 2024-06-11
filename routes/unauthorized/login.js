import User from '../../schema/User.js';
import jwt from 'jsonwebtoken';
import { signToken } from '../../utils/functions.js';

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const query = { email };

        const user = await User.findOne(query);

        if (!user) Error.throw('This Account Does Not Exist', 404);
        if (await user.isUnauthorized(password)) Error.throw('Email or Password is invalid', 200);

        user.removeSensitiveInfo();

        if (user.step !== 0) {
            return res.error({
                message: 'Please complete the signup process',
                step: user.step,
                email: user.email,
                userToken: jwt.sign({ userId: user._id }, process.env.JWT_SECRET),
            });
        }

        const token = signToken(user);

        res.success({
            user,
            token,
        });
    } catch (e) {
        next(e);
    }
}

async function checkEmail(req, res, next) {
    const { email } = req.body;

    try {
        const query = { email };

        const user = await User.findOne(query);

        if (!user) Error.throw('This Account Does Not Exist', 404);

        res.success({ backupEmail: user.backupEmail });
    } catch (e) {
        next(e);
    }
}

export { login, checkEmail };
