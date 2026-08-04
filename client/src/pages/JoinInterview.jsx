import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import BackButton from "../components/Common/BackButton";
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

        if (!interviewId.trim()) {
            setError("Enter the interview ID");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch(
                `${API_URL}/api/rooms/${interviewId.trim()}`
            );

            if (!res.ok) {
                setError("No interview found with that ID");
                setLoading(false);
                return;
            }

            navigate(
                `/room/${interviewId.trim()}?role=candidate&name=${encodeURIComponent(
                    user.name
                )}`
            );
        } catch {
            setError("Could not reach the server. Is it running on :4000?");
            setLoading(false);
        }
    }
    if (user?.role === "interviewer") {
        return (
            <div className="min-h-screen flex items-center justify-center px-5">
                <Card className="max-w-md w-full p-8">
                    <h2 className="text-2xl font-mono mb-3">
                        Wrong Account
                    </h2>

                    <p className="text-dim mb-6">
                        You're currently signed in as an interviewer.
                        Interview links are meant for candidate accounts.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => navigate("/interviewer")}
                        >
                            Go to Dashboard
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                logout();

                                navigate(
                                    `/auth?role=candidate&mode=login&redirect=${encodeURIComponent(
                                        `/join?roomId=${interviewId}`
                                    )}`
                                );
                            }}
                        >
                            Log Out & Continue
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-5">
            <Card className="w-full max-w-md p-8">
                <BackButton />

                <span className="font-mono text-sm text-dim">
                    InterviewForge
                </span>

                <h1 className="text-3xl mt-2 mb-2">
                    Join your interview
                </h1>

                <p className="text-dim text-sm mb-6">
                    Enter the interview ID shared by your interviewer.
                </p>

                {user && (
                    <div className="mb-5 rounded-lg border border-border bg-bg px-4 py-3">
                        <p className="text-xs text-dim mb-1">
                            Signed in as
                        </p>
                        <p className="font-semibold text-white">
                            {user.name}
                        </p>
                        <p className="text-xs text-dim">
                            {user.email}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <input
                        placeholder="Interview ID"
                        value={interviewId}
                        onChange={(e) => setInterviewId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                        className="bg-bg border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-dim outline-none focus:border-interviewer transition-colors"
                    />

                    <Button onClick={handleJoin} disabled={loading}>
                        {loading ? "Joining..." : "Join Interview"}
                    </Button>

                    {error && (
                        <p className="text-red-400 text-sm">
                            {error}
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}