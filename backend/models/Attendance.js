const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent", "half-day", "leave"],
        required: true
    },
    lateStatus: {
        type: Boolean,
        default: false
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    inTime: {
        type: String
    },

    outTime: {
        type: String
    },

    source: {
        type: String,
        enum: ["manual", "csv", "system"],
        default: "manual"
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    updatedAt: {
        type: Date
    }
}, { timestamps: true });

attendanceSchema.index(
    { userId: 1, organizationId: 1, date: 1 },
    { unique: true }
)

module.exports = mongoose.model("Attendance", attendanceSchema);