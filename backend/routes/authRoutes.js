const express = require("express");
const router = express.Router();

const {
    signup,
    login
} = require("../controller/authController.js");

const protect = require("../middleware/authMiddleware.js");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;