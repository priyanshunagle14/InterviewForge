import React, { useState, useEffect } from "react";
import Card from "../Common/Card";
import Badge from "../Common/Badge";

const CODE_SAMPLES = {
    python: {
        name: "two_sum.py",
        language: "Python 3.11",
        code: [
            { line: 1, text: <><span className="text-purple-400">def</span> <span className="text-candidate font-bold">twoSum</span>(nums, target):</> },
            { line: 2, text: <><span className="pl-4 text-dim">seen = &#123;&#125;</span></> },
            { line: 3, text: <><span className="pl-4 text-purple-400">for</span> <span className="text-dim">i, n</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">enumerate</span>(nums):</> },
            { line: 4, text: <><span className="pl-8 text-dim">complement = target - n</span> <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-interviewer/20 text-interviewer border border-interviewer/30 animate-pulse">Alex (Interviewer)</span></> },
            { line: 5, text: <><span className="pl-8 text-purple-400">if</span> <span className="text-dim">complement</span> <span className="text-purple-400">in</span> <span className="text-dim">seen:</span> <span className="text-purple-400">return</span> <span className="text-dim">[seen[complement], i]</span></> },
            { line: 6, text: <><span className="pl-8 text-dim">seen[n] = i</span> <span className="text-candidate inline-block animate-pulse font-bold text-sm">█</span></> }
        ],
        testOutput: {
            status: "PASSED",
            time: "0.14ms",
            memory: "14.2 MB",
            cases: "3/3 Test Cases Passed",
            details: "Input: nums = [2,7,11,15], target = 9 → Output: [0, 1]"
        }
    },
    javascript: {
        name: "valid_parentheses.js",
        language: "JavaScript ES6",
        code: [
            { line: 1, text: <><span className="text-purple-400">function</span> <span className="text-candidate font-bold">isValid</span>(s) &#123;</> },
            { line: 2, text: <><span className="pl-4 text-purple-400">const</span> <span className="text-dim">stack = [];</span></> },
            { line: 3, text: <><span className="pl-4 text-purple-400">const</span> <span className="text-dim">map = &#123; <span className="text-emerald-300">'('</span>: <span className="text-emerald-300">')'</span>, <span className="text-emerald-300">'&#123;'</span>: <span className="text-emerald-300">'&#125;'</span>, <span className="text-emerald-300">'['</span>: <span className="text-emerald-300">']'</span> &#125;;</span></> },
            { line: 4, text: <><span className="pl-4 text-purple-400">for</span> (<span className="text-purple-400">let</span> <span className="text-dim">char</span> <span className="text-purple-400">of</span> <span className="text-dim">s) &#123;</span> <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-candidate/20 text-candidate border border-candidate/30">Jordan (Candidate)</span></> },
            { line: 5, text: <><span className="pl-8 text-purple-400">if</span> (<span className="text-dim">map[char]) stack.push(map[char]);</span></> },
            { line: 6, text: <><span className="pl-8 text-purple-400">else if</span> (<span className="text-dim">stack.pop() !== char)</span> <span className="text-purple-400">return</span> <span className="text-rose-400">false</span>;</> },
            { line: 7, text: <><span className="pl-4 text-dim">&#125;</span> <span className="text-purple-400">return</span> <span className="text-dim">stack.length === 0;</span> <span className="text-candidate inline-block animate-pulse font-bold text-sm">█</span></> }
        ],
        testOutput: {
            status: "PASSED",
            time: "0.08ms",
            memory: "11.6 MB",
            cases: "4/4 Test Cases Passed",
            details: 'Input: s = "()[]{}" → Output: true'
        }
    },
    cpp: {
        name: "max_subarray.cpp",
        language: "C++ 20",
        code: [
            { line: 1, text: <><span className="text-purple-400">int</span> <span className="text-candidate font-bold">maxSubArray</span>(vector&lt;<span className="text-purple-400">int</span>&gt;&amp; nums) &#123;</> },
            { line: 2, text: <><span className="pl-4 text-purple-400">int</span> <span className="text-dim">maxSum = nums[0], currentSum = nums[0];</span></> },
            { line: 3, text: <><span className="pl-4 text-purple-400">for</span> (<span className="text-purple-400">size_t</span> <span className="text-dim">i = 1; i &lt; nums.size(); ++i) &#123;</span></> },
            { line: 4, text: <><span className="pl-8 text-dim">currentSum = max(nums[i], currentSum + nums[i]);</span></> },
            { line: 5, text: <><span className="pl-8 text-dim">maxSum = max(maxSum, currentSum);</span> <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-interviewer/20 text-interviewer border border-interviewer/30">Alex (Interviewer)</span></> },
            { line: 6, text: <><span className="pl-4 text-dim">&#125;</span> <span className="text-purple-400">return</span> <span className="text-dim">maxSum;</span> <span className="text-candidate inline-block animate-pulse font-bold text-sm">█</span></> }
        ],
        testOutput: {
            status: "PASSED",
            time: "0.03ms",
            memory: "8.4 MB",
            cases: "5/5 Test Cases Passed",
            details: "Input: nums = [-2,1,-3,4,-1,2,1,-5,4] → Output: 6"
        }
    }
};

const INITIAL_LOGS = [
    { id: 1, time: "10:14:02", type: "warning", tag: "TAB SWITCH", msg: "Candidate switched browser tab", detail: "Focus lost for 4.2 seconds", flagged: true },
    { id: 2, time: "10:15:30", type: "info", tag: "PASTE EVENT", msg: "Large code block pasted", detail: "342 chars inserted at L4:C12", flagged: false },
    { id: 3, time: "10:18:10", type: "action", tag: "EDITOR LOCK", msg: "Interviewer locked candidate editor", detail: "Mode set to Read-Only", flagged: false },
    { id: 4, time: "10:20:05", type: "action", tag: "TIMER +10M", msg: "Session timer extended by 10 minutes", detail: "New expiry: 11:00 AM", flagged: false },
    { id: 5, time: "10:22:15", type: "success", tag: "EXECUTION", msg: "Code executed via Pyodide Sandbox", detail: "Result: 5/5 tests passed (0.12ms)", flagged: false },
];

export default function InteractiveDemo() {
    const [activeTab, setActiveTab] = useState("editor"); // "editor" | "anticheat" | "scorecard"
    const [selectedLang, setSelectedLang] = useState("python");
    const [isRunningCode, setIsRunningCode] = useState(false);
    const [hasRun, setHasRun] = useState(false);

    // Anti-cheat simulation state
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [logFilter, setLogFilter] = useState("all");

    // Add new log dynamically
    function addSimulatedLog() {
        const sampleLogs = [
            { type: "warning", tag: "TAB SWITCH", msg: "Candidate unfocused interview window", detail: "Away for 2.8s", flagged: true },
            { type: "info", tag: "COPY EVENT", msg: "Code snippet copied to clipboard", detail: "24 chars copied", flagged: false },
            { type: "success", tag: "TEST PASSED", msg: "Custom test case validated", detail: "Output matched expected output", flagged: false }
        ];
        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

        setLogs(prev => [
            { id: Date.now(), time: timeStr, ...randomLog },
            ...prev
        ]);
    }

    function handleRunCode() {
        setIsRunningCode(true);
        setHasRun(false);
        setTimeout(() => {
            setIsRunningCode(false);
            setHasRun(true);
        }, 600);
    }

    const currentSample = CODE_SAMPLES[selectedLang];

    const filteredLogs = logs.filter(l => {
        if (logFilter === "warnings") return l.flagged || l.type === "warning";
        if (logFilter === "actions") return l.type === "action" || l.type === "success";
        return true;
    });

    return (
        <Card className="font-mono text-xs overflow-hidden border border-border/80 bg-surface shadow-2xl shadow-black/80 rounded-xl transition-all duration-300">
            
            {/* TOP CONTAINER HEADER WITH TABS */}
            <div className="bg-surface-raised border-b border-border text-dim">
                
                {/* WINDOW CONTROLS & MAIN TAB NAVIGATION */}
                <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-border/60">
                    
                    {/* Left: Window Dots & Title */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-slate-300 font-bold tracking-wide text-xs hidden sm:inline">
                            InterviewForge Studio
                        </span>
                    </div>

                    {/* Center: Interactive Feature Showcase Tabs */}
                    <div className="flex items-center p-1 bg-bg/80 border border-border/80 rounded-lg">
                        <button
                            onClick={() => setActiveTab("editor")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                activeTab === "editor"
                                    ? "bg-candidate/15 text-candidate border border-candidate/30 shadow-sm"
                                    : "text-dim hover:text-white"
                            }`}
                        >
                            <span>💻</span>
                            <span>Shared IDE</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("anticheat")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer relative ${
                                activeTab === "anticheat"
                                    ? "bg-interviewer/15 text-interviewer border border-interviewer/30 shadow-sm"
                                    : "text-dim hover:text-white"
                            }`}
                        >
                            <span>🛡️</span>
                            <span>Activity & Anti-Cheat</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
                        </button>

                        <button
                            onClick={() => setActiveTab("scorecard")}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                                activeTab === "scorecard"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                                    : "text-dim hover:text-white"
                            }`}
                        >
                            <span>📊</span>
                            <span>Scorecard</span>
                        </button>
                    </div>

                    {/* Right: Live Session Status Badges */}
                    <div className="hidden lg:flex items-center gap-2">
                        <Badge tone="interviewer">Interviewer Live</Badge>
                        <Badge tone="candidate">Candidate Connected</Badge>
                    </div>
                </div>

                {/* SECONDARY TOOLBAR - TAB SPECIFIC CONTROLS */}
                {activeTab === "editor" && (
                    <div className="px-4 py-2 bg-bg/40 flex items-center justify-between gap-3 text-[11px] overflow-x-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-dim/60 font-semibold uppercase tracking-wider text-[10px]">Language:</span>
                            {Object.keys(CODE_SAMPLES).map((langKey) => (
                                <button
                                    key={langKey}
                                    onClick={() => { setSelectedLang(langKey); setHasRun(false); }}
                                    className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                                        selectedLang === langKey
                                            ? "bg-surface-raised text-white font-medium border border-border"
                                            : "text-dim hover:text-white"
                                    }`}
                                >
                                    {CODE_SAMPLES[langKey].language}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleRunCode}
                            disabled={isRunningCode}
                            className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                            {isRunningCode ? (
                                <>
                                    <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <span>▶</span>
                                    <span>Run Code</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {activeTab === "anticheat" && (
                    <div className="px-4 py-2 bg-bg/40 flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2">
                            <span className="text-dim/60 font-semibold uppercase tracking-wider text-[10px]">Filter:</span>
                            <button
                                onClick={() => setLogFilter("all")}
                                className={`px-2 py-0.5 rounded transition ${logFilter === "all" ? "bg-surface-raised text-white" : "text-dim hover:text-white"}`}
                            >
                                All ({logs.length})
                            </button>
                            <button
                                onClick={() => setLogFilter("warnings")}
                                className={`px-2 py-0.5 rounded transition ${logFilter === "warnings" ? "bg-amber-500/20 text-amber-300" : "text-dim hover:text-amber-300"}`}
                            >
                                Security Flags
                            </button>
                            <button
                                onClick={() => setLogFilter("actions")}
                                className={`px-2 py-0.5 rounded transition ${logFilter === "actions" ? "bg-blue-500/20 text-blue-300" : "text-dim hover:text-blue-300"}`}
                            >
                                Controls & Execution
                            </button>
                        </div>

                        <button
                            onClick={addSimulatedLog}
                            className="px-2.5 py-1 rounded bg-surface-raised hover:bg-surface border border-border text-dim hover:text-white transition flex items-center gap-1 cursor-pointer"
                        >
                            <span>+</span>
                            <span>Simulate Event</span>
                        </button>
                    </div>
                )}

                {activeTab === "scorecard" && (
                    <div className="px-4 py-2 bg-bg/40 flex items-center justify-between text-[11px]">
                        <span className="text-dim">Automated evaluation generated post-session completion</span>
                        <span className="text-emerald-400 font-semibold">Verified Transcript #IF-9482</span>
                    </div>
                )}
            </div>

            {/* TAB BODY CONTENT */}
            <div className="p-4 bg-bg font-mono min-h-[260px] flex flex-col justify-between">
                
                {/* 1. MONACO EDITOR TAB CONTENT */}
                {activeTab === "editor" && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="leading-relaxed flex text-dim overflow-x-auto">
                            {/* Line Numbers */}
                            <div className="w-8 select-none text-dim/40 text-right pr-3 space-y-1 text-[11px]">
                                {currentSample.code.map(item => (
                                    <div key={item.line}>{item.line}</div>
                                ))}
                            </div>

                            {/* Code lines */}
                            <div className="flex-1 space-y-1 text-xs">
                                {currentSample.code.map(item => (
                                    <div key={item.line}>{item.text}</div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Execution Output Box */}
                        <div className="mt-4 pt-3 border-t border-border/60 text-[11px]">
                            {isRunningCode ? (
                                <div className="flex items-center gap-2 text-amber-400 py-1">
                                    <span className="w-2.5 h-2.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                                    <span>Compiling & executing code in isolated sandbox container...</span>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-raised/80 border border-border/80">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-emerald-400 font-bold">✓ {currentSample.testOutput.status}</span>
                                        <span className="text-dim">• {currentSample.testOutput.cases}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-dim/80 text-[10px]">
                                        <span>Latency: <strong className="text-white">{currentSample.testOutput.time}</strong></span>
                                        <span>Memory: <strong className="text-white">{currentSample.testOutput.memory}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. ANTI-CHEATING & ACTIVITY LOG TAB CONTENT */}
                {activeTab === "anticheat" && (
                    <div className="space-y-2 animate-fade-in">
                        <div className="text-[11px] text-dim mb-3 flex items-center justify-between">
                            <span>Live Activity Feed (Real-Time WebSocket Sync)</span>
                            <span className="text-amber-400 font-medium">⚠️ 1 Security Warning Flagged</span>
                        </div>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 transition-all ${
                                        log.flagged
                                            ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                                            : log.type === "action"
                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-200"
                                            : log.type === "success"
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                                            : "bg-surface-raised border-border/60 text-dim"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 overflow-hidden">
                                        <span className="text-dim/60 text-[10px] font-mono whitespace-nowrap">{log.time}</span>
                                        <span
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                                                log.flagged
                                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                                    : "bg-surface text-dim border border-border"
                                            }`}
                                        >
                                            {log.tag}
                                        </span>
                                        <span className="font-medium truncate">{log.msg}</span>
                                    </div>
                                    <span className="text-[10px] text-dim/70 hidden sm:inline whitespace-nowrap">{log.detail}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. POST-INTERVIEW SCORECARD TAB CONTENT */}
                {activeTab === "scorecard" && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-surface-raised border border-border">
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-tight">Candidate Evaluation: Alex Turner</h4>
                                <p className="text-[11px] text-dim">Senior Software Engineer • Session Duration: 42 mins</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge tone="success">94/100 Overall Score</Badge>
                                <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                                    RECOMMEND HIRE
                                </span>
                            </div>
                        </div>

                        {/* Category Score Progress Bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-dim">Problem Solving & Algorithms</span>
                                    <span className="text-emerald-400 font-bold">95%</span>
                                </div>
                                <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full w-[95%]" />
                                </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-dim">Code Quality & Cleanliness</span>
                                    <span className="text-emerald-400 font-bold">90%</span>
                                </div>
                                <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full rounded-full w-[90%]" />
                                </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-dim">Communication & Explanation</span>
                                    <span className="text-candidate font-bold">98%</span>
                                </div>
                                <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                                    <div className="bg-candidate h-full rounded-full w-[98%]" />
                                </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-dim">Integrity & Anti-Cheat Score</span>
                                    <span className="text-interviewer font-bold">100% (Clean)</span>
                                </div>
                                <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                                    <div className="bg-interviewer h-full rounded-full w-[100%]" />
                                </div>
                            </div>
                        </div>

                        {/* Interviewer Notes & Export Button */}
                        <div className="pt-2 flex items-center justify-between text-[11px] text-dim border-t border-border/60">
                            <span>Interviewer Notes: "Strong grasp of algorithm efficiency, handled edge cases cleanly."</span>
                            <button className="px-2.5 py-1 rounded bg-surface-raised hover:bg-surface border border-border text-white transition cursor-pointer">
                                📥 Export PDF Report
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* SIMULATED STATUS BAR */}
            <div className="px-4 py-2 bg-surface-raised/90 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-dim">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-medium">Session ID: #ROOM-8924</span>
                    <span className="text-dim">• WebRTC Connected</span>
                </div>
                <div className="flex items-center gap-4 text-[10px]">
                    <span>Click tabs to explore live features</span>
                    <span className="text-candidate font-mono">InterviewForge v1.2</span>
                </div>
            </div>
        </Card>
    );
}
