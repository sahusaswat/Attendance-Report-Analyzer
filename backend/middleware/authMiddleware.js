const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.protect = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json("Not Authorized!");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        req.orgId = decoded.orgId || null;
        req.role = decoded.role || null;
        next()
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};