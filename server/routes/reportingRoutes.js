const express = require("express");
const router = express.Router();
const { generateCombinedReport } = require("../controllers/reportingController");

// generate combined report
router.get("/combined", generateCombinedReport);

module.exports = router;
