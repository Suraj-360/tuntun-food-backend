const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    street: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postal: {
        type: String,
    },
    country: {
        type: String,
    },
    dob: {
        type: String,
    },
    gender: {
        type: String,
    },
    verificationToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("User", userSchema);