const express = require("express");
const router = express.Router();

const {createOrganization, joinOrganization, updateManagerRole, myOrganizations, enterOrganizations} = require("../controller/orgController.js");
const {protect} = require("../middleware/authMiddleware.js");

router.post("/create", protect, createOrganization);
router.post("/join", protect, joinOrganization);
router.get("/my-org", protect, myOrganizations);
router.post("/enter-org", protect, enterOrganizations);
router.post("/add-manager", protect, updateManagerRole);

module.exports = router;