export default function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-surface border border-border rounded-xl shadow-lg shadow-black/20 transition-shadow duration-200 ${className}`}
            style={{
                backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)",
            }}
        >
            {children}
        </div>
    );
}