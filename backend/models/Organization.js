const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Organization", organizationSchema);