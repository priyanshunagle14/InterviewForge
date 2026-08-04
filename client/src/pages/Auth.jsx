
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import BackButton from "../components/Common/BackButton";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

export default function Auth() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    const [mode, setMode] = useState("login");
    const [role, setRole] = useState("interviewer");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const modeParam = searchParams.get("mode");
        const roleParam = searchParams.get("role");

        if (modeParam === "login" || modeParam === "signup") {
            setMode(modeParam);
        }

        if (roleParam === "candidate" || roleParam === "interviewer") {
            setRole(roleParam);
        }
    }, [searchParams]);

    async function handleSubmit() {
        setError("");

        if (
            !email.trim() ||
            !password.trim() ||
            (mode === "signup" && !name.trim())
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const endpoint =
                mode === "signup"
                    ? "/api/auth/signup"
                    : "/api/auth/login";

            const body =
                mode === "signup"
                    ? {
                        name: name.trim(),
                        email: email.trim(),
                        password,
                        role,
                    }
                    : {
                        email: email.trim(),
                        password,
                    };

            const res = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Authentication failed.");
                setLoading(false);
                return;
            }

            login(data.user, data.token);

            // If the user was forced to login from an interview invite,
            // send them back there.
            const redirect = searchParams.get("redirect");

            if (redirect) {
                navigate(redirect, { replace: true });
            } else {
                // Otherwise always go Home.
                navigate("/", { replace: true });
            }
        } catch {
            setError("Could not connect to the server.");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-landing">
            <Card className="w-full max-w-md p-8">
                <BackButton />

                <div className="mb-8">
                    <span className="font-mono text-sm text-dim">
                        InterviewForge
                    </span>

                    <h1 className="text-3xl mt-2">
                        {mode === "login"
                            ? "Welcome back"
                            : "Create your account"}
                    </h1>

                    <p className="text-dim text-sm mt-2">
                        {mode === "login"
                            ? "Sign in to continue your interviews."
                            : "Create an account to manage your interviews."}
                    </p>
                </div>

                <div className="space-y-4">

                    {mode === "signup" && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-white placeholder:text-dim outline-none focus:border-interviewer transition"
                            />

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-white outline-none focus:border-interviewer transition"
                            >
                                <option value="interviewer">
                                    Interviewer
                                </option>

                                <option value="candidate">
                                    Candidate
                                </option>
                            </select>
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-white placeholder:text-dim outline-none focus:border-interviewer transition"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSubmit()
                        }
                        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-white placeholder:text-dim outline-none focus:border-interviewer transition"
                    />

                    {error && (
                        <div className="text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : mode === "login"
                                ? "Log In"
                                : "Create Account"}
                    </Button>

                    <button
                        onClick={() =>
                            setMode(
                                mode === "login"
                                    ? "signup"
                                    : "login"
                            )
                        }
                        className="w-full text-center text-sm text-dim hover:text-white transition"
                    >
                        {mode === "login"
                            ? "Don't have an account? Sign up"
                            : "Already have an account? Log in"}
                    </button>
                </div>
            </Card>
        </div>
    );
}