const express = require("express");
const router = express.Router();

const {DashboardStats} = require("../controller/attendanceController.js");

router.get("/dashboard-stats", DashboardStats);

module.exports = router;