const Attendance = require("../models/Attendance.js");

exports.markAttendance = async (req, res) => {
    try {
        if (req.user.role === "member") {
            return res.status(403).json({ message: "Members cannot mark attendance!" })
        }

        const { userId, status } = req.body;
        const organizationId = req.orgId
        const markedBy = req.user._id;
        const date = new Date().toISOString().split("T")[0];

        const attendance = await Attendance.create({
            userId,
            status,
            organizationId: organizationId,
            markedBy,
            date
        });

        res.status(201).json({ message: "Attendance successfully marked!", attendance })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Attendance already marked today!" });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;

        let filter = {
            organizationId: req.orgId,
            date
        };

        console.log("FILTER:", filter);

        if (req.user.role === "member") {
            filter.userId = req.user._id;
        }

        // This is assignedUsers for manager we will add this further in code
        // if (req.user.role === "manager") {
        //     filter.userId = {$in: req.user.assignedUsers}
        // }

        const attendance = await Attendance.find(filter)
            .populate("userId", "name email role")
            .populate("markedBy", "name role");

        res.status(201).json({ message: "AttendanceByDate successfuly retrieved!", attendance })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByUser = async (req, res) => {
      console.log("API RESPONSE:", req);
    try {
        const {userId} = req.params;
        const organizationId = req.orgId;

        console.log("PARAM USERID:", userId);
    console.log("AUTH USER:", req.user._id);
    console.log("ORG ID:", organizationId);

        if (req.user.role === "member" &&
            userId !== req.user._id.toString()
        ) {
            return res.status(403).json({message: "You are not authorized"});
        }

        const attendance = await Attendance.find({
            userId,
            organizationId
        }).sort({date: -1});

        res.status(200).json({message: "Success", attendance})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};