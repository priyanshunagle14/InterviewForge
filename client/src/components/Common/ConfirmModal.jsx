import { useEffect } from "react";

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    danger = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onCancel();
        }

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/70"
            onClick={onCancel}
        >
            {/* Center wrapper */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md rounded-xl border border-border bg-surface shadow-2xl p-6 animate-fade-in"
                >
                    <h3 className="font-mono text-xl font-bold text-white">
                        {title}
                    </h3>

                    <p className="mt-3 text-sm text-dim leading-relaxed">
                        {message}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="rounded-lg border border-border px-4 py-2 text-sm text-dim hover:text-white hover:border-white transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${danger
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-interviewer text-black hover:brightness-110"
                                }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}