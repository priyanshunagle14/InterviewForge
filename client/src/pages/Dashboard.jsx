const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";
import Button from "../components/Common/Button";
import Input from "../components/Common/Input";
import { useAuth } from "../context/AuthContext";

function SkeletonLoader() {
  return (
    <div className="space-y-3 p-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 bg-surface-raised/40 rounded-xl animate-shimmer" />
      ))}
    </div>
  );
}

function StatCard({ label, value, icon, tone = "interviewer", loading = false }) {
  return (
    <Card className="p-5 flex items-center justify-between group hover:border-border-hover transition-all">
      <div>
        <p className="text-xs font-medium text-dim uppercase tracking-wider mb-1.5">{label}</p>
        {loading ? (
          <div className="h-7 w-12 bg-surface-raised rounded animate-shimmer" />
        ) : (
          <p className="text-3xl font-bold text-white font-mono">{value}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${tone === "interviewer" ? "bg-interviewer/10 text-interviewer" : tone === "candidate" ? "bg-candidate/10 text-candidate" : "bg-emerald-500/10 text-emerald-400"}`}>
        {icon}
      </div>
    </Card>
  );
}

function InterviewRow({ interview, user, onRejoin }) {
  const isCompleted = interview.status === "ended";
  const isActive = interview.status === "active";

  const formattedDate = interview.startedAt
    ? new Date(interview.startedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  return (
    <div className="p-4 sm:px-6 hover:bg-surface-subtle/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-surface-raised border border-border/60 text-dim font-mono text-xs font-semibold">
          #{interview.roomId || "ROOM"}
        </div>
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-sm font-semibold text-white">
              {interview.title || interview.questionTitle || "Technical Assessment Session"}
            </h3>
            <Badge tone={isCompleted ? "dim" : isActive ? "candidate" : "interviewer"}>
              {isCompleted ? "Completed" : isActive ? "Active Now" : "Scheduled"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-dim">
            <span>Candidate: <strong className="text-white/80 font-normal">{interview.candidateName || "Awaiting candidate"}</strong></span>
            <span>•</span>
            <span>Created: {formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {isActive && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onRejoin(interview)}
          >
            Rejoin Room
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/auth?role=interviewer");
      return;
    }

    fetch(`${API_URL}/api/dashboard/interviewer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          navigate("/auth?role=interviewer");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setInterviews(data.interviews || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to sync interview records. Please retry connection.");
        setLoading(false);
      });
  }, [navigate, token, logout]);

  const stats = useMemo(() => ({
    total: interviews.length,
    active: interviews.filter((i) => i.status === "active").length,
    completed: interviews.filter((i) => i.status === "ended").length,
  }), [interviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.roomId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status === "active") ||
        (statusFilter === "ended" && item.status === "ended");

      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchQuery, statusFilter]);

  function handleRejoin(interview) {
    navigate(`/room/${interview.roomId}?role=interviewer&name=${encodeURIComponent(user?.name || "Interviewer")}`);
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interviewer Workspace</h1>
            <p className="text-dim text-sm mt-1">
              Welcome back, <span className="text-candidate font-medium">{user?.name}</span>. Manage your tech evaluations and live rooms.
            </p>
          </div>
          <Button
            onClick={() => navigate("/interviewer")}
            icon="+"
            size="md"
          >
            Create New Interview
          </Button>
        </div>

        {/* Overview Stat Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Sessions"
            value={stats.total}
            tone="interviewer"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Active Rooms"
            value={stats.active}
            tone="candidate"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M12 12h.01" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            tone="success"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Filter and Content Panel */}
        <Card className="overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-subtle/50">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Interview Records</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-raised text-dim border border-border/60">
                {filteredInterviews.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="w-full sm:w-64">
                <Input
                  size="sm"
                  placeholder="Search candidate or room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-lg border border-border/60 text-xs">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    statusFilter === "all" ? "bg-candidate/20 text-candidate" : "text-dim hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    statusFilter === "active" ? "bg-candidate/20 text-candidate" : "text-dim hover:text-white"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter("ended")}
                  className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                    statusFilter === "ended" ? "bg-candidate/20 text-candidate" : "text-dim hover:text-white"
                  }`}
                >
                  Ended
                </button>
              </div>
            </div>
          </div>

          {/* Loading Shimmer State */}
          {loading && <SkeletonLoader />}

          {/* Error Banner */}
          {error && (
            <div className="p-6">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3 text-rose-400">
                <div className="flex items-center gap-3">
                  <span className="text-base">⚠</span>
                  <p className="text-xs font-medium">{error}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredInterviews.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-border/60 flex items-center justify-center mx-auto text-dim text-xl mb-3">
                📋
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">No interviews found</h3>
              <p className="text-xs text-dim max-w-sm mx-auto mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "No records match your active search filter. Try clearing your query."
                  : "You haven't created any interview sessions yet. Launch your first live room to start evaluating candidates."}
              </p>
              {searchQuery || statusFilter !== "all" ? (
                <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => navigate("/interviewer")}>
                  Create First Interview
                </Button>
              )}
            </div>
          )}

          {/* Table List */}
          {!loading && !error && filteredInterviews.length > 0 && (
            <div className="divide-y divide-border/40">
              {filteredInterviews.map((interview) => (
                <InterviewRow
                  key={interview._id || interview.roomId}
                  interview={interview}
                  user={user}
                  onRejoin={handleRejoin}
                />
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}