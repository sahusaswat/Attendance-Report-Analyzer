const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Organization", organizationSchema);