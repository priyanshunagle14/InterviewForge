import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";
import Button from "../components/Common/Button";
import { useAuth } from "../context/AuthContext";

export default function CandidateDashboard() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    useEffect(() => {
        if (!token) {
            navigate(
                `/auth?role=candidate&redirect=${encodeURIComponent(
                    window.location.pathname + window.location.search
                )}`
            );
            return;
        }

        fetch("http://localhost:4000/api/dashboard/candidate", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (res.status === 401) {
                    logout();
                    navigate(
                        `/auth?role=candidate&redirect=${encodeURIComponent(
                            window.location.pathname + window.location.search
                        )}`
                    );
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setInterviews(data.interviews);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load dashboard");
                setLoading(false);
            });
    }, [navigate, token, logout]);

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-5xl mx-auto px-5 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl mb-1">My Interviews</h1>
                        <p className="text-dim text-sm">Welcome back, {user.name}</p>
                    </div>
                    <Button onClick={() => navigate("/join")}>
                        Join Interview
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatCard
                        label="Total Interviews"
                        value={interviews.length}
                    />
                    <StatCard
                        label="Completed"
                        value={interviews.filter((i) => i.status === "ended").length}
                    />
                </div>

                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <h2 className="font-mono text-sm">INTERVIEW HISTORY</h2>
                    </div>

                    {loading && (
                        <div className="px-6 py-8 text-dim text-sm">Loading…</div>
                    )}

                    {error && (
                        <div className="px-6 py-8 text-red-400 text-sm">{error}</div>
                    )}

                    {!loading && !error && interviews.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-dim text-sm mb-4">
                                You haven't joined any interviews yet.
                            </p>
                            <Button onClick={() => navigate("/join")}>
                                Join an Interview
                            </Button>
                        </div>
                    )}

                    {!loading && interviews.map((interview, i) => (
                        <div
                            key={interview._id}
                            className={`px-6 py-4 flex items-center justify-between ${i !== interviews.length - 1 ? "border-b border-border" : ""
                                }`}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-bold">
                                        {interview.roomId}
                                    </span>
                                    <Badge tone={interview.status === "ended" ? "candidate" : "interviewer"}>
                                        {interview.status === "ended" ? "Completed" : "Active"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-dim mt-1">
                                    {interview.questionTitle && (
                                        <span>Question: {interview.questionTitle}</span>
                                    )}
                                    {interview.language && (
                                        <span>Language: {interview.language}</span>
                                    )}
                                    <span>
                                        {new Date(interview.startedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {interview.status === "active" && (
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        navigate(
                                            `/room/${interview.roomId}?role=candidate&name=${encodeURIComponent(user.name)}`
                                        )
                                    }
                                >
                                    Rejoin
                                </Button>
                            )}
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <Card className="p-6">
            <p className="text-dim text-xs font-mono tracking-wide mb-1">{label}</p>
            <p className="text-3xl font-mono font-bold">{value}</p>
        </Card>
    );
}