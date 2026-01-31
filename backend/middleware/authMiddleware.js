const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.protect = async(req,res,next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    };

    if(!token) {
       return  res.status(401).json("Not Authorized!");
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password")
        next()
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};