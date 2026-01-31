const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requried: true
    },
    organizationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    date:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["present", "absent"],
        required: true
    },
    markedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

attendanceSchema.index(
    {userId: 1, organizationId: 1, date:1},
    {unique: true}
)

module.exports = mongoose.model("Attendance", attendanceSchema);