const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/candidate", requireAuth, dashboardController.getCandidateDashboard);
router.get("/interviewer", requireAuth, dashboardController.getInterviewerDashboard);

module.exports = router;