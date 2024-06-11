import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { emailValidator } from '../utils/validators.js';

const fieldRequiredAtSteps = {
    email: 1,
    firstName: 1,
    password: 1,
    role: 1,
    gender: 1,
    dob: 1,
    backupEmail: 2,
};

const bySteps = function (field) {
    return function () {
        return this.step === 0 || this.step >= fieldRequiredAtSteps[field];
    };
};

const required = function (field, fn = true) {
    return [fn, `${field} is required`];
};

const minlength = function (field, length) {
    return [length, `${field} must be at least (${length}) characters long`];
};

const maxlength = function (field, length) {
    return [length, `${field} must be at least (${length}) characters long`];
};

const enumerate = function (values) {
    return {
        values,
        message: '{VALUE} is not supported',
    };
};

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: required('email', bySteps('email')),
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: emailValidator,
                message: props => `${props.value} is not a valid email address!`,
            },
        },
        firstName: {
            type: String,
            trim: true,
            minlength: minlength('firstName', 3),
            maxlength: maxlength('firstName', 40),
            required: required('firstName', bySteps('firstName')),
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: maxlength('firstName', 40),
        },
        password: {
            type: String,
            minlength: 8,
            required: required('password', bySteps('password')),
        },
        role: {
            type: String,
            enum: enumerate(['user', 'admin']),
            default: 'user',
            required: required('role', bySteps('role')),
        },
        backupEmail: {
            type: String,
            required: required('backupEmail', bySteps('backupEmail')),
            trim: true,
            sparse: true,
            lowercase: true,
            validate: {
                validator: emailValidator,
                message: props => `${props.value} is not a valid email address!`,
            },
        },
        phone: {
            type: String,
            sparse: true,
            // validate: {
            //     validator: function (v) {
            //         return phoneValidator;
            //     },
            //     message: props => `${props.value} is not a valid number.`,
            // }, bugfix
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: required('gender', bySteps('gender')),
        },
        photo: {
            type: Types.ObjectId,
            default: '658913d39539a3e3cd4542f5',
        },
        dob: {
            type: Date,
            required: required('dob', bySteps('dob')),
        },
        stripeId: {
            type: String,
        },
        otp: {
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
        },
        verified: {
            email: {
                type: Boolean,
                required: required('backupEmail'),
                default: false,
            },
        },
        step: {
            type: Number,
            required: required('step'),
            default: 1,
        },
        ip: String,
        source: {
            type: String,
            required: true,
        },
        extraRoles: [String],
        personalize: {
            appsOrder: [Number],
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

const convertPasswordToHash = async function (next) {
    if (this.isModified('password')) {
        this.password = await this.convertPasswordToHash(this.password);
    }
    next();
};

userSchema.pre(['save'], convertPasswordToHash);

userSchema.methods = {
    isAuthorized: async function (password) {
        return bcrypt.compare(password, this.password);
    },
    isUnauthorized: async function (password) {
        const authorized = await this.isAuthorized(password);
        return !authorized;
    },
    convertPasswordToHash: async function (password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    },
    removeSensitiveInfo: function () {
        this.password = undefined;
        this.otp = undefined;
    },
};

userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

export default model('User', userSchema);
