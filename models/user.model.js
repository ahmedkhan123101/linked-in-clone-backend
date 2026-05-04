const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email format.');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: ""
        },
        headline: { type: String, default: "" },
        city: { type: String, default: "" },
        skills: [String],
        experience: [{
            title: { type: String, required: true },
            company: { type: String, required: true },
            employmentType: String,
            startMonth: String,
            startYear: Number,
            endMonth: String,
            endYear: Number,
            currentRole: { type: Boolean, default: false },
            description: String,
            skills: [String]
        }],
        education: [{
            school: { type: String, required: true },
            degree: String,
            fieldOfStudy: String,
            startYear: Number,
            endYear: Number,
            grade: String,
            activities: String,
            description: String
        }]
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);
module.exports = User;