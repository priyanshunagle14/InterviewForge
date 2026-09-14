const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";
import Button from "../components/Common/Button";
import { useAuth } from "../context/AuthContext";

function SkeletonLoader() {
  return (
    <div className="space-y-3 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 bg-surface-raised/40 rounded-xl animate-shimmer" />
      ))}
    </div>
  );
}

function StatCard({ label, value, tone = "candidate" }) {
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-dim uppercase tracking-wider mb-1.5">{label}</p>
        <p className="text-3xl font-bold text-white font-mono">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${tone === "candidate" ? "bg-candidate/10 text-candidate" : "bg-emerald-500/10 text-emerald-400"}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </Card>
  );
}

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

        fetch(`${API_URL}/api/dashboard/candidate`, {
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
                if (data) setInterviews(data.interviews || []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load interview history");
                setLoading(false);
            });
    }, [navigate, token, logout]);

    const completedCount = interviews.filter((i) => i.status === "ended").length;

    return (
        <div className="min-h-screen bg-bg text-white">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Candidate Portal</h1>
                        <p className="text-dim text-sm mt-1">Welcome back, <span className="text-candidate font-medium">{user?.name}</span></p>
                    </div>
                    <Button onClick={() => navigate("/join")} icon="→">
                        Join Interview Room
                    </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <StatCard
                        label="Total Sessions Joined"
                        value={interviews.length}
                        tone="candidate"
                    />
                    <StatCard
                        label="Evaluations Completed"
                        value={completedCount}
                        tone="success"
                    />
                </div>

                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/80 bg-surface-subtle/50 flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Session History</h2>
                        <span className="text-xs text-dim">{interviews.length} total</span>
                    </div>

                    {loading && <SkeletonLoader />}

                    {error && (
                        <div className="p-6">
                            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
                                <span>⚠</span> {error}
                            </div>
                        </div>
                    )}

                    {!loading && !error && interviews.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-border/60 flex items-center justify-center mx-auto text-dim text-xl mb-3">
                                💻
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-1">No session history yet</h3>
                            <p className="text-xs text-dim max-w-sm mx-auto mb-6">
                                Enter your interviewer's 6-character room code to enter a live coding environment.
                            </p>
                            <Button onClick={() => navigate("/join")}>
                                Join Room Now
                            </Button>
                        </div>
                    )}

                    {!loading && !error && interviews.length > 0 && (
                        <div className="divide-y divide-border/40">
                            {interviews.map((interview) => (
                                <div
                                    key={interview._id || interview.roomId}
                                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-subtle/70 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60 font-mono text-xs font-semibold text-candidate">
                                            #{interview.roomId}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2.5 mb-1">
                                                <h3 className="text-sm font-semibold text-white">
                                                    {interview.questionTitle || "Live Coding Interview"}
                                                </h3>
                                                <Badge tone={interview.status === "ended" ? "dim" : "candidate"}>
                                                    {interview.status === "ended" ? "Completed" : "Active"}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dim">
                                                {interview.language && <span>Language: <strong className="text-white/80 font-normal uppercase">{interview.language}</strong></span>}
                                                <span>Joined: {new Date(interview.startedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {interview.status === "active" && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                navigate(
                                                    `/room/${interview.roomId}?role=candidate&name=${encodeURIComponent(user?.name || "Candidate")}`
                                                )
                                            }
                                        >
                                            Rejoin Room
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
}