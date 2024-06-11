import Jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

function authenticate(req, res, next) {
    try {
        if (!typeof req.headers.authorization === 'string') Error.throw('Invalid token');

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) return Error.throw('JWT must be provided', 401);

        const user = Jwt.verify(token, process.env.JWT_SECRET);

        console.log(user);

        req.user = user;
        req.user.id = new Types.ObjectId(user.id);
        req.user.token = token;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).error(e.message);
    }
}

export default authenticate;
