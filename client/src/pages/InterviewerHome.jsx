const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import BackButton from "../components/Common/BackButton";
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
            navigate(`/room/${data.roomId}?role=interviewer&name=${encodeURIComponent(user.name)}`);
        } catch {
            setError("Could not reach the server. Is it running on :4000?");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-5">
            <Card className="w-full max-w-md p-8">
                <BackButton />
                <span className="font-mono text-sm text-dim">InterviewForge</span>
                <h1 className="text-3xl mt-2 mb-2">Start an interview</h1>
                <p className="text-dim text-sm mb-7 leading-relaxed">
                    We'll create a room and give you an invite link to send the candidate.
                </p>

                <div className="flex flex-col gap-3">
                    <Button onClick={handleCreateInterview} disabled={loading}>
                        {loading ? "Creating room…" : "Create Interview"}
                    </Button>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                </div>
            </Card>
        </div>
    );
}