const Interview = require("../models/Interview");

/*
    GET /api/interviews/history

    Interviewer:
        Returns interviews created by them.

    Candidate:
        Returns interviews they attended.
*/
async function getInterviewHistory(req, res) {
    try {
        let interviews = [];

        if (req.user.role === "interviewer") {
            interviews = await Interview.find({
                interviewerUserId: req.user.userId,
            }).sort({ startedAt: -1 });
        } else {
            interviews = await Interview.find({
                candidateUserId: req.user.userId,
            }).sort({ startedAt: -1 });
        }

        res.json(interviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch interview history",
        });
    }
}

/*
    DELETE /api/interviews/:id
*/
async function deleteInterview(req, res) {
    try {
        const filter =
            req.user.role === "interviewer"
                ? {
                    _id: req.params.id,
                    interviewerUserId: req.user.userId,
                }
                : {
                    _id: req.params.id,
                    candidateUserId: req.user.userId,
                };

        const deleted = await Interview.findOneAndDelete(filter);

        if (!deleted) {
            return res.status(404).json({
                error: "Interview not found",
            });
        }

        res.json({
            message: "Interview deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to delete interview",
        });
    }
}

/*
    DELETE /api/interviews/delete-selected
*/
async function deleteSelectedInterviews(req, res) {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                error: "No interview ids provided",
            });
        }

        const filter =
            req.user.role === "interviewer"
                ? {
                    _id: { $in: ids },
                    interviewerUserId: req.user.userId,
                }
                : {
                    _id: { $in: ids },
                    candidateUserId: req.user.userId,
                };

        const result = await Interview.deleteMany(filter);

        res.json({
            message: `${result.deletedCount} interview(s) deleted`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to delete interviews",
        });
    }
}

module.exports = {
    getInterviewHistory,
    deleteInterview,
    deleteSelectedInterviews,
};