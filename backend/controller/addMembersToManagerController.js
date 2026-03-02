const User = require("../models/User.js");
const Membership = require("../models/Membership.js");
const mongoose = require("mongoose");

exports.addMembersToManager = async (req, res) => {
    try {
        if (req.role !== "admin") {
            return res.status(403).json({ message: "Only Admin Access!" });
        };

        const { managerId, members } = req.body;
        const managerMembership = await Membership.findOne({
            userId: managerId,
            orgId: req.orgId
        });

        if (!managerMembership || managerMembership.role !== "manager") {
            return res.status(400).json({ message: "Not a Manager!" });
        }

        const managerUser = await User.findById(managerId);

        managerUser.assignedUsers = members.map(id =>
            new mongoose.Types.ObjectId(id)
        );
        await managerUser.save();
        res.status(200).json({ message: "Members successfully assigned!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};