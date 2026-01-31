const User = require("../models/User.js");

exports.addMembersToManager = async (req,res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({message: "Only Admin Access!"});
        };

        const {managerId, members} = req.body;
        const manager = await User.findById(managerId);

        if(!manager || manager.role !== "manager") {
            return res.status(400).json({message: "Not a Manager!"}); 
        };

        manager.assignedUsers = members;
        await manager.save();

        res.status(200).json({message: "Members successfully assigned!"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};