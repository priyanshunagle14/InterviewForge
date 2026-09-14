import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Button from "../components/Common/Button";
import Card from "../components/Common/Card";
import Badge from "../components/Common/Badge";
import InteractiveDemo from "../components/Landing/InteractiveDemo";

import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated: isLoggedIn } = useAuth();
    const [faqOpen, setFaqOpen] = useState(null);

    function getPrimaryAction() {
        if (!isLoggedIn) return { label: "Start Interviewing Free", onClick: () => navigate("/auth?role=interviewer") };
        if (user?.role === "interviewer") return { label: "+ New Interview Room", onClick: () => navigate("/interviewer") };
        return { label: "Join Interview Session", onClick: () => navigate("/join") };
    }

    function getSecondaryAction() {
        if (!isLoggedIn) return { label: "Join as Candidate", onClick: () => navigate("/auth?role=candidate") };
        return { label: "Open Dashboard", onClick: () => navigate(user?.role === "interviewer" ? "/dashboard" : "/candidate-dashboard") };
    }

    const primary = getPrimaryAction();
    const secondary = getSecondaryAction();

    function toggleFaq(index) {
        setFaqOpen(faqOpen === index ? null : index);
    }

    return (
        <div className="min-h-screen bg-bg text-white font-sans selection:bg-candidate/30 selection:text-candidate relative overflow-hidden flex flex-col">

            {/* CYBERPUNK AMBIENT BACKGROUND LIGHTS & GRID PATTERN */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-candidate/10 via-interviewer/5 to-transparent blur-3xl pointer-events-none -z-10" />
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10"
                style={{
                    backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
                    backgroundSize: "24px 24px"
                }}
            />

            <Navbar />

            <main className="max-w-6xl mx-auto px-5 py-12 flex-1 w-full flex flex-col justify-between space-y-24">

                {/* HERO SECTION */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in pt-4">

                    {/* Live Status Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-raised/90 border border-border/80 text-xs font-mono text-dim shadow-xl backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-candidate animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                        <span>Engineered for Technical Evaluations</span>
                        <span className="text-dim/40">•</span>
                        <span className="text-candidate font-semibold tracking-wide">v1.2 Studio Live</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-mono font-bold tracking-tight text-white leading-[1.08]">
                        Run the interview. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-interviewer via-amber-200 to-candidate">
                            Not the tab-switching.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-dim text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
                        One unified workspace. Real-time Monaco code sync, sandboxed multi-language execution, anti-cheat activity logs, and post-session AI scorecards.
                    </p>

                    {/* CTA Actions */}
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Button size="lg" onClick={primary.onClick} className="shadow-lg shadow-candidate/10">
                            {primary.label}
                        </Button>
                        <Button variant="secondary" size="lg" onClick={secondary.onClick}>
                            {secondary.label}
                        </Button>
                    </div>

                    {/* PLATFORM STATS STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 border-t border-border/40">
                        <StatCard number="< 45ms" label="Real-time Cursor Sync" accent="candidate" />
                        <StatCard number="4 Languages" label="JS, Python, C++, Java" accent="interviewer" />
                        <StatCard number="100% Sandboxed" label="Zero-setup Execution" accent="candidate" />
                        <StatCard number="Automated" label="Anti-Cheat & Scorecards" accent="interviewer" />
                    </div>
                </div>

                {/* INTERACTIVE STUDIO DEMO SHOWCASE */}
                <div className="w-full">
                    <div className="text-center mb-6 space-y-1">
                        <span className="font-mono text-[11px] text-dim/70 uppercase tracking-widest">INTERACTIVE ENVIRONMENT PREVIEW</span>
                        <h3 className="text-xl font-mono font-bold text-white">Experience the Live Interview Room</h3>
                    </div>
                    <InteractiveDemo />
                </div>

                {/* HOW IT WORKS SECTION */}
                <div className="space-y-10">
                    <div className="text-center space-y-2">
                        <span className="font-mono text-xs text-candidate tracking-widest uppercase bg-candidate/10 border border-candidate/20 px-3 py-1 rounded-full">
                            EFFORTLESS WORKFLOW
                        </span>
                        <h2 className="text-3xl font-mono font-bold text-white">How InterviewForge Works</h2>
                        <p className="text-dim text-sm max-w-md mx-auto">
                            From room setup to final hiring evaluation in 3 simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StepCard
                            step="01"
                            title="Create & Configure Room"
                            desc="Interviewer initializes a room, selects target language, seeds interview questions, and sets session countdown timer."
                            tag="Interviewer Control"
                        />
                        <StepCard
                            step="02"
                            title="Candidate Log In & Join"
                            desc="Candidates log in with their candidate account and enter the unique Room ID or click an invite link to enter the live room."
                            tag="Secure Access"
                        />
                        <StepCard
                            step="03"
                            title="Collaborate & Score"
                            desc="Write, run, and debug code together in real-time while monitoring live activity feed. Generate full scorecard upon completion."
                            tag="Instant Scorecard"
                        />
                    </div>
                </div>

                {/* FEATURES GRID SECTION */}
                <div id="features" className="space-y-10">
                    <div className="text-center space-y-2">
                        <span className="font-mono text-xs text-candidate tracking-widest uppercase bg-candidate/10 border border-candidate/20 px-3 py-1 rounded-full">
                            BUILT FOR TECHNICAL HIRING
                        </span>
                        <h2 className="text-3xl font-mono font-bold text-white">Everything you need in one room</h2>
                        <p className="text-dim text-sm max-w-md mx-auto leading-relaxed">
                            No more screen sharing lag, no more copy-pasting code into Zoom.
                            InterviewForge gives both sides a real working environment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FeatureCard
                            icon="⚡"
                            title="Shared Monaco IDE"
                            desc="Both participants type in the exact Monaco editor that powers VS Code — complete with syntax highlighting and indentation."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="▶"
                            title="Multi-Language Execution"
                            desc="Run JavaScript, Python, C++, and Java code safely inside an isolated client-side execution sandbox."
                            accent="interviewer"
                        />
                        <FeatureCard
                            icon="🔒"
                            title="Session Security Controls"
                            desc="Interviewers can lock editor input, mute chat, manage participant focus, and end sessions on demand."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="📋"
                            title="Live Anti-Cheat Logging"
                            desc="Every tab switch, window blur, and external paste attempt is recorded in real time with timestamped flags."
                            accent="interviewer"
                        />
                        <FeatureCard
                            icon="⏱"
                            title="Synchronized Timer"
                            desc="Start, pause, or extend a synced countdown timer that keeps candidate and interviewer on exact pace."
                            accent="candidate"
                        />
                        <FeatureCard
                            icon="📊"
                            title="Post-Interview Scorecards"
                            desc="Auto-generated evaluation scorecard with interviewer notes, category performance bars, and exportable transcript."
                            accent="interviewer"
                        />
                    </div>
                </div>

                {/* COMPARISON TABLE */}
                <div className="space-y-8 p-8 bg-surface border border-border/80 rounded-2xl shadow-xl">
                    <div className="text-center space-y-2">
                        <span className="font-mono text-xs text-interviewer tracking-widest uppercase bg-interviewer/10 border border-interviewer/20 px-3 py-1 rounded-full">
                            WHY INTERVIEWFORGE
                        </span>
                        <h2 className="text-2xl font-mono font-bold text-white">Traditional Setup vs InterviewForge</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-border text-dim uppercase text-[10px] tracking-wider">
                                    <th className="py-3 px-4">Feature</th>
                                    <th className="py-3 px-4 text-dim/60">Zoom + Google Docs</th>
                                    <th className="py-3 px-4 text-dim/60">Generic IDEs</th>
                                    <th className="py-3 px-4 text-candidate font-bold bg-candidate/5 rounded-t">InterviewForge Studio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40 text-dim">
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white">Real-Time Code Sync</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ Text lag & plain text</td>
                                    <td className="py-3.5 px-4 text-amber-400">⚠️ Laggy cursor sync</td>
                                    <td className="py-3.5 px-4 text-candidate font-bold bg-candidate/5">✓ Monaco VS Code Engine</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white">Code Execution Sandbox</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ None</td>
                                    <td className="py-3.5 px-4 text-amber-400">⚠️ External setup needed</td>
                                    <td className="py-3.5 px-4 text-candidate font-bold bg-candidate/5">✓ 4 Sandboxed Languages</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white">Anti-Cheat Activity Audit</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ Blind to tab switching</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ No paste auditing</td>
                                    <td className="py-3.5 px-4 text-candidate font-bold bg-candidate/5">✓ Live Event Feed & Alerts</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white">Structured Scorecards</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ Manual notes in Slack</td>
                                    <td className="py-3.5 px-4 text-rose-400">❌ Manual entry</td>
                                    <td className="py-3.5 px-4 text-candidate font-bold bg-candidate/5 rounded-b">✓ Auto-Generated Summary</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ ACCORDION SECTION */}
                <div className="space-y-8 max-w-3xl mx-auto w-full">
                    <div className="text-center space-y-2">
                        <span className="font-mono text-xs text-candidate tracking-widest uppercase">GOT QUESTIONS?</span>
                        <h2 className="text-3xl font-mono font-bold text-white">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-3">
                        <FaqItem
                            isOpen={faqOpen === 0}
                            onToggle={() => toggleFaq(0)}
                            question="How do candidates join an interview session?"
                            answer="Candidates sign in with their candidate account and enter the unique Room ID or click an invite link provided by their interviewer to access their personalized interview workspace."
                        />
                        <FaqItem
                            isOpen={faqOpen === 1}
                            onToggle={() => toggleFaq(1)}
                            question="What programming languages are currently supported?"
                            answer="InterviewForge supports JavaScript (Node.js ES6), Python 3.11, C++ 20, and Java 17 with instant sandboxed execution."
                        />
                        <FaqItem
                            isOpen={faqOpen === 2}
                            onToggle={() => toggleFaq(2)}
                            question="How does the live Anti-Cheat monitoring work?"
                            answer="The room tracks browser window focus loss, tab switching events, and large clipboard pastes. All events are streamed live to the interviewer's control panel without blocking candidate workflow."
                        />
                        <FaqItem
                            isOpen={faqOpen === 3}
                            onToggle={() => toggleFaq(3)}
                            question="Can interviewers control candidate editor state?"
                            answer="Yes. Interviewers have administrative privileges to lock/unlock the editor, manage session timers, clear code, and toggle chat permissions at any point."
                        />
                    </div>
                </div>

                {/* BOTTOM CTA BANNER */}
                <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-surface-raised via-surface to-surface-raised border border-border/80 text-center space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-candidate/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-interviewer/10 blur-3xl rounded-full pointer-events-none" />

                    <h2 className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                        Ready to elevate your technical hiring process?
                    </h2>
                    <p className="text-dim text-sm max-w-xl mx-auto leading-relaxed">
                        Start hosting real-time coding interviews in minutes with zero setup friction.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Button size="lg" onClick={primary.onClick} className="shadow-xl">
                            {primary.label}
                        </Button>
                    </div>
                </div>

            </main>

            <Footer />

        </div>
    );
}

function StatCard({ number, label, accent }) {
    return (
        <div className="p-4 rounded-xl bg-surface/60 border border-border/60 text-center space-y-1 hover:border-border transition">
            <div className={`text-xl sm:text-2xl font-mono font-bold ${accent === "candidate" ? "text-candidate" : "text-interviewer"}`}>
                {number}
            </div>
            <div className="text-[11px] text-dim font-mono">{label}</div>
        </div>
    );
}

function StepCard({ step, title, desc, tag }) {
    return (
        <Card className="p-6 bg-surface border border-border/80 hover:border-candidate/40 transition-all duration-300 space-y-3 group">
            <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-candidate/40 group-hover:text-candidate transition-colors">
                    {step}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised text-dim border border-border">
                    {tag}
                </span>
            </div>
            <h3 className="font-mono font-bold text-base text-white tracking-tight">{title}</h3>
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

function FaqItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className="border border-border/80 rounded-xl bg-surface overflow-hidden transition-colors">
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 text-left font-mono text-xs sm:text-sm font-semibold text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-raised/40 transition"
            >
                <span>{question}</span>
                <span className="text-candidate font-mono text-base font-bold">
                    {isOpen ? "−" : "+"}
                </span>
            </button>
            {isOpen && (
                <div className="px-5 pb-4 text-xs text-dim leading-relaxed font-sans animate-fade-in border-t border-border/40 pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
}