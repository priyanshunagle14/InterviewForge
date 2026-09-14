const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import BackButton from "../components/Common/BackButton";
import Navbar from "../components/Navbar/Navbar";
import { useAuth } from "../context/AuthContext";

export default function InterviewerHome() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    async function handleCreateInterview() {
        if (!token) return;

        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/rooms`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) {
                logout();
                navigate("/auth?role=interviewer");
                return;
            }

            const data = await res.json();
            navigate(`/room/${data.roomId}?role=interviewer&name=${encodeURIComponent(user?.name || "Interviewer")}`);
        } catch {
            setError("Unable to initialize new room. Please ensure the backend server is reachable.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-bg bg-gradient-landing text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <Card className="w-full max-w-lg p-6 sm:p-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <BackButton />
                        <span className="text-xs font-mono text-dim tracking-wider uppercase">Live Room Setup</span>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            Launch Technical Interview
                        </h1>
                        <p className="text-dim text-xs sm:text-sm leading-relaxed">
                            Generate a real-time collaborative coding room with synchronized IDE, live execution, and structured scorecards.
                        </p>
                    </div>

                    <div className="mb-6 p-4 rounded-xl border border-border/80 bg-surface-subtle space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-interviewer/10 text-interviewer flex items-center justify-center font-bold text-xs flex-shrink-0">
                                1
                            </div>
                            <p className="text-dim">Room code & candidate share link auto-generated instantly</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-candidate/10 text-candidate flex items-center justify-center font-bold text-xs flex-shrink-0">
                                2
                            </div>
                            <p className="text-dim">Select coding questions or enter custom prompt in room</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                3
                            </div>
                            <p className="text-dim">Evaluate candidate with built-in rubric and notes</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button onClick={handleCreateInterview} loading={loading} className="w-full" size="lg">
                            Launch Live Interview Room
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
        </div>
    );
}