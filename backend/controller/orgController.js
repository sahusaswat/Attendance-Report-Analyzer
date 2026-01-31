const User = require("../models/User.js")
const Organization = require("../models/Organization.js");

exports.createOrganization = async(req,res) => {
    try {
        if(req.user.role != "admin") {
            return res.status(400).json("Only Admin can access this!")
        }

        const {name} = req.body;
        const organization = await Organization.create({
            name,
            createdBy: req.user._id
        });

        req.user.organizationId = organization._id;
        await req.user.save();

        res.status(200).json({message: "Organization Created!", organization});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.joinOrganization = async(req,res) => {
    try {
        const {organizationId} = req.body;
        const organization = await Organization.findById(organizationId);

        if(!organization) {
            return res.status(400).json({message: "Organization Not Found!"});
        }

        req.user.organizationId = organizationId;
        req.user.role = "member";
        await req.user.save();

        res.status(200).json({message: "Joining the Organization is Successful!"})
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.addManagerORG = async(req,res) => {
    try {  
        if(req.user.role !== "admin") {
            return res.status(400).json({message: "Only Admin have access!"});
        }
        const user = await User.findById(req.body.userId);
        
        if(!user) {
            return res.status(400).json({message: "User Not Found!"});
        }
        if(user.organizationId.toString() !== req.user.organizationId.toString()) {
            return res.status(400).json({message: "User not from same organization"});
        }

        user.role = "manager";
        await user.save();

        res.status(200).json({message: "Manager added successfully!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}