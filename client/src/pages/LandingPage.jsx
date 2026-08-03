import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";


import { useAuth } from "../context/AuthContext";

export default function Landing() {
    const navigate = useNavigate();
    const { user, isAuthenticated: isLoggedIn } = useAuth();

    function getPrimaryAction() {
        if (!isLoggedIn) return { label: "Start Interviewing", onClick: () => navigate("/auth?role=interviewer") };
        if (user?.role === "interviewer") return { label: "New Interview", onClick: () => navigate("/interviewer") };
        return { label: "Join Interview", onClick: () => navigate("/join") };
    }

    function getSecondaryAction() {
        if (!isLoggedIn) return { label: "Join as Candidate", onClick: () => navigate("/auth?role=candidate") };
        return { label: "Go to Dashboard", onClick: () => navigate(user?.role === "interviewer" ? "/dashboard" : "/candidate-dashboard") };
    }

    const primary = getPrimaryAction();
    const secondary = getSecondaryAction();

    return (
        <div className="min-h-screen bg-bg text-white font-sans selection:bg-candidate/30 selection:text-candidate relative overflow-hidden flex flex-col">

            {/* Ambient Background Radial Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-candidate/10 via-interviewer/5 to-transparent blur-3xl pointer-events-none -z-10" />

            <Navbar />

            <main className="max-w-5xl mx-auto px-5 py-12 flex-1 w-full flex flex-col justify-between">

                {/* HERO SECTION */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 space-y-6 animate-fade-in">

                    {/* Live Status Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs font-mono text-dim">
                        <span className="h-1.5 w-1.5 rounded-full bg-candidate animate-pulse" />
                        <span>Engineered for Technical Evaluations</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight text-white leading-[1.1]">
                        Run the interview. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-interviewer via-amber-200 to-candidate">
                            Not the tab-switching.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-dim text-sm md:text-base max-w-lg leading-relaxed">
                        One shared editor. Real-time code sync, granular roles, and session controls —
                        built specifically for technical interviews, not generic pair programming.
                    </p>

                    {/* CTA Actions */}
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <Button onClick={primary.onClick}>{primary.label}</Button>
                        <Button variant="secondary" onClick={secondary.onClick}>{secondary.label}</Button>
                    </div>
                </div>

                {/* IDE SIGNATURE DEMO */}
                <div className="max-w-3xl mx-auto w-full">
                    <CodeDemo />
                </div>

                {/* Features section */}
                <div id="features" className="py-20">
                    <div className="text-center mb-6">
                        <span className="font-mono text-xs text-candidate tracking-widest">BUILT FOR HIRING</span>
                        <h2 className="text-3xl mt-2 mb-3">Everything you need in one room</h2>
                        <p className="text-dim text-sm max-w-md mx-auto leading-relaxed">
                            No more screen sharing lag, no more copy-pasting code into Zoom.
                            InterviewForge gives both sides a real working environment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FeatureCard
                            icon="⚡"
                            title="Shared IDE"
                            desc="Both participants type in the same Monaco editor in real time — the same editor that powers VS Code."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="▶"
                            title="Code Execution"
                            desc="Run JavaScript, Python, C++, and Java instantly via a sandboxed execution engine. No setup required."
                            accent="interviewer"
                        />
                        <FeatureCard
                            icon="🔒"
                            title="Role Security"
                            desc="Interviewers control the session — lock the editor, mute chat, remove participants, and end the interview."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="📋"
                            title="Activity Logging"
                            desc="Every tab switch, paste attempt, and copy action is logged live in the interviewer's activity feed."
                            accent="interviewer"
                        />
                        <FeatureCard
                            icon="⏱"
                            title="Interview Timer"
                            desc="Start, pause, extend, or stop a synced countdown that both sides see simultaneously."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Post-Interview Scorecard"
                            desc="Auto-generated scorecard with interviewer notes and a downloadable transcript after every session."
                            accent="interviewer"
                        />
                    </div>
                </div>

            </main>

            <Footer />

        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <Card className="p-6 bg-surface hover:bg-surface-raised/80 transition-all border border-border group">
            <div className="h-8 w-8 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-mono text-xs mb-4 text-white group-hover:border-dim/40 transition">
                {icon}
            </div>
            <h3 className="font-mono font-bold text-sm text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-dim text-xs leading-relaxed">{desc}</p>
        </Card>
    );
}

function FeatureCard({ icon, title, desc, accent }) {
    return (
        <div
            className={`bg-surface border border-border rounded-xl p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-${accent === "candidate" ? "candidate" : "interviewer"}/5 hover:border-${accent === "candidate" ? "candidate" : "interviewer"}/40 transition-all duration-300 ease-out group`}
            style={{
                backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)",
            }}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 ${accent === "candidate" ? "bg-candidate/10 text-candidate" : "bg-interviewer/10 text-interviewer"}`}>
                <span className="transition-transform duration-300 group-hover:scale-110 inline-block">{icon}</span>
            </div>
            <h3 className="font-mono font-bold text-sm mb-2 group-hover:text-white transition-colors duration-300">{title}</h3>
            <p className="text-dim text-sm leading-relaxed group-hover:text-dim/90 transition-colors duration-300">{desc}</p>
        </div>
    );
}


function CodeDemo() {
    return (
        <Card className="font-mono text-xs overflow-hidden border border-border bg-surface shadow-2xl shadow-black/60 rounded-xl">
            {/* Simulated Browser Window Chrome Header */}
            <div className="px-4 py-2.5 bg-surface-raised border-b border-border text-dim flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-slate-300 font-medium">two_sum.py</span>
                    <span className="text-[10px] text-dim/60">● Python 3.11</span>
                </div>

                <div className="flex items-center gap-2">
                    <Badge tone="interviewer">Interviewer</Badge>
                    <Badge tone="candidate">Candidate</Badge>
                </div>
            </div>

            {/* Code Editor Body with Line Numbers */}
            <div className="p-4 bg-bg leading-relaxed flex font-mono text-dim overflow-x-auto">
                {/* Line Numbers */}
                <div className="w-8 select-none text-dim/40 text-right pr-3 space-y-1 text-[11px]">
                    <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                </div>

                {/* Code Canvas */}
                <div className="flex-1 space-y-1">
                    <div>
                        <span className="text-purple-400">def</span> <span className="text-candidate font-bold">twoSum</span>(nums, target):
                    </div>
                    <div className="pl-4">seen = {"{}"}</div>
                    <div className="pl-4">
                        <span className="text-purple-400">for</span> i, n <span className="text-purple-400">in</span> enumerate(nums):
                    </div>
                    <div className="pl-8">
                        complement = target - n
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-interviewer/10 text-interviewer border border-interviewer/20">
                            Alex (Interviewer)
                        </span>
                    </div>
                    <div className="pl-8 flex items-center gap-1">
                        <span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen: <span className="text-purple-400">return</span> [seen[complement], i]
                        <span className="text-candidate blink-cursor font-bold text-sm">█</span>
                    </div>
                </div>
            </div>

            {/* Mock Terminal Drawer */}
            <div className="px-4 py-2 bg-surface-raised/80 border-t border-border flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                    <span className="text-candidate font-bold">✓ Test Suite Passed</span>
                    <span className="text-dim">• Execution: 0.12ms</span>
                </div>
                <span className="text-dim text-[10px]">Memory: 14.2MB</span>
            </div>
        </Card>

    );
}