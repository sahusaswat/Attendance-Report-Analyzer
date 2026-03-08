const express = require("express");
const router = express.Router();

const { getAttendanceByDate, getAttendanceByUser, getOrganizationMembers, markAttendanceBulk, getPerformance} = require("../controller/attendanceController.js");
const {addMembersToManager, getAssignments} = require("../controller/addMembersToManagerController.js");
const {protect} = require("../middleware/authMiddleware.js");



router.post("/mark-bulk", protect, markAttendanceBulk);
router.get("/date", protect, getAttendanceByDate);
router.get("/user/:userId", protect, getAttendanceByUser);
router.post("/assign", protect, addMembersToManager);
router.get("/assignments", protect, getAssignments);
router.get("/members", protect, getOrganizationMembers);
router.get("/performance", protect, getPerformance)

module.exports = router;

