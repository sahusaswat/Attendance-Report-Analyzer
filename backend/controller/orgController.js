const Organization = require("../models/Organization.js");
const Membership = require("../models/Membership.js");
const jwt = require("jsonwebtoken");

exports.createOrganization = async (req, res) => {
    try {
        const { name } = req.body;
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        const organization = await Organization.create({
            name,
            code,
            createdBy: req.user._id
        });

        const membership = await Membership.create({
            userId: req.user._id,
            orgId: organization._id,
            role: "admin"
        })

        const token = jwt.sign(
            {
                id: req.user._id,
                orgId: organization._id,
                role: membership.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "Organization Created!", organization, code, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.joinOrganization = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Organization code is required" });
        }
        const organization = await Organization.findOne({ code });


        if (!organization) {
            return res.status(400).json({ message: "Invalid Code!" });
        }

        const alreadyMember = await Membership.findOne({
            userId: req.user._id,
            orgId: organization._id
        });

        if (alreadyMember) {
            return res.status(400).json({
                message: "You are already a member of this organization"
            });
        }

        const membership = await Membership.create({
            userId: req.user._id,
            orgId: organization._id,
            role: "member"
        });

        const token = jwt.sign(
            {
                id: req.user._id,
                orgId: organization._id,
                role: membership.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({ token })
    } catch (error) {
        console.log("JOIN ERROR FULL:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Already joined this organization"
            });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.myOrganizations = async (req, res) => {
    const orgs = await Membership.find({ userId: req.user._id }).populate("orgId", "name code")
    res.json({ orgs })
};

exports.enterOrganizations = async (req, res) => {
    const { orgId } = req.body;
    try {
        const membership = await Membership.findOne({
            userId: req.user._id,
            orgId
        });

        if (!membership)
            return res.status(403).json("No access");

        //Workspace token
        const token = jwt.sign(
            {
                id: req.user._id,
                orgId,
                role: membership.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: "Entered organization" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

exports.updateManagerRole = async (req, res) => {

    const { orgId, userId } = req.body;
    try {

        const adminMembership = await Membership.findOne({
            userId: req.user._id,
            orgId
        });

        if (!adminMembership || adminMembership.role !== "admin") {
            return res.status(400).json({ message: "Only Admin has access!" });
        }

        const member = await Membership.findOne({
            userId,
            orgId
        });

        if (!member) {
            return res.status(400).json({ message: "User Not Found!" });
        }

        // Toggle Role
        if (member.role === "member") {
            member.role = "manager";
        } else if (member.role === "manager") {
            member.role = "member";
        } else {
            return res.status(400).json({ message: "Cannot modify admin role" });
        }

        await member.save();

        res.status(200).json({ message: `Role updated to ${member.role}` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};