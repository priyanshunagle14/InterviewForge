
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Input from "../components/Common/Input";
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
    const [fieldErrors, setFieldErrors] = useState({});
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

    const validateForm = () => {
        const errors = {};

        if (mode === "signup" && !name.trim()) {
            errors.name = "Full name is required";
        }

        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!password.trim()) {
            errors.password = "Password is required";
        } else if (mode === "signup" && password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    async function handleSubmit() {
        setError("");

        if (!validateForm()) {
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

            const redirect = searchParams.get("redirect");

            if (redirect) {
                navigate(redirect, { replace: true });
            } else {
                navigate(data.user.role === "candidate" ? "/candidate-dashboard" : "/dashboard", { replace: true });
            }
        } catch {
            setError("Could not connect to the server. Please try again.");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-bg bg-gradient-landing flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md animate-fade-in">
                <div className="mb-6 flex items-center justify-between">
                    <BackButton />
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-bold text-xs text-candidate">
                            IF
                        </div>
                        <span className="font-bold text-sm text-white tracking-tight">InterviewForge</span>
                    </div>
                </div>

                <Card className="p-6 sm:p-8">
                    {/* Segmented Auth Mode Switcher */}
                    <div className="grid grid-cols-2 p-1 bg-surface-subtle border border-border/80 rounded-xl mb-6 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => { setMode("login"); setError(""); setFieldErrors({}); }}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                mode === "login"
                                    ? "bg-surface-raised text-white shadow-sm font-semibold border border-border/60"
                                    : "text-dim hover:text-white"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("signup"); setError(""); setFieldErrors({}); }}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${
                                mode === "signup"
                                    ? "bg-surface-raised text-white shadow-sm font-semibold border border-border/60"
                                    : "text-dim hover:text-white"
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            {mode === "login" ? "Welcome back" : "Get started with InterviewForge"}
                        </h1>
                        <p className="text-dim text-xs leading-relaxed">
                            {mode === "login"
                                ? "Sign in to access your technical interview workspace."
                                : "Conduct live coding interviews & candidate evaluations seamlessly."}
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {mode === "signup" && (
                            <>
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="e.g. Alex Morgan"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={fieldErrors.name}
                                    required
                                />

                                <div>
                                    <label className="block text-xs font-medium text-dim uppercase tracking-wider mb-1.5">
                                        Account Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRole("interviewer")}
                                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                                                role === "interviewer"
                                                    ? "bg-interviewer/10 border-interviewer/50 text-interviewer font-semibold"
                                                    : "bg-surface-subtle border-border/80 text-dim hover:text-white"
                                            }`}
                                        >
                                            <div className="text-xs">Interviewer</div>
                                            <div className="text-[10px] text-dim font-normal mt-0.5">Create & run rooms</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("candidate")}
                                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                                                role === "candidate"
                                                    ? "bg-candidate/10 border-candidate/50 text-candidate font-semibold"
                                                    : "bg-surface-subtle border-border/80 text-dim hover:text-white"
                                            }`}
                                        >
                                            <div className="text-xs">Candidate</div>
                                            <div className="text-[10px] text-dim font-normal mt-0.5">Join live coding</div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={fieldErrors.email}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={fieldErrors.password}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2.5 text-rose-400 text-xs font-medium">
                                <span>⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full mt-2"
                        >
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}