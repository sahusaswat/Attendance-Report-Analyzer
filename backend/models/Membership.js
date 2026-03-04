const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "manager", "member"],
        required: true
    }
});

membershipSchema.index(
    { userId: 1, orgId: 1 }, { unique: true }
);

module.exports = mongoose.model("Membership", membershipSchema);