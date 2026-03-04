const Attendance = require("../models/Attendance.js")
const Membership = require("../models/Membership.js")
const User = require("../models/User.js")

exports.markAttendance = async (req, res) => {
    try {
        if (req.role === "member") {
            return res.status(403).json({ message: "Members cannot mark attendance!" })
        }

        const { userId, status, date } = req.body;
        const organizationId = req.orgId
        const markedBy = req.user._id;
        const today = new Date().toISOString().split("T")[0];

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }
        if (date > today) {
            return res.status(400).json({ message: "Hold on youngman! The day is yet to come :P" });
        }

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

exports.getOrganizationMembers = async (req, res) => {
    try {

        const orgId = req.orgId;

        // ADMIN → gets all
        if (req.role === "admin") {

            const members = await Membership.find({ orgId })
                .populate("userId", "name email")
                .select("userId role");

            return res.status(200).json({ members });
        }

        // MANAGER → gets only assigned users
        if (req.role === "manager") {

            const manager = await User.findById(req.user.id);

            const assigned = manager?.assignedUsers || [];

            if (assigned.length === 0) {
                return res.status(200).json({ members: [] });
            }

            const members = await Membership.find({
                userId: { $in: assigned },
                orgId
            })
                .populate("userId", "name email")
                .select("userId role");

            return res.status(200).json({ members });
        }

        return res.status(403).json({ message: "Not allowed" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAttendanceBulk = async (req, res) => {
    try {
        if (req.role === "member") {
            return res.status(403).json({ message: "Members cannot mark attendance!" })
        }

        const { attendanceList } = req.body;
        const organizationId = req.orgId;
        const markedBy = req.user._id;
        const { date } = req.body;
        const today = new Date().toISOString().split("T")[0];

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        if (date > today) {
            return res.status(400).json({ message: "Hold on youngman! The day is yet to come :P" });
        }

        const formatted = attendanceList.map(a => ({
            userId: a.userId,
            status: a.status,
            organizationId,
            markedBy,
            date
        }));

        await Attendance.insertMany(formatted, { ordered: false });

        res.status(201).json({ message: "Attendance submitted!" });

    } catch (error) {
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

        if (req.role === "member") {
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
    try {
        const { userId } = req.params;
        const organizationId = req.orgId;

        if (req.role === "member" &&
            userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized" });
        }

        const attendance = await Attendance.find({
            userId,
            organizationId
        }).sort({ date: -1 });

        res.status(200).json({ message: "Success", attendance })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPerformance = async (req, res) => {
    try {
        const { startDate, endDate, excludeSat, excludeSun } = req.query;
        const orgId = req.orgId;
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and End dates required" });
        }
        // Get all attendance for org in month
        const records = await Attendance.find({
            organizationId: orgId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });
        // Group by user
        const performance = {};
        records.forEach(r => {
            const id = r.userId.toString();

            if (!performance[id]) {
                performance[id] = 0;
            }

            if (r.status === "present") {
                performance[id] += 1;
            }
        });
        // Count working days
        let totalDays = 0;

        let current = new Date(startDate + "T00:00:00");
        let last = new Date(endDate + "T00:00:00");

        while (current <= last) {

            const day = current.getDay();

            if (excludeSat === "true" && day === 6) {
                current.setDate(current.getDate() + 1);
                continue;
            }

            if (excludeSun === "true" && day === 0) {
                current.setDate(current.getDate() + 1);
                continue;
            }

            totalDays++;
            current.setDate(current.getDate() + 1);
        }
        // Calculate %
        const users = await Membership.find({
            userId: { $in: Object.keys(performance) },
            orgId
        }).populate("userId", "name email");

        const result = users.map(u => {

            const id = u.userId._id.toString();
            const present = performance[id] || 0;

            return {
                name: u.userId.name,
                email: u.userId.email,
                role: u.role,
                presentDays: present,
                totalDays,
                percentage: totalDays === 0
                    ? "0.00"
                    : ((present / totalDays) * 100).toFixed(2)
            };
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}