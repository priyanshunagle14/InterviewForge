import { useState } from "react";
import Card from "../Common/Card";
import Button from "../Common/Button";

const CRITERIA = [
    { key: "communication", label: "Communication" },
    { key: "problemSolving", label: "Problem Solving" },
    { key: "codeQuality", label: "Code Quality" },
];

export default function ScorecardForm({ roomId, candidateName, questionTitle }) {
    const [ratings, setRatings] = useState({ communication: 3, problemSolving: 3, codeQuality: 3 });
    const [notes, setNotes] = useState("");
    const [recommendation, setRecommendation] = useState("Undecided");
    const [downloaded, setDownloaded] = useState(false);

    function handleDownload() {
        const lines = [
            `InterviewForge — Scorecard`,
            `Room: ${roomId}`,
            `Candidate: ${candidateName || "Unknown"}`,
            `Question: ${questionTitle || "None selected"}`,
            ``,
            ...CRITERIA.map((c) => `${c.label}: ${ratings[c.key]}/5`),
            ``,
            `Recommendation: ${recommendation}`,
            ``,
            `Notes:`,
            notes || "(none)",
        ];

        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `scorecard-${roomId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
    }

    return (
        <Card className="p-8 w-full max-w-lg">
            <h2 className="text-xl font-mono mb-1">Interview Scorecard</h2>
            <p className="text-dim text-sm mb-6">
                {candidateName ? `For ${candidateName}` : "Rate this interview"}
            </p>

            <div className="flex flex-col gap-5 mb-6">
                {CRITERIA.map((c) => (
                    <div key={c.key}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">{c.label}</span>
                            <span className="text-sm text-dim">{ratings[c.key]}/5</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={ratings[c.key]}
                            onChange={(e) => setRatings({ ...ratings, [c.key]: Number(e.target.value) })}
                            className="w-full accent-interviewer"
                        />
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <span className="text-sm block mb-1">Overall recommendation</span>
                <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-interviewer"
                >
                    <option>Strong Hire</option>
                    <option>Hire</option>
                    <option>Undecided</option>
                    <option>No Hire</option>
                    <option>Strong No Hire</option>
                </select>
            </div>

            <div className="mb-6">
                <span className="text-sm block mb-1">Notes</span>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Strengths, concerns, follow-up questions for next round…"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dim outline-none focus:border-interviewer resize-none"
                />
            </div>

            <Button onClick={handleDownload}>
                {downloaded ? "Downloaded ✓ — Download again" : "Download Scorecard"}
            </Button>
        </Card>
    );
}