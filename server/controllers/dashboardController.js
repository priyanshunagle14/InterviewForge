const Interview = require("../models/Interview");

async function getInterviewerDashboard(req, res) {
    try {
        const interviews = await Interview.find({ interviewerUserId: req.user.userId })
            .sort({ startedAt: -1 }) // most recent first
            .limit(20);

        res.json({ interviews });
    } catch (err) {
        console.error("Dashboard error:", err.message);
        res.status(500).json({ error: "Failed to fetch dashboard" });
    }
}

async function getCandidateDashboard(req, res) {
    try {
        const interviews = await Interview.find({ candidateUserId: req.user.userId })
            .sort({ startedAt: -1 })
            .limit(20);

        res.json({ interviews });
    } catch (err) {
        console.error("Candidate dashboard error:", err.message);
        res.status(500).json({ error: "Failed to fetch dashboard" });
    }
}

module.exports = { getInterviewerDashboard, getCandidateDashboard };