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

    role: {
        type: String,
        required: true,
        anum: ["admin", "manager", "member", "none"],
    },

    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null
    },
    assignedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);