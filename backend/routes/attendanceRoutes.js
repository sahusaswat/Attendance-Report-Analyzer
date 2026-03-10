const express = require("express");
const router = express.Router();

const { getAttendanceByDate, getAttendanceByUser, getOrganizationMembers, markAttendanceBulk, getPerformance} = require("../controller/attendanceController.js");
const {addMembersToManager, getAssignments} = require("../controller/addMembersToManagerController.js");
const {uploadAttendance} = require("../controller/csvParsingController.js")
const {protect} = require("../middleware/authMiddleware.js");
const {upload} = require("../middleware/upload.js")



router.get("/date", protect, getAttendanceByDate);
router.get("/user/:userId", protect, getAttendanceByUser);
router.get("/assignments", protect, getAssignments);
router.get("/members", protect, getOrganizationMembers);
router.get("/performance", protect, getPerformance)
router.post("/mark-bulk", protect, markAttendanceBulk);
router.post("/assign", protect, addMembersToManager);
router.post("/upload", upload.single("file"), uploadAttendance);

module.exports = router;

