import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../Common/Button";
import Badge from "../Common/Badge";
import ConfirmModal from "../Common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();

    const isDashboard = ["/dashboard", "/candidate-dashboard", "/interviewer"].includes(location.pathname);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-bg/85 backdrop-blur-md text-sm transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* BRAND LOGO */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group select-none">
                            <div className="h-9 w-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-bold text-sm text-candidate shadow-sm group-hover:border-candidate/50 transition-all duration-200">
                                IF
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-base tracking-tight text-white group-hover:text-candidate transition-colors">
                                    InterviewForge
                                </span>
                            </div>
                        </Link>

                        {isAuthenticated && isDashboard && (
                            <div className="hidden md:flex items-center gap-1 border-l border-border/60 pl-6 text-xs">
                                <Link
                                    to={user?.role === "candidate" ? "/candidate-dashboard" : "/dashboard"}
                                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                                        ["/dashboard", "/candidate-dashboard"].includes(location.pathname)
                                            ? "bg-surface-raised text-white"
                                            : "text-dim hover:text-white hover:bg-surface-subtle"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                {user?.role === "interviewer" && (
                                    <Link
                                        to="/interviewer"
                                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                                            location.pathname === "/interviewer"
                                                ? "bg-surface-raised text-white"
                                                : "text-dim hover:text-white hover:bg-surface-subtle"
                                        }`}
                                    >
                                        + New Interview
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden sm:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-subtle border border-border/60 rounded-lg">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-white font-medium">{user?.name}</span>
                                    <Badge tone={user?.role === "interviewer" ? "interviewer" : "candidate"}>
                                        {user?.role === "interviewer" ? "Interviewer" : "Candidate"}
                                    </Badge>
                                </div>

                                {!isDashboard && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => navigate(user?.role === "candidate" ? "/candidate-dashboard" : "/dashboard")}
                                    >
                                        Dashboard
                                    </Button>
                                )}

                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="px-3 py-1.5 text-xs text-dim hover:text-rose-400 transition-colors font-medium cursor-pointer"
                                >
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/auth?mode=login")}
                                    className="px-3 py-1.5 text-xs font-medium text-dim hover:text-white transition-colors cursor-pointer"
                                >
                                    Log in
                                </button>

                                <Button size="sm" onClick={() => navigate("/auth?mode=signup")}>
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="sm:hidden p-2 text-dim hover:text-white cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-b border-border/80 bg-surface px-5 py-4 space-y-3 animate-fade-in">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/auth?mode=login");
                                    }}
                                    className="block w-full text-left text-sm text-dim hover:text-white py-1"
                                >
                                    Log In
                                </button>

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/auth?mode=signup");
                                    }}
                                    className="block w-full text-left text-sm text-dim hover:text-white py-1"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                                    <span className="text-xs text-white font-medium">{user?.name}</span>
                                    <Badge tone={user?.role === "interviewer" ? "interviewer" : "candidate"}>
                                        {user?.role === "interviewer" ? "Interviewer" : "Candidate"}
                                    </Badge>
                                </div>

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate(user?.role === "candidate" ? "/candidate-dashboard" : "/dashboard");
                                    }}
                                    className="block w-full text-left text-sm text-dim hover:text-white py-1"
                                >
                                    Dashboard
                                </button>

                                {user?.role === "interviewer" && (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate("/interviewer");
                                        }}
                                        className="block w-full text-left text-sm text-dim hover:text-white py-1"
                                    >
                                        + New Interview
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className="block w-full text-left text-sm text-rose-400 hover:text-rose-300 py-1"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </header>

            <ConfirmModal
                open={showLogoutModal}
                title="Sign Out"
                message="Are you sure you want to sign out of your InterviewForge session?"
                confirmLabel="Sign Out"
                danger
                onConfirm={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                }}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
}