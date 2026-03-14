const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware.js")

const {getTodayStats, getDashboardAnalytics} = require("../controller/AnalyticsController.js")

router.get("/dashboard-analytics-stats",protect, getDashboardAnalytics);
router.get("/dashboard-todaystats",protect, getTodayStats);

module.exports = router;