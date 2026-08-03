import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-bg/90 font-mono text-sm text-dim pt-12 pb-8">
            <div className="w-full px-5 md:px-10 space-y-10">

                {/* MAIN FOOTER GRID */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

                    {/* COL 1 & 2: BRAND & MOTTO */}
                    <div className="col-span-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded bg-surface-raised border border-border flex items-center justify-center font-bold text-sm text-candidate">
                                IF
                            </div>
                            <span className="font-bold text-white text-base">InterviewForge</span>
                        </div>
                        <p className="text-dim/80 text-sm leading-relaxed max-w-sm font-sans">
                            A ultra-low latency collaborative coding workspace. Designed for engineering teams conducting fair, real-time technical evaluations.
                        </p>

                        {/* Live Operational Status Badge */}
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-xs">
                            <span className="h-2 w-2 rounded-full bg-candidate animate-pulse" />
                            <span className="text-white font-medium">All Systems Operational</span>
                        </div>
                    </div>

                    {/* COL 3: PRODUCT */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
                        <ul className="space-y-1.5 text-dim/80">
                            <li><a href="#features" className="hover:text-white transition">Shared IDE</a></li>
                            <li><a href="#features" className="hover:text-white transition">Code Execution</a></li>
                            <li><a href="#features" className="hover:text-white transition">Role Security</a></li>

                        </ul>
                    </div>

                    {/* COL 4: ROLES */}
                    <div className="space-y-2">
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider">Workflows</h4>
                        <ul className="space-y-1.5 text-dim/80">
                            <li><Link to="/auth?role=interviewer" className="hover:text-interviewer transition">For Interviewers</Link></li>
                            <li><Link to="/auth?role=candidate" className="hover:text-candidate transition">For Candidates</Link></li>
                            <li><Link to="/join" className="hover:text-white transition">Join Room</Link></li>
                        </ul>
                    </div>


                </div>

                {/* BOTTOM BAR */}
                <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-dim/60">
                    <div>
                        © {new Date().getFullYear()} InterviewForge. All rights reserved.
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-dim transition">Privacy Policy</a>
                        <a href="#" className="hover:text-dim transition">Terms of Service</a>
                        <a href="#" className="hover:text-dim transition">Security</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}