const User = require("../models/User.js");
const Membership = require("../models/Membership.js");
const mongoose = require("mongoose");

exports.addMembersToManager = async (req, res) => {
    try {

        if (req.role !== "admin") {
            return res.status(403).json({ message: "Only Admin Access!" });
        }

        const { managerId, members } = req.body;

        if (!managerId) {
            return res.status(400).json({ message: "Manager required" });
        }

        const managerMembership = await Membership.findOne({
            userId: managerId,
            orgId: req.orgId
        });

        if (!managerMembership || managerMembership.role !== "manager") {
            return res.status(400).json({ message: "Selected user is not a manager" });
        }

        const managerUser = await User.findById(managerId);

        if (!managerUser) {
            return res.status(404).json({ message: "Manager not found" });
        }

        // Replace assignments
        managerUser.assignedUsers = members.map(
            id => new mongoose.Types.ObjectId(id)
        );

        await managerUser.save();

        res.json({
            message: "Members assigned successfully",
            assignedUsers: managerUser.assignedUsers
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignments = async (req, res) => {
    try {

        // Get all managers
        const managers = await Membership.find({
            orgId: req.orgId,
            role: "manager"
        }).populate("userId", "name assignedUsers");

        // Get all members
        const members = await Membership.find({
            orgId: req.orgId,
            role: "member"
        }).populate("userId", "name");

        // Collect all assigned member IDs
        const assignedMemberIds = managers
            .flatMap(m => m.userId.assignedUsers || [])
            .map(id => id.toString());

        const assignedMembers = members.filter(m =>
            assignedMemberIds.includes(m.userId._id.toString())
        );

        const unassignedMembers = members.filter(m =>
            !assignedMemberIds.includes(m.userId._id.toString())
        );

        res.json({
            managers,
            assignedMembers,
            unassignedMembers
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};