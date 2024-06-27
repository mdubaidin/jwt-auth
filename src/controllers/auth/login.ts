// import { signAccessToken, signRefreshToken } from '../../utils/functions.js';
import { Handler } from 'express';
import User from '../../models/User.js';
import CustomError from '../../classes/CustomError.js';
import { generateJWT } from '../../utils/jwt/jwt.js';
import { setTokenCookies } from '../../utils/jwt/token.js';

const login: Handler = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const query = { email };
        const user = await User.findOne(query);

        if (!user) return CustomError.throw(`We can't find account with ${email}`, 404);

        if (await user.isUnauthorized(password))
            return CustomError.throw(
                'The password you entered is incorrect, Please try again',
                404
            );

        const { accessToken, refreshToken } = await generateJWT(user);
        const userObject = user.removeSensitiveInfo();

        setTokenCookies(res, accessToken, refreshToken);

        res.success({
            ...userObject,
            accessToken,
            refreshToken,
        });
    } catch (e) {
        next(e);
    }
};

export { login };
