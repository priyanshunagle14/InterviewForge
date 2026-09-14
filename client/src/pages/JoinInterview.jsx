import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
import BackButton from "../components/Common/BackButton";
import Badge from "../components/Common/Badge";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

export default function JoinInterview() {
    const [interviewId, setInterviewId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(
                `/auth?role=candidate&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
            );
            return;
        }

        const prefilled = searchParams.get("roomId");
        if (prefilled) {
            setInterviewId(prefilled);
        }
    }, [navigate, searchParams, isAuthenticated]);

    async function handleJoin() {
        if (!user) {
            setError("Please log in first.");
            return;
        }

        const cleanId = interviewId.trim();

        if (!cleanId) {
            setError("Please enter a valid room code.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${API_URL}/api/rooms/${cleanId}`
            );

            if (!res.ok) {
                setError("No active interview room found with that code.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            const canonicalId = data.roomId || cleanId;

            navigate(
                `/room/${canonicalId}?role=candidate&name=${encodeURIComponent(
                    user.name
                )}`
            );
        } catch {
            setError("Could not connect to live room server. Please verify backend status.");
            setLoading(false);
        }
    }

    if (user?.role === "interviewer") {
        return (
            <div className="min-h-screen bg-bg bg-gradient-landing flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 sm:p-8 animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 text-lg">
                        ⚠
                    </div>

                    <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                        Interviewer Account Active
                    </h2>

                    <p className="text-dim text-xs leading-relaxed mb-6">
                        You are currently signed in as an interviewer (<span className="text-white font-medium">{user.email}</span>). Candidate lobby links require candidate access.
                    </p>

                    <div className="space-y-3">
                        <Button
                            className="w-full"
                            onClick={() => navigate("/dashboard")}
                        >
                            Return to Interviewer Dashboard
                        </Button>

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                logout();
                                navigate(
                                    `/auth?role=candidate&mode=login&redirect=${encodeURIComponent(
                                        `/join${interviewId ? `?roomId=${interviewId}` : ""}`
                                    )}`
                                );
                            }}
                        >
                            Sign Out & Switch to Candidate Account
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg bg-gradient-landing flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 sm:p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <BackButton />
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-bold text-xs text-candidate">
                            IF
                        </div>
                        <span className="font-bold text-sm text-white tracking-tight">InterviewForge</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                        Join Interview Room
                    </h1>
                    <p className="text-dim text-xs leading-relaxed">
                        Enter the unique room code provided by your evaluator.
                    </p>
                </div>

                {user && (
                    <div className="mb-6 rounded-xl border border-border/80 bg-surface-subtle p-3.5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-dim font-medium uppercase tracking-wider mb-0.5">Entering session as</p>
                            <p className="text-xs font-semibold text-white">{user.name}</p>
                            <p className="text-[11px] text-dim">{user.email}</p>
                        </div>
                        <Badge tone="candidate">Candidate</Badge>
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Room Code"
                        placeholder="e.g. SS-x-Kw9k"
                        value={interviewId}
                        onChange={(e) => setInterviewId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                        className="font-mono text-center"
                    />

                    <Button onClick={handleJoin} loading={loading} className="w-full">
                        Join Interview Environment
                    </Button>


                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-400 text-xs font-medium">
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}