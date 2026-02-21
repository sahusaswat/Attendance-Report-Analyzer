const express = require("express");
const router = express.Router();

const {
    signup,
    login
} = require("../controller/authController.js");
const User = require("../models/User.js");

const {protect} = require("../middleware/authMiddleware.js");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, async(req,res)=> {
    const user = await User.findById(req.user.id).select("-password");
    res.json({user});
});

router.post("/logout", (req,res)=> {
    res.clearCookie("token");
    res.json({message: "Logged Out Successfully!"});
});

module.exports = router;