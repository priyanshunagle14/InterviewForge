const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getInterviewHistory,
    deleteInterview,
    deleteSelectedInterviews,
} = require("../controllers/interviewController");

router.get("/history", authMiddleware, getInterviewHistory);

router.delete("/:id", authMiddleware, deleteInterview);

router.delete("/delete-selected", authMiddleware, deleteSelectedInterviews);

module.exports = router;