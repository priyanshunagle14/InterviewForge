export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-surface border border-border/80 rounded-xl shadow-lg shadow-black/30 transition-all duration-200 ${
        hover ? "hover:border-border-hover hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5" : ""
      } ${className}`}
      style={{
        backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 100%)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}