export default function Button({ children, variant = "primary", ...props }) {
    const base = "px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    const variants = {
        primary: "bg-interviewer text-bg hover:brightness-110 hover:shadow-lg hover:shadow-interviewer/20 shadow-md shadow-interviewer/10",
        secondary: "bg-transparent text-white border border-border hover:border-white/40 hover:bg-white/5",
        ghost: "bg-transparent text-dim hover:text-white hover:bg-white/5",
    };
    return (
        <button className={`${base} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
}