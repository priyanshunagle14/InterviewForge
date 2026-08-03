import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Button from "../Common/Button";
import ConfirmModal from "../Common/ConfirmModal";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { user, logout, isAuthenticated } = useAuth();

    const isDashboard = ["/dashboard", "/candidate-dashboard", "/interviewer"].includes(location.pathname);

    function handleAuthAction() {
        if (user) {
            navigate("/interviewer");
        } else {
            navigate("/auth?role=interviewer");
        }
    }

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-md font-mono text-xs">
                <div className={`w-full px-5 md:px-10 h-16 ${isDashboard ? 'grid grid-cols-3 items-center' : 'flex items-center justify-between'}`}>

                    {isDashboard ? (
                        <>
                            {/* LEFT SECTION (DASHBOARD) */}
                            <div className="flex justify-start">
                                <Link to="/" className="text-dim hover:text-white transition flex items-center gap-2">
                                    <span>&larr;</span> Home
                                </Link>
                            </div>

                            {/* BRAND (CENTERED) */}
                            <div className="flex justify-center">
                                <Link to="/" className="flex items-center gap-3 group">
                                    <div className="h-10 w-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-bold text-base text-candidate shadow-inner group-hover:border-candidate/50 transition">
                                        IF
                                    </div>
                                    <span className="font-bold text-lg tracking-tight text-white group-hover:text-candidate transition">
                                        InterviewForge
                                    </span>
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* LEFT SECTION (NON-DASHBOARD) */
                        <div className="flex justify-start">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="h-10 w-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center font-bold text-base text-candidate shadow-inner group-hover:border-candidate/50 transition">
                                    IF
                                </div>
                                <span className="font-bold text-lg tracking-tight text-white group-hover:text-candidate transition">
                                    InterviewForge
                                </span>
                            </Link>
                        </div>
                    )}

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden sm:flex items-center justify-end gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text-dim">
                                    Hi, <span className="text-white">{user.name}</span>
                                </span>

                                {!isDashboard && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(user.role === "interviewer" ? "/dashboard" : "/candidate-dashboard")}
                                    >
                                        Dashboard
                                    </Button>
                                )}

                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/auth?mode=login")}
                                    className="px-3 py-1.5 text-dim hover:text-white transition-colors"
                                >
                                    Log In
                                </button>

                                <Button onClick={() => navigate("/auth?mode=signup")}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="sm:hidden p-2 text-dim hover:text-white"
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-b border-border bg-surface px-5 py-4 space-y-3 animate-fade-in">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/auth?mode=login");
                                    }}
                                    className="block w-full text-left text-dim hover:text-white"
                                >
                                    Log In
                                </button>

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate("/auth?mode=signup");
                                    }}
                                    className="block w-full text-left text-dim hover:text-white"
                                >
                                    Sign Up
                                </button>

                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleAuthAction();
                                    }}
                                >
                                    Start Interviewing
                                </Button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate(user.role === "interviewer" ? "/dashboard" : "/candidate-dashboard");
                                    }}
                                    className="block w-full text-left text-dim hover:text-white"
                                >
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className="block w-full text-left text-red-400 hover:text-red-300"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </header>

            <ConfirmModal
                open={showLogoutModal}
                title="Log out?"
                message="Are you sure you want to log out of your InterviewForge account?"
                confirmLabel="Log Out"
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