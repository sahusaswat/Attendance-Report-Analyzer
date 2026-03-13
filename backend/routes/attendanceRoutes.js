const express = require("express");
const router = express.Router();

const { getAttendanceByDate, getAttendanceByUser, getOrganizationMembers, markAttendanceBulk, getPerformance, downloadAttendance, UpdateAttendance, DeleteRecords, getTeamAttendance} = require("../controller/attendanceController.js");
const {addMembersToManager, getAssignments} = require("../controller/addMembersToManagerController.js");
const {uploadAttendance} = require("../controller/csvParsingController.js")
const {protect} = require("../middleware/authMiddleware.js");
const upload = require("../middleware/upload.js")



router.get("/date", protect, getAttendanceByDate);
router.get("/user/:userId", protect, getAttendanceByUser);
router.get("/assignments", protect, getAssignments);
router.get("/members", protect, getOrganizationMembers);
router.get("/performance", protect, getPerformance)
router.post("/mark-bulk", protect, markAttendanceBulk);
router.post("/assign", protect, addMembersToManager);
router.post("/upload", protect, upload.single("file"), uploadAttendance);
router.get("/download",protect, downloadAttendance);
router.put("/update/:id", protect, UpdateAttendance);
router.delete("/delete/:id", protect, DeleteRecords);
router.get("/team-attendance", protect, getTeamAttendance);

module.exports = router;

