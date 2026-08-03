const express = require("express");
const router = express.Router();
const { runCode, runTests } = require("../controllers/executionController");

router.post("/", runCode);
router.post("/tests", runTests);

module.exports = router;