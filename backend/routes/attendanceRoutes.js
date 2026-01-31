const express = require("express");
const router = express.Router();

const {markAttendance, getAttendanceByDate, getAttendanceByUser} = require("../controller/attendanceController.js");
const {addMembersToManager} = require("../controller/addMembersToManagerController.js")
const {protect} = require("../middleware/authMiddleware.js");

router.post("/mark-it", protect, markAttendance);
router.get("/date", protect, getAttendanceByDate);
router.get("/user/:userId", protect, getAttendanceByUser);
router.post("/assign", protect, addMembersToManager);

module.exports = router;

