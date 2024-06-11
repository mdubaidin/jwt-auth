import User from '../../schema/User.js';
import { generateOTP, signToken } from '../../utils/functions.js';
import jwt from 'jsonwebtoken';

async function createAccount(req, res, next) {
    try {
        const { firstName, lastName, dob, gender, email, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            email: email,
            dob,
            gender,
            password,
            step: 1,
        });

        const otp = generateOTP(4);

        user.otp.email = otp;

        await user.save();

        user.removeSensitiveInfo();

        const userToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        res.success({
            message: 'user created',
            user,
            userToken,
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
}

async function verifyEmail(req, res, next) {
    try {
        const userId = req.userId;
        const otp = req.body.otp;

        const user = await User.findOne({ _id: userId, step: 1 });

        if (!user) Error.throw('user not found');

        if (user.otp.email === otp) user.verified.email = true;
        else Error.throw('Verification code is invalid', 200);

        user.step = 0;

        await user.save();

        user.removeSensitiveInfo();

        const token = signToken(user);

        res.success({
            message: 'Your email address is successfully verified',
            user,
            token,
        });
    } catch (e) {
        next(e);
    }
}

export default { createAccount, verifyEmail };
