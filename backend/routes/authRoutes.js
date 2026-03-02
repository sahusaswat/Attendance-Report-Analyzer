const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware.js");
const {getMe} = require("../controller/authController.js")

const {
    signup,
    login
} = require("../controller/authController.js");


router.post("/register", signup);
router.post("/login", login);

router.post("/logout", (req,res)=> {
    res.clearCookie("token");
    res.json({message: "Logged Out Successfully!"});
});

router.get("/me", protect, getMe)

module.exports = router;