export default function Badge({ children, tone = "candidate", className = "" }) {
  const tones = {
    interviewer: "bg-interviewer/10 text-interviewer border-interviewer/30",
    candidate: "bg-candidate/10 text-candidate border-candidate/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    dim: "bg-white/5 text-dim border-border/80",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };

  const dots = {
    interviewer: "bg-interviewer shadow-[0_0_6px_rgba(255,159,67,0.6)]",
    candidate: "bg-candidate shadow-[0_0_6px_rgba(45,212,191,0.6)]",
    success: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
    warning: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    danger: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]",
    dim: "bg-dim",
    blue: "bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${tones[tone] || tones.dim} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[tone] || dots.dim}`} />
      <span>{children}</span>
    </span>
  );
}