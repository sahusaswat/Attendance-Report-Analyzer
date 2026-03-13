const Attendance = require("../models/Attendance.js")
const Membership = require("../models/Membership.js")
const User = require("../models/User.js")

exports.getOrganizationMembers = async (req, res) => {
    try {

        const orgId = req.orgId;

        if (req.role === "admin") {

            const members = await Membership.find({
                orgId,
                role: { $in: ["manager", "member"] }
            })
                .populate("userId", "name email")
                .select("userId role");

            return res.status(200).json({ members });
        }

        if (req.role === "manager") {

            const manager = await User.findById(req.user._id);

            const assigned = manager?.assignedUsers || [];

            if (assigned.length === 0) {
                return res.status(200).json({ members: [] });
            }

            const usertoFetch = [req.user.id, ...assigned]

            const members = await Membership.find({
                userId: { $in: usertoFetch },
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
            date: new Date(date)
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
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        let filter = {
            organizationId: req.orgId,
            date: {
                $gte: start,
                $lt: end
            },
        };

        if (req.role === "member") {
            filter.userId = req.user._id;
        }

        const attendance = await Attendance.find(filter)
            .populate("userId", "name email role")
            .populate("markedBy", "name role")
            .sort({date: -1});

        res.status(201).json({ message: "AttendanceByDate successfuly retrieved!", attendance })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAttendanceByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;
        const organizationId = req.orgId;

        if (!startDate || !endDate) {
            return res.json({ message: "Please Select the dates!" })
        }

        if ((req.role === "member" || req.role === "manager") &&
            userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const attendance = await Attendance.find({
            userId,
            organizationId,
            date: {
                $gte: start,
                $lte: end
            },
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

        const records = await Attendance.find({
            organizationId: orgId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        });

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
};

exports.DashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const totalPresent = await Attendance.countDocuments({
            organizationId: req.orgId,
            date: { $gte: today, $lt: tomorrow },
            status: "present"
        });

        const leaveCount = await Attendance.countDocuments({
            organizationId: req.orgId,
            date: { $gte: today, $lt: tomorrow },
            status: "leave"
        });

        const totalWorkers = await Membership.countDocuments({
            organizationId: req.orgId,
            role: { $in: ["manager", "member"] }
        });

        // Not the correct performers list
        const topPerformers = await Membership.find({ organizatoinId: req.orgId, role: "member" })
            .populate("userId", "name")
            .limit(2);

        const lowPerformers = await Membership.find({ organizatoinId: req.orgId, role: "member" })
            .populate("userId", "name")
            .sort({ _id: -1 })
            .limit(2);

        res.json({
            totalPresent,
            leaveCount,
            topPerformers,
            lowPerformers,
            totalWorkers
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.downloadAttendance = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const attendance = await Attendance.find({
            organizationId: req.user.orgId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate("userId", "name email");

        let csv = "Name,Email,Date,Status\n";

        attendance.forEach(record => {
            csv += `${record.userId.name},${record.userId.email},${record.date}, ${record.status}\n`
        });

        res.header("Content-type", "text/csv");
        res.attachment("attendance-report.csv");

        return res.send(csv);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.UpdateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id).populate("userId");

        if (!attendance) {
            return res.status(400).json({ message: "Attendance Not found!" });
        };

        if (req.user.role === "member") {
            return res.status(403).json({ message: "You are not authorized!" })
        };

        if (req.role === "manager") {
            const manager = await User.findById(req.user._id);
            const assigned = manager.assignedUsers || [];
            if (!assigned.includes(attendance.userId._id.toString())) {
                return res.status(403).json({ message: "Not your member" });
            }
        }

        attendance.status = req.body.status || attendance.status;
        await attendance.save();

        res.status(201).json({ message: "Attendance Successfully Updated!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.DeleteRecords = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id).populate("userId");

        if (!attendance) {
            return res.status(400).json({ message: "Attendance Not found!" });
        };

        if (req.user.role === "member") {
            return res.status(403).json({ message: "You are not authorized!" })
        };

        if(req.role === "manager"){
            const manager = await User.findById(req.user._id);
            const assigned = manager.assignedUsers || [];
            if(!assigned.includes(attendance.userId._id.toString())){
                return res.status(403).json({message:"Not your member"});
            }
        }
        await attendance.deleteOne();

        res.status(200).json({ message: "Attendance Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};