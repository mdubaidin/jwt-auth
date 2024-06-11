import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';

function filterObject(obj, values) {
    const k = {};
    values.forEach(key => {
        if (obj.hasOwnProperty(key)) k[key] = obj[key];
    });
    return k;
}

function generateOTP(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var otp = '';

    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        otp += chars[randomIndex];
    }

    return otp;
}

const signToken = user =>
    jwt.sign(
        { id: user._id, role: user.role, extraRoles: user.extraRoles },
        process.env.JWT_SECRET
    );

const parseIp = req =>
    req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;

const acceptFiles = function (...fileNames) {
    const tempStoragePath = 'temp_uploads';
    const actualStoragePath = 'uploads';

    fileNames.forEach(fileName => {
        const source = path.join(tempStoragePath, fileName);
        const destination = path.join(actualStoragePath, fileName);
        fs.renameSync(source, destination);
    });
};

const rejectFiles = function (...fileNames) {
    const folderPath = 'temp_uploads';

    fileNames.forEach(fileName => {
        if (!fileName) return;

        const fullPath = path.join(folderPath, fileName);
        return fs.unlinkSync(fullPath);
    });
};

function isValidMongoId(id) {
    try {
        if (!id) return false;
        new Types.ObjectId(id);
        return true;
    } catch (e) {
        return false;
    }
}

export { filterObject, generateOTP, signToken, parseIp, acceptFiles, rejectFiles, isValidMongoId };
