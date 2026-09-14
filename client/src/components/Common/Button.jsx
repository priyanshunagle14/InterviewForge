export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  ...props
}) {
  const base =
    "font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer select-none active:scale-[0.98]";

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md font-medium",
    md: "px-4 py-2.5 text-sm rounded-lg font-medium",
    lg: "px-5 py-3 text-base rounded-lg font-semibold",
  };

  const variants = {
    primary:
      "bg-interviewer text-bg shadow-sm hover:bg-interviewer-hover hover:shadow-md hover:shadow-interviewer/20 active:brightness-95",
    secondary:
      "bg-surface-raised text-white border border-border/80 hover:border-border-hover hover:bg-surface-raised/80 active:bg-surface-subtle",
    ghost:
      "bg-transparent text-dim hover:text-white hover:bg-white/5 active:bg-white/10",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 active:bg-red-500/30",
    outline:
      "bg-transparent text-candidate border border-candidate/40 hover:bg-candidate/10 hover:border-candidate active:bg-candidate/20",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : icon ? (
        <span className="text-base flex-shrink-0 leading-none">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}