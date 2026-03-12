const mongoose = require("mongoose");
const crypto = require("crypto");

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
    },

    ResetPasswordToken: {
        type: String
    },

    ResetPasswordTokenExpires: {
        type: Date
    }

}, { timestamps: true });

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.ResetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.ResetPasswordTokenExpires =  Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);