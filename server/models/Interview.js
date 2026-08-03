const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    interviewerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    candidateUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    candidateName: { type: String, default: null },
    questionTitle: { type: String, default: null },
    finalCode: { type: String, default: "" },
    language: { type: String, default: "javascript" },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "ended"], default: "active" },
});

module.exports = mongoose.model("Interview", interviewSchema);