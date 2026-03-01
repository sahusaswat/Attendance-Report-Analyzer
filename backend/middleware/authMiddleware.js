const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.protect = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("TOKEN RECEIVED:", req.cookies.token, req.headers.authorization);

    if (!token) {
        return res.status(401).json("Not Authorized!");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        req.orgId = decoded.organizationId || null;
        req.role = decoded.role || null;
        console.log("DECODED:", decoded);
        console.log("USER FOUND:", req.user);
        next()
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};