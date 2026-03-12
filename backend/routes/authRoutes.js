const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware.js");

const {
    signup,
    login,
    verifyEmail,
    getMe,
    resendcode,
    forgotpassword,
    resetpassword
} = require("../controller/authController.js");


router.post("/register", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendcode);
router.post("/forgotpassword", forgotpassword)
router.post("resetpassword/:token", resetpassword)

router.post("/logout", (req,res)=> {
    res.clearCookie("token");
    res.json({message: "Logged Out Successfully!"});
});

router.get("/me", protect, getMe)

module.exports = router;