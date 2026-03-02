const express = require("express");
const router = express.Router();

const {markAttendance, getAttendanceByDate, getAttendanceByUser, getOrganizationMembers, markAttendanceBulk, getPerformance} = require("../controller/attendanceController.js");
const {addMembersToManager} = require("../controller/addMembersToManagerController.js");
const {protect} = require("../middleware/authMiddleware.js");


router.post("/mark-it", protect, markAttendance);
router.post("/mark-bulk", protect, markAttendanceBulk);
router.get("/date", protect, getAttendanceByDate);
router.get("/user/:userId", protect, getAttendanceByUser);
router.post("/assign", protect, addMembersToManager);
router.get("/members", protect, getOrganizationMembers);
router.get("/performance", protect, getPerformance)

module.exports = router;

