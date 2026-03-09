const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },

    email: {
        required: true,
        type: String,
        unique: true
    },

    password: {
        required: true,
        type: String,
    },

    assignedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    isVerified: {
        type: Boolean,
        default: false

    },

    VerificationCode: {
        type: String,
    },

    VerificationCodeExpires:{
        type: Date
    },
    
    verificationAttempts: {
        type: Number,
        default: 0
    },

    verificationBlockedUntil: {
        type: Date
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);