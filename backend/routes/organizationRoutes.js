const express = require("express");
const router = express.Router();

const {createOrganization, joinOrganization, addManagerORG} = require("../controller/orgController.js");
const {protect} = require("../middleware/authMiddleware.js");

router.post("/create", protect, createOrganization);
router.post("/join", protect, joinOrganization);
router.post("/add-manager", protect, addManagerORG);

module.exports = router;